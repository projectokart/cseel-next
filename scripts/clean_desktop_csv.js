const fs = require('fs');
const readline = require('readline');
const path = require('path');

const inputPath = 'C:\\Users\\DEVENDER\\Desktop\\school Data India\\All Private Schools india.csv';
const backupPath = 'C:\\Users\\DEVENDER\\Desktop\\school Data India\\All Private Schools india.backup.csv';
const tempOutputPath = 'C:\\Users\\DEVENDER\\Desktop\\school Data India\\All Private Schools india.cleaned.tmp.csv';

if (!fs.existsSync(inputPath)) {
  console.error('Error: CSV file not found at:', inputPath);
  process.exit(1);
}

console.log('--- Step 1: Creating backup of original file ---');
if (!fs.existsSync(backupPath)) {
  fs.copyFileSync(inputPath, backupPath);
  console.log('Backup created at:', backupPath);
} else {
  console.log('Backup already exists at:', backupPath);
}

// ─── High Performance RFC 4180 CSV Row Parser ───
function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur);
  return result;
}

function escapeCSVField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ─── Cleaning Functions ───
function cleanCodePrefix(val) {
  if (!val) return '';
  return String(val)
    .replace(/^\d+[-_:\s]+/, '')
    .replace(/\.0$/, '')
    .trim();
}

function cleanRuralUrban(val) {
  if (!val) return '';
  const str = String(val).trim();
  if (str === '1' || str === '1-Rural' || str.toLowerCase() === 'rural') return 'Rural';
  if (str === '2' || str === '2-Urban' || str.toLowerCase() === 'urban') return 'Urban';
  if (str === '9') return 'Urban';
  const cleaned = cleanCodePrefix(str);
  return (cleaned.toLowerCase() === 'rural' ? 'Rural' : cleaned.toLowerCase() === 'urban' ? 'Urban' : cleaned);
}

function cleanSchoolCategory(val) {
  if (!val) return '';
  const str = cleanCodePrefix(val);
  const map = {
    'Pr. Up Pr. and Secondary Only': 'Primary, Upper Primary and Secondary Only',
    'Pr. with Up.Pr. Sec. and H.Sec.': 'Primary with Upper Primary, Secondary and Higher Secondary',
    'Up. Pr. Secondary and Higher Sec': 'Upper Primary, Secondary and Higher Secondary',
    'Upper Pr. and Secondary': 'Upper Primary and Secondary',
    'Higher Secondary only/Jr. College': 'Higher Secondary only / Junior College',
    'Primary with Upper Primary': 'Primary with Upper Primary',
    'Secondary with Higher Secondary': 'Secondary with Higher Secondary',
    'Secondary Only': 'Secondary Only',
    'Upper Primary only': 'Upper Primary Only',
    'Primary': 'Primary Only',
    'Pre-Primary Only': 'Pre-Primary Only'
  };
  return map[str] || str;
}

function cleanGenderType(val) {
  if (!val) return '';
  const str = String(val).toLowerCase();
  if (str.includes('boys') || str.includes('1-boys')) return 'Boys';
  if (str.includes('girls') || str.includes('2-girls')) return 'Girls';
  if (str.includes('co-ed') || str.includes('coed') || str.includes('coeducational') || str.includes('3-co')) return 'Co-educational';
  return cleanCodePrefix(val);
}

function cleanManagementDesc(val) {
  if (!val) return '';
  const str = cleanCodePrefix(val);
  if (str.toLowerCase().includes('madrasa') || str.toLowerCase().includes('madarsa')) {
    return 'Madrasa Private Unaided (Recognized)';
  }
  if (str === 'Private Unaided' || str === 'Private Unaided (Recognized)') {
    return 'Private Unaided (Recognized)';
  }
  if (str === 'Government Aided') {
    return 'Government Aided';
  }
  return str;
}

function cleanMediumName(val) {
  if (!val) return '';
  return cleanCodePrefix(val);
}

function cleanBoardName(val) {
  if (!val) return '';
  return cleanCodePrefix(val);
}

function cleanYesNo(val) {
  if (!val) return '';
  const str = String(val).trim();
  if (str === '1-Yes' || str.toLowerCase() === 'yes' || str === '1') return 'Yes';
  if (str === '2-No' || str.toLowerCase() === 'no' || str === '2') return 'No';
  return cleanCodePrefix(val);
}

function cleanFloatNumberStr(val) {
  if (!val) return '';
  return String(val).replace(/\.0$/, '').trim();
}

console.log('--- Step 2: Processing & Cleaning CSV stream ---');

const inputStream = fs.createReadStream(inputPath, { encoding: 'utf8' });
const outputStream = fs.createWriteStream(tempOutputPath, { encoding: 'utf8' });

const rl = readline.createInterface({
  input: inputStream,
  crlfDelay: Infinity
});

let lineIndex = 0;
let headerCols = [];
let colIndices = {};

rl.on('line', (line) => {
  lineIndex++;

  if (lineIndex === 1) {
    headerCols = parseCSVLine(line);
    headerCols.forEach((col, idx) => {
      colIndices[col.trim()] = idx;
    });
    outputStream.write(line + '\n');
    return;
  }

  if (!line || line.trim().length === 0) return;

  const row = parseCSVLine(line);

  // Clean respective columns by header name if found
  const cleanField = (colName, cleanerFn) => {
    const idx = colIndices[colName];
    if (idx !== undefined && idx < row.length) {
      row[idx] = cleanerFn(row[idx]);
    }
  };

  cleanField('schLocDesc', cleanRuralUrban);
  cleanField('schTypeDesc', cleanGenderType);
  cleanField('10th Board', cleanBoardName);
  cleanField('12th Board', cleanBoardName);
  cleanField('Primary Medium', cleanMediumName);
  cleanField('Secondary Medium', cleanMediumName);
  cleanField('schMgmtDesc', cleanManagementDesc);
  cleanField('schMgmtDescSt', cleanManagementDesc);
  cleanField('schCatDesc', cleanSchoolCategory);
  cleanField('pincode', cleanFloatNumberStr);
  cleanField('Phone Number', cleanFloatNumberStr);
  cleanField('Established Year', cleanFloatNumberStr);
  cleanField('classFrm', cleanFloatNumberStr);
  cleanField('classTo', cleanFloatNumberStr);
  cleanField('villageId', cleanFloatNumberStr);
  cleanField('clusterId', cleanFloatNumberStr);
  cleanField('lgdvillageId', cleanFloatNumberStr);
  cleanField('lgdpanchayatId', cleanFloatNumberStr);
  cleanField('lgdblockId', cleanFloatNumberStr);
  cleanField('Atal STEM Lab', cleanYesNo);
  cleanField('Playground Available', cleanYesNo);

  const cleanedLine = row.map(escapeCSVField).join(',');
  outputStream.write(cleanedLine + '\n');

  if (lineIndex % 50000 === 0) {
    console.log(`Cleaned ${lineIndex.toLocaleString()} rows...`);
  }
});

rl.on('close', () => {
  outputStream.end(() => {
    console.log(`\n✅ Finished cleaning all ${(lineIndex - 1).toLocaleString()} rows!`);
    
    // Replace original file with cleaned file
    fs.copyFileSync(tempOutputPath, inputPath);
    fs.unlinkSync(tempOutputPath);
    console.log('✅ Updated original CSV file at:', inputPath);
    console.log('Done!');
  });
});
