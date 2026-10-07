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

async function syncAll() {
  console.log('🚀 Step 1: Getting latest commit & tree on main branch...');
  const refData = await githubRequest('/git/ref/heads/main');
  const latestCommitSha = refData.object.sha;
  console.log('Latest Commit SHA:', latestCommitSha);

  const treeData = await githubRequest('/git/trees/' + latestCommitSha + '?recursive=1');
  const remoteTree = new Map();
  for (const item of treeData.tree) {
    if (item.type === 'blob') {
      remoteTree.set(item.path, item.sha);
    }
  }
  console.log('Remote GitHub tree currently contains:', remoteTree.size, 'files.');

  const rootFiles = [
    'package.json',
    'package-lock.json',
    'next.config.js',
    'tailwind.config.ts',
    'tsconfig.json',
    'postcss.config.js',
    'components.json',
    'vercel.json'
  ];

  const localFiles = [];
  for (const rf of rootFiles) {
    if (fs.existsSync(path.join(__dirname, '..', rf))) {
      localFiles.push(rf);
    }
  }

  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir)) {
      if (['node_modules', '.next', '.git', '.vercel', 'scripts', '.vscode'].includes(item)) continue;
      if (item.startsWith('.')) continue;
      const full = path.join(dir, item);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        const rel = path.relative(path.join(__dirname, '..'), full).replace(/\\/g, '/');
        if (rel.startsWith('.env') || rel.endsWith('.log') || rel.endsWith('.tsbuildinfo')) continue;
        localFiles.push(rel);
      }
    }
  }

  walk(path.join(__dirname, '../src'));
  walk(path.join(__dirname, '../public'));

  console.log('Total local eligible files:', localFiles.length);

  // Find files that need upload or are different
  const toUpload = [];
  const changedEntries = [];

  for (const rel of localFiles) {
    const full = path.join(__dirname, '..', rel);
    const buf = fs.readFileSync(full);
    const sha = gitSha(buf);
    const remoteSha = remoteTree.get(rel);

    if (sha !== remoteSha) {
      toUpload.push({ path: rel, buffer: buf, sha: sha });
    }
  }

  console.log('Files needing sync to GitHub:', toUpload.length);

  // Upload blobs in chunks of 5
  const chunkSize = 5;
  let uploadedCount = 0;
  for (let i = 0; i < toUpload.length; i += chunkSize) {
    const chunk = toUpload.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (file) => {
      const isText = /\.(tsx?|jsx?|json|css|html|md|svg|txt|xml|js)$/i.test(file.path);
      const payload = isText
        ? { content: file.buffer.toString('utf8'), encoding: 'utf-8' }
        : { content: file.buffer.toString('base64'), encoding: 'base64' };
      
      const blob = await githubRequest('/git/blobs', 'POST', payload);
      changedEntries.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
      uploadedCount++;
      console.log(`[${uploadedCount}/${toUpload.length}] Processed blob: ${file.path}`);
    }));
  }

  console.log('\n🌲 Step 3: Creating Git Tree with changed entries (' + changedEntries.length + ' files)...');
  const commitData = await githubRequest('/git/commits/' + latestCommitSha);
  const baseTreeSha = commitData.tree.sha;

  let newTree;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      newTree = await githubRequest('/git/trees', 'POST', {
        base_tree: baseTreeSha,
        tree: changedEntries
      });
      break;
    } catch (err) {
      console.warn(`Tree creation attempt ${attempt} failed, retrying in 3s...`, err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  if (!newTree) throw new Error('Failed to create tree after 3 attempts');
  console.log('✅ New Tree SHA:', newTree.sha);

  console.log('\n📝 Step 4: Creating new Commit...');
  const newCommit = await githubRequest('/git/commits', 'POST', {
    message: 'fix(deploy): sync all components and assets to fix Vercel production build',
    tree: newTree.sha,
    parents: [latestCommitSha]
  });
  console.log('✅ New Commit SHA:', newCommit.sha);

  console.log('\n🚀 Step 5: Updating main branch ref...');
  const updatedRef = await githubRequest('/git/refs/heads/main', 'PATCH', {
    sha: newCommit.sha,
    force: false
  });

  console.log('\n🎉 ALL FILES SYNCED TO GITHUB! Commit:', updatedRef.object.sha);
}

syncAll().catch(e => {
  console.error('❌ Sync failed:', e);
});
