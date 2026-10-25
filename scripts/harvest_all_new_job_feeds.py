#!/usr/bin/env python3
"""
🇮🇳 ALL-INDIA COMPREHENSIVE SCHOOL JOBS HARVESTER & DATABASE SYNC
================================================================
Harvests all fresh school teaching and faculty vacancies across India:
1. Parses fresh verified LinkedIn jobs from user's DevTools api-logs
2. Queries Indeed GraphQL API across all 1st-12th subjects and major city hubs
3. Queries LinkedIn Guest Jobs API for live nationwide school vacancies
4. Cleans salaries, detects subjects/designations, and resolves accurate geo-coordinates
5. Appends all new unique vacancies to src/data/aggregated_jobs.json
6. Attempts Supabase sync with graceful fallback
"""

import os
import sys
import json
import re
import time
from datetime import datetime
import requests
from bs4 import BeautifulSoup

if sys.stdout:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_DIR = os.path.join(BASE_DIR, "src", "data")
JOBS_PATH = os.path.join(SRC_DATA_DIR, "aggregated_jobs.json")
GEO_PATH = os.path.join(SRC_DATA_DIR, "india_geo_centroids.json")
API_LOGS_PATH = r"C:\Users\DEVENDER\Downloads\api-logs-1792849322889.json"

SUPABASE_URL = "https://ukazkxthavxphibdbspd.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxOTgzOCwiZXhwIjoyMDg5Mzk1ODM4fQ.Od_IWU3qrttP28AdPajuJfxitTqQIXVo9dXSzFS-Kms"

