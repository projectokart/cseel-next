"""
scripts/gemini_browser_auto_generator.py

Automates image generation directly inside Gemini Web browser using your saved profile:
C:\\Users\\DEVENDER\\Desktop\\Catelog\\chrome_uc_profile

Uses CDP to capture downloaded images and copies them to:
public/images/experiments/<slug>.jpg
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
TEMP_DL = r"D:\Projects\cseel_next\cseel-next\temp_gemini_dl"

os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(TEMP_DL, exist_ok=True)

DL_SELECTOR = "button[aria-label*='Download full size image'], button[aria-label*='Download'], a[aria-label*='Download']"

PROMPTS = {
    "boyles-law-verification-ideal-gas": "Generate an ultra-realistic 8k studio macro photograph of a Boyle's Law physics apparatus. Graduated vertical glass tubes with mercury column levels on a silvered brass millimeter scale, with rubber connecting tubing and Fortin barometer on a wooden stand. High scientific clarity, 16:9 aspect ratio.",
    
    "vernier-caliper-screw-gauge-precision-measurement": "Generate an ultra-realistic 8k macro photograph of metrology instruments on a lab table: a stainless steel manual Vernier Caliper and a precision micrometer screw gauge holding a thin wire, with sharp engraved millimeter markings and graph paper background, 16:9 aspect ratio.",
    
    "resonance-tube-velocity-of-sound": "Generate an ultra-realistic 8k physics photograph of a resonance tube velocity of sound experiment. A vertical water tube with brass reservoir clamp, and an acoustic steel tuning fork stamped 512 Hz vibrating over the tube opening with gentle surface water ripples, 16:9 aspect ratio.",
    
    "internal-resistance-primary-cell-potentiometer": "Generate an ultra-realistic 8k photograph of a 10-meter wire potentiometer board connected to a Leclanche cell jar, a brass sliding jockey, and a center-zero galvanometer in a physics lab, 16:9 aspect ratio.",
    
    "faradays-law-electromagnetic-induction-coil": "Generate an ultra-realistic 8k photograph of Faraday's law electromagnetic induction. A cylindrical copper solenoid coil with an Alnico permanent bar magnet entering the core, connected to a center-zero galvanometer swinging sharply, 16:9 aspect ratio.",
    
    "qualitative-salt-analysis-cation-anion": "Generate an ultra-realistic 8k chemistry lab photograph of a test tube in a clamp containing golden yellow sparkling spangles of Lead Iodide precipitate swirling in liquid, with reagent bottles in the background, 16:9 aspect ratio.",
    
    "preparation-standard-oxalic-acid-solution": "Generate an ultra-realistic 8k photograph of an analytical chemistry standard flask: 250mL volumetric measuring flask with ground glass stopper and sparkling oxalic acid crystals on a watch glass with an analytical balance, 16:9 aspect ratio.",
    
    "ph-determination-universal-indicator-solutions": "Generate an ultra-realistic 8k macro photograph of a white porcelain spot plate displaying rainbow universal indicator colors: red, orange, green, blue, and deep violet with pH test paper strips, 16:9 aspect ratio.",
    
    "reaction-kinetics-sodium-thiosulfate-hcl": "Generate an ultra-realistic 8k photograph of 5 conical flasks over black cross marks on paper showing progressive sulfur precipitation from clear to cloudy yellow with a digital stopwatch, 16:9 aspect ratio.",
    
    "paper-chromatography-plant-pigments": "Generate an ultra-realistic 8k macro photograph of a paper chromatography strip inside a glass cylinder chamber showing 4 separated bands: green chlorophyll b, green chlorophyll a, yellow xanthophyll, and orange carotene, 16:9 aspect ratio.",
    
    "preparation-colloidal-sol-tyndall-effect": "Generate an ultra-realistic 8k dark lab photograph demonstrating the Tyndall effect: a red laser passing invisibly through clear water but glowing as a bright luminous beam through a red ferric hydroxide colloidal sol, 16:9 aspect ratio.",
    
    "organic-functional-group-tests": "Generate an ultra-realistic 8k photograph of Tollens' silver mirror test in organic chemistry: a glass test tube completely coated inside with a gleaming mirror-smooth metallic silver mirror reflecting lab glassware, 16:9 aspect ratio.",
    
    "enthalpy-of-neutralization-calorimetry": "Generate an ultra-realistic 8k physical chemistry calorimetry photograph: a vacuum-jacketed Dewar flask calorimeter with a 0.1°C precision thermometer and wire stirrer, alongside acid and base solutions, 16:9 aspect ratio.",
    
    "mitosis-onion-root-tip-squash": "Generate an ultra-realistic 8k biological photomicrograph (1000x oil immersion) of onion root tip cells showing prophase, metaphase, anaphase, and telophase with magenta acetocarmine chromosome staining, 16:9 aspect ratio.",
    
    "osmosis-potato-osmoscope-demonstration": "Generate an ultra-realistic 8k macro photograph of a potato osmoscope: a carved potato tuber in a water petri dish with red colored sucrose solution risen high above an indicator pin mark, 16:9 aspect ratio.",
    
    "transpiration-rate-ganongs-potometer": "Generate an ultra-realistic 8k botany experiment photograph of Ganong's potometer with a green leafy shoot and a distinct air bubble in a graduated horizontal capillary tube with an electric fan in background, 16:9 aspect ratio.",
    
    "carbon-dioxide-release-seed-respiration": "Generate an ultra-realistic 8k biology experiment photograph of germinating seeds in a sealed conical flask with a suspended KOH tube and colored water rising in a bent delivery tube, 16:9 aspect ratio.",
    
    "photosynthesis-starch-test-iodine": "Generate an ultra-realistic 8k photograph of a starch iodine test on a plant leaf: the sun-exposed center turns deep blue-black while masked stripes remain pale brown, on a white porcelain dish, 16:9 aspect ratio.",
    
    "dna-isolation-plant-material": "Generate an ultra-realistic 8k macro photograph of plant DNA isolation: translucent white fibers of spooled genomic DNA winding around a glass stirring rod at an ice-cold ethanol interface in a beaker, 16:9 aspect ratio.",
    
    "human-blood-smear-wbc-identification": "Generate an ultra-realistic 8k hematology photomicrograph of a human blood smear stained with Leishman's stain, showing a multi-lobed Neutrophil, round Lymphocyte, and biconcave red blood cells, 16:9 aspect ratio.",
    
    "salivary-amylase-starch-digestion": "Generate an ultra-realistic 8k biochemistry photograph of salivary amylase starch digestion: porcelain spot plate showing color progression from blue-black to yellow at the achromic point, 16:9 aspect ratio.",
    
    "stomata-distribution-density-leaf-epidermis": "Generate an ultra-realistic 8k botanical photomicrograph (400x) of plant leaf epidermis showing puzzle-shaped epidermal cells and open kidney-shaped guard cells flanking stomatal pores, 16:9 aspect ratio.",
    
    "area-of-circle-sector-partitioning": "Generate an ultra-realistic 8k geometric model photograph: an acrylic circle divided into 32 alternating red and yellow sectors rearranged into a flat rectangle with drafting compass and ruler, 16:9 aspect ratio.",
    
    "surface-area-volume-sphere-cone-cylinder": "Generate an ultra-realistic 8k photograph of transparent acrylic cone, sphere, and cylinder models proving Archimedes 1:2:3 volume ratio with fine blue sand, 16:9 aspect ratio.",
    
    "angle-subtended-by-arc-circle-theorem": "Generate an ultra-realistic 8k photograph of a circular geometry pegboard with taut cords showing central angle 70 degrees and inscribed angle 35 degrees with a degree protractor, 16:9 aspect ratio.",
    
    "circle-tangents-external-point-construction": "Generate an ultra-realistic 8k engineering drafting photograph of tangent construction from an external point to a circle, verified with dividers and set squares, 16:9 aspect ratio.",
    
    "basic-proportionality-thales-theorem": "Generate an ultra-realistic 8k photograph of Thales basic proportionality theorem geometric model with a triangle and parallel sliding line with engraved millimeter rulers, 16:9 aspect ratio.",
    
    "sum-of-natural-numbers-staircase-model": "Generate an ultra-realistic 8k photograph of an arithmetic progression staircase model with 55 red and 55 yellow unit wooden blocks interlocking into a 10 by 11 rectangle, 16:9 aspect ratio.",
    
    "algebraic-identity-cube-of-binomial-3d": "Generate an ultra-realistic 8k studio photograph of a Montessori wooden Binomial Cube (a+b)^3 dissected into 8 colored wooden blocks in a wooden box, 16:9 aspect ratio.",
    
    "clinometer-trigonometric-height-estimation": "Generate an ultra-realistic 8k outdoor mathematics photograph of a student using a protractor sighting clinometer with a plumb line to measure a tall flagpole with surveyor tape measure, 16:9 aspect ratio.",
    
    "galton-board-normal-distribution-binomial": "Generate an ultra-realistic 8k photograph of a desktop acrylic Galton Board with chrome steel balls cascading down brass pegs into channels forming a normal bell curve, 16:9 aspect ratio."
}

def clear_temp():
    for f in glob.glob(os.path.join(TEMP_DL, "*")):
        try:
            os.remove(f)
        except Exception:
            pass

def wait_for_download(timeout=15):
    for _ in range(timeout * 2):
        time.sleep(0.5)
        files = [f for f in os.listdir(TEMP_DL) if not f.endswith(".crdownload") and not f.endswith(".tmp")]
        if files:
            time.sleep(0.5)
            return os.path.join(TEMP_DL, files[0])
    return None

def main():
    print("=" * 60)
    print("STARTING GEMINI BROWSER IMAGE GENERATOR")
    print(f"Profile: {PROFILE_DIR}")
    print(f"Target: {TARGET_DIR}")
    print("=" * 60)

    # Filter pending
    pending = []
    for slug, prompt in PROMPTS.items():
        out_file = os.path.join(TARGET_DIR, f"{slug}.jpg")
        if not os.path.exists(out_file):
            pending.append((slug, prompt))
        else:
            print(f"[EXISTS] {slug}.jpg")

    print(f"Pending to generate: {len(pending)}")
    if not pending:
        print("All experiment images already generated!")
        return

    options = uc.ChromeOptions()
    options.add_argument(f"--user-data-dir={PROFILE_DIR}")
    options.add_argument("--start-maximized")

    driver = uc.Chrome(options=options, version_main=153)
    driver.execute_cdp_cmd("Page.setDownloadBehavior", {
        "behavior": "allow",
        "downloadPath": TEMP_DL
    })

    print("Opening Gemini App in Chrome...")
    driver.get("https://gemini.google.com/app")
    time.sleep(6)

    success_count = 0
    fail_count = 0

    for idx, (slug, prompt_text) in enumerate(pending):
        target_file = os.path.join(TARGET_DIR, f"{slug}.jpg")
        print(f"\n[{idx + 1}/{len(pending)}] Generating: {slug}...")
        clear_temp()

        try:
            # Count existing download buttons
            existing_btns = driver.find_elements(By.CSS_SELECTOR, DL_SELECTOR)
            prev_btn_count = len(existing_btns)

            # Find prompt text area
            text_area = WebDriverWait(driver, 15).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "div.ql-editor, rich-textarea div[contenteditable='true'], textarea"))
            )
            text_area.click()
            time.sleep(0.3)
            text_area.send_keys(prompt_text)
            time.sleep(0.5)

            # Send prompt
            send_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label*='Send'], button[aria-label*='Submit'], button.send-button"))
            )
            driver.execute_script("arguments[0].click();", send_btn)
            print("  Prompt sent! Waiting for image generation...")

            # Wait for generation & download button
            downloaded = False
            start_time = time.time()
            while time.time() - start_time < 80:
                time.sleep(2)
                dl_btns = driver.find_elements(By.CSS_SELECTOR, DL_SELECTOR)
                if len(dl_btns) > prev_btn_count:
                    target_btn = dl_btns[-1]
                    is_disabled = target_btn.get_attribute("disabled") or ("disabled" in (target_btn.get_attribute("class") or ""))
                    if not is_disabled:
                        elapsed = int(time.time() - start_time)
                        print(f"  Generated in {elapsed}s! Clicking download...")
                        driver.execute_script("arguments[0].scrollIntoView(true); arguments[0].click();", target_btn)
                        
                        raw_dl = wait_for_download(10)
                        if not raw_dl:
                            driver.execute_script("arguments[0].click();", target_btn)
                            raw_dl = wait_for_download(12)

                        if raw_dl:
                            shutil.copy2(raw_dl, target_file)
                            print(f"  [SUCCESS SAVED] {slug}.jpg ({os.path.getsize(target_file)/1024:.1f} KB)")
                            success_count += 1
                            downloaded = True
                            break

            if not downloaded:
                print(f"  [SKIPPED] {slug} (timed out or no direct download button)")
                fail_count += 1

        except Exception as e:
            print(f"  [ERROR] {slug}: {e}")
            fail_count += 1

        time.sleep(3)

    print("\n" + "=" * 60)
    print(f"ALL DONE! Succeeded: {success_count}, Failed: {fail_count}")
    print("=" * 60)
    driver.quit()

if __name__ == "__main__":
    main()
