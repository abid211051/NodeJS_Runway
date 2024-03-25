const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
    constructor(filesize) {
        super(filesize)
        console.log(filesize)
    }

    _transform(chunk, encoding, callback) {
        // Buffer before encrypt

        for (let i = 0; i < chunk.length; i++) {
            chunk[i] = chunk[i] - 1;
        }

        // Buffer after encrypt
        callback(null, chunk);
    }
}

(async () => {
    const readFile = await fs.open("encrypt.txt", "r");
    const writeFile = await fs.open("decrypt.txt", "w");

    const readStream = readFile.createReadStream();
    const writeStream = writeFile.createWriteStream();

    const filesize = (await readFile.stat()).size;

    const decrypt = new Decrypt(filesize);

    readStream.pipe(decrypt).pipe(writeStream);
})()