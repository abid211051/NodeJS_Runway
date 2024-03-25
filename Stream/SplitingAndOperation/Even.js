/*Execution: 330ms [10^6] [for finding even number] */
/*Execution: 26s [10^8] [for finding even number] */
/*Execution: 3m [10^9] [for finding even number] */
/*Memory Usages 40MB [On all cases] */
const fs = require("node:fs/promises");
const { finished } = require("node:stream");

(async () => {
  console.time("readBig");
  const fileHandleRead = await fs.open("text-small.txt", "r");
  const fileHandleWrite = await fs.open("dest.txt", "w");
  const streamRead = fileHandleRead.createReadStream({ highWaterMark: 64 * 1024 });
  const streamWrite = fileHandleWrite.createWriteStream();

  let split = "";
  let st = "";
  streamRead.on("data", (chunk) => {
    const numbers = chunk.toString("utf-8").match(/\s*\d+\s*/g);

    if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
      if (split) {
        numbers[0] = split + numbers[0];
      }
    }

    if (
      Number(numbers[numbers.length - 2]) + 1 !==
      Number(numbers[numbers.length - 1])
    ) {
      split = numbers.pop();
    }

    numbers.forEach((number) => {
      if (Number(number) % 2 === 0) {
        st += ` ${number.trim()} `;
      }
    });
    if (!streamWrite.write(st)) {
      streamRead.pause();
      st = "";
    }
    /* 
    Testing code if all the data in the dest.txt is correct or not. If any data is incorrect it will be written in test.txt;
    If test.txt is empty in our case then all the dest.txt data is correct.
    */
    // if (Number(numbers[0]) !== Number(numbers[1]) - 2) {
    //   numbers[0] = split.trim() + numbers[0].trim();
    // }
    // if (Number(numbers[numbers.length - 1]) - 2 !== Number(numbers[numbers.length - 2])) {
    //   split = numbers.pop();
    // }

    // for (let i = 0; i < numbers.length; i++) {
    //   if (Number(numbers[i]) + 2 !== Number(numbers[i + 1]) && i !== numbers.length - 1) {
    //     streamWrite.write(Buffer.from(`[${numbers[i]} ${numbers[i + 1]}]`));
    //   }
    // }
  });

  // Drain event to clear the write stream buffer, when it reach the highwaterMark
  streamWrite.on("drain", () => {
    streamRead.resume();
  });

  // Nodejs finished() method close all the stream, when error or other failed occur.
  finished(streamRead, (err) => {
    if (err) {
      console.log(err)
    }
    else {
      console.timeEnd("readBig");
    }
  })

  // We explecitly closing writeStream when error occur by the on "error" listener
  streamWrite.on("error", (err) => {
    console.log(err.stack);
    fileHandleRead.close();
    fileHandleWrite.close();
    streamRead.close();
    streamWrite.close();
  })

})();
