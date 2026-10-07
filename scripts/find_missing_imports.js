const fs = require('fs');
const path = require('path');
const https = require('https');
const token = 'process.env.GITHUB_TOKEN';

async function check() {
  const commitRes = await new Promise((resolve, reject) => {
    https.get({
      hostname: 'api.github.com',
      path: '/repos/projectokart/cseel-next/git/trees/main?recursive=1',
      headers: { 'Authorization': 'token ' + token, 'User-Agent': 'NodeJS' }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });

  const gitFiles = new Set(commitRes.tree.filter(t => t.type === 'blob').map(t => t.path));

  // For every file currently on GitHub, let's parse its imports and check if any imported file is NOT in gitFiles!
  let missingImports = [];

  for (const item of commitRes.tree.filter(t => t.type === 'blob')) {
    const gitPath = item.path;
    if (!/\.(tsx?|jsx?)$/.test(gitPath)) continue;
    const localPath = path.join(__dirname, '..', gitPath);
    if (!fs.existsSync(localPath)) {
      console.log('GitHub file does not exist locally:', gitPath);
      continue;
    }
    const content = fs.readFileSync(localPath, 'utf8');
    const matches = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g), ...content.matchAll(/import\s*\(['"]([^'"]+)['"]\)/g)];
    for (const m of matches) {
      const imp = m[1];
      if (!imp.startsWith('.') && !imp.startsWith('@/')) continue;
      
      let resolved = '';
      if (imp.startsWith('@/')) {
        resolved = 'src/' + imp.slice(2);
      } else {
        resolved = path.join(path.dirname(gitPath), imp).replace(/\\/g, '/');
      }

      const exts = ['', '.ts', '.tsx', '.js', '.jsx', '.json', '/index.ts', '/index.tsx', '/index.js'];
      let found = null;
      for (const ext of exts) {
        if (gitFiles.has(resolved + ext)) {
          found = resolved + ext;
          break;
        }
      }

      if (!found) {
        // Check if it exists locally!
        let foundLocal = null;
        for (const ext of exts) {
          if (fs.existsSync(path.join(__dirname, '..', resolved + ext))) {
            foundLocal = (resolved + ext).replace(/\\/g, '/');
            break;
          }
        }
        if (foundLocal) {
          missingImports.push({ file: gitPath, import: imp, resolvedLocal: foundLocal });
        }
      }
    }
  }

  console.log('FOUND MISSING IMPORTS ON GITHUB:');
  console.log(JSON.stringify(missingImports, null, 2));
}

check().catch(console.error);
