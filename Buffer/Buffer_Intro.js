const { Buffer } = require("buffer");

/* Creating a Unit16Array and referncing it from buffer */
/* As Buffer is a subclass of "Unit8Array", it is better to use unit8array
more than other 16 and 32 bit array */
const arr = new Uint16Array([0, 2221, 3]);
/* Shares memory with `arr` */
const memoryContainer = Buffer.from(arr.buffer);
console.log(arr);
console.log(memoryContainer.length);
console.log(memoryContainer);
