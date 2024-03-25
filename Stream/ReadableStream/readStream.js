/*** This process of reading and writting data is 73time faster than our "writeStream.js" code. Bellow of the code i wrote some Note ***/
/* It's not just time efficient, it is memory efficient also, by taking 30-40MB */
/* Execution Time: 32s [10^9] [super fast ha!]*/
/* Memory usages: 30MB [10^9] */
const fs = require("node:fs/promises");

(async () => {
  const readFile = await fs.open("src.txt", "r");
  const writeFile = await fs.open("dest.txt", "w");
  const readStream = readFile.createReadStream({ highWaterMark: 64 * 1024 }); // This { highWaterMark: 64 * 1024 } is by default for readStream.
  const writeStream = writeFile.createWriteStream();
  console.time("readWrite");
  readStream.on("data", (chunk) => {
    if (!writeStream.write(chunk)) {
      readStream.pause();
    }
  });
  writeStream.on("drain", () => {
    readStream.resume();
  });
  readStream.on("close", () => {
    console.timeEnd("readWrite");
    readFile.close();
    writeFile.close();
  });
})();

/* 
1. Always Keep in mind to DRAIN the writeStream file. Otherwise there will be huge memory pressure and cause frezz or crash for some cases.

2. By Default ReadStream and WriteStream have EventEmiter object. So we can emit "on" for different cases.Ex: 'drain', 'data', 'end', 'close' etc.

3. writeStream.write() will return false when 16kb of write stream is totally filled with chunks. We can take it advantage by simply checking true or false.

4. if writeStream.write() return false
        -> pause() the read stream in if statement.
        -> If we declare "drain" eventEmiter in code, whenever writeStream.write() getting false, by default writeStream.on("drain", () =>{}) will emit.
        -> And after "drain" complete callback function of that emiter will trigger. Insider that callback function we can resume() our read Stream again.
        -> This process will loop until all the chunks data is read and written to another file. [Read chunks => Write chunks => Repeat]

5. By printing "writableLength" we can check how much data is loaded in our write stream internal buffer in certain period.

6. By default createReadStream() will emit "close" event Listener, when reading all the data from the file is complete.
*/
