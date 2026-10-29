import json
import re
import os
from collections import defaultdict
from datetime import datetime

AGGREGATED_PATH = 'd:/Projects/cseel_next/cseel-next/src/data/aggregated_jobs.json'
SCHOOLS_PATH = 'd:/Projects/cseel_next/cseel-next/src/data/schools_database.json'

def normalize_text(text):
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[\s\-_–—/|(),.]+', ' ', text).strip()
    return text

def norm_school_name(text):
    if not text:
        return ""
    text = text.lower()
    for w in ['school', 'international', 'public', 'convent', 'academy', 'the', 'senior', 'secondary', 'high', 'vidyalaya', 'institutions', 'institution', 'group']:
        text = re.sub(rf'\b{w}\b', '', text)
    return re.sub(r'[^a-z0-9]', '', text)

def clean_image_url(url):
    if not url:
        return None
    url = url.strip()
    if url.startswith('=IMAGE("') and url.endswith('")'):
        url = url[8:-2]
    if url.startswith('http://') or url.startswith('https://'):
        return url
    return None

def score_job_completeness(j):
    score = 0
    # Coordinates
    coords = j.get('coordinates')
    if coords and isinstance(coords, dict):
        if coords.get('lat') and coords.get('lng'):
            score += 10
    # Salary
    sal = j.get('salary') or j.get('salary_range')
    if sal and sal not in ['Not Disclosed', '---', '', 'null', 'None']:
        score += 5
    if j.get('salaryMin') or j.get('salaryMax'):
        score += 5
    # Subject & Designation
    if j.get('subject'): score += 4
    if j.get('designation'): score += 4
    if j.get('board'): score += 3
    # Verified / Lady tags
    if j.get('verified'): score += 5
    if j.get('forLady'): score += 3
    # Images
    if j.get('image_url') or j.get('organisationLogo'): score += 5
    # Recency
    od = j.get('openingDate', '')
    if od:
        try:
            days_old = (datetime.now() - datetime.strptime(od[:10], '%Y-%m-%d')).days
            score += max(0, 30 - min(days_old, 30))
        except:
            pass
    # Description length
    desc = j.get('description') or j.get('shortDescription') or ''
    if len(desc) > 50: score += 3
    return score

