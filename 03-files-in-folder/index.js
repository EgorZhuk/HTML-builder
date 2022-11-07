const fsPromises = require("fs/promises");
const path = require("path");
const dirPath = path.join(__dirname, "secret-folder");

(async () => {
  try {
    const files = await fsPromises.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(__dirname, "./secret-folder", file.name);
        const name = path.parse(filePath).name;
        const extension = path.extname(filePath).slice(1);
        const size = (await fsPromises.stat(filePath)).size / 1024;
        console.log(`${name} - ${extension} - ${size} kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
