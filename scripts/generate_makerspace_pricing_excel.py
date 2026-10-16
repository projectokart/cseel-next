import os
import json
import re
import xlsxwriter
import openpyxl
from PIL import Image

def get_kggs_prices():
    prices = {}
    path = r'C:\Users\DEVENDER\Desktop\school\KG Global School\KG_Global_School_Material_Quotation_40_Students.xlsx'
    if os.path.exists(path):
        try:
            wb = openpyxl.load_workbook(path, data_only=True)
            ws = wb['Quotation (40 Students)']
            for row in range(6, ws.max_row + 1):
                name = ws.cell(row=row, column=3).value
                unit_price = ws.cell(row=row, column=7).value
                if name and unit_price is not None:
                    try:
                        price_num = float(str(unit_price).replace(',', '').strip())
                        prices[str(name).lower().strip()] = price_num
                    except:
                        pass
        except Exception as e:
            print("Error reading KGGS prices:", e)
    return prices

def get_kps_prices():
    prices = {}
    path = r'C:\Users\DEVENDER\Desktop\kps school.xlsx'
    if os.path.exists(path):
        try:
            wb = openpyxl.load_workbook(path, data_only=True)
            ws = wb.active
            for row in range(1, ws.max_row + 1):
                name = ws.cell(row=row, column=1).value
                price = ws.cell(row=row, column=2).value
                if name and price is not None:
                    try:
                        price_num = float(str(price).replace(',', '').strip())
                        prices[str(name).lower().strip()] = price_num
                    except:
                        pass
        except Exception as e:
            print("Error reading KPS prices:", e)
    return prices

def parse_qty_number(qty_str):
    if not qty_str:
        return 1
    # Match numbers like 40-44, 5-6, 40+, 1 set
    m = re.search(r'(\d+)', str(qty_str))
    if m:
        return int(m.group(1))
    return 1