def main():
    print("[1] Loading aggregated jobs...")
    with open(AGGREGATED_PATH, 'r', encoding='utf-8') as f:
        jobs = json.load(f)
    print(f"    Initial job count: {len(jobs)}")

    # 1. First deduplicate by exact ID / Slug
    id_seen = set()
    unique_id_jobs = []
    for j in jobs:
        jid = j.get('id') or j.get('slug')
        if not jid:
            # Generate deterministic fallback ID if missing
            org = normalize_text(j.get('organisationName') or j.get('institute_name') or '')
            title = normalize_text(j.get('jobPostName') or j.get('title') or '')
            city = normalize_text(j.get('city') or '')
            jid = f"job-{abs(hash((org, title, city)))}"
            j['id'] = jid
            j['slug'] = jid
        if jid in id_seen:
            continue
        id_seen.add(jid)
        unique_id_jobs.append(j)

    print(f"    After ID deduplication: {len(unique_id_jobs)}")

    # 2. Content-based deduplication: (Normalized Title + Normalized Org + City)
    # Also handle specific duplicates where school is generic 'School / Institutional Partner'
    # but another entry exists with real school name and same title/location.
    groups = defaultdict(list)
    generic_org_names = {
        'school institutional partner', 'confidential', 'top reputed school', 
        'reputed school', 'leading cbse school', 'educational institution'
    }

    for j in unique_id_jobs:
        title = normalize_text(j.get('jobPostName') or j.get('title') or '')
        org = normalize_text(j.get('organisationName') or j.get('institute_name') or '')
        city = normalize_text(j.get('city') or '')
        
        # Canonical key
        if org in generic_org_names:
            key = ('GENERIC', title, city)
        else:
            key = ('SPECIFIC', title, org, city)
        groups[key].append(j)

    deduped_jobs = []
    removed_count = 0

    for key, group in groups.items():
        if len(group) == 1:
            deduped_jobs.append(group[0])
        else:
            # Sort by completeness score, keep the highest quality entry
            group.sort(key=score_job_completeness, reverse=True)
            best_job = group[0]
            # Merge missing fields from other duplicates into best_job
            for other in group[1:]:
                removed_count += 1
                if not best_job.get('organisationLogo') and other.get('organisationLogo'):
                    best_job['organisationLogo'] = other['organisationLogo']
                if not best_job.get('image_url') and other.get('image_url'):
                    best_job['image_url'] = other['image_url']
                if not best_job.get('subject') and other.get('subject'):
                    best_job['subject'] = other['subject']
                if not best_job.get('designation') and other.get('designation'):
                    best_job['designation'] = other['designation']
                if not best_job.get('board') and other.get('board'):
                    best_job['board'] = other['board']
                if other.get('forLady'):
                    best_job['forLady'] = True
            deduped_jobs.append(best_job)

    print(f"    Content deduplication removed {removed_count} duplicate postings.")
    print(f"    Jobs count after content deduplication: {len(deduped_jobs)}")

    # 3. Handle Cross-Source LinkedIn Duplicates (Generic scraper vs Curated)
    # E.g. li-4439062251 (Generic) vs li-6391361168246418425 (Akshara International School Pune)
    # Check if a GENERIC job has the same title and city as a SPECIFIC job
    specific_jobs_by_title_city = defaultdict(list)
    for j in deduped_jobs:
        org = normalize_text(j.get('organisationName') or j.get('institute_name') or '')
        if org not in generic_org_names:
            title = normalize_text(j.get('jobPostName') or j.get('title') or '')
            city = normalize_text(j.get('city') or '')
            if title and city:
                specific_jobs_by_title_city[(title, city)].append(j)

    final_jobs = []
    generic_purged = 0
    for j in deduped_jobs:
        org = normalize_text(j.get('organisationName') or j.get('institute_name') or '')
        if org in generic_org_names:
            title = normalize_text(j.get('jobPostName') or j.get('title') or '')
            city = normalize_text(j.get('city') or '')
            if (title, city) in specific_jobs_by_title_city:
                # Skip the generic duplicate because high quality named school entry exists!
                generic_purged += 1
                continue
        final_jobs.append(j)

    print(f"    Cross-source generic fallback duplicates removed: {generic_purged}")
    print(f"    Clean unique jobs remaining: {len(final_jobs)}")

    # 4. Enrich with School Images from schools_database.json
    print("[2] Enriching with verified school images...")
    with open(SCHOOLS_PATH, 'r', encoding='utf-8') as f:
        schools = json.load(f)

    school_lookup = {}
    for s in schools:
        sname = s.get('school_name', '')
        img = clean_image_url(s.get('image_url', ''))
        if sname and img:
            k = norm_school_name(sname)
            if len(k) >= 4 and k not in school_lookup:
                school_lookup[k] = img

    enriched_images = 0
    for j in final_jobs:
        # Check existing images first
        existing_logo = clean_image_url(j.get('organisationLogo'))
        existing_img = clean_image_url(j.get('image_url'))
        
        if existing_logo:
            j['organisationLogo'] = existing_logo
        if existing_img:
            j['image_url'] = existing_img

        # If missing image/logo, match with schools_database
        if not j.get('image_url') and not j.get('organisationLogo'):
            org = j.get('organisationName') or j.get('institute_name') or ''
            k = norm_school_name(org)
            if k in school_lookup:
                img_url = school_lookup[k]
                j['organisationLogo'] = img_url
                j['image_url'] = img_url
                enriched_images += 1

    total_with_images = sum(1 for j in final_jobs if j.get('organisationLogo') or j.get('image_url'))
    print(f"    Newly enriched school images: {enriched_images}")
    print(f"    Total jobs with valid school image/logo: {total_with_images} / {len(final_jobs)}")

    # 5. Standardize fields in final_jobs
    for j in final_jobs:
        if not j.get('id'):
            j['id'] = j.get('slug')
        if not j.get('slug'):
            j['slug'] = j.get('id')
        if not j.get('organisationName'):
            j['organisationName'] = j.get('institute_name') or 'Educational Institution'
        if not j.get('jobPostName'):
            j['jobPostName'] = j.get('title') or 'Teaching Position'

    # Save to aggregated_jobs.json
    with open(AGGREGATED_PATH, 'w', encoding='utf-8') as f:
        json.dump(final_jobs, f, indent=2, ensure_ascii=False)
    print(f"[3] Successfully saved {len(final_jobs)} unique enriched jobs to {AGGREGATED_PATH}")

if __name__ == '__main__':
    main()