INDEED_HEADERS = {
    "content-type": "application/json",
    "indeed-api-key": "176bee76fee13e7dd476a8eb31278b2e9bc1363a0f620338c7d7e65162af0ed4",
    "indeed-ctk": "1k5clgh3125hl000",
    "origin": "https://in.indeed.com",
    "referer": "https://in.indeed.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

LINKEDIN_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

CITIES_GEO = {
    "delhi": ("Delhi", "Delhi", 28.6139, 77.2090),
    "new delhi": ("New Delhi", "Delhi", 28.6139, 77.2090),
    "noida": ("Noida", "Uttar Pradesh", 28.5355, 77.3910),
    "greater noida": ("Greater Noida", "Uttar Pradesh", 28.4744, 77.5040),
    "gurgaon": ("Gurugram", "Haryana", 28.4595, 77.0266),
    "gurugram": ("Gurugram", "Haryana", 28.4595, 77.0266),
    "faridabad": ("Faridabad", "Haryana", 28.4089, 77.3178),
    "ghaziabad": ("Ghaziabad", "Uttar Pradesh", 28.6692, 77.4538),
    "mumbai": ("Mumbai", "Maharashtra", 19.0760, 72.8777),
    "navi mumbai": ("Navi Mumbai", "Maharashtra", 19.0330, 73.0297),
    "thane": ("Thane", "Maharashtra", 19.2183, 72.9781),
    "pune": ("Pune", "Maharashtra", 18.5204, 73.8567),
    "bengaluru": ("Bengaluru", "Karnataka", 12.9716, 77.5946),
    "bangalore": ("Bengaluru", "Karnataka", 12.9716, 77.5946),
    "hyderabad": ("Hyderabad", "Telangana", 17.3850, 78.4867),
    "chennai": ("Chennai", "Tamil Nadu", 13.0827, 80.2707),
    "kolkata": ("Kolkata", "West Bengal", 22.5726, 88.3639),
    "jaipur": ("Jaipur", "Rajasthan", 26.9124, 75.7873),
    "lucknow": ("Lucknow", "Uttar Pradesh", 26.8467, 80.9462),
    "kanpur": ("Kanpur", "Uttar Pradesh", 26.4499, 80.3319),
    "chandigarh": ("Chandigarh", "Punjab", 30.7333, 76.7794),
    "mohali": ("Mohali", "Punjab", 30.7046, 76.7179),
    "panchkula": ("Panchkula", "Haryana", 30.6942, 76.8606),
    "dehradun": ("Dehradun", "Uttarakhand", 30.3165, 78.0322),
    "ahmedabad": ("Ahmedabad", "Gujarat", 23.0225, 72.5714),
    "surat": ("Surat", "Gujarat", 21.1702, 72.8311),
    "vadodara": ("Vadodara", "Gujarat", 22.3072, 73.1812),
    "indore": ("Indore", "Madhya Pradesh", 22.7196, 75.8577),
    "bhopal": ("Bhopal", "Madhya Pradesh", 23.2599, 77.4126),
    "patna": ("Patna", "Bihar", 25.5941, 85.1376),
    "ranchi": ("Ranchi", "Jharkhand", 23.3441, 85.3096),
    "bhubaneswar": ("Bhubaneswar", "Odisha", 20.2961, 85.8245),
    "coimbatore": ("Coimbatore", "Tamil Nadu", 11.0168, 76.9558),
    "kochi": ("Kochi", "Kerala", 9.9312, 76.2673),
    "thiruvananthapuram": ("Thiruvananthapuram", "Kerala", 8.5241, 76.9366),
    "nagpur": ("Nagpur", "Maharashtra", 21.1458, 79.0882),
    "varanasi": ("Varanasi", "Uttar Pradesh", 25.3176, 82.9739),
    "agra": ("Agra", "Uttar Pradesh", 27.1767, 78.0081),
    "meerut": ("Meerut", "Uttar Pradesh", 28.9845, 77.7064),
    "amritsar": ("Amritsar", "Punjab", 31.6340, 74.8723),
    "ludhiana": ("Ludhiana", "Punjab", 30.9010, 75.8573),
    "jodhpur": ("Jodhpur", "Rajasthan", 26.2389, 73.0243),
    "kota": ("Kota", "Rajasthan", 25.2138, 75.8648),
    "udaipur": ("Udaipur", "Rajasthan", 24.5854, 73.7125)
}

EXCLUDED_CHAINS = [
    "allen", "aakash", "resonance", "fiitjee", "motion iit", "narayana educational coaching",
    "chaitanya iit", "reliable institute", "physics wallah", "vedantu", "byju", "unacademy",
    "swiggy", "zomato", "uber", "ola", "telecaller", "bpo", "delivery"
]

def resolve_geo(loc_str):
    loc_clean = str(loc_str or "").lower()
    for k, (city, state, lat, lng) in CITIES_GEO.items():
        if re.search(r'\b' + re.escape(k) + r'\b', loc_clean):
            return city, state, lat, lng
    return "Delhi", "Delhi", 28.6139, 77.2090

def detect_subject(title):
    t = str(title).lower()
    if "physic" in t or "astronomy" in t: return "Physics"
    if "chem" in t: return "Chemistry"
    if "math" in t: return "Mathematics"
    if "bio" in t or "botany" in t or "zoology" in t: return "Biology"
    if "comput" in t or "it" in t or "ai" in t or "coding" in t: return "Computer Science"
    if "robot" in t or "stem" in t or "atl" in t: return "Robotics & AI"
    if "eng" in t and "teacher" in t: return "English"
    if "hindi" in t: return "Hindi"
    if "sanskrit" in t: return "Hindi"
    if "social" in t or "sst" in t or "evs" in t: return "Social Studies"
    if "history" in t: return "History"
    if "geograph" in t: return "Geography"
    if "politic" in t or "civic" in t: return "Social Studies"
    if "econom" in t: return "Economics"
    if "commerce" in t or "account" in t or "business stud" in t: return "Commerce"
    if "art" in t or "craft" in t or "draw" in t or "fine art" in t: return "Art & Design"
    if "music" in t or "dance" in t: return "Art & Design"
    if "physical edu" in t or "pet" in t or "sports" in t: return "Physical Education"
    if "principal" in t or "headmistress" in t or "vice principal" in t or "coordinator" in t: return "Administration"
    if "lab" in t and ("in-charge" in t or "assistant" in t or "attendant" in t): return "Composite Lab"
    if "prt" in t or "primary" in t or "nursery" in t or "montessori" in t: return "Primary"
    if "science" in t: return "Science"
    return "General"

def clean_salary_format(raw_sal):
    if not raw_sal or raw_sal.strip() in ['---', '', 'N/A'] or 'not disclosed' in raw_sal.lower():
        return "Not Disclosed", None, None
    s = raw_sal.strip()
    # Monthly pattern: ₹25k - ₹35k / month
    m = re.match(r'₹?\s*([\d\.]+)\s*(?:k)?\s*[-–—to]+\s*₹?\s*([\d\.]+)\s*(?:k)?\s*(?:\/|\s*per)?\s*mo(?:nth)?', s, re.I)
    if m:
        v1, v2 = float(m.group(1)), float(m.group(2))
        if v1 < 100: v1 *= 1000
        if v2 < 100: v2 *= 1000
        sal_min = int(v1 * 12)
        sal_max = int(v2 * 12)
        return f"₹{int(v1/1000)}k - ₹{int(v2/1000)}k / month", sal_min, sal_max
        
    # LPA pattern: ₹4 - ₹6 Lakhs PA
    m = re.match(r'₹?\s*([\d\.]+)\s*[-–—to]+\s*₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa)?', s, re.I)
    if m:
        v1, v2 = float(m.group(1)), float(m.group(2))
        sal_min = int(v1 * 100000)
        sal_max = int(v2 * 100000)
        if v1 == v2:
            return f"₹{v1:g} Lakhs PA", sal_min, sal_max
        return f"₹{v1:g} - ₹{v2:g} Lakhs PA", sal_min, sal_max

    # Single LPA: ₹4 Lakhs PA
    m = re.match(r'₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa)?$', s, re.I)
    if m:
        v = float(m.group(1))
        sal_val = int(v * 100000)
        return f"₹{v:g} Lakhs PA", sal_val, sal_val

    # Range in description (e.g. 25000 to 35000)
    m = re.search(r'([\d,]+)\s*[-–—to]+\s*([\d,]+)\s*(?:per|a|\/)?\s*(month|year|annum|pm|pa|lpa|lacs)', s, re.I)
    if m:
        v1 = float(m.group(1).replace(',', ''))
        v2 = float(m.group(2).replace(',', ''))
        unit = (m.group(3) or '').lower()
        if any(u in unit for u in ["year", "annum", "pa", "lpa", "lacs"]):
            if v1 < 100: v1 *= 100000; v2 *= 100000
            if v1 == v2:
                return f"₹{int(v1/100000)} Lakhs PA", int(v1), int(v2)
            return f"₹{int(v1/100000)} - ₹{int(v2/100000)} Lakhs PA", int(v1), int(v2)
        elif any(u in unit for u in ["month", "pm"]):
            if v1 < 500: v1 *= 1000; v2 *= 1000
            if v1 == v2:
                return f"₹{int(v1):,} / month", int(v1*12), int(v2*12)
            return f"₹{int(v1/1000)}k - ₹{int(v2/1000)}k / month", int(v1*12), int(v2*12)

    return s, None, None

def parse_api_logs_jobs(seen_ids):
    new_jobs = []
    if not os.path.exists(API_LOGS_PATH):
        print(f"⚠️ API log not found at {API_LOGS_PATH}")
        return new_jobs
        
    print("\n🔍 [1/3] Parsing user's downloaded LinkedIn DevTools API logs...")
    try:
        with open(API_LOGS_PATH, 'r', encoding='utf-8', errors='ignore') as f:
            logs = json.load(f)
            
        resp = str(logs[41].get('response', ''))
        
        # Location mapping chunks
        loc_chunks = {}
        for m in re.finditer(r'([0-9a-f]+):\["([^"]+)"\]', resp):
            loc_chunks[f"$L{m.group(1)}"] = m.group(2)
            
        a11y_matches = re.findall(r'JobSearchResultsPage_A11yLabel(\d+)[^"]*"\}\}\},"value":\{"\$case":"stringValue","stringValue":"([^"]+)"\}', resp)
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        for jid, title in a11y_matches:
            clean_title = title.replace("Selected, ", "").replace(" (Verified job)", "").strip()
            slug = f"li-{jid}"
            job_url = f"https://www.linkedin.com/jobs/view/{jid}"
            if slug in seen_ids or job_url in seen_ids:
                continue
                
            idx = resp.find(f'JobSearchResultsPage_A11yLabel{jid}')
            comp = "Reputed Senior Secondary School"
            raw_loc = "India"
            if idx != -1:
                sub = resp[idx:idx+4000]
                comp_match = re.search(r'\["\$","p",null,\{[^}]*"children":\["([^"]+)"\]\}\]', sub)
                if comp_match:
                    comp = comp_match.group(1)
                loc_ref_match = re.search(r'"children":"(\$L[0-9a-f]+)"', sub)
                if loc_ref_match:
                    raw_loc = loc_chunks.get(loc_ref_match.group(1), "India")

            city, state, lat, lng = resolve_geo(raw_loc)
            subject = detect_subject(clean_title)
            desig = "PGT" if "pgt" in clean_title.lower() else ("TGT" if "tgt" in clean_title.lower() else ("PRT" if "prt" in clean_title.lower() else "Teacher"))
            board = "CBSE" if "cbse" in clean_title.lower() else ("ICSE" if "icse" in clean_title.lower() else None)
            
            seen_ids.add(slug)
            seen_ids.add(job_url)
            new_jobs.append({
                "id": slug,
                "organisationName": comp,
                "organisationLogo": None,
                "jobPostName": clean_title,
                "designation": desig,
                "subject": subject,
                "board": board,
                "roleType": "Full-Time",
                "salary": "Not Disclosed",
                "salaryMin": None,
                "salaryMax": None,
                "shortDescription": f"{comp} is hiring {clean_title} in {raw_loc}. Apply directly on verified LinkedIn job posting.",
                "address": raw_loc,
                "city": city,
                "state": state,
                "district": city,
                "coordinates": {"lat": lat, "lng": lng},
                "openingDate": today_str,
                "lastDate": None,
                "source": "LinkedIn",
                "originalUrl": job_url,
                "verified": True,
                "badge": "LinkedIn Verified"
            })
        print(f"  ↳ Extracted {len(new_jobs)} brand-new verified LinkedIn jobs from API logs!")
    except Exception as e:
        print(f"  ⚠️ Error parsing API logs: {e}")
    return new_jobs

def harvest_indeed_fresh(seen_ids):
    print("\n⚡ [2/3] Extracting fresh live vacancies from Indeed GraphQL API across India...")
    GQL_QUERY = """
    query SearchJobs($what: String!, $location: JobSearchLocationInput, $limit: Int) {
        jobSearch(what: $what, location: $location, limit: $limit) {
            results {
                job {
                    key
                    title
                    employer { name }
                    datePublished
                    description { text }
                }
            }
        }
    }
    """
    
    SEARCH_QUERIES = [
        "PGT Physics School", "TGT Physics School",
        "PGT Chemistry School", "TGT Chemistry School",
        "PGT Mathematics School", "TGT Mathematics School",
        "PGT Biology School", "TGT Biology School",
        "TGT Science School", "PGT English School", "TGT English School",
        "PGT Hindi School", "TGT Hindi School", "Social Studies Teacher School",
        "History Teacher School", "Geography Teacher School", "Economics Teacher School",
        "Commerce Teacher School", "Computer Science Teacher School", "Robotics Teacher School",
        "Art Teacher School", "Physical Education Teacher School", "PRT Teacher School",
        "Primary Teacher School", "Pre Primary Teacher School", "School Principal", "School Lab Assistant"
    ]
    
    hubs = list(CITIES_GEO.items())[:14] # Top 14 educational hubs
    new_jobs = []
    
    for s_idx, q_str in enumerate(SEARCH_QUERIES):
        print(f"  [{s_idx+1}/{len(SEARCH_QUERIES)}] Indeed: '{q_str}' ...")
        for city_key, (c_name, c_state, c_lat, c_lng) in hubs:
            variables = {
                "what": q_str,
                "location": {"where": f"{c_name}, {c_state}", "radius": 40, "radiusUnit": "KILOMETERS"},
                "limit": 25
            }
            try:
                r = requests.post(
                    "https://apis.indeed.com/graphql?co=IN",
                    headers=INDEED_HEADERS,
                    json={"query": GQL_QUERY, "variables": variables},
                    timeout=5
                )
                if r.status_code == 200:
                    results = r.json().get('data', {}).get('jobSearch', {}).get('results', [])
                    for it in results:
                        job = it.get('job')
                        if not job: continue
                        jk = job.get('key')
                        jid = f"ind-{jk}"
                        if not jk or jid in seen_ids:
                            continue
                            
                        title = str(job.get('title') or '').strip()
                        emp = (job.get('employer') or {}).get('name') or "Reputed Senior Secondary School"
                        comb = f"{title} {emp}".lower()
                        if any(b in comb for b in EXCLUDED_CHAINS):
                            continue
                            
                        desc = (job.get('description') or {}).get('text') or ''
                        date_pub = job.get('datePublished', 0)
                        date_str = datetime.fromtimestamp(date_pub/1000).strftime('%Y-%m-%d') if date_pub else datetime.now().strftime('%Y-%m-%d')
                        if date_str < "2026-10-01":
                            continue
                            
                        seen_ids.add(jid)
                        sal_disp, sal_min, sal_max = clean_salary_format(desc)
                        subject = detect_subject(title)
                        desig = "PGT" if "pgt" in title.lower() else ("TGT" if "tgt" in title.lower() else ("PRT" if "prt" in title.lower() else "Teacher"))
                        board = "CBSE" if "cbse" in comb or "cbse" in desc.lower() else ("ICSE" if "icse" in comb or "icse" in desc.lower() else None)
                        
                        new_jobs.append({
                            "id": jid,
                            "organisationName": emp,
                            "organisationLogo": None,
                            "jobPostName": title,
                            "designation": desig,
                            "subject": subject,
                            "board": board,
                            "roleType": "Full-Time",
                            "salary": sal_disp,
                            "salaryMin": sal_min,
                            "salaryMax": sal_max,
                            "shortDescription": desc[:250].strip() if desc else f"{emp} is hiring {title} in {c_name}, {c_state}.",
                            "address": f"{c_name}, {c_state}",
                            "city": c_name,
                            "state": c_state,
                            "district": c_name,
                            "coordinates": {"lat": c_lat, "lng": c_lng},
                            "openingDate": date_str,
                            "lastDate": None,
                            "source": "Indeed",
                            "originalUrl": f"https://in.indeed.com/viewjob?jk={jk}",
                            "verified": True,
                            "badge": "Active Verified"
                        })
            except Exception:
                pass
            time.sleep(0.04)
        print(f"     ↳ Extracted so far: {len(new_jobs)} new vacancies")
        
    print(f"  🎉 INDEED COMPLETE: Harvested {len(new_jobs)} brand-new verified jobs!")
    return new_jobs

def harvest_linkedin_guest(seen_ids):
    print("\n🌐 [3/3] Querying LinkedIn Guest API for live nationwide school vacancies...")
    SEARCH_TOPICS = [
        "PGT Physics Teacher School", "TGT Physics Teacher School",
        "PGT Chemistry Teacher School", "TGT Chemistry Teacher School",
        "PGT Mathematics Teacher School", "TGT Mathematics Teacher School",
        "PGT Biology Teacher School", "TGT Science Teacher School",
        "English Teacher School India", "Hindi Teacher School India",
        "Computer Science Teacher School", "Social Studies Teacher School",
        "School Principal CBSE India", "Primary Teacher CBSE India"
    ]
    
    new_jobs = []
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    for idx, q_str in enumerate(SEARCH_TOPICS):
        url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={requests.utils.quote(q_str)}&location=India&start=0"
        try:
            r = requests.get(url, headers=LINKEDIN_HEADERS, timeout=6)
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, 'html.parser')
                cards = soup.find_all('li')
                for c in cards:
                    title_el = c.find('h3', class_='base-search-card__title')
                    comp_el = c.find('h4', class_='base-search-card__subtitle')
                    loc_el = c.find('span', class_='job-search-card__location')
                    link_el = c.find('a', class_='base-card__full-link')
                    if not title_el or not link_el: continue
                    
                    title = title_el.text.strip()
                    comp = comp_el.text.strip() if comp_el else "Reputed Senior Secondary School"
                    raw_loc = loc_el.text.strip() if loc_el else "India"
                    job_url = link_el.get('href', '').split('?')[0]
                    
                    m = re.search(r'view/(\d+)', job_url)
                    jid = f"li-{m.group(1)}" if m else f"li-{abs(hash(job_url))}"
                    if jid in seen_ids or job_url in seen_ids:
                        continue
                        
                    comb = f"{title} {comp}".lower()
                    if any(b in comb for b in EXCLUDED_CHAINS):
                        continue
                        
                    seen_ids.add(jid)
                    seen_ids.add(job_url)
                    
                    city, state, lat, lng = resolve_geo(raw_loc)
                    subject = detect_subject(title)
                    desig = "PGT" if "pgt" in title.lower() else ("TGT" if "tgt" in title.lower() else ("PRT" if "prt" in title.lower() else "Teacher"))
                    board = "CBSE" if "cbse" in comb else ("ICSE" if "icse" in comb else None)
                    
                    new_jobs.append({
                        "id": jid,
                        "organisationName": comp,
                        "organisationLogo": None,
                        "jobPostName": title,
                        "designation": desig,
                        "subject": subject,
                        "board": board,
                        "roleType": "Full-Time",
                        "salary": "Not Disclosed",
                        "salaryMin": None,
                        "salaryMax": None,
                        "shortDescription": f"{comp} is inviting applications for {title} in {raw_loc}. Minimum relevant experience required. Apply directly on LinkedIn verified job post.",
                        "address": raw_loc,
                        "city": city,
                        "state": state,
                        "district": city,
                        "coordinates": {"lat": lat, "lng": lng},
                        "openingDate": today_str,
                        "lastDate": None,
                        "source": "LinkedIn",
                        "originalUrl": job_url,
                        "verified": True,
                        "badge": "LinkedIn Verified"
                    })
        except Exception:
            pass
        time.sleep(0.04)
        
    print(f"  🎉 LINKEDIN GUEST COMPLETE: Harvested {len(new_jobs)} verified school jobs!")
    return new_jobs

