"""
publish_cdn_feed.py
Auto-publishes compiled jobs feeds to the GitHub Edge CDN branch (data-feed).
Takes ~2 seconds, bypasses Vercel builds entirely, and updates mobile clients.
"""
import os
import shutil
import subprocess
import json
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

PROJECT_ROOT = os.path.abspath(r'd:\Projects\cseel_next')
CSEEL_NEXT = os.path.join(PROJECT_ROOT, 'cseel-next')
DATA_FEED_WORKTREE = os.path.join(PROJECT_ROOT, 'cseel-data-feed')

def publish():
    print("=" * 60)
    print("🚀 CSEEL EDGE CDN PUBLISHER")
    print("=" * 60)

    src_dir = os.path.join(CSEEL_NEXT, 'public', 'jobs')
    dest_dir = os.path.join(DATA_FEED_WORKTREE, 'public', 'jobs')

    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir, exist_ok=True)

    files_to_copy = ['latest.json', 'jobs-feed.json', 'jobs-top50.json', 'jobs-links.json']
    for f in files_to_copy:
        src = os.path.join(src_dir, f)
        dest = os.path.join(dest_dir, f)
        if os.path.exists(src):
            shutil.copy2(src, dest)
            print(f"  ✓ Synced {f} ({os.path.getsize(src) / 1024:.1f} KB)")

    # Read manifest info
    manifest_path = os.path.join(dest_dir, 'latest.json')
    version = "unknown"
    count = 0
    if os.path.exists(manifest_path):
        with open(manifest_path, 'r', encoding='utf-8') as mf:
            mdata = json.load(mf)
            version = mdata.get('version', '')
            count = mdata.get('count', 0)

    # Git commit & push in worktree
    cmd_add = ['git', '-C', DATA_FEED_WORKTREE, 'add', 'public/jobs']
    cmd_status = ['git', '-C', DATA_FEED_WORKTREE, 'status', '--porcelain']
    cmd_commit = ['git', '-C', DATA_FEED_WORKTREE, 'commit', '-m', f'chore(feed): auto-publish cdn feed [skip ci] - count: {count} ver: {version}']
    cmd_push = ['git', '-C', DATA_FEED_WORKTREE, 'push', 'origin', 'data-feed']

    subprocess.run(cmd_add, check=True)
    status_out = subprocess.check_output(cmd_status).decode().strip()
    if not status_out:
        print("  ℹ️ No changes in feed to publish.")
        return

    subprocess.run(cmd_commit, check=True)
    print(f"  ✓ Committed version {version} ({count} jobs)")

    print("  🚀 Pushing to origin/data-feed CDN...")
    subprocess.run(cmd_push, check=True)
    print("  🎉 Edge CDN published successfully! (Zero Vercel build triggered)")
    print("  🌐 Manifest: https://raw.githubusercontent.com/projectokart/cseel-next/data-feed/public/jobs/latest.json")
    print("  🌐 Feed CDN: https://cdn.jsdelivr.net/gh/projectokart/cseel-next@data-feed/public/jobs/jobs-feed.json")

if __name__ == '__main__':
    publish()
