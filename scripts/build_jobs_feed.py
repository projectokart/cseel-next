"""
Job Feed Builder v2 — CSEEL Split-Feed Architecture
Split into:
  - jobs-feed.json: search-critical fields (< 1 MB, scales to 5000 jobs)
  - jobs-links.json: id->url lookup (loaded lazily on card open)
  - jobs-top50.json: first 50 for instant paint (< 10 KB)
  - latest.json: manifest/version pointer
"""
import json, os, sys, re
from datetime import datetime, timedelta

BASE_DIR      = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INPUT_FILE    = os.path.join(BASE_DIR, 'src', 'data', 'aggregated_jobs.json')
OUTPUT_DIR    = os.path.join(BASE_DIR, 'public', 'jobs')
OUTPUT_SLIM   = os.path.join(OUTPUT_DIR, 'jobs-feed.json')
OUTPUT_LINKS  = os.path.join(OUTPUT_DIR, 'jobs-links.json')
OUTPUT_TOP50  = os.path.join(OUTPUT_DIR, 'jobs-top50.json')
OUTPUT_LATEST = os.path.join(OUTPUT_DIR, 'latest.json')

MAX_AGE_DAYS  = 45
TARGET_SIZE_B = 1_048_576   # 1 MB (1024 KB) target on jobs-feed.json

BOARD_MAP = {'CBSE':'C','ICSE':'I','Cambridge / IB':'IB','State Board':'S','International':'INT'}
SOURCE_MAP = {
    'LinkedIn':'LI','Indeed':'IN','Naukri.com':'NK','Direct School Portal':'DP',
    'Apna.co':'AP','TeacherON':'TO','TimesJobs':'TJ','Shine.com':'SH',
    'EducoHire':'EH','Foundit':'FO','KVS / NVS':'KV','DAV CMC':'DV','AWES India':'AW',
}
ROLE_MAP = {
    'Full-Time':'F','Part-Time':'P','Visiting Faculty':'V',
    'Lab In-Charge':'L','ATL Mentor':'A','Contractual':'C',
}

def purge_old(jobs):
    cutoff = datetime.now() - timedelta(days=MAX_AGE_DAYS)
    kept, purged = [], 0
    for j in jobs:
        od = j.get('openingDate', '')
        if od:
            try:
                if datetime.strptime(od[:10], '%Y-%m-%d') < cutoff:
                    purged += 1
                    continue
            except:
                pass
        kept.append(j)
    return kept, purged

def slim_job(j):
    """Search-critical fields only — NO URL, NO description."""
    s = {}

    jid = j.get('slug') or j.get('id', '')
    if jid: s['id'] = jid

    org = j.get('organisationName', '')
    if org: s['n'] = org[:40]

    title = j.get('jobPostName', '')
    if title: s['t'] = title[:50]

    desig = j.get('designation', '')
    if desig: s['g'] = desig[:18]

    subj = j.get('subject', '')
    if subj: s['s'] = subj[:18]

    board = j.get('board', '')
    if board: s['b'] = BOARD_MAP.get(board, board[:8])

    role = j.get('roleType', '')
    if role: s['r'] = ROLE_MAP.get(role, role[:2])

    sal = j.get('salary', '')
    skip_sal = {'Not Disclosed','Not Disclosed (On Merit / Negotiable)','---','','null','None'}
    if sal and sal not in skip_sal:
        s['$'] = sal[:25]

    smin = j.get('salaryMin')
    smax = j.get('salaryMax')
    if isinstance(smin, (int, float)) and smin > 0: s['$n'] = int(smin)
    if isinstance(smax, (int, float)) and smax > 0: s['$x'] = int(smax)

    city = j.get('city', '')
    state = j.get('state', '')
    dist = j.get('district', '')
    if city: s['c'] = city
    if state: s['st'] = state
    if dist and dist != city: s['dt'] = dist

    coords = j.get('coordinates', {})
    if coords:
        try:
            lat = round(float(coords.get('lat', 0)), 4)
            lng = round(float(coords.get('lng', 0)), 4)
            if lat != 0 and lng != 0:
                s['co'] = [lat, lng]
        except:
            pass

    exp = j.get('minExperience', '')
    if exp: s['x'] = str(exp)[:10]

    od = j.get('openingDate', '')
    if od: s['od'] = od[:10]

    src = j.get('source', '')
    if src: s['src'] = SOURCE_MAP.get(src, src[:8])

    url = j.get('applyUrl') or j.get('originalUrl', '')
    if url: s['u'] = url[:100]

    if j.get('verified'): s['v'] = 1
    if j.get('forLady'): s['f'] = 1

    img = j.get('organisationLogo') or j.get('image_url')
    if img and isinstance(img, str) and (img.startswith('http://') or img.startswith('https://')):
        img = re.sub(r'=w\d+-h\d+-k-no', '=s300', img)
        s['im'] = img

    return s

