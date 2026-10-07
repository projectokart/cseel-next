import fitz
import json
import re

def extract_items_from_doc(pdf_path):
    doc = fitz.open(pdf_path)
    current_pkg = 'Package 1'
    items = []
    
    # Track current item being built
    curr_item = None
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        for l in lines:
            if 'Package 1:' in l: current_pkg = 'Package 1: Electronics Development, Robotics, IoT and Sensors'
            elif 'Package 2:' in l: current_pkg = 'Package 2: Rapid Prototyping Tools'
            elif 'Package 3:' in l: current_pkg = 'Package 3: Mechanical, Electrical, and Measurement tools'
            elif 'Package 4:' in l: current_pkg = 'Package 4: Power Supply & Accessories and Safety Equipment'
            
        tabs = page.find_tables()
        for t in tabs:
            extracted = t.extract()
            for row in extracted:
                cleaned = [c.replace('\n', ' ').strip() if c else '' for c in row]
                non_empty = [c for c in cleaned if c]
                if not non_empty:
                    continue
                row_str = ' '.join(non_empty)
                if 'Suggested Quantity' in row_str or 'Category Name' in row_str or row_str.startswith('Package '):
                    continue
                
                # Check if this row is a new item or continuation
                # Look for Suggested Quantity (number or number with unit) and Type
                qty = ''
                itype = ''
                name = ''
                cat = ''
                spec = ''
                
                # Let's see columns:
                # Typically len(cleaned) is around 7-9
                # Let's inspect where qty is
                for idx, c in enumerate(cleaned):
                    if c in ['Consumable', 'Equipment', 'Non-Consumable']:
                        itype = c
                        # usually qty is right before itype or 1-2 columns before
                        for prev_idx in range(idx - 1, -1, -1):
                            if cleaned[prev_idx]:
                                qty = cleaned[prev_idx]
                                break
                                
                if itype or (qty and re.match(r'^[0-9]+', qty)):
                    # This row contains a quantity!
                    # Find name and category and spec
                    # Before qty:
                    pre_qty = []
                    found_qty = False
                    for c in cleaned:
                        if c == qty:
                            found_qty = True
                            break
                        if c: pre_qty.append(c)
                    
                    if curr_item:
                        items.append(curr_item)
                        
                    # pre_qty has Category, Name, Spec parts
                    curr_item = {
                        'page': page_num + 1,
                        'pkg': current_pkg,
                        'qty': qty,
                        'type': itype,
                        'raw_row': cleaned,
                        'pre_qty': pre_qty,
                        'extra_lines': []
                    }
                else:
                    if curr_item:
                        curr_item['extra_lines'].append(cleaned)
                        
    if curr_item:
        items.append(curr_item)
    return items

items60 = extract_items_from_doc('atl_60.pdf')
items90 = extract_items_from_doc('atl_90.pdf')

print(f'Items found with qty in 60: {len(items60)}')
print(f'Items found with qty in 90: {len(items90)}')

with open('items60_raw.json', 'w', encoding='utf-8') as f:
    json.dump(items60, f, indent=2, ensure_ascii=False)

with open('items90_raw.json', 'w', encoding='utf-8') as f:
    json.dump(items90, f, indent=2, ensure_ascii=False)
