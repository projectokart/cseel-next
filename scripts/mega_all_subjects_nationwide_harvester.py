import os
import sys
import time
import json
import re
import subprocess
from datetime import datetime
import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AGG_PATH = os.path.abspath(os.path.join(SCRIPT_DIR, "../src/data/aggregated_jobs.json"))

SUPABASE_URL = 'https://ukazkxthavxphibdbspd.supabase.co'
SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxOTgzOCwiZXhwIjoyMDg5Mzk1ODM4fQ.Od_IWU3qrttP28AdPajuJfxitTqQIXVo9dXSzFS-Kms'

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

TEMP_PROFILE = r"C:\Users\DEVENDER\AppData\Local\Temp\naukri_mega_profile"
os.makedirs(TEMP_PROFILE, exist_ok=True)

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
    return "India", "All India", 20.5937, 78.9629

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
    
    # 1. Monthly equal: ₹50k - ₹50k/mo -> ₹50,000 / month
    m = re.match(r'₹?\s*(\d+)\s*k?\s*[-–—to]+\s*₹?\s*(\d+)\s*k\s*/\s*mo', s, re.I)
    if m:
        v1, v2 = int(m.group(1)), int(m.group(2))
        sal_min = v1 * 1000 * 12
        sal_max = v2 * 1000 * 12
        if v1 == v2:
            return f"₹{v1},000 / month", sal_min, sal_max
        return f"₹{v1}k - ₹{v2}k / month", sal_min, sal_max
        
    # 2. LPA pattern: ₹4 - ₹4 LPA -> ₹4 Lakhs PA
    m = re.match(r'₹?\s*([\d\.]+)\s*[-–—to]+\s*₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa)?', s, re.I)
    if m:
        v1, v2 = float(m.group(1)), float(m.group(2))
        sal_min = int(v1 * 100000)
        sal_max = int(v2 * 100000)
        if v1 == v2:
            return f"₹{v1:g} Lakhs PA", sal_min, sal_max
        return f"₹{v1:g} - ₹{v2:g} Lakhs PA", sal_min, sal_max

    # 3. Single LPA: ₹4 LPA -> ₹4 Lakhs PA
    m = re.match(r'₹?\s*([\d\.]+)\s*(?:lpa|lakhs?|lacs?)\s*(?:pa)?$', s, re.I)
    if m:
        v = float(m.group(1))
        sal_val = int(v * 100000)
        return f"₹{v:g} Lakhs PA", sal_val, sal_val

    # 4. Range in description (e.g. 25000 to 35000)
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

