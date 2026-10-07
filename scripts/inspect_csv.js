const fs = require('fs');
const readline = require('readline');

const csvPath = 'C:\\Users\\DEVENDER\\Desktop\\school Data India\\All Private Schools india.csv';

if (!fs.existsSync(csvPath)) {
  console.error('File not found at:', csvPath);
  process.exit(1);
}

const stats = fs.statSync(csvPath);
console.log('File size:', (stats.size / (1024 * 1024)).toFixed(2), 'MB');

const rl = readline.createInterface({
  input: fs.createReadStream(csvPath),
  crlfDelay: Infinity
});

let lineCount = 0;
const sampleLines = [];

rl.on('line', (line) => {
  lineCount++;
  if (lineCount <= 10) {
    sampleLines.push(line);
  }
});

rl.on('close', () => {
  console.log('Total lines in CSV:', lineCount);
  console.log('\n--- HEADER (Line 1) ---');
  console.log(sampleLines[0]);
  console.log('\n--- SAMPLE ROW 1 (Line 2) ---');
  console.log(sampleLines[1]);
  console.log('\n--- SAMPLE ROW 2 (Line 3) ---');
  console.log(sampleLines[2]);
});
