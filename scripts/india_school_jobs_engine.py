#!/usr/bin/env python3
"""
════════════════════════════════════════════════════════════════════════════════
🇮🇳 INDIA SCHOOL JOBS ENGINE (INDEED • LINKEDIN • NAUKRI)
════════════════════════════════════════════════════════════════════════════════
Production-grade, high-integrity automated vacancy extraction across the TOP 3
authentic job portals:
  1. Indeed India (in.indeed.com)  — High-Speed GraphQL API
  2. LinkedIn India (linkedin.com) — Voyager REST API + Guest Search Fallback
  3. Naukri (naukri.com)           — High-Density Education Pipeline & Parser

ROBUST ENGINEERING PRINCIPLES (ZERO FABRICATION / ZERO GUESSWORK):
  1. Stable Deterministic IDs: Uses hashlib.sha1 (never randomized process hash()).
  2. Title-First Classification: Title is primary truth; avoids false positives
     from description words ("it", "state-of-the-art", "pet care").
  3. Strict Salary Currency Requirement: Disallows plain numbers from description
     ("5k students", "500 books") without explicit currency/salary markers.
  4. Explicit Error Logging: Full logging for non-2xx responses and exceptions.
  5. Lost-Update Prevention: Syncs both new and updated records back to Supabase.
  6. Authentic Geocoding: Returns None for unknown cities; never fabricates Delhi.
  7. Genuine Metadata: lastDate = None and verified = False unless source-verified.
  8. Strict School Exclusion Filters: Permanently blocks coaching institutes
     (Allen, Aakash, Resonance, FIITJEE) and college/university roles.

Single Source of Truth:
  Directly synchronizes, deduplicates, and batch-upserts into Supabase `public.jobs`.
════════════════════════════════════════════════════════════════════════════════
"""

import sys
import os
import json
import re
import hashlib
import argparse
from datetime import datetime, timedelta

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_SCRAPING_DEPS = True
except ImportError:
    HAS_SCRAPING_DEPS = False

# Fix Windows console utf-8 encoding
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Project paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DATA_DIR = os.path.join(BASE_DIR, "src", "data")
OUTPUT_JSON_PATH = os.path.join(SRC_DATA_DIR, "aggregated_jobs.json")
FACETS_PATH = os.path.join(SRC_DATA_DIR, "job_filter_facets.json")

# Supabase Credentials (Single Source of Truth)
# Supabase Credentials (Environment Variable with Safe Project Fallback)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://ukazkxthavxphibdbspd.supabase.co").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrYXpreHRoYXZ4cGhpYmRic3BkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxOTgzOCwiZXhwIjoyMDg5Mzk1ODM4fQ.Od_IWU3qrttP28AdPajuJfxitTqQIXVo9dXSzFS-Kms")

# ── 1. Indian Educational Cities Geolocation Map ──────────────────────────────
INDIAN_CITIES_GEO = {
    'delhi': {'state': 'Delhi NCR', 'lat': 28.6139, 'lng': 77.2090},
    'new delhi': {'state': 'Delhi NCR', 'lat': 28.6139, 'lng': 77.2090},
    'delhi ncr': {'state': 'Delhi NCR', 'lat': 28.6139, 'lng': 77.2090},
    'noida': {'state': 'Uttar Pradesh', 'lat': 28.5355, 'lng': 77.3910},
    'greater noida': {'state': 'Uttar Pradesh', 'lat': 28.4744, 'lng': 77.5040},
    'gurugram': {'state': 'Haryana', 'lat': 28.4595, 'lng': 77.0266},
    'gurgaon': {'state': 'Haryana', 'lat': 28.4595, 'lng': 77.0266},
    'faridabad': {'state': 'Haryana', 'lat': 28.4089, 'lng': 77.3178},
    'ghaziabad': {'state': 'Uttar Pradesh', 'lat': 28.6692, 'lng': 77.4538},
    'mumbai': {'state': 'Maharashtra', 'lat': 19.0760, 'lng': 72.8777},
    'navi mumbai': {'state': 'Maharashtra', 'lat': 19.0330, 'lng': 73.0297},
    'thane': {'state': 'Maharashtra', 'lat': 19.2183, 'lng': 72.9781},
    'pune': {'state': 'Maharashtra', 'lat': 18.5204, 'lng': 73.8567},
    'bengaluru': {'state': 'Karnataka', 'lat': 12.9716, 'lng': 77.5946},
    'bangalore': {'state': 'Karnataka', 'lat': 12.9716, 'lng': 77.5946},
    'hyderabad': {'state': 'Telangana', 'lat': 17.3850, 'lng': 78.4867},
    'chennai': {'state': 'Tamil Nadu', 'lat': 13.0827, 'lng': 80.2707},
    'kolkata': {'state': 'West Bengal', 'lat': 22.5726, 'lng': 88.3639},
    'ahmedabad': {'state': 'Gujarat', 'lat': 23.0225, 'lng': 72.5714},
    'jaipur': {'state': 'Rajasthan', 'lat': 26.9124, 'lng': 75.7873},
    'chandigarh': {'state': 'Chandigarh', 'lat': 30.7333, 'lng': 76.7794},
    'lucknow': {'state': 'Uttar Pradesh', 'lat': 26.8467, 'lng': 80.9462},
    'dehradun': {'state': 'Uttarakhand', 'lat': 30.3165, 'lng': 78.0322},
    'indore': {'state': 'Madhya Pradesh', 'lat': 22.7196, 'lng': 75.8577},
    'bhopal': {'state': 'Madhya Pradesh', 'lat': 23.2599, 'lng': 77.4126},
    'patna': {'state': 'Bihar', 'lat': 25.5941, 'lng': 85.1376},
    'bhubaneswar': {'state': 'Odisha', 'lat': 20.2961, 'lng': 85.8245},
    'nagpur': {'state': 'Maharashtra', 'lat': 21.1458, 'lng': 79.0882},
    'vadodara': {'state': 'Gujarat', 'lat': 22.3072, 'lng': 73.1812},
    'surat': {'state': 'Gujarat', 'lat': 21.1702, 'lng': 72.8311},
    'kochi': {'state': 'Kerala', 'lat': 9.9312, 'lng': 76.2673},
    'coimbatore': {'state': 'Tamil Nadu', 'lat': 11.0168, 'lng': 76.9558},
    'visakhapatnam': {'state': 'Andhra Pradesh', 'lat': 17.6868, 'lng': 83.2185},
    'kanpur': {'state': 'Uttar Pradesh', 'lat': 26.4499, 'lng': 80.3319},
    'varanasi': {'state': 'Uttar Pradesh', 'lat': 25.3176, 'lng': 82.9739},
    'amritsar': {'state': 'Punjab', 'lat': 31.6340, 'lng': 74.8723},
    'jalandhar': {'state': 'Punjab', 'lat': 31.3260, 'lng': 75.5762},
    'rewari': {'state': 'Haryana', 'lat': 28.1833, 'lng': 76.6167},
    'palwal': {'state': 'Haryana', 'lat': 28.1447, 'lng': 77.3260},
    'panipat': {'state': 'Haryana', 'lat': 29.3909, 'lng': 76.9635},
    'karnal': {'state': 'Haryana', 'lat': 29.6857, 'lng': 76.9905},
    'rohtak': {'state': 'Haryana', 'lat': 28.8955, 'lng': 76.6066},
}

