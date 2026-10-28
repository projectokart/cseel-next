#!/usr/bin/env python3
"""
CSEEL Google PageSpeed Insights & Core Web Vitals Auditor
=========================================================
Runs automated Lighthouse and Core Web Vitals audits on live URLs
via Google PageSpeed Insights API (v5) using API Key.
"""

import os
import sys
import argparse
import urllib.request
import json

API_KEY = os.environ.get('PAGESPEED_API_KEY', 'AIzaSyCRx0d0z9_de5pXsRjdeArMNloV0hB4l8U')
DEFAULT_URL = 'https://www.cseel.org'


def audit_url(url=DEFAULT_URL, strategy='MOBILE'):
    print(f"\n{'='*70}")
    print(f"[RUNNING] GOOGLE PAGESPEED INSIGHTS AUDIT: {strategy.upper()}")
    print(f"Target URL: {url}")
    print(f"{'='*70}")
    print("[INFO] Fetching Lighthouse metrics from Google servers (takes ~15-20 seconds)...")

    api_url = (
        f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
        f"?url={urllib.parse.quote(url)}"
        f"&strategy={strategy.lower()}"
        f"&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO"
        f"&key={API_KEY}"
    )

    req = urllib.request.Request(api_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            response = json.loads(resp.read().decode('utf-8'))

        lh = response.get('lighthouseResult', {})
        categories = lh.get('categories', {})
        audits = lh.get('audits', {})

        perf_score = int((categories.get('performance', {}).get('score') or 0) * 100)
        a11y_score = int((categories.get('accessibility', {}).get('score') or 0) * 100)
        bp_score = int((categories.get('best-practices', {}).get('score') or 0) * 100)
        seo_score = int((categories.get('seo', {}).get('score') or 0) * 100)

        print("\n--- LIGHTHOUSE SCORES ---")
        print(f"  • Performance:     {perf_score}/100")
        print(f"  • Accessibility:   {a11y_score}/100")
        print(f"  • Best Practices:  {bp_score}/100")
        print(f"  • SEO Score:       {seo_score}/100")

        # Core Web Vitals Metrics
        print("\n--- CORE WEB VITALS METRICS ---")
        fcp = audits.get('first-contentful-paint', {}).get('displayValue', 'N/A')
        lcp = audits.get('largest-contentful-paint', {}).get('displayValue', 'N/A')
        tbt = audits.get('total-blocking-time', {}).get('displayValue', 'N/A')
        cls = audits.get('cumulative-layout-shift', {}).get('displayValue', 'N/A')
        speed_index = audits.get('speed-index', {}).get('displayValue', 'N/A')

        print(f"  • First Contentful Paint (FCP):    {fcp}")
        print(f"  • Largest Contentful Paint (LCP):  {lcp}")
        print(f"  • Total Blocking Time (TBT):       {tbt}")
        print(f"  • Cumulative Layout Shift (CLS):   {cls}")
        print(f"  • Speed Index:                     {speed_index}")

        # Top Opportunities
        print("\n--- TOP PERFORMANCE OPPORTUNITIES ---")
        opp_found = False
        for k, v in audits.items():
            details = v.get('details', {})
            if details.get('type') == 'opportunity' and v.get('score', 1) < 0.9:
                display_val = v.get('displayValue', '')
                if display_val:
                    print(f"  • {v.get('title')}: {display_val}")
                    opp_found = True
        if not opp_found:
            print("  • No major blocking opportunities detected.")

        return {
            'scores': {
                'performance': perf_score,
                'accessibility': a11y_score,
                'best_practices': bp_score,
                'seo': seo_score,
            },
            'cwv': {'fcp': fcp, 'lcp': lcp, 'tbt': tbt, 'cls': cls, 'speed_index': speed_index}
        }

    except Exception as e:
        print(f"[ERROR] Failed to fetch PageSpeed metrics: {e}")
        return None


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run Google PageSpeed Insights Audit')
    parser.add_argument('--url', default=DEFAULT_URL, help='Target URL to audit')
    parser.add_argument('--strategy', default='MOBILE', choices=['MOBILE', 'DESKTOP', 'mobile', 'desktop'])
    args = parser.parse_args()

    audit_url(url=args.url, strategy=args.strategy)
