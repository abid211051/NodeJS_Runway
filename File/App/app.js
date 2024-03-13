const fs = require("node:fs/promises");

(async () => {
  try {
    const commandFile = await fs.open("./command.txt", "r"); // Return file descriptor. And this filehandler have by default EventEmiter access

    /*** Declaring some constant ***/
    const CREATE_FILE = "touch";
    const DELETE_FILE = "unlink";
    const RENAME_FILE = "mv";
    const ADD_TO_FILE = "echo";

    /*** All the Methods for Different file operation ***/
    //CommandLine: touch <path>
    const CreateFile = async (path) => {
      if (path.length > 0) {
        let handleCreateFile;
        try {
          handleCreateFile = await fs.open(path, "wx");
          handleCreateFile.close();
        } catch (error) {
          if (error.code === "EEXIST") {
            console.log(`${error.path} already exist!`);
          }
        }
      }
    };

    //CommandLine: unlink <path>
    const DeleteFile = async (path) => {
      if (path.length > 0) {
        try {
          await fs.unlink(path);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log(`No such file or directory at ${error.path}`);
          }
        }
      }
    };

    //CommandLine: mv <oldpath> <newpath>
    const RenameFile = async (oldpath, newpath) => {
      if (oldpath.length > 0 && newpath.length > 0) {
        try {
          await fs.rename(oldpath, newpath);
        } catch (error) {
          if (error.code === "ENOENT") {
            console.log(`No such file or directory at ${oldpath}`);
          }
        }
      }
    };

    //CommandLine: echo "data" >> <path>
    const AddToFile = async (data, path) => {
      if (path.length > 0) {
        await fs.appendFile(path, data, {
          encoding: "utf-8",
          flag: "a",
        });
        try {
        } catch (error) {
          console.log(error.message);
        }
      }
    };

    /*** Triggering different file operation on event from the "command.txt" file***/
    commandFile.on("change", async () => {
      const size = (await commandFile.stat()).size;
      const buff = Buffer.alloc(size);
      const offset = 0;
      const length = buff.byteLength;
      const position = 0;
      await commandFile.read(buff, offset, length, position);
      const commandLine = buff.toString("utf-8");
      if (commandLine.includes(CREATE_FILE)) {
        let path = commandLine.split(`${CREATE_FILE} `)[1];
        if (path) {
          CreateFile(path.trim());
        }
      }
      if (commandLine.includes(DELETE_FILE)) {
        let path = commandLine.split(`${DELETE_FILE} `)[1];
        if (path) {
          DeleteFile(path.trim());
        }
      }
      if (commandLine.includes(RENAME_FILE)) {
        let path = commandLine.split(/\s(?=[\.\/a-zA-Z])/i);
        if (path.length > 2) {
          RenameFile(path[1].trim(), path[2].trim());
        } else {
          console.log("Invalid Command!");
        }
      }
      if (commandLine.includes(ADD_TO_FILE)) {
        let dataAndPath = commandLine.split(/\s*>>\s*/i);
        AddToFile(dataAndPath[0].substring(5), dataAndPath[1].trim());
      }
    });

    /*** Watcher ***/
    const watcher = fs.watch("command.txt"); // Return a asnc Iterator
    for await (let event of watcher) {
      if (event.eventType === "change") {
        commandFile.emit("change"); //Emitting event on save of the "command.txt"
      }
    }
  } catch (error) {
    console.log(error.message);
  }
})();