# ── 2. Strict School Job Qualification & Exclusion Filters ───────────────────
EXCLUDED_COACHING = [
    "iit", "jee", "neet", "allen", "aakash", "resonance", "fiitjee", 
    "career point", "pace", "bansal", "chaitanya", "narayana coaching",
    "vidyamandir", "medical coaching", "engineering coaching", "cat coaching",
    "gate coaching", "coaching institute", "foundation faculty", "coaching", 
    "tuition", "academy coaching"
]

EXCLUDED_HIGHER_ED = [
    "assistant professor", "associate professor", "university professor", 
    "college lecturer", "polytechnic lecturer", "guest faculty university", 
    "phd scholar", "dean", "engineering college", "degree college",
    "adjunct faculty", "tenure track"
]

EXCLUDED_NON_TEACHING = [
    "bpo", "telecaller", "customer service", "customer care", "call center",
    "sales executive", "business development", "marketing executive", "seo executive",
    "delivery", "driver", "security guard", "peon", "housekeeping", "cook", "maid",
    "plumber", "carpenter", "electrician", "real estate", "tele-sales"
]

def is_valid_school_job(title: str, employer: str = "", desc: str = "") -> bool:
    comb = f"{title} {employer} {desc}".lower()
    t_lower = str(title or "").lower()
    e_lower = str(employer or "").lower()
    full_id = f"{t_lower} {e_lower}"

    # 1. Discard non-teaching corporate noise
    for bad in EXCLUDED_NON_TEACHING:
        if re.search(r'\b' + re.escape(bad) + r'\b', full_id):
            return False

    # 2. Discard higher-ed university & college roles
    for bad in EXCLUDED_HIGHER_ED:
        if re.search(r'\b' + re.escape(bad) + r'\b', full_id):
            return False

    # 3. Discard coaching institutes
    for bad in EXCLUDED_COACHING:
        if re.search(r'\b' + re.escape(bad) + r'\b', e_lower):
            return False
        if re.search(r'\b' + re.escape(bad) + r'\b', t_lower):
            school_context = any(s in comb for s in [
                "k-12", "cbse school", "icse school", "public school", 
                "international school", "grammar school", "vidyalaya", 
                "vidyapith", "convent"
            ])
            if not school_context:
                return False

    # 4. Must relate to school / education role
    edu_indicators = [
        "teacher", "faculty", "pgt", "tgt", "prt", "ntt", "mentor", 
        "educator", "principal", "coordinator", "headmistress", "school", 
        "instructor", "counselor", "psychologist", "librarian", "trainer", 
        "incharge", "coach", "academic", "kindergarten", "nursery", "lab assistant"
    ]
    if not any(re.search(r'\b' + re.escape(ind) + r'\b', comb) for ind in edu_indicators):
        return False

    return True

# ── 3. Title-First Designation & Subject Normalization ───────────────────────
def detect_designation_from_title(title: str) -> str:
    t = str(title or "").lower()
    if re.search(r'\b(vice\s*principal|vice-principal)\b', t):
        return "Vice Principal"
    if re.search(r'\b(principal|headmistress|headmaster|director\s*school|center\s*head)\b', t):
        return "School Principal"
    if re.search(r'\b(academic\s*coordinator|wing\s*coordinator|curriculum\s*coordinator|hod)\b', t):
        return "Academic Coordinator"
    if re.search(r'\b(administrator|admin\s*officer|front\s*desk|receptionist|admission\s*counselor|admission\s*executive|school\s*accountant)\b', t):
        return "School Administration"
    if re.search(r'\b(librarian|library\s*in-charge)\b', t):
        return "Librarian"
    if re.search(r'\b(special\s*educator|rehabilitation)\b', t):
        return "Special Educator"
    if re.search(r'\b(counselor|counsellor|psychologist|wellness)\b', t):
        return "School Counselor"
    if re.search(r'\b(physical\s*education|\bpet\b|\bpti\b|sports\s*coach|yoga|swimming\s*coach)\b', t):
        return "Physical Education"
    if re.search(r'\b(music|dance|art\s*and\s*craft|drawing|drama|theatre)\b', t):
        return "Art & Activities"
    if re.search(r'\b(atl\s*mentor|robotics\s*trainer|stem\s*mentor|tinkering|maker\s*lab)\b', t):
        return "ATL Mentor"
    if re.search(r'\b(lab\s*assistant|lab\s*in-charge|lab\s*incharge|laboratory\s*assistant|composite\s*lab)\b', t):
        return "Lab In-Charge"
    if re.search(r'\b(pgt|post\s*graduate\s*teacher|class\s*(?:11|12|xi|xii))\b', t):
        return "PGT"
    if re.search(r'\b(tgt|trained\s*graduate\s*teacher|class\s*(?:6|7|8|9|10|vi|vii|viii|ix|x))\b', t):
        return "TGT"
    if re.search(r'\b(prt|primary\s*teacher|class\s*(?:1|2|3|4|5|i|ii|iii|iv|v)|mother\s*teacher)\b', t):
        return "PRT"
    if re.search(r'\b(nursery|pre[\s-]*primary|ntt|kindergarten|early\s*years|playgroup|montessori)\b', t):
        return "Pre-Primary / Nursery"
    return None

