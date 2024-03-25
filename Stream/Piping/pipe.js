const fs = require("node:fs/promises");
const { pipeline } = require("node:stream");

/* Pipe() deals with all the pause, resume, draining for us internally, 
so no need to handle "drain", "data", pause(), resume() by ourself.
We can chaine pipe(), but destination pipe() have to be a writable stream.
ex: read.pipe(transform).pipe(transform).pipe(write);
One drawback is here also we have to handle error, for the streams manually.

NoTe: We always have to destroy or close the streams when all the read write is done,
or any error occurs. If successfull r/w happen, then nodeJS done that job for us. But if any
error occur we have to do that manually by "error" event listener.
*/
// (async () => {
//     console.time("pipe")
//     const readFile = await fs.open("src.txt", "r");
//     const writeFile = await fs.open("write.txt", "w");

//     const readStream = readFile.createReadStream();
//     const writeStream = writeFile.createWriteStream();

//     readStream.pipe(writeStream);

//     readStream.on("error", (err) => {
//         console.log(err.message);
//         readStream.close();
//         writeStream.close();
//     })
//     readStream.on("end", () => {
//         console.timeEnd("pipe");
//     })
// })()


/* 
We can get rid from this manual error, close, destroy event handling by using pipeline();
stream.pipeline() closes all the streams when an error is raised.
*/

(async () => {
    try {

    } catch (error) {

    }
    console.time("pipe")
    const readFile = await fs.open("src.txt", "r");
    const writeFile = await fs.open("write.txt", "w");

    const readStream = readFile.createReadStream();
    const writeStream = writeFile.createWriteStream();

    pipeline(readStream, writeStream, (err) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log("Piping is complete");
        }
        console.timeEnd("pipe");
    })
})()