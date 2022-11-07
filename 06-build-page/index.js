const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");

const destination = path.join(__dirname, "project-dist");

const srcAssetsPath = path.join(__dirname, "assets");
const destAssetsPath = path.join(__dirname, "project-dist", "assets");

const srcStyles = path.join(__dirname, "styles");
const destStyles = path.join(__dirname, "project-dist", "style.css");

const srcHtml = path.join(__dirname, "template.html");
const destHtml = path.join(__dirname, "project-dist", "index.html");
const htmlComponents = path.join(__dirname, "components");

async function copyDir(src, dest) {
  await fsPromises.rm(dest, { recursive: true, force: true });
  await fsPromises.mkdir(dest, { recursive: true });
  const files = await fsPromises.readdir(src, {
    withFileTypes: true,
  });

  for (let file of files) {
    const source = path.join(src, file.name);
    const destination = path.join(dest, file.name);
    if (file.isFile()) {
      await fsPromises.copyFile(source, destination);
    } else await copyDir(source, destination);
  }
}

async function mergeStyles() {
  const bundle = fs.createWriteStream(destStyles);
  const files = await fsPromises.readdir(srcStyles, { withFileTypes: true });

  for (const file of files) {
    const source = path.join(srcStyles, file.name);

    if (file.isFile() && path.extname(source) === ".css") {
      const readStyle = fs.createReadStream(source, "utf8");
      readStyle.pipe(bundle);
    }
  }
}

async function mergeHtml() {
  await fsPromises.copyFile(srcHtml, destHtml);
  let htmlContent = await fsPromises.readFile(destHtml, "utf-8");
  const bundle = fs.createWriteStream(destHtml);
  const files = await fsPromises.readdir(htmlComponents, {
    withFileTypes: true,
  });
  for (const file of files) {
    const source = path.join(htmlComponents, file.name);
    if (file.isFile() && path.extname(source) === ".html") {
      const fileName = path.parse(source).name;
      const componentContent = await fsPromises.readFile(source, "utf-8");
      htmlContent = htmlContent.replace(`{{${fileName}}}`, componentContent);
    }
  }
  bundle.write(htmlContent);
}

(async () => {
  try {
    await fsPromises.rm(destination, { recursive: true, force: true });
    await fsPromises.mkdir(destination, { recursive: true });

    await copyDir(srcAssetsPath, destAssetsPath);
    await mergeStyles();
    await mergeHtml();
    console.log("Build successfully complete.");
  } catch (err) {
    console.error(err);
  }
})();
