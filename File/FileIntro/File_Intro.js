/* Three way to use File */
const fspromise = require("node:fs/promises");
const fsSyncCallback = require("node:fs");
/* Promises */
/* Most used method to handle file operation is promises, it is clear and asynchronus process to handle file */
(async () => {
  try {
    await fspromise.copyFile(
      "File_Intro.js",
      "promisesTest.txt",
      fspromise.constants.COPYFILE_EXCL
    );
    console.log("Copied to new file");
  } catch (error) {
    console.log(error.message);
  }
})();

/* CallBack */
/* Callback is used when we need high degree of computation, It is faster than other 2 way. But it can lead to a callback Hell */
const arr = new Buffer.from([0x48, 0x45, 0x4c, 0x4c, 0x4f, 0x57, 0x21]);
fsSyncCallback.writeFile("callbackTest.txt", arr, (err) => {
  if (err) console.log(err);
  console.log("Written into the file is successfull.");
});

/* Synchronus */
/* Dealing with file can take some ammount of time.So avoiding this sync method is good for us. 
We can use this when we badly need some data before running other process of the app.[other process will be blocked until file operation finished] */
const res = fsSyncCallback.readFileSync("syncTest.txt");
console.log(res.toString("utf-8"));