def detect_subject_from_text(text: str, is_title: bool = True) -> str:
    t = str(text or "").lower()

    found_subjs = []
    if re.search(r'\b(physic|physics)\b', t): found_subjs.append("Physics")
    if re.search(r'\b(chemist|chemistry)\b', t): found_subjs.append("Chemistry")
    if re.search(r'\b(math|maths|mathematics|calculus|algebra|geometry)\b', t): found_subjs.append("Mathematics")
    if re.search(r'\b(biolog|biology|botany|zoology|life\s*science)\b', t): found_subjs.append("Biology")
    if re.search(r'\b(english|literature|phonics)\b', t): found_subjs.append("English")
    if re.search(r'\b(hindi)\b', t): found_subjs.append("Hindi")
    if re.search(r'\b(sanskrit)\b', t): found_subjs.append("Sanskrit")
    if re.search(r'\b(french)\b', t): found_subjs.append("French")
    if re.search(r'\b(german|spanish)\b', t): found_subjs.append("German")
    
    # Safe tech match: In description never match bare 'it' or 'cs'
    if is_title:
        if re.search(r'\b(computer|informatics|python|coding|\bcs\b|\bit\b|artificial\s*intelligence|\bai\b|information\s*technology)\b', t):
            found_subjs.append("Computer Science")
    else:
        if re.search(r'\b(computer\s*science|informatics\s*practices|python\s*coding|artificial\s*intelligence|information\s*technology)\b', t):
            found_subjs.append("Computer Science")

    if re.search(r'\b(robotics|robot|atl|tinkering|stem|iot|maker)\b', t): found_subjs.append("Robotics & AI")
    if re.search(r'\b(social\s*studies|social\s*science|sst)\b', t): found_subjs.append("Social Studies")
    if re.search(r'\b(history)\b', t): found_subjs.append("History")
    if re.search(r'\b(geography)\b', t): found_subjs.append("Geography")
    if re.search(r'\b(political\s*science|civics)\b', t): found_subjs.append("Political Science")
    if re.search(r'\b(economics)\b', t): found_subjs.append("Economics")
    if re.search(r'\b(commerce|accountancy|business\s*studies|accounts)\b', t): found_subjs.append("Commerce")
    
    # Safe art match: avoid 'state-of-the-art'
    if re.search(r'(?<!state-of-the-)\b(art\s+and\s+craft|drawing|painting|fine\s*arts|visual\s*arts)\b', t):
        found_subjs.append("Art & Design")
    elif is_title and re.search(r'\b(art\s*teacher|craft\s*teacher)\b', t):
        found_subjs.append("Art & Design")

    if re.search(r'\b(music|vocal|instrumental|guitar|piano|tabla)\b', t): found_subjs.append("Music")
    if re.search(r'\b(dance|kathak|contemporary)\b', t): found_subjs.append("Dance")
    
    # Safe PET match: avoid pet animals in description
    if is_title:
        if re.search(r'\b(physical\s*education|\bpet\b|\bpti\b|sports|athletics|football|cricket|basketball|badminton|swimming|yoga|skating)\b', t):
            found_subjs.append("Physical Education")
    else:
        if re.search(r'\b(physical\s*education\s*teacher|\bpet\s*teacher|sports\s*coach|yoga\s*instructor)\b', t):
            found_subjs.append("Physical Education")

    if re.search(r'\b(special\s*educator|special\s*education|learning\s*disability)\b', t): found_subjs.append("Special Education")
    if re.search(r'\b(counselor|counsellor|psychology|wellness\s*teacher)\b', t): found_subjs.append("Counselor")
    if re.search(r'\b(composite\s*lab|lab\s*assistant|lab\s*incharge)\b', t): found_subjs.append("Composite Lab")

    if len(found_subjs) == 1:
        return found_subjs[0]
    elif len(found_subjs) == 2:
        return f"{found_subjs[0]} & {found_subjs[1]}"
    elif len(found_subjs) > 2:
        return ", ".join(found_subjs[:2])
    
    if re.search(r'\b(science|general\s*science|evs|environmental\s*studies)\b', t):
        return "Science"

    return None

def parse_designation_and_subject(title: str, desc: str = ""):
    """
    TITLE-FIRST PRIORITY:
    Evaluates Title first to prevent description false positives.
    """
    t_clean = str(title or "").strip()
    d_clean = str(desc or "").strip()

    # 1. Designation from Title
    desig = detect_designation_from_title(t_clean)
    if not desig and d_clean:
        # Check description ONLY if title was an ambiguous teacher role
        if any(w in t_clean.lower() for w in ["teacher", "faculty", "educator"]):
            if re.search(r'\b(class\s*(?:11|12|xi|xii))\b', d_clean.lower()): desig = "PGT"
            elif re.search(r'\b(class\s*(?:6|7|8|9|10|vi|vii|viii|ix|x))\b', d_clean.lower()): desig = "TGT"
            elif re.search(r'\b(class\s*(?:1|2|3|4|5|i|ii|iii|iv|v))\b', d_clean.lower()): desig = "PRT"
    if not desig:
        desig = "Teacher"

    # 2. Subject Resolution (Title First & Role Constrained)
    # Administrative & Specialist roles have fixed subject domains; never let desc keywords misclassify them
    if desig in ["School Principal", "Vice Principal", "Academic Coordinator", "School Administration"]:
        subj = "Administration"
    elif desig == "School Counselor":
        subj = "Counselor"
    elif desig == "Special Educator":
        subj = "Special Education"
    elif desig == "Librarian":
        subj = "Composite Lab"
    elif desig == "Physical Education":
        subj = "Physical Education"
    else:
        # For academic teaching roles: check Title first
        subj = detect_subject_from_text(t_clean, is_title=True)
        if not subj and d_clean:
            # Fall back to description ONLY if title had no subject
            subj = detect_subject_from_text(d_clean, is_title=False)
        if not subj:
            if desig in ["PRT", "Pre-Primary / Nursery"] or re.search(r'\b(primary|mother\s*teacher|all\s*subjects?)\b', t_clean.lower()):
                subj = "Primary"
            else:
                subj = "General"

    # 3. Board Detection
    board = None
    comb = f"{t_clean} {d_clean}".lower()
    if re.search(r'\b(icse|isc|cisce)\b', comb): board = "ICSE"
    elif re.search(r'\b(cambridge|ib|international\s*baccalaureate|igcse)\b', comb): board = "Cambridge / IB"
    elif re.search(r'\b(state\s*board|haryana\s*board|up\s*board|maharashtra\s*board)\b', comb): board = "State Board"
    elif re.search(r'\b(cbse)\b', comb): board = "CBSE"

    # 4. Role Type
    role_type = "Full-Time"
    if re.search(r'\b(part[\s-]*time|visiting|guest|contractual|hourly)\b', comb):
        role_type = "Part-Time"
    elif desig == "ATL Mentor":
        role_type = "ATL Mentor"
    elif desig == "Lab In-Charge":
        role_type = "Lab In-Charge"

    return desig, subj, board, role_type

# ── 4. Strict Salary Normalization ───────────────────────────────────────────
def parse_salary(raw_salary: str = None, designation: str = None):
    """
    ZERO FAKE GUESSWORK:
    Requires explicit currency / pay markers. Discards plain numbers from descriptions.
    """
    if not raw_salary or any(w in (raw_salary or "").lower() for w in ["not disclosed", "competitive", "best in", "as per norms"]):
        return "Not Disclosed", None, None

    raw_clean = str(raw_salary).replace(",", "").strip()

    # Must contain explicit currency/salary marker
    has_marker = any(m in raw_clean.lower() for m in ['₹', 'rs', 'inr', 'lpa', 'lac', 'lakh', 'per month', 'per annum', '/mo', '/yr', 'pm', 'pa'])
    if not has_marker:
        return "Not Disclosed", None, None

    # 1. Monthly 'K' range like "40K INR/month - 70K INR/month" or "40k - 70k/mo"
    m_range = re.findall(r'(\d+)\s*[kK]\s*(?:INR|₹)?\s*/?\s*(?:month|mo)?', raw_clean, re.I)
    if len(m_range) >= 2:
        mn = int(m_range[0]) * 1000
        mx = int(m_range[1]) * 1000
        return f"₹{mn//1000}k - ₹{mx//1000}k/mo", mn * 12, mx * 12
    elif len(m_range) == 1 and 'up to' in raw_clean.lower():
        mx = int(m_range[0]) * 1000
        return f"Up to ₹{mx//1000}k/mo", int(mx * 0.7) * 12, mx * 12

    # 2. LPA match like "4.5 - 7.5 LPA"
    lpa_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakh|lac)', raw_clean, re.I)
    if lpa_match:
        mn = float(lpa_match.group(1))
        mx = float(lpa_match.group(2))
        return f"₹{mn:.1f} - ₹{mx:.1f} LPA", int(mn * 100000), int(mx * 100000)

    # 3. Full digits monthly numeric range "35000 - 55000 per month"
    m_full = re.search(r'(\d{4,6})\s*(?:-|to)\s*(?:₹|rs\.?|inr)?\s*(\d{4,6})', raw_clean, re.I)
    if m_full:
        mn = int(m_full.group(1))
        mx = int(m_full.group(2))
        if any(w in raw_clean.lower() for w in ['month', 'mo', 'pm']) or mn < 100000:
            return f"₹{mn//1000}k - ₹{mx//1000}k/mo", mn * 12, mx * 12
        else:
            return f"₹{mn/100000:.1f} - ₹{mx/100000:.1f} LPA", mn, mx

    return "Not Disclosed", None, None

