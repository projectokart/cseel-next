#!/usr/bin/env python3
"""
CSEEL Google Indexing API Automation Script
===========================================
Instantly notifies Googlebot to crawl and index updated or new pages
via Google Web Search Indexing API (v3).
"""

import os
import sys
import time
import argparse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

CREDS_FILE = 'd:/Projects/cseel_next/cseel-next/credentials.json'
SCOPES = ['https://www.googleapis.com/auth/indexing']

CORE_URLS = [
    'https://www.cseel.org/',
    'https://www.cseel.org/composite-lab',
    'https://www.cseel.org/steam-lab',
    'https://www.cseel.org/makerspace',
    'https://www.cseel.org/schools',
    'https://www.cseel.org/schemes',
    'https://www.cseel.org/domain/science',
    'https://www.cseel.org/domain/engineering',
    'https://www.cseel.org/domain/art',
    'https://www.cseel.org/subject/physics',
    'https://www.cseel.org/subject/chemistry',
    'https://www.cseel.org/subject/biology',
    'https://www.cseel.org/subject/mathematics',
    'https://www.cseel.org/about-us',
    'https://www.cseel.org/contact-us',
    'https://www.cseel.org/careers',
    'https://www.cseel.org/blog',
    'https://www.cseel.org/privacy',
    'https://www.cseel.org/terms'
]


def get_indexing_service():
    if not os.path.isfile(CREDS_FILE):
        print(f"[ERROR] Credentials file not found at {CREDS_FILE}")
        sys.exit(1)
    creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=SCOPES)
    return build('indexing', 'v3', credentials=creds)


def publish_url(service, url: str, action_type="URL_UPDATED"):
    """Notify Googlebot to index or re-crawl a URL."""
    body = {
        "url": url,
        "type": action_type
    }
    try:
        response = service.urlNotifications().publish(body=body).execute()
        meta = response.get('urlNotificationMetadata', {})
        latest = meta.get('latestUpdate', {})
        notify_time = latest.get('notifyTime', 'Just now')
        print(f"  [SUCCESS] Notified Googlebot: {url}")
        print(f"            Type: {action_type} | Time: {notify_time}")
        return True
    except HttpError as e:
        if "indexing.googleapis.com" in str(e):
            print("\n[!] Google Indexing API is not enabled yet in your project.")
            print("Enable it with 1 click here:")
            print("-> https://console.cloud.google.com/flows/enableapi?apiid=indexing.googleapis.com\n")
        else:
            print(f"  [ERROR] Failed to notify Googlebot for {url}: {e}")
        return False


def get_url_status(service, url: str):
    """Check when Google was last notified about this URL."""
    print(f"\n--- GOOGLEBOT INDEXING METADATA: {url} ---")
    try:
        response = service.urlNotifications().getMetadata(url=url).execute()
        latest_update = response.get('latestUpdate', {})
        latest_remove = response.get('latestRemove', {})

        if latest_update:
            print(f"• Latest Update Notification: {latest_update.get('notifyTime')}")
            print(f"• URL:                        {latest_update.get('url')}")
            print(f"• Type:                       {latest_update.get('type')}")
        else:
            print("• No previous update notifications recorded for this URL.")

        if latest_remove:
            print(f"• Latest Remove Notification: {latest_remove.get('notifyTime')}")
    except HttpError as e:
        print(f"[ERROR] Metadata check error: {e}")


def publish_all_core_pages(service):
    """Batch-submit all high-priority CSEEL pages to Googlebot."""
    print(f"\n{'='*70}")
    print(f"[INDEXING] BATCH NOTIFYING GOOGLEBOT FOR {len(CORE_URLS)} CORE PAGES")
    print(f"{'='*70}")

    success_count = 0
    for idx, url in enumerate(CORE_URLS, 1):
        print(f"[{idx}/{len(CORE_URLS)}] Submitting {url}...")
        ok = publish_url(service, url, "URL_UPDATED")
        if ok:
            success_count += 1
        time.sleep(0.5) # Gentle rate limiting

    print(f"\n[DONE] Successfully notified Googlebot for {success_count}/{len(CORE_URLS)} pages!")
    print("Googlebot will prioritize crawling these URLs within hours instead of weeks.")


def main():
    parser = argparse.ArgumentParser(description="CSEEL Google Indexing API CLI")
    parser.add_argument("--action", choices=["publish", "publish-all", "status"], default="publish-all")
    parser.add_argument("--url", default="https://www.cseel.org/", help="URL to index or check")
    parser.add_argument("--type", choices=["URL_UPDATED", "URL_DELETED"], default="URL_UPDATED")

    args = parser.parse_args()
    service = get_indexing_service()

    if args.action == "publish":
        publish_url(service, args.url, args.type)
    elif args.action == "publish-all":
        publish_all_core_pages(service)
    elif args.action == "status":
        get_url_status(service, args.url)


if __name__ == "__main__":
    main()
