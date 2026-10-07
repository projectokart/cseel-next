import fitz
import json

def parse_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    all_pages_text = []
    for i, page in enumerate(doc):
        all_pages_text.append({'page': i+1, 'text': page.get_text()})
    return all_pages_text

pages60 = parse_pdf('atl_60.pdf')
pages90 = parse_pdf('atl_90.pdf')

with open('pages60.json', 'w', encoding='utf-8') as f:
    json.dump(pages60, f, indent=2, ensure_ascii=False)

with open('pages90.json', 'w', encoding='utf-8') as f:
    json.dump(pages90, f, indent=2, ensure_ascii=False)

print('Dumped pages60.json and pages90.json')
