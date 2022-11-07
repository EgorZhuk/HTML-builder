const fs = require("fs");
const { readdir } = require("fs/promises");
const path = require("path");

const srcPath = path.join(__dirname, "styles");
const destPath = path.join(__dirname, "project-dist", "bundle.css");

(async () => {
  try {
    const bundle = fs.createWriteStream(destPath);
    const files = await readdir(srcPath, { withFileTypes: true });

    for (const file of files) {
      const source = path.join(srcPath, file.name);

      if (file.isFile() && path.extname(source) === ".css") {
        const readStyle = fs.createReadStream(source, "utf8");
        readStyle.pipe(bundle);
      }
    }
  } catch (err) {
    console.error(err);
  }
})();
