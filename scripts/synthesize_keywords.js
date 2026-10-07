const fs = require('fs');
const XLSX = require('xlsx');

const xlsxPath = 'C:/Users/DEVENDER/Desktop/Project/website data/steam lab data/STEM_Labs_All_Websites_Keywords.xlsx';
const wb = XLSX.readFile(xlsxPath);

const allRows = [];
const keywordCounts = new Map();
const categoryCounts = new Map();
const websiteCounts = new Map();

for (const sheetName of wb.SheetNames) {
  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
  for (const row of data) {
    const kw = (row['Keyword / Search Phrase'] || row['Keyword'] || '').trim();
    const site = (row['Website Source'] || row['Source'] || sheetName).trim();
    const cat = (row['Category'] || '').trim();
    const intent = (row['Search Intent'] || '').trim();
    const url = (row['Target URL'] || row['URL'] || '').trim();

    if (kw && kw !== 'Homepage Brand Keyword') {
      allRows.push({ kw, site, cat, intent, url });
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    }
    if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    if (site) websiteCounts.set(site, (websiteCounts.get(site) || 0) + 1);
  }
}

console.log('Total Keywords Collected:', allRows.length);
console.log('\n--- Categories Breakdown ---');
for (const [cat, count] of categoryCounts.entries()) {
  console.log(`${cat}: ${count}`);
}

console.log('\n--- Sample Keywords by Category ---');
const byCat = {};
for (const row of allRows) {
  if (!byCat[row.cat]) byCat[row.cat] = [];
  if (byCat[row.cat].length < 15) {
    byCat[row.cat].push(row.kw);
  }
}

for (const cat of Object.keys(byCat)) {
  console.log(`\n[${cat}] (${byCat[cat].length} samples):`);
  console.log(byCat[cat].join(' | '));
}
