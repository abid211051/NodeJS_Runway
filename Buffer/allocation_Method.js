const { Buffer } = require("buffer");

/* alloc() is slower than other allocation method. 
It will allocate piece of memory and will initialize all bytes 
with 0 [by default] */
const usingAlloc = Buffer.alloc(3);
usingAlloc[0] = 0xe0;
usingAlloc[1] = 0xa6;
usingAlloc[2] = 0x8a;
console.log("Using alloc(): ", usingAlloc.toString("utf-8"));

/* from() is faster than alloc, and doesn't need to predefine the size of buffer.
Actually it use allocUnsafe() BTS*/
const usingForm = Buffer.from([0x11, 0x22], "hex");
console.log("Using Form(): ", usingForm[1].toString(16));

/* poolsize() return the pre-allocated memory for buffer. We will discuss about it in bellow note */
console.log(
  "Full PoolSize: ",
  Buffer.poolSize,
  "\n",
  "Half PoolSize: ",
  Buffer.poolSize >>> 1
);
/* allocUnsafe() is the faster method to allocate a buffer in memory, 
but it has security drawback. It doesn't intialize all the allocated bytes with default value like
alloc() did. That's why hacker can pick existing data from allocUnsafe index*/
const usingAllocUnSafe = Buffer.allocUnsafe(5000);
console.log("Using allocUnsafe(): ", usingAllocUnSafe[4299].toString(2)); //Converting to binary
/* Modifiying default poolsize to 1000 */
Buffer.poolSize = 1000;
console.log(Buffer.poolSize);

/* NOTE: Nodejs pre-allocate some ammount of memory for buffer.
By using "poolsize" we can see and modify the size of that pre-allocated space.
If the allocated memory size is less than or equal to "Buffer.poolsize"
nodejs will automatically put that buffer in that pre-allocated memory.
else buffer will be allocate somewhere else in the system memory.
That pre-aloocated memory is 8KB for most of the system.

pre-allocation is applicable for "allocUnsafe() method"
*/
