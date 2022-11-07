const fsPromises = require("fs/promises");
const path = require("path");
const srcPath = path.join(__dirname, "files");
const destPath = path.join(__dirname, "files-copy");

async function copyDir(src, dest) {
  try {
    await fsPromises.rm(destPath, { recursive: true, force: true });
    await fsPromises.mkdir(destPath, { recursive: true });
    const files = await fsPromises.readdir(srcPath);

    for (let file of files) {
      const source = path.join(srcPath, file);
      const destination = path.join(destPath, file);
      await fsPromises.copyFile(source, destination);
    }

    console.log(`Folder "files" has been copied to folder "files-copy"`);
  } catch (err) {
    console.error(err);
  }
}
copyDir(srcPath, destPath);
