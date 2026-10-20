import os
from playwright.sync_api import sync_playwright
from PIL import Image

ASSETS_DIR = r"d:\Projects\cseel_next\cseel-next\public\email_assets\school_template"
DOWNLOADS_DIR = r"C:\Users\DEVENDER\Downloads\files"

SVGS = {}

SIDE_CURVES = ""

# ===========================================================================
# 1. error-02-not-found (No Website Exists / Missing on Google Search)
# ===========================================================================
SVGS["error-02-not-found"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Light blue circle with Magnifying Glass -->
  <circle cx="394" cy="58" r="28" fill="#a8c7fa"/>
  <circle cx="391" cy="55" r="9" fill="none" stroke="#202124" stroke-width="3"/>
  <path d="M398 62 l9 9" stroke="#202124" stroke-width="3" stroke-linecap="round"/>

  <!-- Central Browser Window -->
  <rect x="150" y="34" width="220" height="190" rx="16" fill="#fff" stroke="#202124" stroke-width="3"/>
  <path d="M150 70 H370" stroke="#202124" stroke-width="3"/>
  <circle cx="170" cy="52" r="4.5" fill="#ea4335"/>
  <circle cx="186" cy="52" r="4.5" fill="#fbbc04"/>
  <circle cx="202" cy="52" r="4.5" fill="#34a853"/>
  
  <!-- Search query pill in address bar with Google 'G' -->
  <rect x="218" y="44" width="138" height="18" rx="9" fill="#f1f3f4"/>
  <circle cx="228" cy="53" r="5" fill="#4285f4"/>
  <text x="238" y="56" font-size="8.5" font-weight="500" fill="#5f6368">google.com/search</text>

  <!-- Inside Browser: Dotted empty frame for missing site -->
  <rect x="172" y="86" width="176" height="118" rx="12" fill="#f8fafd" stroke="#bdc1c6" stroke-width="2" stroke-dasharray="6 4"/>

  <!-- Big Red Question Mark in Center -->
  <circle cx="260" cy="132" r="28" fill="#fce8e6"/>
  <circle cx="260" cy="132" r="18" fill="#fff" stroke="#202124" stroke-width="2.6"/>
  <text x="260" y="139" font-size="20" font-weight="700" fill="#ea4335" text-anchor="middle">?</text>

  <!-- Clear text notice inside empty browser: "No Website Found" -->
  <rect x="200" y="170" width="120" height="20" rx="10" fill="#fce8e6"/>
  <text x="260" y="183.5" font-size="9.5" font-weight="700" fill="#c5221f" text-anchor="middle">&#9888; 0 Websites Found</text>

  <!-- Top Left Satellite: Blue circle with Graduation Cap -->
  <circle cx="132" cy="95" r="26" fill="#1a73e8"/>
  <path d="M116 93 L132 85 L148 93 L132 101Z" fill="#ffffff"/>
  <path d="M123 98 v7 q9 6 18 0 v-7" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M148 93 v10" stroke="#fbbc04" stroke-width="2.6" stroke-linecap="round"/>

  <!-- Bottom Left Satellite: Red alert card with "No Portal" -->
  <rect x="94" y="160" width="76" height="66" rx="14" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <circle cx="132" cy="182" r="13" fill="#fce8e6"/>
  <path d="M126 176 l12 12 M138 176 l-12 12" stroke="#c5221f" stroke-width="2.8" stroke-linecap="round"/>
  <text x="132" y="213" font-size="9" font-weight="700" fill="#c5221f" text-anchor="middle">No Portal</text>

  <!-- Bottom Right Satellite: School house in green card with "CBSE" -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M384 186 l14 -10 l14 10z" fill="#34a853" stroke="#202124" stroke-width="2.4" stroke-linejoin="round"/>
  <rect x="388" y="186" width="20" height="16" fill="#fff" stroke="#202124" stroke-width="2.4"/>
  <rect x="394" y="192" width="8" height="10" fill="#1a73e8"/>
  <text x="398" y="218" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">CBSE Norms</text>
</svg>"""

# ===========================================================================
# 2. error-03-social-only (Social Media Only vs Official Portal)
# ===========================================================================
SVGS["error-03-social-only"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <defs>
    <clipPath id="social-screen"><rect x="198" y="11" width="124" height="238" rx="19"/></clipPath>
  </defs>
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Light blue circle with Globe icon -->
  <circle cx="378" cy="58" r="28" fill="#a8c7fa"/>
  <circle cx="378" cy="58" r="12" fill="none" stroke="#202124" stroke-width="2.8"/>
  <ellipse cx="378" cy="58" rx="5" ry="12" fill="none" stroke="#202124" stroke-width="2.4"/>
  <path d="M366 58 h24" stroke="#202124" stroke-width="2.4"/>

  <!-- Central Smartphone -->
  <rect x="195" y="8" width="130" height="244" rx="22" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <g clip-path="url(#social-screen)">
    <!-- Top notch -->
    <rect x="237" y="16" width="46" height="9" rx="4.5" fill="#202124"/>
    
    <!-- Profile bar: Facebook blue circle + name lines -->
    <circle cx="214" cy="46" r="9" fill="#1877f2"/>
    <text x="214" y="50" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">f</text>
    <text x="228" y="47" font-size="8.5" font-weight="700" fill="#202124">School Page</text>
    <text x="228" y="55" font-size="7" font-weight="500" fill="#5f6368">Social Media</text>

    <!-- Social Photo Post Card with PERFECT Heart -->
    <rect x="203" y="66" width="114" height="80" rx="10" fill="#fce8e6"/>
    <path d="M260 112 c-12 -14 -20 -20 -20 -27 a10 10 0 0 1 17 -6.5 l3 3 l3 -3 a10 10 0 0 1 17 6.5 c0 7 -8 13 -20 27 z" fill="#ea4335"/>
    <text x="260" y="132" font-size="7.5" font-weight="600" fill="#c5221f" text-anchor="middle">Daily Photos Only</text>

    <!-- Social engagement dots -->
    <circle cx="214" cy="156" r="4" fill="#ea4335"/>
    <circle cx="225" cy="156" r="4" fill="#1877f2"/>
    <text x="235" y="159" font-size="7.5" font-weight="500" fill="#5f6368">148 likes</text>

    <!-- Sponsored Competitor Ad Card inside Feed -->
    <rect x="203" y="168" width="114" height="64" rx="8" fill="#fef7e0" stroke="#fbbc04" stroke-width="1.8"/>
    <text x="211" y="180" font-size="7.5" font-weight="700" fill="#b06000">&#9888; SPONSORED AD</text>
    <text x="211" y="191" font-size="8" font-weight="500" fill="#5f6368">Other schools targeting</text>
    <rect x="211" y="199" width="98" height="18" rx="9" fill="#ea4335"/>
    <text x="260" y="211.5" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">ADMISSIONS OPEN</text>
  </g>

  <!-- Top Left Satellite: Blue Notification Bell circle -->
  <circle cx="150" cy="80" r="24" fill="#1a73e8"/>
  <path d="M142 84 h16 c0 0 -2 -2 -2 -7 v-4 a6 6 0 0 0 -12 0 v4 c0 5 -2 7 -2 7z" fill="#ffffff"/>
  <circle cx="150" cy="88" r="2" fill="#ffffff"/>

  <!-- Bottom Left Satellite: Clean Red '✕' No Official Domain Card -->
  <rect x="92" y="160" width="78" height="66" rx="14" fill="#fff" stroke="#202124" stroke-width="3"/>
  <circle cx="131" cy="182" r="13" fill="#fce8e6"/>
  <path d="M125 176 l12 12 M137 176 l-12 12" stroke="#c5221f" stroke-width="2.8" stroke-linecap="round"/>
  <text x="131" y="213" font-size="9" font-weight="700" fill="#c5221f" text-anchor="middle">No .edu / .org</text>

  <!-- Bottom Right Satellite: Verified Green Check Badge -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M386 189 l8 8 l16 -16" fill="none" stroke="#34a853" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="398" y="218" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">Official Portal</text>
</svg>"""

# ===========================================================================
# 3. error-04-no-ssl (Unsecure HTTP / Not Secure Warning)
# ===========================================================================
SVGS["error-04-no-ssl"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Light Blue Chrome Shield -->
  <circle cx="394" cy="58" r="28" fill="#a8c7fa"/>
  <path d="M394 44 l16 6 v12 c0 12 -16 18 -16 18 s-16 -6 -16 -18 v-12z" fill="#ffffff" stroke="#202124" stroke-width="2.4"/>
  <circle cx="394" cy="58" r="4" fill="#1a73e8"/>

  <!-- Central Browser Window -->
  <rect x="150" y="34" width="220" height="190" rx="16" fill="#fff" stroke="#202124" stroke-width="3"/>
  <path d="M150 70 H370" stroke="#202124" stroke-width="3"/>
  <circle cx="170" cy="52" r="4.5" fill="#ea4335"/>
  <circle cx="186" cy="52" r="4.5" fill="#fbbc04"/>
  <circle cx="202" cy="52" r="4.5" fill="#34a853"/>
  
  <!-- Red "Not Secure" Address Bar with crisp readable text -->
  <rect x="216" y="44" width="142" height="18" rx="9" fill="#fce8e6" stroke="#ea4335" stroke-width="1.8"/>
  <path d="M226 50 v-3 a3 3 0 0 1 6 0 v1" fill="none" stroke="#c5221f" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="224" y="50" width="8" height="6" rx="1.5" fill="#c5221f"/>
  <text x="236" y="56.5" font-size="8.5" font-weight="700" fill="#c5221f">Not Secure | http://</text>

  <!-- Big Red Open Padlock in Center -->
  <circle cx="260" cy="128" r="34" fill="#fce8e6"/>
  <circle cx="260" cy="128" r="24" fill="#fff" stroke="#202124" stroke-width="2.6"/>
  <rect x="248" y="123" width="24" height="18" rx="4" fill="#ea4335"/>
  <circle cx="260" cy="130" r="2" fill="#ffffff"/>
  <path d="M260 132 v3" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
  <!-- Swung open shackle -->
  <path d="M252 123 v-7 a8 8 0 0 1 16 0 v2" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round"/>

  <!-- Warning text message below padlock -->
  <rect x="180" y="174" width="160" height="22" rx="11" fill="#fce8e6"/>
  <text x="260" y="188.5" font-size="9" font-weight="700" fill="#c5221f" text-anchor="middle">&#9888; Connection Not Private</text>

  <!-- Top Left Satellite: Red Alert Circle with Exclamation -->
  <circle cx="132" cy="95" r="26" fill="#ea4335"/>
  <path d="M132 83 v14" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
  <circle cx="132" cy="105" r="2.8" fill="#ffffff"/>

  <!-- Bottom Left Satellite: Yellow Caution Triangle Card -->
  <rect x="94" y="160" width="76" height="66" rx="14" fill="#fff" stroke="#202124" stroke-width="3"/>
  <polygon points="132,170 148,198 116,198" fill="#fef7e0" stroke="#fbbc04" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M132 178 v9" stroke="#b06000" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="132" cy="192" r="1.4" fill="#b06000"/>
  <text x="132" y="214" font-size="9" font-weight="700" fill="#b06000" text-anchor="middle">SSL Missing</text>

  <!-- Bottom Right Satellite: Green HTTPS Shield Upgrade -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M398 174 l14 5 v10 c0 10 -14 15 -14 15 s-14 -5 -14 -15 v-10z" fill="#34a853"/>
  <path d="M393 189 l3 3 l7 -7" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
  <text x="398" y="218" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">HTTPS 100%</text>
</svg>"""

# ===========================================================================
# 4. error-05-single-page (Single Static Page vs Multi-Page Portal)
# ===========================================================================
SVGS["error-05-single-page"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Light Blue Virtual 360 circle -->
  <circle cx="394" cy="58" r="28" fill="#a8c7fa"/>
  <ellipse cx="394" cy="58" rx="14" ry="7" fill="none" stroke="#202124" stroke-width="2.6"/>
  <text x="394" y="61.5" font-size="8.5" font-weight="700" fill="#202124" text-anchor="middle">360&deg;</text>

  <!-- Left: Cramped 1-Page Static Site (Old) -->
  <g transform="translate(125, 42)">
    <rect x="0" y="0" width="96" height="174" rx="12" fill="#ffffff" stroke="#9aa0a6" stroke-width="2.6"/>
    <rect x="10" y="12" width="76" height="12" rx="4" fill="#dadce0"/>
    <text x="48" y="21" font-size="7.5" font-weight="700" fill="#5f6368" text-anchor="middle">Static Page</text>
    <rect x="10" y="30" width="76" height="26" rx="4" fill="#e8eaed"/>
    <rect x="10" y="62" width="76" height="6" rx="3" fill="#bdc1c6"/>
    <rect x="10" y="74" width="54" height="6" rx="3" fill="#bdc1c6"/>
    <rect x="10" y="86" width="68" height="6" rx="3" fill="#bdc1c6"/>
    
    <!-- Red bottom limit box: "1 Page Only" -->
    <rect x="10" y="126" width="76" height="28" rx="6" fill="#fce8e6" stroke="#ea4335" stroke-width="1.8"/>
    <text x="48" y="143" font-size="8.5" font-weight="700" fill="#c5221f" text-anchor="middle">&#10005; 1 Page Only</text>
  </g>

  <!-- Big Transformation Arrow in Center -->
  <g transform="translate(236, 114)">
    <circle cx="24" cy="16" r="20" fill="#e8f0fe" stroke="#1a73e8" stroke-width="2.6"/>
    <path d="M15 16 h18 M27 11 l5 5 l-5 5" fill="none" stroke="#1a73e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Right: Modern Multi-Page Layered Portal -->
  <g transform="translate(296, 32)">
    <!-- Back page 2: Yellow card -->
    <rect x="22" y="0" width="122" height="186" rx="12" fill="#fef7e0" stroke="#202124" stroke-width="2.4"/>
    <!-- Back page 1: Green card -->
    <rect x="11" y="8" width="122" height="186" rx="12" fill="#e6f4ea" stroke="#202124" stroke-width="2.6"/>
    <!-- Front page: White main card -->
    <rect x="0" y="16" width="124" height="186" rx="12" fill="#ffffff" stroke="#202124" stroke-width="3"/>
    
    <!-- 3 Nav Tabs with readable labels -->
    <rect x="8" y="28" width="34" height="12" rx="6" fill="#1a73e8"/>
    <text x="25" y="37" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle">About</text>

    <rect x="46" y="28" width="34" height="12" rx="6" fill="#e6f4ea"/>
    <text x="63" y="37" font-size="6.5" font-weight="700" fill="#137333" text-anchor="middle">Admit</text>

    <rect x="84" y="28" width="32" height="12" rx="6" fill="#fef7e0"/>
    <text x="100" y="37" font-size="6.5" font-weight="700" fill="#b06000" text-anchor="middle">CBSE</text>

    <!-- Hero banner with 360 tour -->
    <rect x="8" y="46" width="108" height="48" rx="8" fill="#a8c7fa"/>
    <circle cx="62" cy="70" r="13" fill="#ffffff" stroke="#1a73e8" stroke-width="2"/>
    <text x="62" y="73.5" font-size="7.5" font-weight="700" fill="#1a73e8" text-anchor="middle">360&deg; Tour</text>

    <!-- 2 Content Blocks -->
    <rect x="8" y="100" width="50" height="38" rx="6" fill="#f8fafd" stroke="#dadce0" stroke-width="1.6"/>
    <text x="33" y="122" font-size="7.5" font-weight="600" fill="#5f6368" text-anchor="middle">Faculty</text>

    <rect x="66" y="100" width="50" height="38" rx="6" fill="#f8fafd" stroke="#dadce0" stroke-width="1.6"/>
    <text x="91" y="122" font-size="7.5" font-weight="600" fill="#5f6368" text-anchor="middle">Gallery</text>
    
    <!-- Green Live Check Badge at bottom -->
    <rect x="8" y="148" width="108" height="28" rx="8" fill="#e6f4ea" stroke="#137333" stroke-width="1.6"/>
    <text x="44" y="165" font-size="8.5" font-weight="700" fill="#137333" text-anchor="middle">&check; CBSE Portal</text>
  </g>

  <!-- Top Left Satellite: Red circle with document alert -->
  <circle cx="100" cy="78" r="22" fill="#ea4335"/>
  <text x="100" y="85" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">1p</text>

  <!-- Bottom Left Satellite: Stacked Books -->
  <rect x="80" y="174" width="36" height="12" rx="3" fill="#4285f4" stroke="#202124" stroke-width="2"/>
  <rect x="78" y="160" width="38" height="12" rx="3" fill="#ea4335" stroke="#202124" stroke-width="2"/>
  <rect x="80" y="146" width="34" height="12" rx="3" fill="#34a853" stroke="#202124" stroke-width="2"/>

  <!-- Bottom Right Satellite: Verified Green School Badge -->
  <rect x="366" y="170" width="66" height="60" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M386 193 l6 6 l14 -14" fill="none" stroke="#34a853" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="399" y="218" font-size="8.5" font-weight="700" fill="#137333" text-anchor="middle">Multi-Page</text>
</svg>"""

# ===========================================================================
# 5. error-06-slow-updates (Slow Agency Tickets vs 30-Min Rapid Updates)
# ===========================================================================
SVGS["error-06-slow-updates"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <defs>
    <clipPath id="wa-screen"><rect x="198" y="11" width="124" height="238" rx="19"/></clipPath>
  </defs>
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Green Rocket Launch Circle -->
  <circle cx="388" cy="64" r="28" fill="#a8d5b5"/>
  <path d="M388 48 c4 0 10 6 10 16 l-4 4 l-3 -3 l-3 3 l3 3 l-4 4 c-10 0 -16 -6 -16 -10 c0 -8 9 -17 17 -17z" fill="#202124"/>
  <circle cx="391" cy="56" r="2.5" fill="#ffffff"/>

  <!-- Central Smartphone (WhatsApp 30-Min Rapid Updates) -->
  <rect x="195" y="8" width="130" height="244" rx="22" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <g clip-path="url(#wa-screen)">
    <!-- Top notch -->
    <rect x="237" y="16" width="46" height="9" rx="4.5" fill="#202124"/>
    
    <!-- WhatsApp Green Header Bar -->
    <rect x="203" y="32" width="114" height="30" rx="8" fill="#25d366"/>
    <circle cx="218" cy="47" r="8" fill="#ffffff"/>
    <path d="M216 43 q3 0 5 5 l-1.5 1.5 q-1.5 0 -3 -1.5 q-1.5 -1.5 -1.5 -3z" fill="#25d366"/>
    <text x="232" y="51" font-size="9" font-weight="700" fill="#ffffff">WhatsApp Direct</text>

    <!-- Circular PDF Upload Chat Bubble -->
    <rect x="203" y="72" width="114" height="54" rx="8" fill="#e6f4ea" stroke="#81c995" stroke-width="1.8"/>
    <!-- Red PDF File Icon -->
    <rect x="211" y="80" width="22" height="28" rx="4" fill="#ea4335"/>
    <text x="222" y="97" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">PDF</text>
    <text x="240" y="90" font-size="8" font-weight="700" fill="#1f1f1f">Circular.pdf</text>
    <text x="240" y="100" font-size="7" font-weight="500" fill="#137333">Upload Now &rarr;</text>

    <!-- Downward Publishing Arrow -->
    <path d="M260 136 v12 M255 142 l5 6 l5 -6" stroke="#25d366" stroke-width="2.6" stroke-linecap="round"/>

    <!-- Live in 30 Mins Result Box -->
    <rect x="203" y="158" width="114" height="42" rx="10" fill="#e6f4ea" stroke="#137333" stroke-width="2"/>
    <circle cx="218" cy="179" r="7" fill="#137333"/>
    <path d="M215 179 l2 2 l4 -4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>
    <text x="230" y="176" font-size="8.5" font-weight="700" fill="#137333">Live in 30 Mins</text>
    <text x="230" y="186" font-size="7" font-weight="500" fill="#5f6368">Instant Publishing</text>
  </g>

  <!-- Top Left Satellite: Yellow Lightning Speed Circle -->
  <circle cx="140" cy="76" r="26" fill="#fef7e0" stroke="#fbbc04" stroke-width="2.4"/>
  <path d="M142 58 l-8 15 h8 l-3 14 l11 -17 h-8z" fill="#fbbc04" stroke="#202124" stroke-width="1.8" stroke-linejoin="round"/>

  <!-- Bottom Left Satellite: Slow Agency Ticket Clock Card -->
  <rect x="92" y="154" width="76" height="74" rx="14" fill="#fff" stroke="#202124" stroke-width="3"/>
  <rect x="100" y="162" width="60" height="14" rx="4" fill="#fce8e6"/>
  <text x="130" y="172.5" font-size="7.5" font-weight="700" fill="#c5221f" text-anchor="middle">Agency Delay</text>
  <circle cx="130" cy="196" r="15" fill="#f8f9fa" stroke="#202124" stroke-width="2"/>
  <path d="M130 187 v9 l6 4" stroke="#ea4335" stroke-width="2.4" stroke-linecap="round"/>
  <text x="130" y="220" font-size="7.5" font-weight="600" fill="#5f6368" text-anchor="middle">5-7 Days wait</text>

  <!-- Bottom Right Satellite: Verified Green Check Badge -->
  <rect x="360" y="166" width="74" height="64" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M384 191 l6 6 l14 -14" fill="none" stroke="#34a853" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="397" y="218" font-size="8.5" font-weight="700" fill="#137333" text-anchor="middle">30-Min SLA</text>
</svg>"""

# ===========================================================================
# 6. cbse-compliance (Section: CBSE Mandatory Public Disclosure)
# ===========================================================================
SVGS["cbse-compliance"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Gold Star Circle -->
  <circle cx="388" cy="64" r="28" fill="#fef7e0" stroke="#fbbc04" stroke-width="2.4"/>
  <path d="M388 48 l4 10 l11 1 l-8 8 l2 11 l-9 -5 l-9 5 l2 -11 l-8 -8 l11 -1z" fill="#fbbc04"/>

  <!-- Center: CBSE Compliance Certificate Card -->
  <rect x="155" y="30" width="210" height="200" rx="16" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  
  <!-- Header with blue badge & line -->
  <rect x="175" y="44" width="170" height="30" rx="8" fill="#e8f0fe"/>
  <circle cx="195" cy="59" r="10" fill="#1a73e8"/>
  <path d="M191 59 l3 3 l6 -6" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
  <text x="260" y="63.5" font-size="10.5" font-weight="700" fill="#1a73e8" text-anchor="middle">CBSE COMPLIANCE</text>

  <!-- 3 Checkpoints inside certificate -->
  <g transform="translate(175, 88)">
    <circle cx="10" cy="10" r="9" fill="#e6f4ea"/>
    <path d="M6 10 l3 3 l6 -6" stroke="#137333" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <text x="26" y="14" font-size="9.5" font-weight="600" fill="#202124">Public Disclosure</text>
  </g>
  <g transform="translate(175, 118)">
    <circle cx="10" cy="10" r="9" fill="#e6f4ea"/>
    <path d="M6 10 l3 3 l6 -6" stroke="#137333" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <text x="26" y="14" font-size="9.5" font-weight="600" fill="#202124">Fee Structure &amp; NOC</text>
  </g>
  <g transform="translate(175, 148)">
    <circle cx="10" cy="10" r="9" fill="#e6f4ea"/>
    <path d="M6 10 l3 3 l6 -6" stroke="#137333" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <text x="26" y="14" font-size="9.5" font-weight="600" fill="#202124">Faculty &amp; Fire Safety</text>
  </g>

  <!-- Verified Stamp Seal Bottom Center -->
  <circle cx="260" cy="194" r="18" fill="#e6f4ea" stroke="#137333" stroke-width="2.6"/>
  <text x="260" y="198" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">&check; 100%</text>

  <!-- Top Left Satellite: Blue Ribbon Certificate Circle -->
  <circle cx="132" cy="80" r="26" fill="#1a73e8"/>
  <circle cx="132" cy="76" r="10" fill="#ffffff"/>
  <path d="M128 84 l-4 12 l8 -3 l8 3 l-4 -12" fill="#ffffff"/>

  <!-- Bottom Left Satellite: Green Trust Shield Card -->
  <rect x="94" y="160" width="76" height="66" rx="14" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <path d="M132 172 l14 5 v9 c0 10 -14 14 -14 14 s-14 -4 -14 -14 v-9z" fill="#34a853"/>
  <path d="M127 185 l3 3 l7 -7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
  <text x="132" y="214" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">Audit Proof</text>

  <!-- Bottom Right Satellite: School House in Green Card -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <path d="M384 186 l14 -10 l14 10z" fill="#34a853" stroke="#202124" stroke-width="2.4" stroke-linejoin="round"/>
  <rect x="388" y="186" width="20" height="16" fill="#fff" stroke="#202124" stroke-width="2.4"/>
  <rect x="394" y="192" width="8" height="10" fill="#1a73e8"/>
  <text x="398" y="218" font-size="8.5" font-weight="700" fill="#137333" text-anchor="middle">Bye-Laws Ready</text>
</svg>"""

# ===========================================================================
# 7. virtual-tour-360 (Section: 360° Virtual Campus Tour)
# ===========================================================================
SVGS["virtual-tour-360"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Light Blue 360 Globe Circle -->
  <circle cx="394" cy="58" r="28" fill="#a8c7fa"/>
  <circle cx="394" cy="58" r="12" fill="none" stroke="#202124" stroke-width="2.8"/>
  <ellipse cx="394" cy="58" rx="5" ry="12" fill="none" stroke="#202124" stroke-width="2.4"/>
  <path d="M382 58 h24" stroke="#202124" stroke-width="2.4"/>

  <!-- Central Desktop Monitor on Stand -->
  <rect x="150" y="28" width="220" height="145" rx="14" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <!-- Screen landscape view -->
  <rect x="160" y="38" width="200" height="125" rx="8" fill="#e8f0fe"/>
  <path d="M160 115 q55 -28 100 -6 q50 22 100 -12 v66 h-200z" fill="#a8d5b5"/>
  <!-- School building inside monitor -->
  <rect x="235" y="70" width="50" height="34" rx="4" fill="#ffffff" stroke="#202124" stroke-width="2"/>
  <polygon points="230,70 260,52 290,70" fill="#ea4335" stroke="#202124" stroke-width="2"/>
  <rect x="254" y="86" width="12" height="18" fill="#e8eaed" stroke="#202124" stroke-width="1.6"/>
  <circle cx="260" cy="65" r="4" fill="#fbbc04"/>

  <!-- Dotted 360 rotating orbit -->
  <ellipse cx="260" cy="116" rx="52" ry="17" fill="none" stroke="#1a73e8" stroke-width="3" stroke-dasharray="7 5"/>
  <polygon points="312,114 317,122 308,120" fill="#1a73e8"/>
  <polygon points="208,118 203,110 212,112" fill="#1a73e8"/>

  <!-- Pure Center 360 Sphere Badge with clean 360 text -->
  <circle cx="260" cy="116" r="18" fill="#1a73e8"/>
  <text x="260" y="121" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">360&deg;</text>

  <!-- Monitor stand & base -->
  <path d="M250 173 h20 v20 h-20z" fill="#bdc1c6" stroke="#202124" stroke-width="3"/>
  <rect x="228" y="193" width="64" height="8" rx="4" fill="#202124"/>

  <!-- Top Left Satellite: Blue Camera Eye Circle -->
  <circle cx="132" cy="80" r="26" fill="#1a73e8"/>
  <circle cx="132" cy="80" r="12" fill="#ffffff"/>
  <circle cx="132" cy="80" r="6" fill="#1a73e8"/>

  <!-- Bottom Left Satellite: VR Headset Card -->
  <rect x="94" y="156" width="76" height="66" rx="14" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <rect x="108" y="168" width="48" height="26" rx="8" fill="#a8c7fa" stroke="#202124" stroke-width="2.2"/>
  <circle cx="122" cy="181" r="5" fill="#ffffff"/>
  <circle cx="142" cy="181" r="5" fill="#ffffff"/>
  <text x="132" y="211" font-size="8.5" font-weight="700" fill="#1a73e8" text-anchor="middle">Virtual Tour</text>

  <!-- Bottom Right Satellite: Growth Arrow Card -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#ffffff" stroke="#202124" stroke-width="3"/>
  <circle cx="398" cy="186" r="15" fill="#e6f4ea"/>
  <path d="M388 191 l6 -7 l5 5 l8 -9" fill="none" stroke="#137333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M402 180 h5 v5" fill="none" stroke="#137333" stroke-width="3" stroke-linecap="round"/>
  <text x="398" y="218" font-size="8.5" font-weight="700" fill="#137333" text-anchor="middle">+40% Leads</text>
</svg>"""

# ===========================================================================
# 8. zero-risk-guarantee (Section: Work First, Pay Later)
# ===========================================================================
SVGS["zero-risk-guarantee"] = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
  <style>
    text {{ font-family: 'Google Sans', Roboto, -apple-system, Arial, sans-serif; -webkit-font-smoothing: antialiased; }}
  </style>
{SIDE_CURVES}
  <!-- Top Right Satellite: Mint Green Star of Excellence Circle -->
  <circle cx="390" cy="66" r="28" fill="#a8d5b5"/>
  <path d="M390 52 l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1z" fill="#202124"/>

  <!-- Central Shield of Trust -->
  <g transform="translate(195, 18)">
    <path d="M65 6 l58 22 v48 c0 48 -58 72 -58 72 s-58 -24 -58 -72 v-48z" fill="#ffffff" stroke="#202124" stroke-width="3"/>
    <path d="M65 18 l46 18 v40 c0 38 -46 58 -46 58 s-46 -20 -46 -58 v-40z" fill="#e6f4ea"/>
    
    <!-- Big Bold Green Checkmark -->
    <path d="M44 72 l15 15 l30 -32" fill="none" stroke="#137333" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Bottom Ribbon Pill: WORK FIRST • PAY LATER with crisp readable text -->
    <rect x="-24" y="152" width="178" height="34" rx="17" fill="#1a73e8" stroke="#202124" stroke-width="2.6"/>
    <circle cx="-6" cy="169" r="6" fill="#fbbc04"/>
    <text x="68" y="173.5" font-size="10.5" font-weight="700" fill="#ffffff" text-anchor="middle">WORK FIRST &bull; PAY LATER</text>
  </g>

  <!-- Top Left Satellite: Gold Coin Circle (₹0) -->
  <circle cx="140" cy="86" r="28" fill="#fef7e0" stroke="#fbbc04" stroke-width="2.4"/>
  <text x="140" y="96" font-size="22" font-weight="700" fill="#b06000" text-anchor="middle">&#8377;0</text>

  <!-- Bottom Left Satellite: 3D Stack of Golden Coins + "Zero Advance" -->
  <g transform="translate(0, -6)">
    <ellipse cx="128" cy="208" rx="32" ry="10" fill="#fbbc04" stroke="#202124" stroke-width="2.8"/>
    <path d="M96 208 v-12 a32 10 0 0 1 64 0 v12" fill="#fbbc04" stroke="#202124" stroke-width="2.8"/>
    <ellipse cx="128" cy="196" rx="32" ry="10" fill="#fdd663" stroke="#202124" stroke-width="2.8"/>
    <path d="M96 196 v-12 a32 10 0 0 1 64 0 v12" fill="#fdd663" stroke="#202124" stroke-width="2.8"/>
    <ellipse cx="128" cy="184" rx="32" ry="10" fill="#fde293" stroke="#202124" stroke-width="2.8"/>
    <text x="128" y="232" font-size="9" font-weight="700" fill="#b06000" text-anchor="middle">Zero Advance</text>
  </g>

  <!-- Bottom Right Satellite: Green Locked Padlock Card -->
  <rect x="360" y="164" width="76" height="66" rx="14" fill="#e6f4ea" stroke="#202124" stroke-width="3"/>
  <rect x="384" y="176" width="28" height="22" rx="5" fill="#34a853"/>
  <circle cx="398" cy="185" r="2.5" fill="#ffffff"/>
  <path d="M398 187 v3" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <path d="M389 176 v-7 a9 9 0 0 1 18 0 v7" fill="none" stroke="#202124" stroke-width="2.8" stroke-linecap="round"/>
  <text x="398" y="218" font-size="9" font-weight="700" fill="#137333" text-anchor="middle">100% Risk Free</text>
</svg>"""

print(f"Generating and rendering {len(SVGS)} refined Google-style SVGs with crisp text...")

os.makedirs(ASSETS_DIR, exist_ok=True)
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, svg_content in SVGS.items():
        svg_asset_path = os.path.join(ASSETS_DIR, f"{name}.svg")
        svg_down_path = os.path.join(DOWNLOADS_DIR, f"{name}.svg")
        with open(svg_asset_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        with open(svg_down_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
            
        png_asset_path = os.path.join(ASSETS_DIR, f"{name}.png")
        png_down_path = os.path.join(DOWNLOADS_DIR, f"{name}.png")
        
        page = browser.new_page(viewport={"width": 520, "height": 260}, device_scale_factor=2)
        page.set_content(f"""<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; background:transparent;">
{svg_content}
</body>
</html>""")
        png_bytes = page.screenshot(omit_background=True)
        with open(png_asset_path, "wb") as f:
            f.write(png_bytes)
        with open(png_down_path, "wb") as f:
            f.write(png_bytes)
        page.close()
        print(f"Successfully generated and rendered {name}.png")

    browser.close()

# Generate 4x3 collage of all 12 illustrations at high-res 1040x520
files = [
    'hero-offline.png', 'error-02-not-found.png', 'error-03-social-only.png',
    'error-04-no-ssl.png', 'error-05-single-page.png', 'error-06-slow-updates.png',
    'restore-live.png', 'agency-cost.png', 'direct-benefits.png',
    'cbse-compliance.png', 'virtual-tour-360.png', 'zero-risk-guarantee.png'
]

w, h = 1040, 520
grid_w, grid_h = 3, 4
collage = Image.new('RGB', (w * grid_w, h * grid_h), (255, 255, 255))

for i, fn in enumerate(files):
    img_path = os.path.join(ASSETS_DIR, fn)
    if os.path.exists(img_path):
        im = Image.open(img_path).convert('RGBA')
        if im.size != (w, h):
            im = im.resize((w, h), Image.Resampling.LANCZOS)
        bg = Image.new('RGBA', im.size, (255, 255, 255))
        bg.paste(im, (0, 0), im)
        col = i % grid_w
        row = i // grid_w
        collage.paste(bg.convert('RGB'), (col * w, row * h))

out_path = r'C:\Users\DEVENDER\.gemini\antigravity\brain\2dd31d9b-3f2c-4247-9319-6d3e04e1b616\all_illustrations_preview.png'
collage.save(out_path)
print("Updated high-res collage saved to", out_path)
