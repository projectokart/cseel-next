const fs = require('fs');
const path = require('path');
const xlsxPath = 'C:/Users/DEVENDER/Desktop/Project/website data/steam lab data/STEM_Labs_All_Websites_Keywords.xlsx';

try {
  const XLSX = require('xlsx');
  const wb = XLSX.readFile(xlsxPath);
  console.log('Sheets in Keywords Excel:', wb.SheetNames);
  for (const name of wb.SheetNames) {
    const data = XLSX.utils.sheet_to_json(wb.Sheets[name]);
    console.log(`\n--- Sheet: ${name} (Total rows: ${data.length}) ---`);
    console.log('Columns:', data.length > 0 ? Object.keys(data[0]) : 'empty');
    console.log('Sample rows:', JSON.stringify(data.slice(0, 5), null, 2));
  }
} catch (e) {
  console.error('Error with xlsx:', e.message);
}
