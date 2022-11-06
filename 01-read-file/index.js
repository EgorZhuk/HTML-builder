const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readFile = fs.createReadStream(filePath, 'utf-8');

readFile.on('data', chunk => console.log(chunk))
readFile.on('error', error => console.log(`Error: ${error.message}`));
readFile.on('end',() =>{});