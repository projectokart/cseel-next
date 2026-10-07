const fs = require('fs');
const content = fs.readFileSync('src/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView.tsx', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);
lines.forEach((l, i) => {
  if (l.includes('<section') || l.includes('activeSection') || l.includes('activeTab') || l.includes('navigation') || l.includes('Navbar') || l.includes('header') || l.includes('id="')) {
    if (l.trim().startsWith('<section') || l.trim().startsWith('<header') || l.trim().startsWith('<nav') || l.includes('id=')) {
      console.log((i + 1) + ': ' + l.trim().slice(0, 100));
    }
  }
});
