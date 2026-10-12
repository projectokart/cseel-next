"""
scripts/gemini_browser_strict_generator.py

Generates experiment images one-by-one with 100% strict matching:
1. For each experiment, opens a clean chat (https://gemini.google.com/app).
2. Sends the tailored prompt.
3. Waits for the generated image element and download button.
4. Downloads the image into a clean temp folder.
5. Verifies download size and saves directly as:
   public/images/experiments/<slug>.jpg
6. Cleans temp before next prompt.
"""

import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os
import sys
import glob
import shutil

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
TARGET_DIR = r"D:\Projects\cseel_next\cseel-next\public\images\experiments"
TEMP_DL = r"D:\Projects\cseel_next\cseel-next\temp_strict_dl"

os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(TEMP_DL, exist_ok=True)

DL_SELECTOR = "button[aria-label*='Download full size image'], button[aria-label*='Download'], a[aria-label*='Download']"

# 27 experiments missing images with exact prompts
PROMPTS = {
    # Physics (1)
    "faradays-law-electromagnetic-induction-coil": "Generate an ultra-realistic 8k physics laboratory photograph of Faraday's Law of Electromagnetic Induction. A clear cylindrical copper solenoid coil wound with insulated copper wire placed on a wooden lab bench. An Alnico permanent bar magnet with distinct red North and blue South poles being pushed into the solenoid core. Two wires lead from the coil terminals directly into an analog center-zero galvanometer with its needle deflecting. Authentic Indian science lab setting, 16:9 aspect ratio.",

    # Chemistry (8)
    "qualitative-salt-analysis-cation-anion": "Generate an ultra-realistic 8k chemistry lab photograph of systematic qualitative salt analysis: a glass test tube held in a brass test tube holder containing golden yellow sparkling spangles of Lead Iodide precipitate swirling in hot clear liquid, with reagent drop bottles on a lab wooden rack in background, 16:9 aspect ratio.",

    "preparation-standard-oxalic-acid-solution": "Generate an ultra-realistic 8k photograph of an analytical chemistry standard solution setup: a sparkling 250mL Pyrex volumetric measuring flask with a glass stopper filled with colorless solution to the etched line, next to a watch glass with white crystalline oxalic acid dihydrate on a digital analytical balance, 16:9 aspect ratio.",

    "ph-determination-universal-indicator-solutions": "Generate an ultra-realistic 8k macro photograph of a 12-cavity white porcelain spot plate displaying a vibrant pH spectrum with universal indicator: red for pH 1 acid, yellow, green for pH 7 neutral, blue, and deep purple for pH 12 alkaline, alongside colored pH paper indicator test strips, 16:9 aspect ratio.",

    "reaction-kinetics-sodium-thiosulfate-hcl": "Generate an ultra-realistic 8k chemistry kinetics experiment photograph: 5 Erlenmeyer flasks arranged side by side on white filter paper marked with bold black crosses (+), demonstrating colloidal sulfur precipitation from clear to milky yellow where the black cross disappears, with a digital laboratory stopwatch, 16:9 aspect ratio.",

    "paper-chromatography-plant-pigments": "Generate an ultra-realistic 8k macro photograph of Whatman paper chromatography strip suspended inside a tall glass developing jar: distinct separated plant pigment bands visible clearly from bottom to top: green chlorophyll b, blue-green chlorophyll a, yellow xanthophyll, and vivid orange-yellow carotene, 16:9 aspect ratio.",

    "preparation-colloidal-sol-tyndall-effect": "Generate an ultra-realistic 8k dark laboratory photograph demonstrating the Tyndall effect: a bright red 650nm laser beam passing invisibly through a beaker of pure distilled water on the left, but shining as a luminous bright scattering cone through a clear glass beaker of reddish-brown ferric hydroxide colloidal sol on the right, 16:9 aspect ratio.",

    "organic-functional-group-tests": "Generate an ultra-realistic 8k organic chemistry photograph of Tollens' test (Silver Mirror Test): a clean glass test tube whose inner walls are completely coated with a flawless, gleaming, mirror-smooth reflective layer of pure metallic silver, resting in a beaker of warm water, 16:9 aspect ratio.",

    "enthalpy-of-neutralization-calorimetry": "Generate an ultra-realistic 8k physical chemistry thermochemistry photograph: a laboratory Dewar flask calorimeter with an insulated stopper fitted with a sensitive Beckmann 0.1°C precision thermometer and a spiral wire stirrer, alongside measuring cylinders of hydrochloric acid and sodium hydroxide, 16:9 aspect ratio.",

    # Biology (9)
    "mitosis-onion-root-tip-squash": "Generate an ultra-realistic 8k biological photomicrograph (1000x oil immersion) of onion root tip meristem squash cells: vivid pink-magenta acetocarmine staining showing distinct mitotic stages: prophase, metaphase equatorial plate, anaphase chromatid separation, and telophase cell plate formation, 16:9 aspect ratio.",

    "osmosis-potato-osmoscope-demonstration": "Generate an ultra-realistic 8k biology experiment macro photograph of a potato osmoscope: a peeled, flat-bottomed potato tuber cavity filled with red eosin-colored 20% sucrose solution placed in a glass Petri dish containing clear pure water, showing the red liquid level risen high above the indicator pin, 16:9 aspect ratio.",

    "transpiration-rate-ganongs-potometer": "Generate an ultra-realistic 8k botanical laboratory photograph of Ganong's Potometer: a healthy green leafy Coleus shoot tightly fitted with rubber cork into a glass water reservoir tube, with a single sharp air bubble visible inside the graduated horizontal capillary tube with millimeter scale, 16:9 aspect ratio.",

    "carbon-dioxide-release-seed-respiration": "Generate an ultra-realistic 8k biology experiment photograph demonstrating respiration in germinating seeds: a sealed conical flask containing sprouting gram seeds with a small test tube of KOH solution suspended inside, connected via a bent glass delivery tube to a beaker of colored water with the meniscus risen up the tube, 16:9 aspect ratio.",

    "photosynthesis-starch-test-iodine": "Generate an ultra-realistic 8k botany experiment photograph of the starch iodine test: a boiled green variegated Money plant leaf lying in a white porcelain tile, stained with brown iodine solution: the chlorophyll areas have turned deep blue-black indicating starch, while non-photosynthetic margins remain yellow-brown, 16:9 aspect ratio.",

    "dna-isolation-plant-material": "Generate an ultra-realistic 8k molecular biology photograph of plant genomic DNA isolation: a clear glass beaker with an ice-cold 95% ethanol overlay, where thick spooled white filamentous mucus-like strands of pure DNA are wound around a sterile glass rod, 16:9 aspect ratio.",

    "human-blood-smear-wbc-identification": "Generate an ultra-realistic 8k medical laboratory hematology photomicrograph of a peripheral human blood smear stained with Leishman's stain: a multi-lobed segmented neutrophil with pink cytoplasm and granules, a round lymphocyte with dark purple nucleus, and numerous biconcave pink erythrocytes, 16:9 aspect ratio.",

    "salivary-amylase-starch-digestion": "Generate an ultra-realistic 8k biochemistry laboratory photograph of salivary amylase action on starch: a 12-well porcelain spot plate with sequential drops of starch-iodine mixture taken at 1-minute intervals, showing color changing from deep blue-black to violet to yellow at the achromic point, 16:9 aspect ratio.",

    "stomata-distribution-density-leaf-epidermis": "Generate an ultra-realistic 8k botanical photomicrograph (400x) of lower epidermis peel of Tradescantia leaf: safranin stained puzzle-like epidermal cells surrounding distinct bean-shaped guard cells flanking open stomatal pores with visible chloroplasts, 16:9 aspect ratio.",

    # Mathematics (9)
    "area-of-circle-sector-partitioning": "Generate an ultra-realistic 8k geometric visual mathematics model photograph: an acrylic circular disc divided into 32 alternating red and yellow radial wedge sectors, rearranged edge-to-edge into an approximate rectangle with length pi*r and width r on a clean grid math workbench, 16:9 aspect ratio.",

    "surface-area-volume-sphere-cone-cylinder": "Generate an ultra-realistic 8k educational mathematics photograph of Archimedes volume ratio models: crystal-clear acrylic hollow cone, sphere, and cylinder of identical radius r and height 2r, filled with bright blue fine sand demonstrating the 1:2:3 volume ratio on a clean studio table, 16:9 aspect ratio.",

    "angle-subtended-by-arc-circle-theorem": "Generate an ultra-realistic 8k geometry demonstration board photograph: a polished wooden circular geometry pegboard with taut colored elastic cords forming a central angle measuring 70 degrees and an inscribed angle subtended at the circumference measuring exactly 35 degrees with an engraved protractor, 16:9 aspect ratio.",

    "circle-tangents-external-point-construction": "Generate an ultra-realistic 8k mathematical drafting photograph of geometric construction: a precise compass-drawn circle on heavy cardstock with two tangent lines drawn from an external point P touching points T1 and T2, verified with steel calipers showing exact equal lengths PT1 = PT2, 16:9 aspect ratio.",

    "basic-proportionality-thales-theorem": "Generate an ultra-realistic 8k mathematics laboratory model photograph verifying Thales Theorem (Basic Proportionality Theorem): an acrylic triangle ABC with a sliding parallel line DE parallel to BC, with engraved millimeter scales showing AD/DB = AE/EC with brass thumbscrews, 16:9 aspect ratio.",

    "sum-of-natural-numbers-staircase-model": "Generate an ultra-realistic 8k visual arithmetic progression model photograph: two identical staircase step models made of interlocking colored wooden cube blocks (55 red cubes and 55 yellow cubes) fitted together to form a 10 by 11 rectangle of 110 cubes, representing n*(n+1)/2, 16:9 aspect ratio.",

    "algebraic-identity-cube-of-binomial-3d": "Generate an ultra-realistic 8k educational studio photograph of the 3D Binomial Cube Montessori mathematical model: 8 colored solid wooden geometric blocks dissecting (a+b)^3 into a^3, 3a^2b, 3ab^2, and b^3, partially assembled inside an open polished hardwood presentation box, 16:9 aspect ratio.",

    "clinometer-trigonometric-height-estimation": "Generate an ultra-realistic 8k outdoor STEM education photograph of trigonometric height estimation: an Indian high school student sighting the top of a school building using a handmade semicircular protractor clinometer with a weighted plumb line and straw, with a surveyor measuring tape along the ground, 16:9 aspect ratio.",

    "galton-board-normal-distribution-binomial": "Generate an ultra-realistic 8k desktop mathematics apparatus photograph of a Galton Board (Quincunx): clear acrylic casing with a triangular grid of brass pins, where hundreds of shiny small steel bearing balls have fallen into vertical collection bins forming a smooth Gaussian normal distribution bell curve, 16:9 aspect ratio."
}

