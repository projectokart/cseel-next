import json
import re

with open('items60_raw.json', 'r', encoding='utf-8') as f:
    items60 = json.load(f)

with open('items90_raw.json', 'r', encoding='utf-8') as f:
    items90 = json.load(f)

print(f'Total items: 60={len(items60)}, 90={len(items90)}')

cleaned_items = []

# Map of standard educational applications by category / keywords
def get_application(name, cat, pkg):
    nl = name.lower()
    cl = cat.lower()
    if 'arduino' in nl or 'microcontroller' in nl or 'atmega' in nl:
        return 'Core embedded computing, sensor data acquisition, logic programming'
    if 'raspberry pi' in nl:
        return 'Advanced edge computing, Python coding, Linux OS, camera AI computer vision'
    if 'breadboard' in nl or 'general purpose' in nl or 'berg' in nl:
        return 'Solderless circuit prototyping, breakout testing, rapid electronic wiring'
    if 'resistor' in nl or 'capacitor' in nl or 'diode' in nl or 'transistor' in nl:
        return 'Fundamental passive electronics, current limiting, filtering, switching circuits'
    if 'lcd' in nl or 'display' in nl or 'led matrix' in nl or '7 segment' in nl:
        return 'Visual alphanumeric and graphic data output, student telemetry displays'
    if 'bluetooth' in nl or 'wifi' in nl or 'esp' in nl or 'node mcu' in nl or 'rf' in nl or 'gsm' in nl or 'gps' in nl:
        return 'Wireless IoT communications, cloud telemetry, geo-tracking, smart automation'
    if 'ultrasonic' in nl or 'pir' in nl or 'sensor' in nl or 'ldr' in nl or 'humidity' in nl:
        return 'Environmental perception, distance measurement, automated trigger systems'
    if 'servo' in nl or 'motor' in nl or 'stepper' in nl or 'driver' in nl:
        return 'Robotics actuation, robotic arm articulation, rover mobility, precise angle control'
    if 'drone' in nl:
        return 'Aeromodelling, flight dynamics, quadcopter stabilization, aerial robotics'
    if 'diy kit' in nl or 'construction' in nl:
        return 'Hands-on mechanical assemblies, linkage mechanisms, STEM challenge projects'
    if '3d printer' in nl or 'filament' in nl:
        return 'Digital additive manufacturing, CAD prototyping, custom robotic chassis printing'
    if 'hacksaw' in nl or 'pliers' in nl or 'hammer' in nl or 'clamp' in nl or 'spanner' in nl or 'wrench' in nl or 'file' in nl:
        return 'Structural shaping, cutting, mechanical assembly, material fabrication'
    if 'drill' in nl:
        return 'Precision hole boring in plastic, wood, acrylic, and light metal workpieces'
    if 'soldering' in nl or 'heat gun' in nl:
        return 'Permanent wire jointing, PCB component assembly, heat shrink insulation'
    if 'glue gun' in nl or 'glue stick' in nl:
        return 'Rapid mechanical adhesion, structural mockups, model prototyping'
    if 'multimeter' in nl or 'oscilloscope' in nl or 'calliper' in nl or 'tape' in nl or 'rule' in nl:
        return 'Scientific measurement, waveform analysis, precision dimensional verification'
    if 'telescope' in nl:
        return 'Astronomy, celestial observation, optical physics practicals'
    if 'microscope' in nl:
        return 'Cellular observation, bio-STEM investigations, microstructure analysis'
    if 'sewing' in nl:
        return 'Wearable electronics, e-textiles, conductive thread wearable innovation'
    if 'safety' in nl or 'first-aid' in nl or 'fire extinguisher' in nl or 'goggles' in nl or 'gloves' in nl or 'mask' in nl:
        return 'Occupational laboratory safety, personal protection, emergency preparedness'
    if 'power' in nl or 'battery' in nl or 'adapter' in nl or 'cable tie' in nl or 'screws' in nl:
        return 'Laboratory power supply distribution, cable management, hardware fastening'
    return 'Hands-on experiential learning, prototyping, and tinkering experimentation'

for i in range(len(items60)):
    it60 = items60[i]
    it90 = items90[i]
    
    pkg_raw = it60['pkg']
    if 'Package 1' in pkg_raw: pkg = 'Package 1'
    elif 'Package 2' in pkg_raw: pkg = 'Package 2'
    elif 'Package 3' in pkg_raw: pkg = 'Package 3'
    else: pkg = 'Package 4'
    
    pre = it60['pre_qty']
    cat = 'General'
    name = ''
    spec_start = ''
    
    if len(pre) == 1:
        name = pre[0]
    elif len(pre) == 2:
        cat = pre[0]
        name = pre[1]
    elif len(pre) >= 3:
        cat = pre[0]
        name = pre[1]
        spec_start = pre[2]
        
    # clean extra lines for spec
    extra_specs = []
    if spec_start: extra_specs.append(spec_start)
    for el in it60['extra_lines']:
        cleaned_el = ' '.join([c for c in el if c])
        if cleaned_el:
            extra_specs.append(cleaned_el)
            
    full_spec = ' '.join(extra_specs).strip()
    if not full_spec:
        full_spec = 'Mandated technical specifications as per official NITI Aayog ATL inventory.'
        
    full_spec = re.sub(r'\s+', ' ', full_spec).strip()
    
    # Clean Qty
    q60 = it60['qty'].strip()
    q90 = it90['qty'].strip()
    
    # Format qty nicely (e.g. '30 Units', '100 Nos', etc.)
    if q60.isdigit():
        q60_str = f'{q60} Units'
        q90_str = f'{q90} Units'
    else:
        q60_str = q60
        q90_str = q90
        
    itype = 'Consumable' if it60['type'] == 'Consumable' else 'Equipment'
    
    # Reference URL
    ref_url = 'https://aim.gov.in/pdf/ATL_Equipment_List/ATL_Equipment_List_60_students.pdf' if i < 151 else 'https://aim.gov.in/atl-overview.php'
    
    cleaned_items.append({
        'srNo': i + 1,
        'package': pkg,
        'category': cat,
        'name': name,
        'spec': full_spec,
        'qty60': q60_str,
        'qty90': q90_str,
        'type': itype,
        'application': get_application(name, cat, pkg),
        'refUrl': ref_url
    })

print(f'Processed {len(cleaned_items)} cleaned items!')

with open('cleaned_atl_151.json', 'w', encoding='utf-8') as f:
    json.dump(cleaned_items, f, indent=2, ensure_ascii=False)
