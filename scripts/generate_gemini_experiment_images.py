"""
scripts/generate_gemini_experiment_images.py

Automates browser Gemini via the user's logged-in profile:
"C:\\Users\\DEVENDER\\Desktop\\Catelog\\chrome_uc_profile"
(opened by C:\\Users\\DEVENDER\\Desktop\\Login_Gemini_Once.bat).

Sends ultra-detailed photographic image generation prompts to Gemini Web,
detects generated output images, downloads and saves them directly to
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
import base64
import requests

PROFILE_DIR = r"C:\Users\DEVENDER\Desktop\Catelog\chrome_uc_profile"
TARGET_DIR = r"D:\Projects\cseel_next\cseel-next\public\images\experiments"
TEMP_DOWNLOADS = r"D:\Projects\cseel_next\cseel-next\temp_gemini_images"

os.makedirs(TARGET_DIR, exist_ok=True)
os.makedirs(TEMP_DOWNLOADS, exist_ok=True)

# 40 Experiments prompt catalog
EXPERIMENTS_TO_GENERATE = [
  {
    "slug": "focal-length-convex-lens-uv-method",
    "prompt": "Create an ultra-realistic 8k studio macro photograph of a high-school physics optical bench setup determining focal length of a convex lens using u-v method. A precision 1.5-meter graduated brass optical bench with dual steel rails, mounted with adjustable upright sliders. In the center, a 50mm double convex optical glass lens held in a polished spring clamp. An illuminated sharp pin on the left and a conjugate inverted real image needle on the right. Dark lab background, ray optics, shallow depth of field, photorealistic educational laboratory photography, 16:9 aspect ratio."
  },
  {
    "slug": "meter-bridge-resistance-combination",
    "prompt": "Create an ultra-realistic 8k studio macro photograph of a Physics Meter Bridge experiment setup on a polished teakwood bench. A 1-meter taut constantan resistance wire over an engraved wooden scale, flanked by thick L-shaped brass terminal strips. In the left gap, a decade resistance box with polished brass plugs. In the right gap, a precision wire coil. A spring-loaded knife-edge jockey resting delicately at the null point (40cm), connected to a sensitive center-zero galvanometer with 30-0-30 divisions. Cinematic warm studio lighting, crisp laboratory instruments, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "acceleration-due-to-gravity-simple-pendulum",
    "prompt": "Create an ultra-realistic 8k macro photograph of a simple pendulum physics experiment. A solid polished spherical brass bob (25mm diameter) suspended from a heavy cast-iron retort stand with split cork clamp by an inextensible fine linen thread. In the foreground, an authentic digital laboratory stopwatch reading 35.90 seconds and a wooden meter scale measuring length L = 80 cm. Subtle oscillation motion blur trail behind the metallic bob, cinematic physics lab setting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "boyles-law-verification-ideal-gas",
    "prompt": "Create an ultra-realistic 8k studio photograph of a classic Boyle's Law apparatus in a physics lab. Vertical graduated borosilicate glass tubes with shiny liquid mercury column levels connected by heavy rubber pressure tubing on a polished silvered brass meter scale. Close-up on the enclosed air column compressing under hydrostatic mercury head pressure. Alongside sits an authentic Fortin mercurial barometer in brass casing. Pristine vintage lab aesthetics, cinematic lighting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "vernier-caliper-screw-gauge-precision-measurement",
    "prompt": "Create an ultra-realistic 8k macro still-life photograph of high-precision metrology tools resting on a clean wooden workbench with graph paper. A stainless steel satin-chrome manual Vernier Caliper measuring a borosilicate glass beaker diameter, and beside it a heavy cast-iron external micrometer screw gauge with knurled ratchet holding a fine copper wire between its carbide anvils. Crisp engraved millimeter and vernier scales, optical reflections, extreme mechanical detail, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "resonance-tube-velocity-of-sound",
    "prompt": "Create an ultra-realistic 8k laboratory photograph of a resonance tube velocity of sound experiment. A vertical 1-meter borosilicate glass cylinder filled with water connected to an adjustable brass reservoir clamp on a wooden stand. Directly above the open tube mouth, a vibrating steel acoustic tuning fork stamped '512 Hz' held horizontally, showing acoustic standing wave ripple patterns on the water meniscus surface. Crisp educational physics aesthetics, cinematic rim lighting, 16:9 aspect ratio."
  },
  {
    "slug": "internal-resistance-primary-cell-potentiometer",
    "prompt": "Create an ultra-realistic 8k photograph of a 10-meter potentiometer physics experiment. A ten-wire wooden potentiometer board with parallel constantan wires and shiny brass corner connector strips. Connected to a traditional glass jar Leclanché primary cell with porous pot and zinc rod, a plug resistance box, and a brass sliding jockey touching the wire. Sensitive center-zero galvanometer with clear needle deflection. Authentic Indian CBSE practical physics lab setup, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "faradays-law-electromagnetic-induction-coil",
    "prompt": "Create an ultra-realistic 8k studio photograph of Faraday's electromagnetic induction experiment. A large cylindrical hollow solenoid coil wound with dense enamelled bright copper wire (500 turns) on a transparent acrylic former. A heavy Alnico permanent bar magnet with distinct painted red North and blue South poles is captured mid-motion plunging into the hollow core, connected to a sensitive center-zero galvanometer with needle swinging sharply. Dramatic rim lighting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "redox-titration-kmno4-mohrs-salt",
    "prompt": "Create an ultra-realistic 8k macro photograph of a redox titration chemistry experiment. A 50mL glass burette clamped to a stand filled with deep violet-purple Potassium Permanganate (KMnO4) solution with Schellbach blue stripe. A single purple drop falls into a 250mL conical flask containing light green Mohr's salt solution, swirling into an ethereal, delicate permanent faint pink color transition over a white porcelain tile. Laboratory glassware, wash bottle, reagent bottles, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "qualitative-salt-analysis-cation-anion",
    "prompt": "Create an ultra-realistic 8k chemistry lab photograph of qualitative salt analysis showing the lead iodide golden spangles test. A borosilicate glass test tube held in a brass test tube clamp; inside, brilliant glittering golden yellow crystalline spangles of Lead Iodide (PbI2) precipitate swirl and sparkle under bright light in clear liquid. In background, test tube rack with colorful reagent dropper bottles (KI, BaCl2, dilute HCl). High clarity, chemical laboratory realism, 16:9 aspect ratio."
  },
  {
    "slug": "preparation-standard-oxalic-acid-solution",
    "prompt": "Create an ultra-realistic 8k photograph of analytical chemistry standard solution preparation. A pristine 250mL volumetric measuring flask with ground glass stopper filled to the exact calibration ring with clear oxalic acid solution. Beside it on a clean marble bench sits a glass watch glass with glittering translucent prismatic oxalic acid dihydrate crystals, a laboratory analytical electronic balance with glass draft shields, and a wash bottle with distilled water. Scientific precision, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "ph-determination-universal-indicator-solutions",
    "prompt": "Create an ultra-realistic 8k macro photograph of universal indicator pH spectrum test. A white glazed porcelain 12-cavity spot plate holding solutions displaying the complete vibrant rainbow pH scale: Scarlet red (pH 1 HCl), Orange (pH 3 vinegar), Yellow (pH 5), Emerald green (pH 7 water), Azure blue (pH 9 bicarbonate), and Deep violet (pH 13 NaOH). Beside the spot plate lie tweezers holding colorful pH test strips and a calibrated color chart comparator. Clean bright laboratory lighting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "reaction-kinetics-sodium-thiosulfate-hcl",
    "prompt": "Create an ultra-realistic 8k chemistry kinetics photograph. Five identical 250mL conical flasks arranged in a row over a white paper sheet marked with bold black crosses (+). The flasks show progressive stages of turbidity: from completely clear water to faint opalescence, to cloudy yellow colloidal sulfur precipitate completely obscuring the black cross mark beneath. Beside them, an authentic digital stopwatch and graduated cylinder. Educational physical chemistry aesthetics, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "paper-chromatography-plant-pigments",
    "prompt": "Create an ultra-realistic 8k macro photograph of a paper chromatography strip resolving spinach leaf photosynthetic pigments. Inside a cylindrical glass developing chamber, a Whatman No. 1 paper strip displays four razor-sharp, distinct separated pigment bands: olive-green chlorophyll b at bottom, blue-green chlorophyll a, golden-yellow xanthophyll, and vivid bright orange carotene near the solvent front. Capillary solvent migration, laboratory glassware, clean scientific aesthetic, 16:9 aspect ratio."
  },
  {
    "slug": "preparation-colloidal-sol-tyndall-effect",
    "prompt": "Create an ultra-realistic 8k photograph demonstrating the Tyndall effect in a darkened chemistry laboratory. Two square optical glass cuvettes sitting side-by-side: left cuvette contains clear 0.1M NaCl solution where a red 650nm laser beam passes through completely invisible; right cuvette contains deep wine-red Ferric Hydroxide Fe(OH)3 colloidal sol where the laser beam creates a brilliant, glowing illuminated red track (Tyndall cone) scattering light sideways. Cinematic dark room physics, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "organic-functional-group-tests",
    "prompt": "Create an ultra-realistic 8k chemistry photograph of Tollens' silver mirror test. A borosilicate glass test tube held in wooden tongs; the inside inner surface of the test tube is completely coated with an authentic, brilliant specular reflective metallic silver mirror reflecting laboratory windows and glassware with mirror perfection. A warm water bath beaker and reagent bottles in the soft background. Clean, breathtaking organic chemistry photography, 16:9 aspect ratio."
  },
  {
    "slug": "enthalpy-of-neutralization-calorimetry",
    "prompt": "Create an ultra-realistic 8k physical chemistry calorimetry photograph. A vacuum-jacketed polished silvered glass Dewar calorimeter flask in a protective wooden case with cork lid. Inserted through the cork are a high-precision 0.1°C graduated thermometer showing temperature rise from 24.2°C to 30.7°C, and a stainless steel wire stirrer loop. Beside it, graduated cylinders of 1.0M HCl and 1.0M NaOH. Professional educational thermodynamics laboratory setup, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "mitosis-onion-root-tip-squash",
    "prompt": "Create an ultra-realistic 8k biological photomicrograph of onion root tip meristem cells undergoing mitosis at 1000x oil immersion magnification. Distinct cells captured in all classical mitotic stages: condensed prophase chromosomes, metaphase equatorial plate alignment with dark violet stained chromatids, anaphase V-shaped chromosomes pulling towards opposite poles, and telophase cell plate formation. Deep acetocarmine magenta staining on crisp cellular background, university biology textbook quality, 16:9 aspect ratio."
  },
  {
    "slug": "osmosis-potato-osmoscope-demonstration",
    "prompt": "Create an ultra-realistic 8k macro photograph of a potato osmoscope demonstrating endo-osmosis in biology. A large peeled potato tuber carved with a central rectangular cavity standing in a glass Petri dish containing clear water. Inside the potato cavity, a concentrated 20% sucrose solution colored with bright red eosin dye has visibly risen high above an initial indicator pin mark. Cut tuber cell texture, glass petri dish reflections, clean educational biological science setup, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "transpiration-rate-ganongs-potometer",
    "prompt": "Create an ultra-realistic 8k biology laboratory photograph of Ganong's potometer measuring plant transpiration. A fresh leafy shoot of Hibiscus with green leaves sealed airtight into a glass tube reservoir with rubber stopper. Connected horizontally is a precision graduated capillary tube where a single distinct 2mm air bubble is captured traveling across millimeter markings. In background, a small table fan and lamp for environmental testing. Natural botanical laboratory lighting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "carbon-dioxide-release-seed-respiration",
    "prompt": "Create an ultra-realistic 8k biology experiment photograph demonstrating aerobic respiration in germinating seeds. A 250mL conical flask packed with healthy sprouting Bengal gram seeds with emergent white radicles. Suspended inside is a miniature test tube holding clear 20% KOH solution. An airtight single-hole rubber stopper connects a bent glass delivery tube leading into a beaker of colored water, showing colored water pushed several centimeters up the tube due to partial vacuum. Educational science laboratory realism, 16:9 aspect ratio."
  },
  {
    "slug": "photosynthesis-starch-test-iodine",
    "prompt": "Create an ultra-realistic 8k botany photograph of a starch test on a variegated plant leaf. A destarched leaf laid flat in a white porcelain dish after iodine treatment: the central chlorophyll sector is stained an intense, rich blue-black showing abundant starch synthesis, while the masked rectangular stripe and non-photosynthetic white border remain pale yellowish-brown. Water bath, beaker of green extracted chlorophyll in background, crisp botanical laboratory details, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "dna-isolation-plant-material",
    "prompt": "Create an ultra-realistic 8k biotechnology macro photograph of plant genomic DNA isolation. A glass beaker containing mashed banana lysis buffer at bottom, and a clear upper layer of ice-cold 95% ethanol. At the liquid interface, translucent white, cottony viscous fibers of spooled genomic DNA double-helix strands wind visibly around a central glass stirring rod. Mortar and pestle with banana pulp, test tubes, chilled ice bath in background. Cutting-edge high school biology laboratory aesthetic, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "human-blood-smear-wbc-identification",
    "prompt": "Create an ultra-realistic 8k high-magnification photomicrograph (1000x oil immersion) of a human peripheral blood smear stained with Leishman's stain. In the center, a multi-lobed polymorphonuclear Neutrophil with lilac granular cytoplasm, surrounded by biconcave pink Erythrocyte red blood cells and a round dark-blue stained Lymphocyte with high nuclear-to-cytoplasmic ratio. Certified medical hematology slide clarity, vibrant cellular details, 16:9 aspect ratio."
  },
  {
    "slug": "salivary-amylase-starch-digestion",
    "prompt": "Create an ultra-realistic 8k biochemistry photograph of salivary amylase starch digestion kinetics. A white glazed ceramic spot plate showing a time-course series of cavities with Lugol's iodine: transitioning from deep inky blue-black (0 min undigested starch) to reddish-brown erythrodextrin (4 min), to yellowish-brown achroodextrin (6 min), and finally clear pale yellow iodine color at the 8-minute achromic point. Pipette dropper, starch solution, and digital timer in background. Clinical laboratory precision, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "stomata-distribution-density-leaf-epidermis",
    "prompt": "Create an ultra-realistic 8k biological photomicrograph (400x) of leaf epidermis stomata. Transparent puzzle-like epidermal cells interspaced with numerous distinct elliptical stomatal complexes, showing paired kidney-shaped guard cells flanking open stomatal pores with visible chloroplasts inside guard cell cytoplasm. High-contrast Safranin staining on fresh Tradescantia lower peel, botanical microscopy textbook clarity, 16:9 aspect ratio."
  },
  {
    "slug": "area-of-circle-sector-partitioning",
    "prompt": "Create an ultra-realistic 8k architectural math model photograph of circle area formula derivation. An acrylic circle of radius r = 7cm partitioned into 32 equal intermeshing sectors of alternating red and yellow colors, rearranged side-by-side into an approximate flat rectangle with base length equal to pi * r (22cm) and height equal to r (7cm). Millimeter grid paper, brass drafting compass, and technical pencil on polished wooden table. Clean geometric beauty, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "surface-area-volume-sphere-cone-cylinder",
    "prompt": "Create an ultra-realistic 8k photography of transparent acrylic geometric shapes demonstrating Archimedes volume ratio 1:2:3. A hollow right circular cone, a hollow sphere, and a circumscribed cylinder all sharing equal radius r = 5cm and height h = 10cm on a white laboratory table. Fine colored blue sand filled in the shapes proves that 3 cones fill the cylinder and 2 cones fill the sphere. Clean optical refraction in acrylic plastic, mathematical clarity, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "angle-subtended-by-arc-circle-theorem",
    "prompt": "Create an ultra-realistic 8k photograph of a circular geometry wooden pegboard demonstrating the central angle theorem. An engraved circle with center O where colored taut elastic cords connect points A and B to center O forming a central angle of exactly 70 degrees, and cords extending to circumference point P forming an inscribed angle of exactly 35 degrees. A 360-degree rotating brass degree protractor verifies the 2:1 ratio. Aesthetic mathematical woodwork, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "circle-tangents-external-point-construction",
    "prompt": "Create an ultra-realistic 8k photograph of a geometric circle tangent construction. On heavy drafting Bristol board, a drawn circle with center O and an external point P. Two perfectly constructed tangent line segments PT1 and PT2 with precise perpendicular 90-degree radius lines OT1 and OT2 verified by an acrylic set square. Proportional steel divider measuring both tangents proving PT1 = PT2 = 12cm. Professional engineering drafting aesthetics, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "basic-proportionality-thales-theorem",
    "prompt": "Create an ultra-realistic 8k photograph of Thales basic proportionality theorem geometric model. A triangle ABC with line DE drawn strictly parallel to base BC using twin sliding set squares. Engraved millimeter rulers along sides AB and AC verify that segment ratio AD/DB equals AE/EC (0.600 = 0.600). Polished wooden model board, fine drafting instruments, crisp mathematical typography, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "sum-of-natural-numbers-staircase-model",
    "prompt": "Create an ultra-realistic 8k photography of a tactile wooden arithmetic progression staircase model. Two identical stepped staircases made of 55 red unit cubes and 55 yellow unit cubes (columns from 1 to 10) interlocking upside-down seamlessly into a single 10 by 11 rectangle of 110 cubes, visually proving that sum 1+2+...+n = n(n+1)/2 = 55. Clean natural wood grain, architectural tabletop studio setting, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "algebraic-identity-cube-of-binomial-3d",
    "prompt": "Create an ultra-realistic 8k studio photograph of a Montessori wooden Binomial Cube (a + b)^3 puzzle. Dissected into its 8 colored polished beechwood blocks: 1 large red cube a^3 (5x5x5cm), 3 black prisms with yellow faces 3a^2b, 3 black prisms with blue faces 3ab^2, and 1 small blue cube b^3 (2x2x2cm), partially assembled inside its wooden box with side (a+b) = 7cm. High-end educational tactile geometry, photorealistic, 16:9 aspect ratio."
  },
  {
    "slug": "clinometer-trigonometric-height-estimation",
    "prompt": "Create an ultra-realistic 8k outdoor mathematics photograph of trigonometric height measurement. A student holding a handmade optical clinometer made with a semi-circular protractor, sighting tube straw, and a weighted brass plumb line suspended at 38 degrees elevation angle, sighting the top of a tall campus flagpole. In the foreground on grass lies a 30-meter fiberglass surveyor's tape measure (distance d = 10m). Bright natural morning sunlight, photorealistic educational math, 16:9 aspect ratio."
  },
  {
    "slug": "galton-board-normal-distribution-binomial",
    "prompt": "Create an ultra-realistic 8k photograph of a desktop Galton Board (Quincunx) physics-math apparatus. A vertical transparent acrylic board with a triangular lattice of 10 rows of shiny brass pegs. 1,000 tiny polished chrome steel ball bearings cascade down the pegs and collect into 11 bottom vertical channels, naturally forming a perfect smooth Gaussian normal distribution bell curve. Gleaming metallic reflections, scientific tabletop aesthetics, photorealistic, 16:9 aspect ratio."
  }
]

def main():
    print("=" * 60)
    print("GEMINI BROWSER AUTOMATION IMAGE GENERATOR")
    print(f"Profile: {PROFILE_DIR}")
    print(f"Target: {TARGET_DIR}")
    print("=" * 60)

    # Check already existing generated images
    pending = []
    for item in EXPERIMENTS_TO_GENERATE:
        dest_path = os.path.join(TARGET_DIR, f"{item['slug']}.jpg")
        if not os.path.exists(dest_path):
            pending.append(item)
        else:
            print(f"[EXISTS] {item['slug']}.jpg")

    print(f"Total experiments to generate: {len(pending)} / {len(EXPERIMENTS_TO_GENERATE)}")
    if not pending:
        print("All experiment images already exist! Done.")
        return

    # Start Chrome with user's profile
    options = uc.ChromeOptions()
    options.add_argument(f"--user-data-dir={PROFILE_DIR}")
    options.add_argument("--window-size=1280,900")
    
    # Configure download directory to TEMP_DOWNLOADS
    prefs = {
        "download.default_directory": TEMP_DOWNLOADS,
        "download.prompt_for_download": False,
        "download.directory_upgrade": True,
        "safebrowsing.enabled": True
    }
    options.add_experimental_option("prefs", prefs)

    print("Launching Chrome Browser with Gemini Profile...")
    driver = uc.Chrome(options=options, version_main=153)
    driver.get("https://gemini.google.com/app")
    time.sleep(5)

    print("Checking Gemini input box...")
    try:
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "rich-textarea, div[contenteditable='true'], textarea"))
        )
        print("Gemini interface loaded successfully!")
    except Exception as e:
        print(f"Could not find input box: {e}")
        driver.quit()
        return

    for idx, item in enumerate(pending):
        slug = item["slug"]
        prompt_text = item["prompt"]
        dest_file = os.path.join(TARGET_DIR, f"{slug}.jpg")
        print(f"\n--- [{idx + 1}/{len(pending)}] Generating image for: {slug} ---")

        try:
            # Click New Chat if available to keep prompt context clean
            try:
                new_chat_btn = driver.find_elements(By.CSS_SELECTOR, "a[aria-label*='New chat'], button[aria-label*='New chat'], a.side-nav-sparkle-button")
                if new_chat_btn:
                    driver.execute_script("arguments[0].click();", new_chat_btn[0])
                    time.sleep(2)
            except Exception:
                pass

            # Find textarea
            text_area = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "div.ql-editor, rich-textarea div[contenteditable='true'], textarea"))
            )
            text_area.click()
            time.sleep(0.3)
            
            # Send prompt
            text_area.send_keys(prompt_text)
            time.sleep(0.8)

            # Send button
            send_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label*='Send'], button[aria-label*='Submit'], button.send-button"))
            )
            driver.execute_script("arguments[0].click();", send_btn)
            print("Prompt sent! Waiting for Gemini Imagen output...")

            # Wait for generated image in chat
            # Generated images in Gemini have img tags with specific containers or generated preview
            found_img_url = None
            start_wait = time.time()
            while time.time() - start_wait < 70:
                time.sleep(3)
                # Look for generated image elements in the response
                imgs = driver.find_elements(By.CSS_SELECTOR, "message-content img, .generated-image-container img, img[alt*='Generated'], img.image-preview")
                for img in imgs:
                    src = img.get_attribute("src") or ""
                    if src.startswith("http") or src.startswith("data:image"):
                        # Ensure it's not user avatar or tiny icon
                        w = img.size.get('width', 0)
                        h = img.size.get('height', 0)
                        if w > 200 or h > 200 or "googleusercontent" in src:
                            found_img_url = src
                            break
                if found_img_url:
                    break

            if found_img_url:
                print(f"Found generated image: {found_img_url[:60]}...")
                # Download image
                if found_img_url.startswith("data:image"):
                    base64_data = found_img_url.split(",")[1]
                    with open(dest_file, "wb") as f:
                        f.write(base64.b64decode(base64_data))
                else:
                    # Download via requests or javascript
                    try:
                        resp = requests.get(found_img_url, timeout=15)
                        if resp.status_code == 200:
                            with open(dest_file, "wb") as f:
                                f.write(resp.content)
                            print(f"[SAVED] {dest_file}")
                        else:
                            print(f"Download failed with code {resp.status_code}")
                    except Exception as err:
                        print(f"Requests error: {err}")
            else:
                print("Notice: No image detected within 70s. Checking for download button or canvas...")
                dl_btns = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Download'], a[aria-label*='Download']")
                if dl_btns:
                    driver.execute_script("arguments[0].click();", dl_btns[-1])
                    time.sleep(3)
                    # Check temp download directory
                    files = glob.glob(os.path.join(TEMP_DOWNLOADS, "*"))
                    if files:
                        latest = max(files, key=os.path.getctime)
                        shutil.move(latest, dest_file)
                        print(f"[SAVED from download button] {dest_file}")

        except Exception as ex:
            print(f"Error generating {slug}: {ex}")

        time.sleep(3)

    print("\nBatch generation cycle finished!")
    driver.quit()

if __name__ == "__main__":
    main()