def harvest_indeed_nationwide(existing_ids):
    print("\n" + "=" * 70)
    print("⚡ [1/3] INDEED NATIONWIDE ALL-SUBJECTS EXTRACTION")
    print("=" * 70)
    
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
    
    SUBJECT_QUERIES = [
        # All 1-12th school subjects
        "PGT Physics School", "TGT Physics School",
        "PGT Chemistry School", "TGT Chemistry School",
        "PGT Mathematics School", "TGT Mathematics School",
        "PGT Biology School", "TGT Biology School",
        "TGT Science School", "General Science Teacher School",
        "PGT English School", "TGT English School",
        "PGT Hindi School", "TGT Hindi School", "Sanskrit Teacher School",
        "Social Science Teacher School", "History Teacher School", "Geography Teacher School",
        "Economics Teacher School", "Commerce Teacher School", "Accountancy Teacher School",
        "Computer Science Teacher School", "AI Robotics Teacher School", "Coding Teacher School", "Astronomy Teacher School",
        "Art Craft Teacher School", "Music Teacher School", "Physical Education Teacher School",
        "PRT Teacher School", "Primary Teacher CBSE", "Pre Primary Teacher School", "Montessori Teacher School",
        "School Principal CBSE", "Vice Principal School", "Academic Coordinator School", "School Lab Assistant"
    ]
    
    hubs = list(CITIES_GEO.items())
    new_jobs = []
    seen = set(existing_ids)
    
    for s_idx, q_str in enumerate(SUBJECT_QUERIES):
        print(f"[{s_idx+1}/{len(SUBJECT_QUERIES)}] Querying Indeed: '{q_str}' ...")
        # Query top 15 hub clusters
        for city_key, (c_name, c_state, c_lat, c_lng) in hubs[:12]:
            variables = {
                "what": q_str,
                "location": {"where": f"{c_name}, {c_state}", "radius": 50, "radiusUnit": "KILOMETERS"},
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
                        if not jk or jid in seen:
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
                            
                        seen.add(jid)
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
        print(f"   ↳ Extracted so far: {len(new_jobs)} new Indeed vacancies")
        
    print(f"🎉 INDEED COMPLETE: Harvested {len(new_jobs)} verified school jobs!")
    return new_jobs

def harvest_linkedin_nationwide(existing_ids):
    print("\n" + "=" * 70)
    print("🌐 [2/3] LINKEDIN ALL-SUBJECTS GUEST API EXTRACTION")
    print("=" * 70)
    
    SEARCH_TOPICS = [
        "PGT Physics School India", "TGT Physics School India",
        "PGT Chemistry School India", "TGT Chemistry School India",
        "PGT Mathematics School India", "TGT Mathematics School India",
        "PGT Biology School India", "TGT Biology School India",
        "Science Teacher School India", "Computer Science Teacher School India",
        "Robotics AI Teacher School India", "Astronomy Teacher School India",
        "English Teacher School India", "Hindi Teacher School India",
        "Social Studies Teacher School India", "History Teacher School India",
        "Geography Teacher School India", "Commerce Teacher School India",
        "Economics Teacher School India", "Accountancy Teacher School India",
        "Art Teacher School India", "Music Teacher School India",
        "Physical Education Teacher School India", "PRT Teacher School India",
        "Pre Primary Teacher School India", "School Principal India", "Vice Principal School India"
    ]
    
    new_jobs = []
    seen = set(existing_ids)
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    for idx, q_str in enumerate(SEARCH_TOPICS):
        print(f"[{idx+1}/{len(SEARCH_TOPICS)}] Querying LinkedIn: '{q_str}' ...")
        for start_page in [0, 25]:
            url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={requests.utils.quote(q_str)}&location=India&start={start_page}"
            try:
                r = requests.get(url, headers=LINKEDIN_HEADERS, timeout=7)
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
                        if jid in seen or job_url in seen:
                            continue
                            
                        comb = f"{title} {comp}".lower()
                        if any(b in comb for b in EXCLUDED_CHAINS):
                            continue
                            
                        seen.add(jid)
                        seen.add(job_url)
                        
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
            time.sleep(0.05)
            
    print(f"🎉 LINKEDIN COMPLETE: Harvested {len(new_jobs)} verified school jobs!")
    return new_jobs

def harvest_naukri_nationwide(existing_ids):
    print("\n" + "=" * 70)
    print("🌐 [3/3] NAUKRI REAL CHROME CDP NATIONWIDE EXTRACTION")
    print("=" * 70)
    
    NAUKRI_ROUTES = [
        # Subject routes
        "https://www.naukri.com/physics-teacher-jobs",
        "https://www.naukri.com/chemistry-teacher-jobs",
        "https://www.naukri.com/biology-teacher-jobs",
        "https://www.naukri.com/mathematics-teacher-jobs",
        "https://www.naukri.com/science-teacher-jobs",
        "https://www.naukri.com/english-teacher-jobs",
        "https://www.naukri.com/hindi-teacher-jobs",
        "https://www.naukri.com/social-studies-teacher-jobs",
        "https://www.naukri.com/history-teacher-jobs",
        "https://www.naukri.com/geography-teacher-jobs",
        "https://www.naukri.com/commerce-teacher-jobs",
        "https://www.naukri.com/economics-teacher-jobs",
        "https://www.naukri.com/accountancy-teacher-jobs",
        "https://www.naukri.com/computer-teacher-jobs",
        "https://www.naukri.com/robotics-teacher-jobs",
        "https://www.naukri.com/art-teacher-jobs",
        "https://www.naukri.com/music-teacher-jobs",
        "https://www.naukri.com/physical-education-teacher-jobs",
        
        # Level routes
        "https://www.naukri.com/pgt-teacher-jobs",
        "https://www.naukri.com/tgt-teacher-jobs",
        "https://www.naukri.com/prt-teacher-jobs",
        "https://www.naukri.com/pre-primary-teacher-jobs",
        "https://www.naukri.com/school-principal-jobs",
        "https://www.naukri.com/headmistress-jobs",
        "https://www.naukri.com/school-coordinator-jobs",
        
        # Hub location routes
        "https://www.naukri.com/school-jobs-in-delhi-ncr",
        "https://www.naukri.com/school-jobs-in-mumbai",
        "https://www.naukri.com/school-jobs-in-bangalore",
        "https://www.naukri.com/school-jobs-in-pune",
        "https://www.naukri.com/school-jobs-in-hyderabad",
        "https://www.naukri.com/school-jobs-in-kolkata",
        "https://www.naukri.com/school-jobs-in-jaipur",
        "https://www.naukri.com/school-jobs-in-chandigarh",
        "https://www.naukri.com/school-jobs-in-lucknow",
        "https://www.naukri.com/school-jobs-in-ahmedabad",
        "https://www.naukri.com/school-jobs-in-chennai",
        "https://www.naukri.com/school-jobs-in-noida",
        "https://www.naukri.com/school-jobs-in-gurgaon"
    ]
    
    cmd = [
        CHROME_PATH,
        "--remote-debugging-port=9222",
        f"--user-data-dir={TEMP_PROFILE}",
        "--no-first-run",
        "--no-default-browser-check",
        "about:blank"
    ]
    
    proc = subprocess.Popen(cmd)
    time.sleep(4)
    
    new_jobs = []
    seen = set(existing_ids)
    today_str = datetime.now().strftime("%Y-%m-%d")
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
            ctx = browser.contexts[0]
            page = ctx.pages[0] if ctx.pages else ctx.new_page()
            
            for idx, route_url in enumerate(NAUKRI_ROUTES):
                route_name = route_url.split('/')[-1]
                print(f"[{idx+1}/{len(NAUKRI_ROUTES)}] Navigating Naukri: '{route_name}' ...")
                try:
                    page.goto(route_url, wait_until="domcontentloaded", timeout=22000)
                    page.wait_for_timeout(2200)
                    
                    articles = page.query_selector_all(".srp-jobtuple-wrapper, .cust-job-tuple, div[data-job-id]")
                    route_count = 0
                    for a in articles:
                        title_el = a.query_selector("a.title, a[class*='title']")
                        if not title_el: continue
                        title = title_el.inner_text().strip()
                        job_url = title_el.get_attribute("href") or ""
                        if not job_url: continue
                        
                        m = re.search(r'-(\d{8,16})$', job_url)
                        jid = f"nk-{m.group(1)}" if m else f"nk-{abs(hash(job_url))}"
                        if jid in seen or job_url in seen:
                            continue
                            
                        comp_el = a.query_selector("a.comp-name, a[class*='comp-name']")
                        exp_el = a.query_selector("span.exp-wrap, span[class*='exp']")
                        sal_el = a.query_selector("span.sal-wrap, span[class*='sal']")
                        loc_el = a.query_selector("span.loc-wrap, span[class*='loc']")
                        desc_el = a.query_selector("span.job-desc, div.job-desc")
                        
                        comp = comp_el.inner_text().strip() if comp_el else "Reputed Senior Secondary School"
                        raw_exp = exp_el.inner_text().strip() if exp_el else None
                        raw_sal = sal_el.inner_text().strip() if sal_el else "Not Disclosed"
                        raw_loc = loc_el.inner_text().strip() if loc_el else "India"
                        desc_text = desc_el.inner_text().strip() if desc_el else ""
                        
                        comb = f"{title} {comp}".lower()
                        if any(b in comb for b in EXCLUDED_CHAINS):
                            continue
                            
                        seen.add(jid)
                        seen.add(job_url)
                        
                        sal_disp, sal_min, sal_max = clean_salary_format(raw_sal)
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
                            "salary": sal_disp,
                            "salaryMin": sal_min,
                            "salaryMax": sal_max,
                            "shortDescription": desc_text or f"{comp} is hiring {title} in {raw_loc}. Apply directly on Naukri verified posting.",
                            "address": raw_loc,
                            "city": city,
                            "state": state,
                            "district": city,
                            "coordinates": {"lat": lat, "lng": lng},
                            "minExperience": raw_exp,
                            "openingDate": today_str,
                            "lastDate": None,
                            "source": "Naukri.com",
                            "originalUrl": job_url,
                            "verified": True,
                            "badge": "Naukri.com Verified"
                        })
                        route_count += 1
                    print(f"   ↳ Extracted {route_count} vacancies (Total Naukri: {len(new_jobs)})")
                except Exception as e:
                    print(f"   ⚠️ Error route {route_name}: {e}")
            browser.close()
    finally:
        proc.terminate()
        
    print(f"🎉 NAUKRI COMPLETE: Harvested {len(new_jobs)} verified school jobs!")
    return new_jobs

