const https = require('https');
const fs = require('fs');
const path = require('path');
const token = 'process.env.GITHUB_TOKEN';

async function checkGitTree() {
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

  if (!commitRes.tree) {
    console.error('No tree returned:', commitRes);
    return;
  }

  const gitFiles = new Set(commitRes.tree.filter(t => t.type === 'blob').map(t => t.path));
  console.log('Total files in GitHub main:', gitFiles.size);

  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      if (item === 'node_modules' || item === '.next' || item === '.git' || item === '.vercel') continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (/\.(tsx?|jsx?|json|css|png|jpg|svg)$/.test(item)) {
        const rel = path.relative(path.join(__dirname, '..'), full).replace(/\\/g, '/');
        if (!gitFiles.has(rel)) {
          console.log('Local file not in GitHub:', rel);
        }
      }
    }
  }

  walk(path.join(__dirname, '../src'));
}

checkGitTree().catch(e => console.error(e));
