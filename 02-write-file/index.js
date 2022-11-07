const fs = require('fs');
const readline = require('readline');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const writeFile = fs.createWriteStream(filePath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter a sentence: '
});

writeFile.on('error', (err) => {
  console.log(`An error occured while writing to the file. Error: ${error.message}`)
})


rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
      case 'exit':
          rl.close();
          break;
      default:
          sentence = line + '\n'
          writeFile.write(sentence);
          rl.prompt();
          break;
  }
}).on('close', () => {
  writeFile.end();
  writeFile.on('finish', () => {
      console.log(`Your text have been written to ${filePath}`);
  })
})