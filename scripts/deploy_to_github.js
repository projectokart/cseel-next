const https = require('https');
const fs = require('fs');
const path = require('path');

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
        'User-Agent': 'CSEEL-Deployment-Bot',
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
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function pushAllChanges() {
  console.log('🚀 Step 1: Testing GitHub Auth & Connection...');
  const repoData = await githubRequest('');
  console.log('✅ Connected to Repo:', repoData.full_name, '| Default Branch:', repoData.default_branch);

  console.log('\n🔍 Step 2: Getting latest commit on main branch...');
  const refData = await githubRequest('/git/ref/heads/main');
  const latestCommitSha = refData.object.sha;
  console.log('Latest Commit SHA:', latestCommitSha);

  const commitData = await githubRequest('/git/commits/' + latestCommitSha);
  const baseTreeSha = commitData.tree.sha;
  console.log('Base Tree SHA:', baseTreeSha);

  const files = [
    'package.json',
    'package-lock.json',
    'next.config.js',
    'src/data/subjectActivitiesData.ts',
    'src/components/subject/PrintableLabManual.tsx',
    'src/integrations/supabase/schoolSearchClient.ts',
    'src/app/school/[state]/[district]/[village]/[schoolSlug]/SchoolProfileView.tsx',
    'src/app/school/[state]/[district]/[village]/[schoolSlug]/page.tsx',
    'src/components/offers/OfferPopup.tsx',
    'src/app/(public)/Client.tsx',
    'src/app/(public)/virtual-lab-tour/page.tsx',
    'src/app/(public)/virtual-lab-tour/Client.tsx',
    'src/app/(public)/compare-plans/Client.tsx',
    'src/components/layout/Navbar.tsx',
    'src/components/shared/TopProgressBar.tsx',
    'src/components/shared/NucleusLoader.tsx',
    'src/lib/cache/smartCache.ts',
    'src/lib/cache/useSmartSWR.ts',
    'src/contexts/NavigationContext.tsx',
    'src/features/homepage-cms/hooks/useHomepageCms.ts',
    'src/features/homepage-cms/data/homepageSeed.ts',
    'src/app/layout.tsx',
    'src/app/globals.css',
    'src/app/experiments/[id]/page.tsx',
    'src/components/school-finder/SchoolDetailModal.tsx',
    'src/app/school-finder/Client.tsx',
    'src/data/schoolFinderData.ts',
    'src/components/school-finder/SchoolFinderMap.tsx',
    'src/data/unique_locations.json',
    'src/features/edu-network/utils/fuzzySearch.ts',
    'src/lib/schoolsSeoParser.ts',
    'src/integrations/supabase/schoolsDirectoryDb.ts',
    'src/components/schools/SchoolsDirectoryClient.tsx',
    'src/lib/facultyProfiles.ts',
    'src/lib/facultyHtmlGenerators.ts',
    'src/lib/schoolsHierarchySeoParser.ts',
    'src/integrations/supabase/schoolsHierarchyDb.ts',
    'src/components/schools/SchoolsHierarchyClient.tsx',
    'src/data/schoolsLocationHierarchyData.ts',
    'src/components/subject/ExperimentDetailModal.tsx',
    'src/components/resume-builder/ResumeBuilderCanvas.tsx',
    'src/lib/location-utils.ts',
    'src/lib/facultyComponents.ts',
    'src/features/edu-network/api/udiseMasterService.ts',
    'src/app/design/htmlContent.ts',
    'src/app/design/prebuiltPages.json',
    'src/components/seo/BreadcrumbsJsonLd.tsx',
    'src/middleware.ts',
    'src/features/admin/contexts/AdminAuthContext.tsx',
    'src/app/(public)/edu-network/organisation/school/page.tsx',
    'src/app/(public)/edu-network/organisation/school/[slug]/page.tsx',
    'src/app/(public)/edu-network/school/page.tsx',
    'src/app/(public)/edu-network/schools/page.tsx'
  ];

  console.log('\n📦 Step 3: Creating GitHub blobs for all modified files...');
  const treeEntries = [];
  for (const rel of files) {
    const full = path.join(__dirname, '..', rel);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      const blob = await githubRequest('/git/blobs', 'POST', { content: content, encoding: 'utf-8' });
      treeEntries.push({ path: rel.replace(/\\/g, '/'), mode: '100644', type: 'blob', sha: blob.sha });
      console.log('Uploaded blob for: ' + rel);
    } else {
      console.warn('⚠️ File not found locally: ' + rel);
    }
  }

  console.log('\n🌲 Step 4: Creating new Git Tree...');
  const newTree = await githubRequest('/git/trees', 'POST', { base_tree: baseTreeSha, tree: treeEntries });
  console.log('New Tree SHA: ' + newTree.sha);

  console.log('\n📝 Step 5: Creating new Commit...');
  const newCommit = await githubRequest('/git/commits', 'POST', {
    message: 'feat(edu-network): connect /edu-network/organisation/school to modern school directory with Google Places design & live seed profiles',
    tree: newTree.sha,
    parents: [latestCommitSha]
  });
  console.log('New Commit SHA: ' + newCommit.sha);

  console.log('\n🚀 Step 6: Updating heads/main reference (Pushing to GitHub)...');
  const updatedRef = await githubRequest('/git/refs/heads/main', 'PATCH', {
    sha: newCommit.sha,
    force: false
  });

  console.log('\n🎉 SUCCESS! Pushed new commit to GitHub projectokart/cseel-next main branch: ' + updatedRef.object.sha);
  console.log('⚡ Vercel Production Auto-Deployment has been triggered!');
}

pushAllChanges().catch(e => console.error('❌ Error:', e));