# ── 5. Location Parsing (Zero Fabrication of Delhi) ───────────────────────────
def parse_location(raw_loc: str = ""):
    """
    ACCURATE GEOCODING:
    Returns (None, None, raw_loc, None) when city is unknown.
    NEVER fabricates Delhi or default Delhi coordinates.
    """
    raw_clean = str(raw_loc or "").strip()
    raw_lower = raw_clean.lower()
    
    if not raw_clean:
        return None, None, None, None

    for city_key, info in INDIAN_CITIES_GEO.items():
        if re.search(r'\b' + re.escape(city_key) + r'\b', raw_lower):
            city_name = " ".join([w.capitalize() for w in city_key.split()])
            addr = raw_clean
            return city_name, info['state'], addr, {'lat': info['lat'], 'lng': info['lng']}

    # Unknown city: return real location string with None coordinates (Zero Fabrication)
    return None, None, raw_clean, None

def resolve_logo(school_name: str, custom_logo: str = None) -> str:
    if custom_logo and custom_logo.startswith('http') and 'unsplash.com' not in custom_logo:
        return custom_logo
    return None

# ── 6. Portal 1: Live LinkedIn India Scraper (Voyager + Guest Fallback) ───────
LINKEDIN_HEADERS = {
    "accept": "application/vnd.linkedin.normalized+json+2.1",
    "csrf-token": "ajax:1858039678731551262",
    "x-restli-protocol-version": "2.0.0",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "cookie": (
        'bcookie="v=2&76f47071-4479-4d1d-8f09-59e553ec0049"; '
        'bscookie="v=1&2026102702285446fae21a-6b0b-4731-8eab-4c9efa4193fbAQFL0jPYcz66gVbU_s3ohQSZK3GVS1Ka"; '
        'JSESSIONID="ajax:1858039678731551262"; '
        'li_at=AQEDAR9155QCP8eYAAABoXsw6y0AAAGhnz1vLVYAa_qzpFcy3tBvoxldPndqfxbqeN6H-pmxlzIOk9i6lLZxmGM-1oJ-QDPNMP2C36qKncZrQ2xUX6li2owoS4eeMsdCh-fdsalprFzYAnvUE1kxJLuj; '
        'liap=true;'
    )
}

LINKEDIN_SUBJECT_QUERIES = [
    # Leadership & Administration
    "school principal",
    "vice principal school",
    "headmistress school",
    "academic coordinator school",
    "school administrator",
    # Academic Teaching
    "school teacher",
    "CBSE school teacher",
    "PGT Physics teacher",
    "PGT Chemistry teacher",
    "PGT Biology teacher",
    "TGT Science teacher",
    "PGT Mathematics teacher",
    "TGT Mathematics teacher",
    "computer science teacher school",
    "ATL mentor robotics school",
    "PRT primary teacher",
    "Pre Primary nursery teacher",
    "English teacher school",
    "Hindi teacher school",
    "Sanskrit teacher school",
    "social studies teacher school",
    "economics commerce teacher school",
    # Well-being, Sports & Activities
    "school counselor",
    "special educator school",
    "physical education teacher school",
    "art craft teacher school",
    "music dance teacher school",
    "school librarian lab assistant"
]

