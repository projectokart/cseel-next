const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const repoUrl = 'https://github.com/projectokart/cseel-next.git';

async function main() {
  console.log('1. Initializing Git repository in:', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('✓ Git repository initialized.');

  console.log('2. Staging all files...');
  const files = await git.statusMatrix({ fs, dir });
  for (const [file, head, workdir, stage] of files) {
    if (file.startsWith('.git/') || file.startsWith('node_modules/') || file.startsWith('.next/')) continue;
    if (workdir !== head || stage !== workdir) {
      if (workdir === 0) {
        await git.remove({ fs, dir, filepath: file });
      } else {
        await git.add({ fs, dir, filepath: file });
      }
    }
  }
  console.log('✓ Files staged.');

  console.log('3. Committing files...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'projectokart',
      email: 'projectokart@gmail.com',
    },
    message: 'Initial commit: Complete CSEEL Next.js production platform with Supabase & Vercel',
  });
  console.log('✓ Committed with SHA:', sha);

  console.log('4. Adding remote origin...');
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: repoUrl,
    force: true,
  });
  console.log('✓ Remote origin set to:', repoUrl);

  console.log('Ready to push!');
}

main().catch((err) => {
  console.error('Error during git operation:', err);
});
