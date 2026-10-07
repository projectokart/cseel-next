import fitz
import json

def parse_full(pdf_path):
    doc = fitz.open(pdf_path)
    rows_data = []
    
    current_pkg = 'Package 1'
    
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        text = page.get_text()
        
        # Check package header
        for l in text.split('\n'):
            ls = l.strip()
            if 'Package 1:' in ls or 'Package 1 -' in ls: current_pkg = 'Package 1: Electronics Development, Robotics, IoT and Sensors'
            elif 'Package 2:' in ls or 'Package 2 -' in ls: current_pkg = 'Package 2: Rapid Prototyping Tools'
            elif 'Package 3:' in ls or 'Package 3 -' in ls: current_pkg = 'Package 3: Mechanical, Electrical, and Measurement Tools'
            elif 'Package 4:' in ls or 'Package 4 -' in ls: current_pkg = 'Package 4: Power Supply, Accessories and Safety Equipment'
            
        tabs = page.find_tables()
        for tab in tabs:
            extracted = tab.extract()
            for r in extracted:
                c = [col.strip().replace('\n', ' ') if col else '' for col in r]
                rows_data.append({'page': page_idx + 1, 'pkg': current_pkg, 'cells': c})
    return rows_data

r60 = parse_full('atl_60.pdf')
r90 = parse_full('atl_90.pdf')

print('Extracted rows 60:', len(r60))
print('Extracted rows 90:', len(r90))

with open('raw_table_60.json', 'w', encoding='utf-8') as f:
    json.dump(r60, f, indent=2, ensure_ascii=False)

with open('raw_table_90.json', 'w', encoding='utf-8') as f:
    json.dump(r90, f, indent=2, ensure_ascii=False)