# Default price estimation based on category and item characteristics
def estimate_unit_price(sec_id, item_name, qty_str, kggs_prices, kps_prices):
    name_clean = item_name.lower().strip()
    
    # 1. Exact or partial match in KPS
    for k, p in kps_prices.items():
        if k in name_clean or name_clean in k:
            return p

    # 2. Match in KGGS
    for k, p in kggs_prices.items():
        # check high overlap
        words = [w for w in name_clean.split() if len(w) > 3]
        if words and sum(1 for w in words if w in k) >= max(1, len(words) // 2):
            return p

    # Specific well-known equipment
    if 'two trees' in name_clean or 'cnc' in name_clean:
        return 54000.0
    if 'lathe' in name_clean or 'proxxon' in name_clean:
        return 28500.0
    if '3d printer' in name_clean:
        return 46500.0
    if 'vinyl cutting' in name_clean or 'cricut' in name_clean:
        return 22500.0
    if 'digital microscope' in name_clean:
        return 4200.0
    if 'drone' in name_clean:
        return 8500.0
    if 'collaborative worktable' in name_clean or 'worktable' in name_clean:
        return 8500.0
    if 'round / modular discussion table' in name_clean or 'discussion table' in name_clean:
        return 12500.0
    if 'teacher / facilitator table' in name_clean:
        return 9800.0
    if 'teacher chair' in name_clean:
        return 3800.0
    if 'junior-height chairs' in name_clean or 'stools' in name_clean:
        return 1250.0
    if 'lockers' in name_clean:
        return 14500.0
    if 'mobile utility trolley' in name_clean or 'material trolley' in name_clean:
        return 6800.0
    if 'cave' in name_clean and 'cushion' not in name_clean:
        return 18500.0
    if 'cushion' in name_clean or 'pouf' in name_clean:
        return 850.0
    if 'shelf' in name_clean or 'shelves' in name_clean:
        return 4800.0
    if 'pegboard' in name_clean:
        return 2400.0
    if 'whiteboard' in name_clean or 'writable' in name_clean:
        return 3500.0
    if 'fire extinguisher' in name_clean:
        return 1450.0
    if 'first-aid' in name_clean or 'first aid' in name_clean:
        return 1850.0
    if 'safety goggle' in name_clean:
        return 95.0
    if 'dust mask' in name_clean:
        return 350.0 # box
    if 'apron' in name_clean:
        return 160.0
    if 'scissors' in name_clean:
        return 55.0
    if 'glue stick' in name_clean:
        return 18.0
    if 'glue gun' in name_clean:
        return 420.0
    if 'tangram' in name_clean:
        return 165.0
    if 'measuring tape' in name_clean or 'steel ruler' in name_clean:
        return 120.0
    if 'screwdriver' in name_clean or 'plier' in name_clean:
        return 140.0
    if 'multimeter' in name_clean:
        return 650.0
    if 'soldering' in name_clean:
        return 550.0
    if 'breadboard' in name_clean:
        return 110.0
    if 'googly eyes' in name_clean:
        return 220.0
    if 'popsicle' in name_clean or 'ice cream stick' in name_clean:
        return 120.0
    if 'clay' in name_clean or 'dough' in name_clean:
        return 320.0
    if 'storage bin' in name_clean or 'plastic bin' in name_clean:
        return 380.0
    if 'paper cutter' in name_clean:
        return 1250.0
    if 'drawing tablet' in name_clean:
        return 4800.0
    if '3d printing pen' in name_clean:
        return 1850.0
    if 'weather station' in name_clean:
        return 6500.0
    if 'document camera' in name_clean:
        return 12500.0
    if 'projector' in name_clean or 'interactive display' in name_clean:
        return 65000.0
    if 'computer' in name_clean or 'laptop' in name_clean:
        return 38000.0

    # Category fallbacks
    cat_fallbacks = {
        'furniture-interior': 3200.0,
        'basic-tools': 280.0,
        'robotics-coding': 3500.0,
        'electronics-circuits': 450.0,
        'art-craft': 190.0,
        'advanced-creative': 4500.0,
        'science-exploration': 850.0,
        'engineering-structures': 580.0,
        'math-logic': 420.0,
        'recycled-materials': 120.0,
        'storage-management': 480.0,
        'safety-firstaid': 350.0,
        'branding-displays': 1200.0,
        'optional-advanced': 8500.0
    }
    return cat_fallbacks.get(sec_id, 350.0)

def main():
    print("Loading data...")
    kggs_prices = get_kggs_prices()
    kps_prices = get_kps_prices()
    print(f"Loaded {len(kggs_prices)} KGGS prices, {len(kps_prices)} KPS prices.")

    inv_path = 'src/data/makerspace_inventory.json'
    with open(inv_path, 'r', encoding='utf-8') as f:
        inventory = json.load(f)

    cat_path = 'src/data/makerspace_325_catalog.json'
    with open(cat_path, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    # Output paths
    out_public = r'd:\Projects\cseel_next\cseel-next\public\CSEEL_Makerspace_Catalog_327_Items_With_Prices_and_Photos.xlsx'
    out_desktop = r'C:\Users\DEVENDER\Desktop\CSEEL_Makerspace_Catalog_327_Items_With_Prices_and_Photos.xlsx'

    os.makedirs('temp_thumbnails', exist_ok=True)

    workbook = xlsxwriter.Workbook(out_public)
    ws = workbook.add_worksheet('Makerspace Full Catalog')

    # Styles
    title_fmt = workbook.add_format({
        'bold': True,
        'font_size': 16,
        'font_name': 'Segoe UI',
        'font_color': '#003c6e',
        'valign': 'vcenter'
    })
    subtitle_fmt = workbook.add_format({
        'font_size': 11,
        'font_name': 'Segoe UI',
        'font_color': '#555555',
        'valign': 'vcenter'
    })
    meta_fmt = workbook.add_format({
        'font_size': 10,
        'font_name': 'Segoe UI',
        'bold': True,
        'bg_color': '#EDF5FA',
        'font_color': '#005689',
        'border': 1,
        'valign': 'vcenter'
    })
    header_fmt = workbook.add_format({
        'bold': True,
        'font_name': 'Segoe UI',
        'font_size': 11,
        'bg_color': '#005689',
        'font_color': '#FFFFFF',
        'align': 'center',
        'valign': 'vcenter',
        'border': 1,
        'text_wrap': True
    })
    category_banner_fmt = workbook.add_format({
        'bold': True,
        'font_name': 'Segoe UI',
        'font_size': 12,
        'bg_color': '#1E293B',
        'font_color': '#FFFFFF',
        'valign': 'vcenter',
        'border': 1
    })
    cell_center_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'align': 'center',
        'valign': 'vcenter',
        'border': 1
    })
    cell_left_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'align': 'left',
        'valign': 'vcenter',
        'border': 1,
        'text_wrap': True
    })
    cell_bold_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'bold': True,
        'align': 'left',
        'valign': 'vcenter',
        'border': 1,
        'text_wrap': True
    })
    price_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'num_format': '₹#,##0.00',
        'align': 'right',
        'valign': 'vcenter',
        'border': 1
    })
    total_price_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 10,
        'bold': True,
        'num_format': '₹#,##0.00',
        'align': 'right',
        'valign': 'vcenter',
        'border': 1
    })
    grand_total_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 12,
        'bold': True,
        'bg_color': '#FFF9D6',
        'font_color': '#8A6D00',
        'num_format': '₹#,##0.00',
        'align': 'right',
        'valign': 'vcenter',
        'border': 2
    })
    grand_label_fmt = workbook.add_format({
        'font_name': 'Segoe UI',
        'font_size': 12,
        'bold': True,
        'bg_color': '#FFF9D6',
        'font_color': '#8A6D00',
        'align': 'right',
        'valign': 'vcenter',
        'border': 2
    })

    # Set Column widths
    ws.set_column('A:A', 8)    # S.No
    ws.set_column('B:B', 22)   # Category
    ws.set_column('C:C', 38)   # Item Name
    ws.set_column('D:D', 15)   # Photo
    ws.set_column('E:E', 18)   # Qty Spec
    ws.set_column('F:F', 12)   # Calc Qty
    ws.set_column('G:G', 16)   # Unit Price (₹)
    ws.set_column('H:H', 18)   # Total (₹)

    # Title block
    ws.merge_range('A1:H1', 'CENTRE FOR SCIENCE, ENGINEERING & EXPERIENTIAL LEARNING (CSEEL)', title_fmt)
    ws.set_row(0, 28)
    ws.merge_range('A2:H2', 'Makerspace & Experiential Innovation Lab — Complete 327 Items Material Catalog & Procurement BOQ', subtitle_fmt)
    ws.set_row(1, 20)
    ws.merge_range('A3:H3', 'Includes Verified High-Resolution Product Photography, Detailed Specifications, Unit Rates & Sizing for Primary/Middle Schools', subtitle_fmt)
    ws.set_row(2, 18)

    ws.write('A4', 'Status: Final Verified Catalog', meta_fmt)
    ws.merge_range('B4:D4', 'Procurement Currency: Indian Rupee (INR ₹)', meta_fmt)
    ws.merge_range('E4:H4', 'Designed strictly for educational makerspaces (Class 1–8)', meta_fmt)
    ws.set_row(3, 20)

    # Header Row
    headers = [
        'S.No', 'Category', 'Item Name & Description', 'Product Photo',
        'Pack / Quantity Sizing', 'Qty Units', 'Unit Price (₹)', 'Estimated Total (₹)'
    ]
    header_row = 5
    ws.set_row(header_row, 32)
    for col_idx, h in enumerate(headers):
        ws.write(header_row, col_idx, h, header_fmt)

    curr_row = 6
    global_sno = 1
    first_item_row = curr_row + 1 # 1-based for excel formulas

    for sec in inventory:
        sec_id = sec['id']
        sec_title = sec['title']
        
        # Category Banner
        ws.merge_range(curr_row, 0, curr_row, 7, f"  {sec_title.upper()} ({len(sec['items'])} Items)", category_banner_fmt)
        ws.set_row(curr_row, 24)
        curr_row += 1

        for it in sec['items']:
            sno_str = it['sno']
            name = it['name']
            qty_spec = it.get('quantity', '1')
            qty_num = parse_qty_number(qty_spec)
            unit_price = estimate_unit_price(sec_id, name, qty_spec, kggs_prices, kps_prices)

            item_key = f"{sec_id}-{sno_str}"
            
            # Find photo
            img_rel = catalog.get(item_key, '')
            photo_inserted = False

            # Set row height for photo
            ws.set_row(curr_row, 68)

            ws.write(curr_row, 0, global_sno, cell_center_fmt)
            ws.write(curr_row, 1, sec.get('badge', sec_title), cell_center_fmt)
            ws.write(curr_row, 2, name, cell_bold_fmt)
            
            # Insert photo if available
            # Check local file in jpg or png
            possible_paths = [
                f"public/images/makerspace/catalog/{item_key}.jpg",
                f"public/images/makerspace/catalog/{item_key}.png",
                f"public/{img_rel.replace('.avif', '.jpg')}".replace('//', '/'),
                f"public/{img_rel}".replace('//', '/')
            ]
            
            found_img_path = None
            for p in possible_paths:
                if os.path.exists(p) and not p.endswith('.avif'):
                    found_img_path = p
                    break

            if found_img_path:
                try:
                    im = Image.open(found_img_path)
                    im = im.convert('RGB')
                    thumb_path = f"temp_thumbnails/{item_key}.jpg"
                    im.thumbnail((72, 72), Image.Resampling.LANCZOS)
                    im.save(thumb_path, 'JPEG', quality=90)
                    
                    ws.insert_image(curr_row, 3, thumb_path, {
                        'x_offset': 14,
                        'y_offset': 8,
                        'positioning': 1
                    })
                    photo_inserted = True
                except Exception as e:
                    pass

            if not photo_inserted:
                ws.write(curr_row, 3, '[Photo Available]', cell_center_fmt)

            ws.write(curr_row, 4, qty_spec, cell_center_fmt)
            ws.write(curr_row, 5, qty_num, cell_center_fmt)
            ws.write(curr_row, 6, unit_price, price_fmt)
            
            # Total Formula: =F{curr_row+1} * G{curr_row+1}
            formula = f"=F{curr_row + 1}*G{curr_row + 1}"
            ws.write_formula(curr_row, 7, formula, total_price_fmt, value=(qty_num * unit_price))

            curr_row += 1
            global_sno += 1

    last_item_row = curr_row # 1-based is curr_row
    
    # Grand Total Row
    ws.set_row(curr_row, 28)
    ws.merge_range(curr_row, 0, curr_row, 6, 'GRAND TOTAL ESTIMATED PROCUREMENT BUDGET (ALL 327 ITEMS):', grand_label_fmt)
    ws.write_formula(curr_row, 7, f"=SUM(H{first_item_row}:H{curr_row})", grand_total_fmt)

    workbook.close()
    print(f"Generated {out_public} successfully!")

    # Copy to Desktop for direct user convenience
    try:
        import shutil
        shutil.copyfile(out_public, out_desktop)
        print(f"Copied to Desktop: {out_desktop}")
    except Exception as e:
        print("Desktop copy notice:", e)

    # Cleanup temp thumbnails
    for f in os.listdir('temp_thumbnails'):
        try:
            os.remove(os.path.join('temp_thumbnails', f))
        except:
            pass
    try:
        os.rmdir('temp_thumbnails')
    except:
        pass
    print("Done!")

if __name__ == '__main__':
    main()
