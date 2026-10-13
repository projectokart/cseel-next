import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
import time

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
RESOURCE = "https://www.cseel.org/"

def open_performance():
    opt = uc.ChromeOptions()
    opt.add_argument(f"--user-data-dir={PROFILE_DIR}")
    opt.add_argument("--window-size=1440,900")

    driver = uc.Chrome(options=opt, version_main=153)
    driver.get(f"https://search.google.com/search-console?resource_id={RESOURCE}")
    time.sleep(6)

    # Click the Performance dropdown/menu item on the left
    items = driver.find_elements(By.XPATH, "//a[contains(@href, 'performance')] | //div[@role='treeitem'][contains(., 'Performance')]")
    if items:
        driver.execute_script("arguments[0].click();", items[0])
        time.sleep(6)
        print("URL after click:", driver.current_url)
        driver.save_screenshot("sc_perf_page.png")
        driver.execute_script("window.scrollBy(0, 500);")
        time.sleep(2)
        driver.save_screenshot("sc_perf_queries_table.png")
    else:
        print("No performance treeitem found.")

    driver.quit()

if __name__ == "__main__":
    open_performance()