def link_entry(j):
    """URL + short description for card detail view (loaded on demand)."""
    url = j.get('applyUrl') or j.get('originalUrl', '')
    desc = j.get('shortDescription', '')[:120]
    entry = {}
    if url: entry['u'] = url[:200]
    if desc: entry['d'] = desc
    return entry

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("[1] Loading source data ...")
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        raw = json.load(f)
    full_kb = os.path.getsize(INPUT_FILE) / 1024
    print(f"    {len(raw)} raw jobs  ({full_kb:.0f} KB)")

    print(f"[2] Purging jobs older than {MAX_AGE_DAYS} days ...")
    active, purged = purge_old(raw)
    print(f"    Kept {len(active)}, purged {purged}")

    # Dedup by slug
    seen, deduped = set(), []
    for j in active:
        key = j.get('slug') or j.get('id', '')
        if key and key in seen: continue
        if key: seen.add(key)
        deduped.append(j)
    # Sort newest first
    deduped.sort(key=lambda j: j.get('openingDate', ''), reverse=True)
    print(f"    After dedup: {len(deduped)} unique jobs")

    print("[3] Building split feed ...")
    slim  = [slim_job(j) for j in deduped]
    links = {(j.get('slug') or j.get('id', '')): link_entry(j) for j in deduped}

    feed_json  = json.dumps(slim,  separators=(',', ':'), ensure_ascii=False)
    links_json = json.dumps(links, separators=(',', ':'), ensure_ascii=False)
    top50_json = json.dumps(slim[:50], separators=(',', ':'), ensure_ascii=False)

    feed_kb  = len(feed_json.encode('utf-8'))  / 1024
    links_kb = len(links_json.encode('utf-8')) / 1024
    top50_kb = len(top50_json.encode('utf-8')) / 1024
    avg_b    = len(feed_json.encode('utf-8'))  / len(slim)

    print(f"    jobs-feed.json:  {feed_kb:.1f} KB  (avg {avg_b:.0f} B/job)")
    print(f"    jobs-links.json: {links_kb:.1f} KB")
    print(f"    jobs-top50.json: {top50_kb:.1f} KB")
    est_5k = avg_b * 5000 / 1024
    print(f"    Est for 5000 jobs: {est_5k:.0f} KB")

    limit_ok = len(feed_json.encode('utf-8')) <= TARGET_SIZE_B
    print(f"    1 MB Limit: {'PASS' if limit_ok else 'FAIL'}")

    newest = deduped[0].get('openingDate', '')[:10] if deduped else ''
    version = f"v_{len(slim)}_{datetime.now().strftime('%Y-%m-%d')}_v4"

    facets_src = os.path.join(BASE_DIR, 'src', 'data', 'job_filter_facets.json')
    facets_dest = os.path.join(OUTPUT_DIR, 'jobs-facets.json')
    if os.path.exists(facets_src):
        with open(facets_src, 'r', encoding='utf-8') as f:
            facets_data = json.load(f)
        with open(facets_dest, 'w', encoding='utf-8') as f:
            json.dump(facets_data, f, separators=(',', ':'), ensure_ascii=False)
        facets_kb = len(json.dumps(facets_data, separators=(',', ':')).encode('utf-8')) / 1024
        print(f"    jobs-facets.json:{facets_kb:.1f} KB")

    manifest = {
        "version": version,
        "count": len(slim),
        "generatedAt": datetime.now().isoformat(),
        "feedUrl": "/jobs/jobs-feed.json",
        "top50Url": "/jobs/jobs-top50.json",
        "linksUrl": "/jobs/jobs-links.json",
        "facetsUrl": "/jobs/jobs-facets.json",
        "feedSizeKb": round(feed_kb, 1),
        "linksSizeKb": round(links_kb, 1),
    }

    with open(OUTPUT_SLIM,  'w', encoding='utf-8') as f: f.write(feed_json)
    with open(OUTPUT_LINKS, 'w', encoding='utf-8') as f: f.write(links_json)
    with open(OUTPUT_TOP50, 'w', encoding='utf-8') as f: f.write(top50_json)
    with open(OUTPUT_LATEST,'w', encoding='utf-8') as f: json.dump(manifest, f, indent=2)

    print(f"\n[4] Written to {OUTPUT_DIR}/")
    print(f"    Version: {version}")

if __name__ == '__main__':
    main()
