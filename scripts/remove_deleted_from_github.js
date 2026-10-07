const https = require('https');

const token = 'process.env.GITHUB_TOKEN';
const owner = 'projectokart';
const repo = 'cseel-next';

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

async function removeDeletedFiles() {
  console.log('🚀 Getting latest commit on main...');
  const refData = await githubRequest('/git/ref/heads/main');
  const latestCommitSha = refData.object.sha;
  console.log('Latest Commit SHA:', latestCommitSha);

  const commitData = await githubRequest('/git/commits/' + latestCommitSha);
  const baseTreeSha = commitData.tree.sha;

  const deletedFiles = [
    'public/downloads/CSEEL_EduNetwork_Credentials.csv',
    'src/app/(dashboard)/user/my-projects-legacy/page.tsx',
    'src/app/(public)/admin/page.tsx',
    'src/app/(public)/credentials.csv/route.ts',
    'src/app/(public)/material/[slug]/page.tsx',
    'src/app/(public)/projectocart/route.ts',
    'src/app/(public)/projectokart/route.ts',
    'src/app/(public)/system-admin-portal/page.tsx',
    'src/app/api/credentials/route.ts',
    'scratch_prev.tsx'
  ];

  console.log('Removing files by creating tree with sha: null...');
  const treeEntries = deletedFiles.map(filePath => ({
    path: filePath,
    mode: '100644',
    type: 'blob',
    sha: null
  }));

  const newTree = await githubRequest('/git/trees', 'POST', {
    base_tree: baseTreeSha,
    tree: treeEntries
  });
  console.log('✅ New Clean Tree SHA:', newTree.sha);

  console.log('📝 Creating Commit...');
  const newCommit = await githubRequest('/git/commits', 'POST', {
    message: 'fix(routes): delete conflicting legacy /admin and orphaned route files to fix Vercel build',
    tree: newTree.sha,
    parents: [latestCommitSha]
  });
  console.log('✅ New Commit SHA:', newCommit.sha);

  console.log('🚀 Updating main branch...');
  const updatedRef = await githubRequest('/git/refs/heads/main', 'PATCH', {
    sha: newCommit.sha,
    force: false
  });

  console.log('🎉 SUCCESSFULLY PURGED ORPHANED CONFLICTING ROUTES! Commit:', updatedRef.object.sha);
}

removeDeletedFiles().catch(console.error);
