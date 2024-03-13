const { Buffer } = require("buffer");

/* Character encoding and decoding */
// const memoryContainer = Buffer.alloc(3);

// memoryContainer[0] = 0x48;
// memoryContainer[1] = 0x69;
// memoryContainer[2] = 0x21;

// const memoryContainer = Buffer.from([0x48, 0x69, 0x21]);
// console.log(memoryContainer.toString());

// const memoryContainer = Buffer.from("Hi!", "utf-8");
// console.log(memoryContainer.toString("hex"));

// const memoryContainer = Buffer.from("486921", "hex");
// console.log(memoryContainer);

/* Putting Hexadeciaml E0A68A inside buffer.*/
const memoryContainer = Buffer.from("E0A68A", "hex");
/* Getting the corrosponding data of that hex value,
 which is "ঊ".*/
console.log(memoryContainer.toString("latin1"));

/* NOTE: Difference character encoding will give 
different result for same Hex value
Example: If we use "utf-8" for Hex value E0A68A
it will give "ঊ", on the other hand if we use "latin1" it will 
result "à¦" */
