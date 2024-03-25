const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Encrypt extends Transform {
    constructor(filesize) {
        super()
        this.filesize = filesize;
        this.byteRead = 0;
        this.iteration = 0;
    }

    _transform(chunk, encoding, callback) {
        // Buffer before encrypt
        for (let i = 0; i < chunk.length; i++) {
            chunk[i] = chunk[i] + 1;
        }
        this.byteRead += chunk.length;
        this.iteration += 1;

        if (this.iteration % 10 === 0) {
            console.log(((this.byteRead / this.filesize) * 100).toFixed(1))
        }
        // Buffer after encrypt
        callback(null, chunk);
    }
    _final(err) {
        console.log(((this.byteRead / this.filesize) * 100).toFixed(1))
    }
}

(async () => {
    const readFile = await fs.open("text-small.txt", "r");
    const writeFile = await fs.open("encrypt.txt", "w");

    const readStream = readFile.createReadStream();
    const writeStream = writeFile.createWriteStream();

    const filesize = (await readFile.stat()).size;

    const encrypt = new Encrypt(filesize);
    readStream.pipe(encrypt).pipe(writeStream);
})()