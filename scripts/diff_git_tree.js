const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const token = 'process.env.GITHUB_TOKEN';
const owner = 'projectokart';
const repo = 'cseel-next';

function gitSha(buf) {
  const header = 'blob ' + buf.length + '\0';
  return crypto.createHash('sha1').update(Buffer.from(header)).update(buf).digest('hex');
}

function githubRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/repos/' + owner + '/' + repo + endpoint,
      method: method,
      headers: {
        'Authorization': 'token ' + token,
        'User-Agent': 'NodeJS',
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      }
    };
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error('GitHub API Error (' + res.statusCode + '): ' + (parsed.message || body)));
          }
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function findDifferences() {
  console.log('Fetching remote tree...');
  const treeData = await githubRequest('/git/trees/main?recursive=1');
  const remoteMap = new Map();
  for (const item of treeData.tree) {
    if (item.type === 'blob') {
      remoteMap.set(item.path, item.sha);
    }
  }

  console.log('Remote has', remoteMap.size, 'files.');

  const localFiles = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir)) {
      if (['node_modules', '.next', '.git', '.vercel', 'scripts', '.vscode'].includes(item)) continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        const rel = path.relative(path.join(__dirname, '..'), full).replace(/\\/g, '/');
        // skip large binaries, system logs, env files
        if (rel.startsWith('.env') || rel.endsWith('.log')) continue;
        localFiles.push(rel);
      }
    }
  }
  walk(path.join(__dirname, '..'));

  console.log('Local has', localFiles.length, 'files.');

  const needUpload = [];
  for (const rel of localFiles) {
    const full = path.join(__dirname, '..', rel);
    const buf = fs.readFileSync(full);
    const sha = gitSha(buf);
    const remoteSha = remoteMap.get(rel);
    if (sha !== remoteSha) {
      needUpload.push({ path: rel, localSha: sha, remoteSha: remoteSha || 'MISSING' });
    }
  }

  console.log('\nFiles that differ or are missing on GitHub:', needUpload.length);
  for (const item of needUpload) {
    console.log(item.path, item.remoteSha === 'MISSING' ? '[MISSING ON GITHUB]' : '[MODIFIED]');
  }
}

findDifferences().catch(console.error);
