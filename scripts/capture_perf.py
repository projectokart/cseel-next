import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
RESOURCE = "https://www.cseel.org/"

def capture_performance():
    opt = uc.ChromeOptions()
    opt.add_argument(f"--user-data-dir={PROFILE_DIR}")
    opt.add_argument("--window-size=1440,900")

    driver = uc.Chrome(options=opt, version_main=153)
    driver.get(f"https://search.google.com/search-console?resource_id={RESOURCE}")
    time.sleep(5)

    # Click Performance in the sidebar menu
    perf_link = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//div[contains(text(), 'Performance') or contains(., 'Search results')]"))
    )
    driver.execute_script("arguments[0].click();", perf_link)
    time.sleep(6)
    driver.save_screenshot("sc_performance_clean.png")

    # Scroll down to capture Top Queries and Top Pages
    driver.execute_script("window.scrollBy(0, 650);")
    time.sleep(2)
    driver.save_screenshot("sc_performance_queries.png")

    print("Performance screenshots captured!")
    driver.quit()

if __name__ == "__main__":
    capture_performance()
