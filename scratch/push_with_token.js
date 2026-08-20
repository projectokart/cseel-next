const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const token = process.argv[2] || process.env.GITHUB_TOKEN;

if (!token) {
  console.log('Please provide your GitHub Personal Access Token:');
  console.log('Usage: node scratch/push_with_token.js <YOUR_GITHUB_PAT_TOKEN>');
  process.exit(1);
}

async function push() {
  console.log('Pushing branch "main" to https://github.com/projectokart/cseel-next.git ...');
  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({
      username: token,
      password: '',
    }),
  });
  console.log('✓ Successfully pushed to GitHub!', pushResult);
}

push().catch((err) => {
  console.error('Error pushing to GitHub:', err.message || err);
});