def clear_temp():
    for f in glob.glob(os.path.join(TEMP_DL, "*")):
        try:
            os.remove(f)
        except Exception:
            pass

def wait_for_download(timeout=18):
    for _ in range(timeout * 2):
        time.sleep(0.5)
        files = [f for f in os.listdir(TEMP_DL) if not f.endswith(".crdownload") and not f.endswith(".tmp")]
        if files:
            file_path = os.path.join(TEMP_DL, files[0])
            if os.path.getsize(file_path) > 50000:  # Valid image > 50KB
                time.sleep(0.5)
                return file_path
    return None

def main():
    print("=" * 65)
    print("STRICT ONE-BY-ONE GEMINI EXPERIMENT IMAGE GENERATOR")
    print(f"Target Directory: {TARGET_DIR}")
    print(f"Temp Download:   {TEMP_DL}")
    print("=" * 65)

    pending = []
    for slug, prompt in PROMPTS.items():
        out_file = os.path.join(TARGET_DIR, f"{slug}.jpg")
        if not os.path.exists(out_file):
            pending.append((slug, prompt))
        else:
            print(f"[ALREADY VERIFIED] {slug}.jpg")

    print(f"\nRemaining to generate: {len(pending)}")
    if not pending:
        print("All experiment images are already present!")
        return

    options = uc.ChromeOptions()
    options.add_argument(f"--user-data-dir={PROFILE_DIR}")
    options.add_argument("--window-size=1400,950")

    driver = uc.Chrome(options=options, version_main=153)
    driver.execute_cdp_cmd("Page.setDownloadBehavior", {
        "behavior": "allow",
        "downloadPath": TEMP_DL
    })

    success = 0
    failed = 0

    for idx, (slug, prompt_text) in enumerate(pending):
        target_file = os.path.join(TARGET_DIR, f"{slug}.jpg")
        print(f"\n[{idx + 1}/{len(pending)}] Starting: {slug}")
        clear_temp()

        try:
            # 1. Always navigate to clean new chat to ensure 0 crosstalk/mismatch
            driver.get("https://gemini.google.com/app")
            time.sleep(5)

            # 2. Find text input
            text_area = WebDriverWait(driver, 15).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "div.ql-editor, rich-textarea div[contenteditable='true'], textarea"))
            )
            text_area.click()
            time.sleep(0.4)
            text_area.send_keys(prompt_text)
            time.sleep(0.5)

            # 3. Submit prompt
            send_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label*='Send'], button[aria-label*='Submit'], button.send-button"))
            )
            driver.execute_script("arguments[0].click();", send_btn)
            print("  -> Prompt sent. Waiting for generation...")

            # 4. Wait for download button to appear (clean chat has 0 initially)
            downloaded = False
            start_t = time.time()
            while time.time() - start_t < 90:
                time.sleep(2)
                dl_btns = driver.find_elements(By.CSS_SELECTOR, DL_SELECTOR)
                if len(dl_btns) > 0:
                    btn = dl_btns[0]
                    # Check if clickable
                    try:
                        is_disabled = btn.get_attribute("disabled") or ("disabled" in (btn.get_attribute("class") or ""))
                        if not is_disabled:
                            print(f"  -> Generated in {int(time.time() - start_t)}s! Downloading...")
                            driver.execute_script("arguments[0].scrollIntoView(true); arguments[0].click();", btn)
                            
                            raw_file = wait_for_download(12)
                            if not raw_file:
                                # Retry click
                                driver.execute_script("arguments[0].click();", btn)
                                raw_file = wait_for_download(12)

                            if raw_file:
                                shutil.copy2(raw_file, target_file)
                                sz_kb = os.path.getsize(target_file) / 1024
                                print(f"  [SAVED EXACT] {slug}.jpg ({sz_kb:.1f} KB)")
                                success += 1
                                downloaded = True
                                break
                    except Exception as e:
                        pass

            if not downloaded:
                print(f"  [TIMEOUT/SKIPPED] {slug}")
                failed += 1

        except Exception as e:
            print(f"  [ERROR] {slug}: {e}")
            failed += 1

        time.sleep(3)

    print("\n" + "=" * 65)
    print(f"STRICT RUN FINISHED! Success: {success}, Failed: {failed}")
    print("=" * 65)
    driver.quit()

if __name__ == "__main__":
    main()
