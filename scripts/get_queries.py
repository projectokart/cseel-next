import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import time

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
RESOURCE = "https://www.cseel.org/"

def open_full_report():
    opt = uc.ChromeOptions()
    opt.add_argument(f"--user-data-dir={PROFILE_DIR}")
    opt.add_argument("--window-size=1440,900")

    driver = uc.Chrome(options=opt, version_main=153)
    driver.get(f"https://search.google.com/search-console?resource_id={RESOURCE}")
    time.sleep(6)

    # Click 'Full report >' link directly
    buttons = driver.find_elements(By.XPATH, "//*[contains(text(), 'Full report')]")
    if buttons:
        driver.execute_script("arguments[0].click();", buttons[0])
        time.sleep(6)
        driver.save_screenshot("sc_full_performance.png")
        
        # Scroll down to capture Top Queries and Clicks
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(3)
        driver.save_screenshot("sc_top_queries.png")
        print("Performance and Queries captured successfully!")
    else:
        print("Full report button not found directly.")

    driver.quit()

if __name__ == "__main__":
    open_full_report()
