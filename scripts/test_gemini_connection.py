import undetected_chromedriver as uc
import time
import os
import sys

profile_dir = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
print(f"Connecting to Chrome profile at: {profile_dir}")

options = uc.ChromeOptions()
options.add_argument(f"--user-data-dir={profile_dir}")
options.add_argument("--window-size=1280,900")

try:
    driver = uc.Chrome(options=options, version_main=153)
    driver.get("https://gemini.google.com/app")
    time.sleep(5)
    print("Page Title:", driver.title)
    print("Current URL:", driver.current_url)

    elements = driver.find_elements("css selector", "rich-textarea, div[contenteditable='true'], textarea")
    print(f"Input elements found: {len(elements)}")
    if len(elements) > 0:
        print("SUCCESS: Logged in and ready for Gemini automation!")
    else:
        print("Notice: May need login or different selector.")
    
    time.sleep(2)
    driver.quit()
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
