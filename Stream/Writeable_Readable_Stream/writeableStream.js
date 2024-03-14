/*** WITH DRAINING ***/
/* With draining though code is litle bit slower, but it's memory efficient.
And we can write million of data with this process*/
/* Execution time: 2.3s [10^6]*/
/* Execution time: 22.5s [10^7]*/
/* Execution time: 3:52.520 (m:ss.mmm) [10^8]*/
/* Memory Usages: 37 MB [Same for all case]*/
const fs = require("node:fs/promises");
(async () => {
  console.time("filehandle");
  let filehandle = await fs.open("dataFile.txt", "w");
  let stream = filehandle.createWriteStream();
  let i = 0;
  const writeFile = () => {
    while (i < 1e7) {
      let buff = Buffer.from(` ${i} `, "utf-8");

      if (i === 9999999) return stream.end(buff);

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