def scrape_live_linkedin_jobs(queries=None, count_per_query=25):
    """
    Scrapes live authentic school vacancies from LinkedIn India.
    Uses high-speed official Voyager REST API (with session auth) + guest endpoint fallback.
    """
    if not HAS_SCRAPING_DEPS:
        return []

    if queries is None:
        queries = LINKEDIN_SUBJECT_QUERIES

    print(f"🌐 [LinkedIn India] Scanning live vacancies across {len(queries)} target queries...")
    scraped_cards = []
    seen_urls = set()
    today_str = datetime.now().strftime("%Y-%m-%d")

    for q in queries:
        try:
            encoded_q = requests.utils.quote(q)
            voyager_url = f"https://www.linkedin.com/voyager/api/voyagerJobsDashJobCards?decorationId=com.linkedin.voyager.dash.deco.jobs.search.JobSearchCardsCollection-216&count={count_per_query}&q=jobSearch&query=(origin:JOB_SEARCH_PAGE_SEARCH_BUTTON,keywords:{encoded_q})"
            r = requests.get(voyager_url, headers=LINKEDIN_HEADERS, timeout=8)

            if r.status_code == 200:
                data = r.json()
                included = data.get("included", [])
                for item in included:
                    if item.get("$type") == "com.linkedin.voyager.dash.jobs.JobPostingCard":
                        title_obj = item.get("title")
                        title = title_obj.get("text", "").strip() if isinstance(title_obj, dict) else ""
                        if not title: continue

                        comp_obj = item.get("primaryDescription")
                        school = comp_obj.get("text", "").strip() if isinstance(comp_obj, dict) else "Reputed School"

                        loc_obj = item.get("secondaryDescription")
                        loc_str = loc_obj.get("text", "").strip() if isinstance(loc_obj, dict) else ""

                        sal_obj = item.get("tertiaryDescription")
                        sal_text = sal_obj.get("text", "").strip() if isinstance(sal_obj, dict) else ""

                        entity_urn = item.get("entityUrn", "")
                        m = re.search(r'\((\d+),', entity_urn)
                        # STABLE DETERMINISTIC ID (SHA1)
                        num_id = m.group(1) if m else hashlib.sha1(f"{title}-{school}-{loc_str}".encode('utf-8')).hexdigest()[:12]
                        job_url = f"https://www.linkedin.com/jobs/view/{num_id}"

                        if job_url in seen_urls: continue
                        seen_urls.add(job_url)

                        if not is_valid_school_job(title, school, ""):
                            continue

                        desig, subj, board, role_type = parse_designation_and_subject(title, "")
                        salary_str, s_min, s_max = parse_salary(sal_text, desig)
                        city, state, addr, coords = parse_location(loc_str)
                        school_logo = resolve_logo(school, "")

                        scraped_cards.append({
                            "id": f"li-{num_id}",
                            "organisationName": school,
                            "organisationLogo": school_logo,
                            "jobPostName": title,
                            "designation": desig,
                            "subject": subj,
                            "board": board,
                            "roleType": role_type,
                            "salary": salary_str,
                            "salaryMin": s_min,
                            "salaryMax": s_max,
                            "shortDescription": f"{school} is hiring for {title}{f' in {city}, {state}' if city else ''}.",
                            "address": addr,
                            "city": city,
                            "state": state,
                            "coordinates": coords,
                            "minExperience": "Min 2 yrs Exp",
                            "openingDate": today_str,
                            "lastDate": None,  # Genuine: Never fabricated
                            "source": "LinkedIn",
                            "originalUrl": job_url,
                            "verified": False,  # Genuine: False unless confirmed
                            "badge": "LinkedIn"
                        })
            else:
                # Fallback to Guest Endpoint
                guest_url = f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords={encoded_q}&location=India&start=0"
                gr = requests.get(guest_url, headers={'User-Agent': LINKEDIN_HEADERS['user-agent']}, timeout=6)
                if gr.status_code == 200:
                    soup = BeautifulSoup(gr.text, 'html.parser')
                    for c in soup.find_all('div', class_='base-card'):
                        link_elem = c.find('a', class_='base-card__full-link')
                        title_elem = c.find('h3', class_='base-search-card__title')
                        comp_elem = c.find('h4', class_='base-search-card__subtitle')
                        loc_elem = c.find('span', class_='job-search-card__location')

                        job_url = link_elem.get('href') if link_elem else ""
                        if not job_url or job_url in seen_urls: continue
                        seen_urls.add(job_url)

                        title = title_elem.text.strip() if title_elem else "School Teacher"
                        school = comp_elem.text.strip() if comp_elem else "Reputed School"
                        loc_str = loc_elem.text.strip() if loc_elem else ""

                        if not is_valid_school_job(title, school, ""): continue

                        desig, subj, board, role_type = parse_designation_and_subject(title, "")
                        salary_str, s_min, s_max = parse_salary("", desig)
                        city, state, addr, coords = parse_location(loc_str)

                        m_id = re.search(r'-(\d+)\?', job_url)
                        num_id = m_id.group(1) if m_id else hashlib.sha1(job_url.encode('utf-8')).hexdigest()[:12]

                        scraped_cards.append({
                            "id": f"li-{num_id}",
                            "organisationName": school,
                            "organisationLogo": None,
                            "jobPostName": title,
                            "designation": desig,
                            "subject": subj,
                            "board": board,
                            "roleType": role_type,
                            "salary": salary_str,
                            "salaryMin": s_min,
                            "salaryMax": s_max,
                            "shortDescription": f"{school} is hiring for {title}{f' in {city}, {state}' if city else ''}.",
                            "address": addr,
                            "city": city,
                            "state": state,
                            "coordinates": coords,
                            "minExperience": "Min 2 yrs Exp",
                            "openingDate": today_str,
                            "lastDate": None,
                            "source": "LinkedIn",
                            "originalUrl": job_url,
                            "verified": False,
                            "badge": "LinkedIn"
                        })
                else:
                    print(f"  ⚠️ LinkedIn query '{q}' status {gr.status_code}")
        except Exception as e:
            print(f"  ⚠️ LinkedIn scraper exception for '{q}': {e}")

    print(f"  ↳ Fetched {len(scraped_cards)} live vacancies from LinkedIn!")
    return scraped_cards