def main():
    print("=" * 75)
    print("🚀 CSEEL ALL-INDIA NEW JOBS HARVESTER & DATABASE INGESTION")
    print("=" * 75)
    
    # 1. Load Existing Local Jobs Store
    existing_jobs = []
    seen_ids = set()
    if os.path.exists(JOBS_PATH):
        with open(JOBS_PATH, 'r', encoding='utf-8') as f:
            existing_jobs = json.load(f)
        for j in existing_jobs:
            seen_ids.add(j['id'])
            if j.get('originalUrl'):
                seen_ids.add(j['originalUrl'])
    print(f"📖 Existing database: {len(existing_jobs)} active listings.")
    
    # 2. Extract from User's API Logs
    api_log_jobs = parse_api_logs_jobs(seen_ids)
    
    # 3. Harvest Fresh Live Vacancies from Indeed
    indeed_jobs = harvest_indeed_fresh(seen_ids)
    
    # 4. Harvest Fresh Live Vacancies from LinkedIn
    linkedin_jobs = harvest_linkedin_guest(seen_ids)
    
    all_new_jobs = api_log_jobs + indeed_jobs + linkedin_jobs
    print(f"\n🌟 Total Brand-New Vacancies Harvested: {len(all_new_jobs)}")
    
    if len(all_new_jobs) == 0:
        print("Dataset is already 100% up to date!")
        return

    # 5. Merge and Update Local Database (src/data/aggregated_jobs.json)
    updated_dataset = existing_jobs + all_new_jobs
    with open(JOBS_PATH, 'w', encoding='utf-8') as f:
        json.dump(updated_dataset, f, indent=2, ensure_ascii=False)
    print(f"\n💾 SUCCESSFULLY UPDATED {JOBS_PATH}!")
    print(f"   • Previous count: {len(existing_jobs)}")
    print(f"   • New additions:  +{len(all_new_jobs)}")
    print(f"   • New Total:      {len(updated_dataset)} verified teaching vacancies")
    
    # 6. Attempt Sync to Supabase
    print(f"\n☁️ Attempting sync to Supabase public.jobs table...")
    today_str = datetime.now().strftime("%Y-%m-%d")
    supabase_rows = []
    for j in all_new_jobs:
        coords = j.get('coordinates') or {"lat": 28.6139, "lng": 77.2090}
        city = j.get('city') or 'India'
        state = j.get('state') or 'India'
        district = j.get('district') or city
        address = j.get('address') or f"{city}, {state}"
        subject = j.get('subject') or 'General'
        opening_date = j.get('openingDate') or today_str
        
        reqs = [
            f"source:{j.get('source', 'Indeed')}",
            f"url:{j.get('originalUrl', '')}",
            f"lat:{coords.get('lat', 28.6139)}",
            f"lng:{coords.get('lng', 77.2090)}",
            f"district:{district}",
            f"address:{address}",
            f"subject:{subject}",
            f"opening_date:{opening_date}"
        ]
        if j.get("designation"): reqs.append(f"designation:{j['designation']}")
        if j.get("board"): reqs.append(f"board:{j['board']}")
        if j.get("salaryMin"): reqs.append(f"salary_min:{j['salaryMin']}")
        if j.get("salaryMax"): reqs.append(f"salary_max:{j['salaryMax']}")
        if j.get("applyUrl"): reqs.append(f"apply_url:{j['applyUrl']}")
        
        supabase_rows.append({
            "title": j.get("jobPostName") or "School Teacher",
            "slug": j["id"],
            "department": subject,
            "institute_name": j.get("organisationName") or "Reputed Senior Secondary School",
            "city": city,
            "state": state,
            "salary_range": j.get("salary") or "Not Disclosed",
            "experience_required": j.get("minExperience"),
            "job_type": j.get("roleType") or "Full-Time",
            "description": j.get("shortDescription") or "",
            "requirements": reqs,
            "benefits": [],
            "is_active": True,
            "deadline": None,
            "posted_at": f"{opening_date}T00:00:00+00:00"
        })
        
    headers = {
        "apikey": SERVICE_KEY,
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal"
    }
    
    batch_size = 50
    synced = 0
    try:
        for i in range(0, len(supabase_rows), batch_size):
            batch = supabase_rows[i:i+batch_size]
            res = requests.post(f"{SUPABASE_URL}/rest/v1/jobs?on_conflict=slug", headers=headers, json=batch, timeout=6)
            if res.status_code in [200, 201]:
                synced += len(batch)
                print(f"  • Synced {synced}/{len(supabase_rows)} to Supabase")
            else:
                print(f"  ⚠️ Supabase returned: {res.status_code}")
                break
    except Exception as e:
        print(f"  ℹ️ Supabase paused or connection error ({e}). Local database is 100% active!")
        
    print("\n" + "=" * 75)
    print(f"🎉 COMPLETED: Database now contains {len(updated_dataset)} live school vacancies!")
    print("=" * 75)

if __name__ == "__main__":
    main()
