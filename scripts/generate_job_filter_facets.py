#!/usr/bin/env python3
"""
Pre-calculates dynamic facet counts across all 2,346+ vacancies in aggregated_jobs.json.
Generates `src/data/job_filter_facets.json` with exact counts for:
- All 20+ Subjects
- All Designations (PGT, TGT, PRT, Leadership, etc.)
- All Educational Boards (CBSE, ICSE, IB/Cambridge, State Board)
- Top Cities & Districts
- States
- Salary Slabs
- Job Portals (Indeed, Naukri, LinkedIn, Direct)
"""

import json
import os
import sys
from datetime import datetime

if sys.stdout:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JOBS_PATH = os.path.join(BASE_DIR, "src", "data", "aggregated_jobs.json")
FACETS_PATH = os.path.join(BASE_DIR, "src", "data", "job_filter_facets.json")

def generate_facets():
    if not os.path.exists(JOBS_PATH):
        print(f"Error: {JOBS_PATH} does not exist.")
        return

    with open(JOBS_PATH, 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    total_jobs = len(jobs)
    subjects_map = {}
    designations_map = {}
    boards_map = {}
    cities_map = {}
    states_map = {}
    portals_map = {}
    job_types_map = {}

    salary_slabs = {
        "Above 8 LPA": 0,
        "5 - 8 LPA": 0,
        "3 - 5 LPA": 0,
        "Below 3 LPA": 0,
        "Not Disclosed": 0
    }

    for j in jobs:
        # 1. Subject
        sub = j.get('subject') or 'General'
        subjects_map[sub] = subjects_map.get(sub, 0) + 1

        # 2. Designation
        des = j.get('designation') or 'Teacher'
        designations_map[des] = designations_map.get(des, 0) + 1

        # 3. Board
        bd = j.get('board')
        if bd:
            # normalize "IB" and "IB/Cambridge"
            if bd in ['IB', 'IB/Cambridge', 'Cambridge']:
                bd = 'Cambridge / IB'
            boards_map[bd] = boards_map.get(bd, 0) + 1

        # 4. City
        city = j.get('city') or 'India'
        cities_map[city] = cities_map.get(city, 0) + 1

        # 5. State
        state = j.get('state') or 'India'
        states_map[state] = states_map.get(state, 0) + 1

        # 6. Portal
        src = j.get('source') or 'Indeed'
        portals_map[src] = portals_map.get(src, 0) + 1

        # 7. Job Type
        jt = j.get('roleType') or 'Full-Time'
        job_types_map[jt] = job_types_map.get(jt, 0) + 1

        # 8. Salary Slab
        s_max = j.get('salaryMax')
        s_min = j.get('salaryMin')
        sal_val = s_max or s_min

        if sal_val:
            if sal_val >= 800000:
                salary_slabs["Above 8 LPA"] += 1
            elif sal_val >= 500000:
                salary_slabs["5 - 8 LPA"] += 1
            elif sal_val >= 300000:
                salary_slabs["3 - 5 LPA"] += 1
            else:
                salary_slabs["Below 3 LPA"] += 1
        else:
            salary_slabs["Not Disclosed"] += 1

    # Format lists sorted by frequency
    subject_options = [
        {"id": k, "label": k, "count": v}
        for k, v in sorted(subjects_map.items(), key=lambda x: -x[1])
    ]

    designation_options = [
        {"id": k, "label": k if k != 'Teacher' else 'General Teacher', "count": v}
        for k, v in sorted(designations_map.items(), key=lambda x: -x[1])
    ]

    board_options = [
        {"id": k, "label": k, "count": v}
        for k, v in sorted(boards_map.items(), key=lambda x: -x[1])
    ]

    city_options = [
        {"id": k, "label": k, "count": v}
        for k, v in sorted(cities_map.items(), key=lambda x: -x[1])
        if k != "India"
    ]

    state_options = [
        {"id": k, "label": k, "count": v}
        for k, v in sorted(states_map.items(), key=lambda x: -x[1])
        if k != "India" and k != "All India"
    ]

    portal_options = [
        {"id": k, "label": k, "count": v}
        for k, v in sorted(portals_map.items(), key=lambda x: -x[1])
    ]

    salary_options = [
        {"id": k, "label": k, "count": v}
        for k, v in salary_slabs.items()
    ]

    for_lady_count = sum(1 for j in jobs if j.get('forLady'))

    facets_data = {
        "lastUpdated": datetime.now().isoformat(),
        "totalVacancies": total_jobs,
        "forLadyCount": for_lady_count,
        "subjects": subject_options,
        "designations": designation_options,
        "boards": board_options,
        "cities": city_options,
        "states": state_options,
        "portals": portal_options,
        "salarySlabs": salary_options,
        "counts": {
            "subjects": subjects_map,
            "designations": designations_map,
            "boards": boards_map,
            "cities": cities_map,
            "states": states_map,
            "portals": portals_map,
        }
    }

    with open(FACETS_PATH, 'w', encoding='utf-8') as f:
        json.dump(facets_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Generated {FACETS_PATH} successfully!")
    print(f"  • Total Vacancies: {total_jobs}")
    print(f"  • Subjects: {len(subject_options)} distinct subjects with exact counts")
    print(f"  • Designations: {len(designation_options)}")
    print(f"  • Boards: {len(board_options)}")
    print(f"  • Educational Cities: {len(city_options)}")
    print(f"  • States: {len(state_options)}")

if __name__ == "__main__":
    generate_facets()