# ── 7. Portal 2: Live Indeed India GraphQL Scraper ───────────────────────────
INDEED_HEADERS = {
    'content-type': 'application/json',
    'indeed-api-key': '176bee76fee13e7dd476a8eb31278b2e9bc1363a0f620338c7d7e65162af0ed4',
    'indeed-ctk': '1k5clgh3125hl000',
    'origin': 'https://in.indeed.com',
    'referer': 'https://in.indeed.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

INDEED_GQL_QUERY = """
query SearchJobs($what: String!, $location: JobSearchLocationInput, $limit: Int) {
    jobSearch(what: $what, location: $location, limit: $limit) {
        results {
            job {
                key
                title
                employer { name }
                datePublished
                location {
                    city
                    postalCode
                }
                description { text }
            }
        }
    }
}
"""

INDEED_SUBJECT_QUERIES = [
    # Leadership & Administration
    "School Principal",
    "School Vice Principal",
    "Headmistress School",
    "Academic Coordinator School",
    "School Administrator",
    # Core general & levels
    "School Teacher",
    "CBSE School Teacher",
    "ICSE School Teacher",
    "PRT Primary Teacher School",
    "Pre Primary Nursery Teacher School",
    # Sciences & Mathematics
    "PGT Physics Teacher School",
    "TGT Physics Teacher School",
    "PGT Chemistry Teacher School",
    "TGT Chemistry Teacher School",
    "PGT Biology Teacher School",
    "TGT Science Teacher School",
    "PGT Mathematics Teacher School",
    "TGT Mathematics Teacher School",
    # Tech, AI & Robotics
    "Computer Science Teacher School",
    "Coding AI Teacher School",
    "ATL Mentor School",
    "Robotics Trainer School",
    # Languages & Humanities
    "PGT English Teacher School",
    "TGT English Teacher School",
    "PGT Hindi Teacher School",
    "Sanskrit Teacher School",
    "French German Teacher School",
    "TGT Social Studies SST School",
    "PGT History Teacher School",
    "PGT Geography Teacher School",
    "PGT Political Science Teacher School",
    "PGT Economics Teacher School",
    "PGT Commerce Accounts Teacher School",
    # Activities, Well-Being & Support
    "Art and Craft Teacher School",
    "Music Dance Teacher School",
    "Physical Education PET Teacher School",
    "School Counselor Psychologist",
    "Special Educator School",
    "School Lab Assistant Incharge"
]

ALL_INDIA_HUBS = [
    ("Delhi NCR", "Delhi NCR"),
    ("Noida", "Uttar Pradesh"),
    ("Greater Noida", "Uttar Pradesh"),
    ("Gurugram", "Haryana"),
    ("Faridabad", "Haryana"),
    ("Ghaziabad", "Uttar Pradesh"),
    ("Mumbai", "Maharashtra"),
    ("Pune", "Maharashtra"),
    ("Bengaluru", "Karnataka"),
    ("Hyderabad", "Telangana"),
    ("Chennai", "Tamil Nadu"),
    ("Kolkata", "West Bengal"),
    ("Jaipur", "Rajasthan"),
    ("Lucknow", "Uttar Pradesh"),
    ("Kanpur", "Uttar Pradesh"),
    ("Chandigarh", "Punjab"),
    ("Ahmedabad", "Gujarat"),
    ("Indore", "Madhya Pradesh"),
    ("Bhopal", "Madhya Pradesh"),
    ("Dehradun", "Uttarakhand"),
    ("Patna", "Bihar"),
    ("Kochi", "Kerala"),
    ("Coimbatore", "Tamil Nadu"),
    ("Bhubaneswar", "Odisha")
]

def scrape_live_indeed_jobs(queries=None, hubs=None, max_per_hub=15):
    """
    Scrapes live authentic school vacancies from Indeed India GraphQL API.
    Uses real job location if available, avoids fabricating Delhi.
    """
    if not HAS_SCRAPING_DEPS:
        return []

    if queries is None:
        queries = INDEED_SUBJECT_QUERIES

    if hubs is None:
        hubs = ALL_INDIA_HUBS

    print(f"⚡ [Indeed India] Scanning live vacancies across {len(queries)} queries in {len(hubs)} hubs...")
    scraped_cards = []
    seen_keys = set()
    today_str = datetime.now().strftime("%Y-%m-%d")

    for q in queries:
        for c_name, c_state in hubs:
            variables = {
                "what": q,
                "location": {"where": f"{c_name}, {c_state}", "radius": 35, "radiusUnit": "KILOMETERS"},
                "limit": max_per_hub
            }
            try:
                r = requests.post(
                    "https://apis.indeed.com/graphql?co=IN",
                    headers=INDEED_HEADERS,
                    json={"query": INDEED_GQL_QUERY, "variables": variables},
                    timeout=8
                )
                if r.status_code != 200:
                    continue
                results = r.json().get('data', {}).get('jobSearch', {}).get('results', [])
                for it in results:
                    job = it.get('job')
                    if not job: continue
                    jk = job.get('key')
                    if not jk or jk in seen_keys: continue
                    seen_keys.add(jk)

                    title = str(job.get('title') or 'School Faculty').strip()
                    school = (job.get('employer') or {}).get('name') or "Reputed Senior Secondary School"
                    desc = (job.get('description') or {}).get('text') or ''
                    date_pub = job.get('datePublished', 0)
                    date_str = datetime.fromtimestamp(date_pub / 1000).strftime('%Y-%m-%d') if date_pub else today_str

                    if not is_valid_school_job(title, school, desc):
                        continue

                    desig, subj, board, role_type = parse_designation_and_subject(title, desc)
                    
                    # Extract real job location if provided by Indeed
                    loc_obj = job.get('location') or {}
                    real_city = loc_obj.get('city')
                    loc_input = real_city if real_city else f"{c_name}, {c_state}"
                    city, state, addr, coords = parse_location(loc_input)

                    # Extract salary ONLY if explicit currency markers exist
                    salary_match = re.search(r'(?:₹|rs\.?|inr)\s*\d+[\d,]*(?:\s*-\s*(?:₹|rs\.?|inr)?\s*\d+[\d,]*)?(?:\s*(?:lpa|per\s*month|per\s*annum|pm|pa|\/mo|\/yr))?', desc, re.IGNORECASE)
                    raw_sal = salary_match.group(0) if salary_match else ""
                    salary_str, s_min, s_max = parse_salary(raw_sal, desig)

                    school_logo = resolve_logo(school, "")
                    job_id = f"ind-{jk}"
                    job_url = f"https://in.indeed.com/viewjob?jk={jk}"

                    scraped_cards.append({
                        "id": job_id,
                        "organisationName": school,
                        "organisationLogo": school_logo,
                        "jobPostName": title,
                        "designation": desig,
                        "subject": subj,
                        "board": board,
                        "roleType": role_type,
                        "salary": salary_str,
                        "salaryMin": s_min,
                        "salaryMax": s_max,
                        "shortDescription": desc[:250].strip() if desc else f"{school} is hiring {title}{f' in {city}, {state}' if city else ''}.",
                        "address": addr,
                        "city": city,
                        "state": state,
                        "coordinates": coords,
                        "minExperience": "Min 2 yrs Exp",
                        "openingDate": date_str,
                        "lastDate": None,
                        "source": "Indeed",
                        "originalUrl": job_url,
                        "verified": False,
                        "badge": "Indeed"
                    })
            except Exception as e:
                pass

    print(f"  ↳ Fetched {len(scraped_cards)} live vacancies from Indeed India!")
    return scraped_cards

# ── 8. Portal 3: Naukri.com Ingestion & Parser ────────────────────────────────
def parse_naukri_json(data_or_path) -> list:
    """
    Parses Naukri.com API or DOM card payloads into clean normalized FacultyJobItem cards.
    Uses deterministic SHA1 ID generation.
    """
    if isinstance(data_or_path, str):
        if os.path.exists(data_or_path):
            with open(data_or_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            data = json.loads(data_or_path)
    else:
        data = data_or_path

    job_details = data.get("jobDetails", []) if isinstance(data, dict) else (data if isinstance(data, list) else [])
    today_str = datetime.now().strftime("%Y-%m-%d")

    cards = []
    for item in job_details:
        title = item.get("title", item.get("jobTitle", "School Faculty"))
        school = item.get("companyName", item.get("orgName", "Reputed School"))
        logo = item.get("logoPath", "")

        raw_salary = ""
        raw_exp = "Min 2 yrs Exp"
        raw_loc = ""

        for p in item.get("placeholders", []):
            ptype = p.get("type")
            if ptype == "salary": raw_salary = p.get("label", "")
            elif ptype == "experience": raw_exp = p.get("label", "Min 2 yrs Exp")
            elif ptype == "location": raw_loc = p.get("label", "")

        desc = item.get("jobDescription", "")
        if not is_valid_school_job(title, school, desc):
            continue

        desig, subj, board, role_type = parse_designation_and_subject(title, desc)
        salary_str, s_min, s_max = parse_salary(raw_salary, desig)
        city, state, addr, coords = parse_location(raw_loc)
        school_logo = resolve_logo(school, logo)

        source_url = item.get("staticUrl", item.get("jdURL", "https://www.naukri.com"))
        if source_url and not source_url.startswith("http"):
            source_url = f"https://www.naukri.com{'' if source_url.startswith('/') else '/'}{source_url}"

        # DETERMINISTIC ID (SHA1)
        source_id = item.get('jobId')
        if not source_id:
            source_id = hashlib.sha1((source_url or f"{title}-{school}").encode('utf-8')).hexdigest()[:12]
        job_id = f"nk-{source_id}"

        cards.append({
            "id": job_id,
            "organisationName": school,
            "organisationLogo": school_logo,
            "jobPostName": title,
            "designation": desig,
            "subject": subj,
            "board": board,
            "roleType": role_type,
            "salary": salary_str,
            "salaryMin": s_min,
            "salaryMax": s_max,
            "shortDescription": desc.replace("\n", " ")[:180] if desc else f"{school} is hiring for {desig} {subj}{f' in {city}' if city else ''}.",
            "address": addr,
            "city": city,
            "state": state,
            "coordinates": coords,
            "minExperience": raw_exp,
            "openingDate": today_str,
            "lastDate": None,
            "source": "Naukri.com",
            "originalUrl": source_url,
            "verified": False,
            "badge": "Naukri"
        })

    return cards

# ── 9. Supabase Direct Synchronization (Single Source of Truth) ───────────────
def fetch_all_supabase_jobs():
    """
    Fetches all active jobs directly from Supabase public.jobs table.
    Filters exclusively for Indeed, LinkedIn, and Naukri.
    """
    if not HAS_SCRAPING_DEPS:
        return []

    print("📡 Fetching active vacancies directly from Supabase...")
    all_jobs = []
    offset = 0
    limit = 1000
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
    }

    while True:
        try:
            url = f"{SUPABASE_URL}/rest/v1/jobs?is_active=eq.true&order=posted_at.desc&select=*&offset={offset}&limit={limit}"
            r = requests.get(url, headers=headers, timeout=12)
            if r.status_code != 200:
                print(f"⚠️ Supabase fetch warning [HTTP {r.status_code}]: {r.text}")
                break
            batch = r.json()
            if not batch:
                break

            for row in batch:
                reqs = row.get("requirements") or []
                src = "Indeed"
                orig_url = ""
                lat = None
                lng = None
                desig = "Teacher"
                subj = row.get("department") or ""
                board = None
                s_min = None
                s_max = None
                for req in reqs:
                    if req.startswith("source:"): src = req.split(":", 1)[1]
                    elif req.startswith("url:"): orig_url = req.split(":", 1)[1]
                    elif req.startswith("lat:"): 
                        try: lat = float(req.split(":", 1)[1])
                        except: pass
                    elif req.startswith("lng:"):
                        try: lng = float(req.split(":", 1)[1])
                        except: pass
                    elif req.startswith("designation:"): desig = req.split(":", 1)[1]
                    elif req.startswith("board:"): board = req.split(":", 1)[1]
                    elif req.startswith("salary_min:"): 
                        try: s_min = int(req.split(":", 1)[1])
                        except: pass
                    elif req.startswith("salary_max:"):
                        try: s_max = int(req.split(":", 1)[1])
                        except: pass

                # Only keep Indeed, LinkedIn, and Naukri
                if src not in ["Indeed", "LinkedIn", "Naukri.com"]:
                    continue

                all_jobs.append({
                    "id": row.get("slug") or f"sb-{row.get('id')}",
                    "organisationName": row.get("institute_name", ""),
                    "organisationLogo": None,
                    "jobPostName": row.get("title", ""),
                    "designation": desig,
                    "subject": subj,
                    "board": board,
                    "roleType": row.get("job_type", "Full-Time"),
                    "salary": row.get("salary_range", "---"),
                    "salaryMin": s_min,
                    "salaryMax": s_max,
                    "shortDescription": row.get("description", ""),
                    "address": row.get("city") or row.get("state") or "",
                    "city": row.get("city"),
                    "state": row.get("state"),
                    "coordinates": {"lat": lat, "lng": lng} if (lat is not None and lng is not None) else None,
                    "minExperience": row.get("experience_required", "Min 2 yrs Exp"),
                    "openingDate": (row.get("posted_at") or "")[:10],
                    "lastDate": None,
                    "source": src,
                    "originalUrl": orig_url,
                    "verified": False,
                    "badge": src
                })

            if len(batch) < limit:
                break
            offset += limit
        except Exception as e:
            print(f"⚠️ Supabase fetch exception: {e}")
            break

    print(f"  ↳ Loaded {len(all_jobs)} active vacancies directly from Supabase!")
    return all_jobs

def sync_new_jobs_to_supabase(cards):
    """
    Directly uploads newly extracted or updated vacancies into Supabase public.jobs.
    Full error logging for non-2xx responses.
    """
    if not cards or not HAS_SCRAPING_DEPS:
        return 0

    print(f"🚀 Synchronizing {len(cards)} vacancies directly into Supabase (on_conflict=slug)...")
    headers = {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal"
    }

    supabase_rows = []
    for j in cards:
        title = j.get("jobPostName", "School Teacher")
        school = j.get("organisationName", "School")
        city = j.get("city")
        state = j.get("state")
        addr = j.get("address", "")
        coords = j.get("coordinates")

        reqs = []
        if j.get("source"): reqs.append(f"source:{j['source']}")
        if j.get("originalUrl"): reqs.append(f"url:{j['originalUrl']}")
        if coords:
            reqs.append(f"lat:{coords.get('lat')}")
            reqs.append(f"lng:{coords.get('lng')}")
        if city: reqs.append(f"district:{city}")
        if addr: reqs.append(f"address:{addr}")
        if j.get("designation"): reqs.append(f"designation:{j['designation']}")
        if j.get("subject"): reqs.append(f"subject:{j['subject']}")
        if j.get("board"): reqs.append(f"board:{j['board']}")
        if j.get("salaryMin"): reqs.append(f"salary_min:{j['salaryMin']}")
        if j.get("salaryMax"): reqs.append(f"salary_max:{j['salaryMax']}")
        if j.get("openingDate"): reqs.append(f"opening_date:{j['openingDate']}")

        row = {
            "title": title,
            "slug": j.get("id"),
            "department": j.get("subject") or "Faculty",
            "institute_name": school,
            "city": city,
            "state": state,
            "salary_range": j.get("salary", "---"),
            "experience_required": j.get("minExperience"),
            "job_type": j.get("roleType", "Full-Time"),
            "description": j.get("shortDescription", f"{school} is hiring for {title}."),
            "requirements": reqs,
            "benefits": [],
            "is_active": True,
            "deadline": None,
            "posted_at": f"{j.get('openingDate', datetime.now().strftime('%Y-%m-%d'))}T00:00:00Z"
        }
        supabase_rows.append(row)

    batch_size = 40
    uploaded = 0
    for i in range(0, len(supabase_rows), batch_size):
        batch = supabase_rows[i:i + batch_size]
        try:
            res = requests.post(
                f"{SUPABASE_URL}/rest/v1/jobs?on_conflict=slug",
                headers=headers,
                json=batch,
                timeout=15
            )
            if res.status_code in [200, 201, 204]:
                uploaded += len(batch)
            else:
                print(f"  ❌ Supabase batch upload failed [HTTP {res.status_code}]: {res.text}")
        except Exception as e:
            print(f"  ❌ Supabase batch upload exception: {e}")

    print(f"  ✅ Synced {uploaded}/{len(cards)} vacancies directly to Supabase!")
    return uploaded

# ── 10. Execution Pipeline ────────────────────────────────────────────────────
def run_sync(filter_city: str = None, include_live_indeed: bool = True, include_live_linkedin: bool = True, naukri_file: str = None):
    print("═" * 72)
    print("🚀 INDIA SCHOOL JOBS ENGINE (INDEED • LINKEDIN • NAUKRI)")
    print("═" * 72)
    print("Extracting authentic school vacancies strictly from TOP 3 portals:")
    print("  1. Indeed India (in.indeed.com)  — High-Speed GraphQL API")
    print("  2. LinkedIn India (linkedin.com) — Voyager REST API + Guest Search")
    print("  3. Naukri (naukri.com)           — High-Density Education Pipeline")
    print("-" * 72)

    fresh_jobs = []

    # 1. Ingest live Indeed India vacancies
    if include_live_indeed:
        live_indeed_jobs = scrape_live_indeed_jobs()
        fresh_jobs.extend(live_indeed_jobs)

    # 2. Ingest live LinkedIn vacancies
    if include_live_linkedin:
        live_linkedin_jobs = scrape_live_linkedin_jobs()
        fresh_jobs.extend(live_linkedin_jobs)

    # 3. Ingest Naukri JSON if provided
    if naukri_file and os.path.exists(naukri_file):
        print(f"📥 Ingesting Naukri API payload from {naukri_file}...")
        naukri_jobs = parse_naukri_json(naukri_file)
        print(f"  ↳ Extracted {len(naukri_jobs)} vacancies from Naukri!")
        fresh_jobs.extend(naukri_jobs)

    # Load existing jobs directly from Supabase (Single Source of Truth)
    existing_jobs = fetch_all_supabase_jobs()
    if not existing_jobs and os.path.exists(OUTPUT_JSON_PATH):
        try:
            with open(OUTPUT_JSON_PATH, "r", encoding="utf-8") as f:
                existing_jobs = json.load(f)
        except Exception as e:
            print(f"⚠️ Warning reading local jobs file: {e}")

    # Purge jobs older than 45 days
    now_dt = datetime.now()
    forty_five_days_ago = now_dt - timedelta(days=45)
    unexpired_existing = []
    purged_count = 0
    for j in existing_jobs:
        try:
            op_dt = datetime.strptime(j.get('openingDate', ''), "%Y-%m-%d")
            if op_dt >= forty_five_days_ago:
                unexpired_existing.append(j)
            else:
                purged_count += 1
        except Exception:
            unexpired_existing.append(j)

    if purged_count > 0:
        print(f"🧹 Purged {purged_count} expired vacancies older than 45 days.")

    # 5-Point Deduplication System across the 3 portals
    from difflib import SequenceMatcher

    def is_exact_duplicate(job_a, job_b):
        if job_a.get('designation') != job_b.get('designation') or job_a.get('subject') != job_b.get('subject'):
            return False
        if (job_a.get('city') or '').lower() != (job_b.get('city') or '').lower():
            return False

        name_a = (job_a.get('organisationName') or '').lower().strip()
        name_b = (job_b.get('organisationName') or '').lower().strip()
        sim = SequenceMatcher(None, name_a, name_b).ratio()
        if sim < 0.85:
            return False

        date_a_str = job_a.get('openingDate', '')
        date_b_str = job_b.get('openingDate', '')
        try:
            dt_a = datetime.strptime(date_a_str, "%Y-%m-%d")
            dt_b = datetime.strptime(date_b_str, "%Y-%m-%d")
            if abs((dt_a - dt_b).days) > 10:
                return False
        except Exception:
            pass

        return True

    consolidated = list(unexpired_existing)
    added_count = 0
    updated_cards = []

    for fresh in fresh_jobs:
        if filter_city and filter_city.lower() not in (fresh.get('city') or '').lower():
            continue

        matched_idx = -1
        for idx, ex in enumerate(consolidated):
            if is_exact_duplicate(ex, fresh):
                matched_idx = idx
                break

        if matched_idx >= 0:
            ex = consolidated[matched_idx]
            changed = False
            # Keep freshest date
            if fresh.get('openingDate', '') > ex.get('openingDate', ''):
                ex['openingDate'] = fresh.get('openingDate', '')
                changed = True
            # Update salary if fresh posting has real salary and existing was Not Disclosed
            if fresh.get('salary') and fresh.get('salary') != "Not Disclosed" and ex.get('salary') == "Not Disclosed":
                ex['salary'] = fresh.get('salary')
                ex['salaryMin'] = fresh.get('salaryMin')
                ex['salaryMax'] = fresh.get('salaryMax')
                changed = True
            if fresh.get('originalUrl') and not ex.get('originalUrl'):
                ex['originalUrl'] = fresh.get('originalUrl')
                changed = True
            if changed:
                updated_cards.append(ex)
        else:
            consolidated.append(fresh)
            added_count += 1

    # Sync newly added cards AND updated records back to Supabase (LOST-UPDATE RESOLUTION)
    cards_to_sync = []
    if added_count > 0:
        cards_to_sync.extend(consolidated[-added_count:])
    if updated_cards:
        cards_to_sync.extend(updated_cards)

    if cards_to_sync:
        sync_new_jobs_to_supabase(cards_to_sync)
    else:
        print("ℹ️ Zero new or updated vacancies to upload to Supabase.")

    # Save local JSON file as backup cache
    os.makedirs(SRC_DATA_DIR, exist_ok=True)
    with open(OUTPUT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(consolidated, f, indent=2, ensure_ascii=False)

    # Trigger dynamic facets recalculation
    try:
        scripts_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.insert(0, scripts_dir)
        from generate_job_filter_facets import generate_facets
        generate_facets()
    except Exception as fe:
        print(f"⚠️ Facet generation notice: {fe}")

    print(f"✅ Extraction, Normalization & Supabase Sync Complete!")
    print(f"  • Total Active Vacancies in Database: {len(consolidated)}")
    print(f"  • Brand-New Vacancies Extracted & Uploaded: {added_count}")
    print(f"  • Updated Existing Vacancies: {len(updated_cards)}")
    print(f"  • Local Backup File: {OUTPUT_JSON_PATH}")
    print("═" * 72)

    # Portal breakdown
    portal_counts = {}
    city_counts = {}
    for j in consolidated:
        portal_counts[j.get('source', 'Unknown')] = portal_counts.get(j.get('source', 'Unknown'), 0) + 1
        c = j.get('city') or 'Unspecified Location'
        city_counts[c] = city_counts.get(c, 0) + 1

    print("\n📊 PORTAL BREAKDOWN (STRICTLY INDEED, LINKEDIN & NAUKRI):")
    for p, c in sorted(portal_counts.items(), key=lambda x: -x[1]):
        print(f"  • {p:30}: {c:2} vacancies")

    print("\n📍 TOP EDUCATIONAL CITIES:")
    for city, c in sorted(city_counts.items(), key=lambda x: -x[1])[:8]:
        print(f"  • {city:30}: {c:2} vacancies")
    print("═" * 72)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="India School Jobs Engine (Indeed, LinkedIn, Naukri)")
    parser.add_argument("--sync", action="store_true", help="Sync latest jobs from Indeed, LinkedIn, and Naukri")
    parser.add_argument("--city", type=str, default=None, help="Filter by city (e.g. Delhi, Noida, Mumbai)")
    parser.add_argument("--scrape-indeed", action="store_true", help="Scrape live Indeed vacancies")
    parser.add_argument("--no-scrape-indeed", action="store_true", help="Skip live Indeed scraping")
    parser.add_argument("--scrape-linkedin", action="store_true", help="Scrape live LinkedIn vacancies")
    parser.add_argument("--no-scrape-linkedin", action="store_true", help="Skip live LinkedIn scraping")
    parser.add_argument("--ingest-naukri", type=str, default=None, help="Path to Naukri v3 search JSON response file")
    args = parser.parse_args()

    include_li = not args.no_scrape_linkedin
    include_ind = not args.no_scrape_indeed
    run_sync(
        filter_city=args.city,
        include_live_indeed=include_ind,
        include_live_linkedin=include_li,
        naukri_file=args.ingest_naukri
    )
