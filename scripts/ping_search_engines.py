#!/usr/bin/env python3
"""
CSEEL Search Engine Sitemap Ping & IndexNow Broadcaster
======================================================
Notifies Google, Bing, Yahoo, and IndexNow search engines about
CSEEL's master sitemap and all segmented sub-sitemaps (33k+ schools, jobs, materials).
"""

import sys
import urllib.request
import urllib.parse
import json
import time

SITEMAPS = [
    "https://www.cseel.org/sitemap.xml",
    "https://www.cseel.org/sitemaps/static.xml",
    "https://www.cseel.org/sitemaps/jobs.xml",
    "https://www.cseel.org/sitemaps/materials.xml",
    "https://www.cseel.org/sitemaps/schools-1.xml",
    "https://www.cseel.org/sitemaps/schools-2.xml",
    "https://www.cseel.org/sitemaps/schools-3.xml",
    "https://www.cseel.org/sitemaps/schools-4.xml",
    "https://www.cseel.org/sitemaps/schools-5.xml",
    "https://www.cseel.org/sitemaps/schools-6.xml",
    "https://www.cseel.org/sitemaps/schools-7.xml",
]

def ping_url(service_name: str, endpoint_url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; CSEEL-SEO-Bot/1.0; +https://www.cseel.org)"
    }
    req = urllib.request.Request(endpoint_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            code = resp.getcode()
            print(f"  [SUCCESS] {service_name} returned HTTP {code}")
            return True
    except Exception as e:
        print(f"  [WARN] {service_name} ping response: {e}")
        return False

def ping_google():
    print("\n--- PINGING GOOGLE SITEMAP ENDPOINTS ---")
    for sm in SITEMAPS:
        encoded = urllib.parse.quote(sm, safe='')
        url = f"https://www.google.com/ping?sitemap={encoded}"
        print(f"Pinging Google for: {sm}")
        ping_url("Google", url)
        time.sleep(0.3)

def ping_bing():
    print("\n--- PINGING BING SITEMAP ENDPOINTS ---")
    for sm in SITEMAPS:
        encoded = urllib.parse.quote(sm, safe='')
        url = f"https://www.bing.com/ping?sitemap={encoded}"
        print(f"Pinging Bing for: {sm}")
        ping_url("Bing", url)
        time.sleep(0.3)

def ping_indexnow():
    print("\n--- BROADCASTING TO INDEXNOW (Bing, Yandex, Naver, Seznam) ---")
    endpoint = "https://api.indexnow.org/indexnow"
    payload = {
        "host": "www.cseel.org",
        "key": "cseel2026seosearchrankingkey001",
        "keyLocation": "https://www.cseel.org/cseel2026seosearchrankingkey001.txt",
        "urlList": SITEMAPS[:10] + [
            "https://www.cseel.org/edu-network/teachers",
            "https://www.cseel.org/schools",
            "https://www.cseel.org/materials",
            "https://www.cseel.org/composite-lab",
            "https://www.cseel.org/steam-lab",
            "https://www.cseel.org/makerspace",
            "https://www.cseel.org/domain/science",
            "https://www.cseel.org/domain/engineering",
            "https://www.cseel.org/domain/art"
        ]
    }
    data = json.dumps(payload).encode('utf-8')
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "CSEEL-IndexNow-Broadcaster/1.0"
    }
    req = urllib.request.Request(endpoint, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            print(f"  [SUCCESS] IndexNow returned HTTP {resp.getcode()} (Accepted for rapid re-crawl)")
    except Exception as e:
        print(f"  [INFO] IndexNow ping status: {e}")

def main():
    print("=" * 70)
    print("CSEEL SEARCH ENGINE PING & SITEMAP BROADCASTER (2026)")
    print("=" * 70)
    ping_google()
    ping_bing()
    ping_indexnow()
    print("\n[DONE] All search engines notified.")

if __name__ == "__main__":
    main()
