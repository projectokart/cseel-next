import os
import sys
import json
import re
import glob
from collections import defaultdict
from datetime import datetime

if sys.stdout:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGG_FILE = os.path.join(BASE_DIR, 'src', 'data', 'aggregated_jobs.json')
CURATED_DIR = os.path.abspath(r'd:\Projects\cseel_next\cseel-job-engine\curated_feeds')

def norm_text(t):
    if not t: return ''
    return re.sub(r'[^a-z0-9]', '', str(t).lower())

def norm_school(t):
    if not t: return ''
    t = str(t).lower()
    for w in ['school', 'international', 'public', 'convent', 'academy', 'the', 'senior', 'secondary', 'high', 'vidyalaya', 'institutions', 'institution', 'group']:
        t = re.sub(rf'\b{w}\b', '', t)
    return re.sub(r'[^a-z0-9]', '', t)

def main():
    print("=" * 70)
    print("🔍 STRICT ZERO-DUPLICATE JOB MERGE ENGINE")
    print("=" * 70)

    with open(AGG_FILE, 'r', encoding='utf-8') as f:
        agg = json.load(f)

    print(f"[1] Base Master Jobs: {len(agg)}")

    existing_slugs = set()
    existing_urls = set()
    existing_content = set()

    for j in agg:
        jid = norm_text(j.get('slug') or j.get('id'))
        if jid: existing_slugs.add(jid)
        
        url = (j.get('applyUrl') or j.get('originalUrl') or '').strip().lower()
        if url and 'mailto:' not in url:
            clean_u = url.split('?')[0].rstrip('/')
            existing_urls.add(clean_u)
            
        s = norm_school(j.get('organisationName') or j.get('institute_name'))
        t = norm_text(j.get('jobPostName') or j.get('title'))
        c = norm_text(j.get('city'))
        if s and t:
            existing_content.add((s, t, c))

    print(f"    Indexed signatures: {len(existing_slugs)} slugs, {len(existing_urls)} URLs, {len(existing_content)} content tuples")

    curated_files = glob.glob(os.path.join(CURATED_DIR, '*.json'))
    print(f"\n[2] Scanning {len(curated_files)} curated feeds...")

    def parse_curated_job(j):
        reqs = j.get('requirements') or []
        req_dict = {}
        for r in reqs:
            if ':' in r:
                k, v = r.split(':', 1)
                req_dict[k.strip()] = v.strip()
                
        url = (j.get('applyUrl') or j.get('originalUrl') or req_dict.get('url') or '').strip()
        source = req_dict.get('source') or j.get('source') or 'Indeed'
        subject = req_dict.get('subject') or j.get('department') or 'General'
        designation = req_dict.get('designation') or 'Teacher'
        board = req_dict.get('board') or 'CBSE'
        opening_date = req_dict.get('opening_date') or (j.get('posted_at') or '')[:10] or '2026-10-25'
        district = req_dict.get('district') or j.get('city') or 'Delhi'
        
        coords = {}
        if 'lat' in req_dict and 'lng' in req_dict:
            try:
                coords = {'lat': float(req_dict['lat']), 'lng': float(req_dict['lng'])}
            except:
                pass
                
        title = j.get('title') or j.get('jobPostName') or 'Teaching Faculty'
        org = j.get('institute_name') or j.get('organisationName') or 'School / Institutional Partner'
        sal = j.get('salary_range') or j.get('salary') or 'Not Disclosed'
        desc = j.get('description') or ''
        
        sal_min = None
        sal_max = None
        nums = re.findall(r'(\d+[\d,]*)', sal.replace(',', ''))
        if len(nums) >= 2:
            try:
                sal_min = int(nums[0])
                sal_max = int(nums[1])
            except:
                pass
        elif len(nums) == 1:
            try:
                sal_max = int(nums[0])
            except:
                pass
                
        jid = j.get('slug') or j.get('id') or f"ind-{abs(hash((org, title, district)))}"
        city = j.get('city') or district
        state = j.get('state') or 'Delhi'
        
        return {
            'id': jid,
            'slug': jid,
            'organisationName': org,
            'organisationLogo': None,
            'image_url': None,
            'jobPostName': title,
            'title': title,
            'institute_name': org,
            'designation': designation,
            'subject': subject,
            'department': subject,
            'board': board,
            'roleType': j.get('job_type') or 'Full-Time',
            'job_type': j.get('job_type') or 'Full-Time',
            'salary': sal,
            'salary_range': sal,
            'salaryMin': sal_min,
            'salaryMax': sal_max,
            'shortDescription': desc[:150] if desc else f'{title} at {org}',
            'description': desc,
            'address': f"{org}, {city}, {state}",
            'city': city,
            'state': state,
            'district': district,
            'coordinates': coords,
            'minExperience': j.get('experience_required') or '1-3 years',
            'experience_required': j.get('experience_required') or '1-3 years',
            'openingDate': opening_date,
            'lastDate': j.get('deadline'),
            'deadline': j.get('deadline'),
            'source': source,
            'originalUrl': url,
            'applyUrl': url,
            'verified': True,
            'badge': 'Verified',
            'forLady': bool(re.search(r'lady|female|mother teacher', title, re.IGNORECASE)),
            'requirements': reqs
        }

    new_jobs_to_append = []

    for fpath in curated_files:
        fname = os.path.basename(fpath)
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list): continue
        
        accepted_this_file = 0
        for j in data:
            jid = norm_text(j.get('slug') or j.get('id'))
            if jid and jid in existing_slugs:
                continue
                
            reqs = j.get('requirements') or []
            url = (j.get('applyUrl') or j.get('originalUrl') or '').strip().lower()
            if not url:
                for r in reqs:
                    if r.startswith('url:'):
                        url = r[4:].strip().lower()
                        break
            clean_u = ''
            if url and 'mailto:' not in url:
                clean_u = url.split('?')[0].rstrip('/')
                if clean_u in existing_urls:
                    continue
                    
            s = norm_school(j.get('organisationName') or j.get('institute_name'))
            t = norm_text(j.get('jobPostName') or j.get('title'))
            c = norm_text(j.get('city'))
            if s and t and (s, t, c) in existing_content:
                continue
                
            if jid: existing_slugs.add(jid)
            if clean_u: existing_urls.add(clean_u)
            if s and t: existing_content.add((s, t, c))
            
            parsed = parse_curated_job(j)
            new_jobs_to_append.append(parsed)
            accepted_this_file += 1
            
        print(f"  • {fname}: accepted +{accepted_this_file} strictly unique jobs")

    print(f"\n[3] Total Unique Jobs to Append: +{len(new_jobs_to_append)}")
    merged = agg + new_jobs_to_append

    # Final Strict Safety Pass
    print("\n[4] Running Final Full-Pass Deduplication Verification...")
    final_seen = set()
    final_list = []
    final_dups = 0
    for j in merged:
        key = j.get('slug') or j.get('id')
        if key in final_seen:
            final_dups += 1
            continue
        final_seen.add(key)
        final_list.append(j)

    print(f"    Final Duplicates Found: {final_dups}")
    print(f"    Final Verified Master Jobs: {len(final_list)}")

    with open(AGG_FILE, 'w', encoding='utf-8') as f:
        json.dump(final_list, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully written to {AGG_FILE}")

if __name__ == '__main__':
    main()