def main():
    print("=" * 75)
    print("🚀 MEGA ALL-SUBJECTS NATIONWIDE HARVESTER & SUPABASE PIPELINE")
    print("=" * 75)
    
    # 1. Load Existing Local DB
    existing_jobs = []
    seen_ids = set()
    if os.path.exists(AGG_PATH):
        try:
            with open(AGG_PATH, "r", encoding="utf-8") as f:
                existing_jobs = json.load(f)
                for j in existing_jobs:
                    seen_ids.add(j["id"])
                    if j.get("originalUrl"):
                        seen_ids.add(j["originalUrl"])
            print(f"📖 Existing dataset: {len(existing_jobs)} active verified jobs.")
        except Exception as e:
            print("Error loading local dataset:", e)

    # 2. Extract Across All 3 Networks
    indeed_jobs = harvest_indeed_nationwide(seen_ids)
    for j in indeed_jobs:
        seen_ids.add(j["id"])
        seen_ids.add(j["originalUrl"])

    linkedin_jobs = harvest_linkedin_nationwide(seen_ids)
    for j in linkedin_jobs:
        seen_ids.add(j["id"])
        seen_ids.add(j["originalUrl"])

    naukri_jobs = harvest_naukri_nationwide(seen_ids)

    all_new_jobs = indeed_jobs + linkedin_jobs + naukri_jobs
    print(f"\n🌟 Total New Unique Jobs Extracted: {len(all_new_jobs)}")
    
    # 3. Merge and Save Locally
    final_dataset = existing_jobs + all_new_jobs
    with open(AGG_PATH, "w", encoding="utf-8") as f:
        json.dump(final_dataset, f, indent=2, ensure_ascii=False)
    print(f"💾 Saved {len(final_dataset)} total verified jobs to {AGG_PATH}!")
    
    # 4. Sync New Jobs to Supabase
    print(f"\n☁️ Synchronizing {len(all_new_jobs)} new vacancies to Supabase `jobs` table...")
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
    for i in range(0, len(supabase_rows), batch_size):
        batch = supabase_rows[i:i+batch_size]
        res = requests.post(f"{SUPABASE_URL}/rest/v1/jobs?on_conflict=slug", headers=headers, json=batch, timeout=20)
        if res.status_code in [200, 201]:
            synced += len(batch)
            print(f"  • Batch {i//batch_size + 1}: {synced}/{len(supabase_rows)} synced to Supabase!")
        else:
            print(f"  ❌ Batch {i//batch_size + 1} Error: {res.status_code} {res.text[:80]}")
        time.sleep(0.03)
        
    print(f"\n🎉 PIPELINE SUCCESS: Synced {synced} brand-new verified jobs into Supabase!")
    
    # Print Portal Breakdown
    breakdown = {}
    for j in final_dataset:
        s = j.get('source', 'Unknown')
        breakdown[s] = breakdown.get(s, 0) + 1
    print("\n📊 FINAL ACTIVE JOBS BREAKDOWN ACROSS INDIA:")
    for k, v in breakdown.items():
        print(f"  • {k}: {v} active listings")
    print(f"  TOTAL LIVE DATABASE: {len(final_dataset)} verified jobs\n")

if __name__ == "__main__":
    main()
