/*** Promise version is too slower compare to callback one.***/
/*** This code took 57s - 1m in case of my machine [Hardware] ***/
/* Execution Time: 58s */
/* Cpu use: Fluctute [40 - 70%] */
/* Memory usages: Around 40MB */
// const fs = require("node:fs/promises");
// (async () => {
//   console.time("filehandle");
//   let filehandle = await fs.open("write.txt", "w");
//   for (let i = 0; i < 1e6; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");
//     await filehandle.write(buff);
//   }
//   console.timeEnd("filehandle");
//   filehandle.close();
// })();

/*** Callback version is super faster than promise one.***/
/*** This same code took only 2 - 3s in case of my machine [Hardware] ***/
/* Execution Time: 2.8s */
/* Cpu use: 100% */
/* Memory usages: 1GB[On highest Spike] */
// const fs = require("node:fs");
// (async () => {
//   console.time("filehandle");
//   fs.open("write.txt", "w", (err, fd) => {
//     if (err) throw err;
//     for (let i = 0; i < 1e6; i++) {
//       const buff = Buffer.from(` ${i} `, "utf-8");
//       fs.write(fd, buff, () => {});
//     }
//     console.timeEnd("filehandle");
//     fs.close(fd);
//   });
// })();

/**** NOTE: Surprisingly in both cases(promise and callback) stream perform almost same. 
But don't use stream like that. It is memory inefficient ****/
/*** Using Stream [With fs/promise] ***/
/* Execution Time: 570ms */
/* Cpu use: 100% */
/* Memory usages: 200MB */
const fs = require("node:fs/promises");
(async () => {
  console.time("filehandle");
  let filehandle = await fs.open("write.txt", "w");
  let stream = filehandle.createWriteStream();
  for (let i = 0; i < 1e6; i++) {
    const buff = Buffer.from(` ${i} `, "utf-8");
    stream.write(buff);
  }
  console.timeEnd("filehandle");
  filehandle.close();
})();

/*** Using Stream [With fs/callback] ***/
/* Execution Time: 530ms */
/* Cpu use: 100% */
/* Memory usages: 200MB */
// const fs = require("node:fs");
// (async () => {
//   console.time("filehandle");
//   fs.open("write.txt", "w", (err, fd) => {
//     let stream = fs.createWriteStream("write.txt");
//     for (let i = 0; i < 1e6; i++) {
//       const buff = Buffer.from(` ${i} `, "utf-8");
//       stream.write(buff);
//     }
//     console.timeEnd("filehandle");
//     fs.close(fd);
//   });
// })();
