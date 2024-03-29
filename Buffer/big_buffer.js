const { Buffer } = require("buffer");

/* We can declare a huge buffer like bellow.
it will take 1e6=1000000byte from our computer Ram */
// const b = Buffer.alloc(1e8);

/* This piece of code will execute after every 3sec and 
will fill the whole 1e6 byte buffer with 0xff*/
// setInterval(() => {
//   b.fill(0xff);
//   console.log("filled");
// }, 3000);

/* WARNING: Never declare a buffer size
more than your PC memory or near to maximum PC memory limit,
it will freeze or crash your system*/

/* though this buffer is taking " 999999 ", as a string inside array, it will extract space and consider 999999 as a number */
/* As 999999 hex is F423F buffer will show only last to hex value 3f[each hex is 4bit; 4+4=8] as buffer inherite unit8array*/
const buf = Buffer.from(["999995h"]);
console.log(buf.toString("hex"));
