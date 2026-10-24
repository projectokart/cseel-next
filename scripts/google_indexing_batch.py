#!/usr/bin/env python3
"""
CSEEL Google Indexing API Batch Job & School Submitter
=====================================================
Batch-notifies Googlebot to index JobPostings and School profiles
using the official Google Web Search Indexing API (v3).
"""

import os
import sys
import json
import time
import argparse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

CREDS_FILE = 'd:/Projects/cseel_next/cseel-next/credentials.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']
JOBS_FILE = 'd:/Projects/cseel_next/cseel-next/src/data/aggregated_jobs.json'

def get_indexing_service():
    if not os.path.isfile(CREDS_FILE):
        print(f"[ERROR] Credentials file not found at {CREDS_FILE}")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    return build('indexing', 'v3', credentials=creds)

def publish_url(service, url: str, action_type="URL_UPDATED"):
    body = {
        "url": url,
        "type": action_type
    }
    try:
        response = service.urlNotifications().publish(body=body).execute()
        meta = response.get('urlNotificationMetadata', {})
        latest = meta.get('latestUpdate', {})
        notify_time = latest.get('notifyTime', 'Just now')
        print(f"  [SUCCESS] {url} -> {notify_time}")
        return True
    except HttpError as e:
        if "quotaExceeded" in str(e).lower() or "429" in str(e):
            print(f"  [QUOTA LIMIT] Reached daily quota limit for Google Indexing API: {e}")
            return "QUOTA_EXCEEDED"
        print(f"  [ERROR] {url}: {e}")
        return False

def submit_jobs(service, limit=100):
    if not os.path.isfile(JOBS_FILE):
        print(f"[ERROR] Jobs file not found at {JOBS_FILE}")
        return
    with open(JOBS_FILE, 'r', encoding='utf-8') as f:
        jobs = json.load(f)

    print(f"\nFound {len(jobs)} total jobs. Submitting top {limit} active JobPosting URLs...")
    success = 0
    for idx, job in enumerate(jobs[:limit], 1):
        job_id = job.get('id')
        if not job_id:
            continue
        url = f"https://www.cseel.org/edu-network/teachers/job/{job_id}"
        print(f"[{idx}/{limit}] Submitting {job.get('postName', 'Job')} at {job.get('organisationName', 'School')}...")
        res = publish_url(service, url, "URL_UPDATED")
        if res == "QUOTA_EXCEEDED":
            break
        if res:
            success += 1
        time.sleep(0.3)
    print(f"\n[DONE] Successfully published {success} JobPosting URLs to Google Indexing API.")

def main():
    parser = argparse.ArgumentParser(description="CSEEL Google Indexing Batch Submitter")
    parser.add_argument("--type", choices=["jobs", "url", "core"], default="jobs")
    parser.add_argument("--url", default="")
    parser.add_argument("--limit", type=int, default=50)
    args = parser.parse_args()

    service = get_indexing_service()
    if args.type == "jobs":
        submit_jobs(service, limit=args.limit)
    elif args.type == "url" and args.url:
        publish_url(service, args.url, "URL_UPDATED")
    else:
        print("Please specify a valid command.")

if __name__ == "__main__":
    main()
