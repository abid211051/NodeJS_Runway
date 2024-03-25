/*** WITH DRAINING ***/
/* With draining though code is litle bit slower, but it's memory efficient.
And we can write million of data with this process*/
/*** My System: Ryzen 5600U; Memory 8GB ***/
/* Execution time: 2.3s [10^6] */
/* Execution time: 22.5s [10^7] [Time:10^6x10] */
/* Execution time: 3:52.520 (m:ss.mmm)[10^8] [Time:10^6x100] */
/* Execution time: 39:02.137 (m:ss.mmm)[10^9] [Time:10^6x1000] */
/* Memory Usages: 37 MB [Same for all case] */
const fs = require("node:fs/promises");
(async () => {
  let filehandle = await fs.open("dataFile.txt", "w");
  let stream = filehandle.createWriteStream();
  console.time("filehandle");
  let numberOfIteration = 100000000;
  let i = 0;
  const writeFile = () => {
    while (i < numberOfIteration) {
      let buff = Buffer.from(` ${i} `, "utf-8");

      if (i === numberOfIteration - 1) return stream.end(buff);

      if (!stream.write(buff)) {
        i++;
        break;
      }

      i++;
    }
  };
  writeFile();

  stream.on("drain", () => {
    writeFile();
  });

  stream.on("finish", () => {
    console.timeEnd("filehandle");
    filehandle.close();
  });
})();

// /*** WITHOUT DRAINING ***/
/* Without draining though code is litle bit faster but, it's totally memory inefficient.
This version can lead memory lekage and frezzing issue, because of the high memory consumption */
// /* Execution time: 2.2s */
// /* Memory Usages: 210 MB */
// const fs = require("node:fs/promises");
// (async () => {
//   let filehandle = await fs.open("dataFile.txt", "w");
//   console.time("filehandle");
//   let stream = filehandle.createWriteStream();
//   let i = 0;
//   const drain = () => {
//     while (i < 1e6) {
//       let buff = Buffer.from(` ${i} `, "utf-8");
//       if (i === 999999) return stream.end(buff);
//       stream.write(buff);
//       i++;
//     }
//   };
//   drain();
//   stream.on("finish", () => {
//     console.timeEnd("filehandle");
//     filehandle.close();
//   });
// })();

/*
1. Basically we are running that loop million, billion time to create our big data file.

2. In whole loop process from 0 to 10^6 we are taking only 3 to 8 byte inside Buffer.from(" ${i} "); Remember each character in string is 1byte.

3. As we know our write stream internal buffer is just 16kb. So on huge file operation without "drain", there will be memory overflow/lekage.

4. By using drain we can reduce memory overflow/lekage problem. 

5. Still this code took huge ammount of time in case of 10^8 to 10^9 operation. This is because
    -> We are just writting 3-8bytes Buffer inside stream on each itteration, but our write stream can hold at least 16Kb at a time to perform a write operation into file.
    -> Another reason can be latency of the loop.
    
6. Though this code is optimize one. still for much more efficient code we can follow the "readStream.js" code.
*/
