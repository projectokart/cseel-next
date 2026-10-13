import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import time
import json
import os

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
RESOURCE = "https://www.cseel.org/"
BASE_URL = f"https://search.google.com/search-console?resource_id={RESOURCE}"

def run_analysis():
    print("Connecting to Google Search Console via Chrome profile...")
    opt = uc.ChromeOptions()
    opt.add_argument(f"--user-data-dir={PROFILE_DIR}")
    opt.add_argument("--window-size=1440,900")

    driver = uc.Chrome(options=opt, version_main=153)
    
    # 1. Performance Overview
    driver.get(f"https://search.google.com/search-console/performance/search-result?resource_id={RESOURCE}")
    time.sleep(6)
    driver.save_screenshot("sc_performance.png")

    # 2. Coverage / Pages Indexing
    driver.get(f"https://search.google.com/search-console/index?resource_id={RESOURCE}")
    time.sleep(6)
    driver.save_screenshot("sc_indexing_pages.png")

    # 3. Sitemaps
    driver.get(f"https://search.google.com/search-console/sitemaps?resource_id={RESOURCE}")
    time.sleep(6)
    driver.save_screenshot("sc_sitemaps.png")

    # 4. Core Web Vitals / HTTPS
    driver.get(f"https://search.google.com/search-console/https?resource_id={RESOURCE}")
    time.sleep(5)
    driver.save_screenshot("sc_https.png")

    print("ALL SCREENSHOTS CAPTURED SUCCESSFULLY!")
    driver.quit()

if __name__ == "__main__":
    run_analysis()
