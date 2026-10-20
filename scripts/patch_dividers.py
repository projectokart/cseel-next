import re

with open('cseel-next/scripts/update_all_6_variants.py', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update CDN hash
text = text.replace('cseel-next@d84928e', 'cseel-next@4dcfc46')

# 2. Define thin Google divider
divider = """      <!-- THIN GOOGLE SECTION DIVIDER -->
      <tr>
        <td style="padding: 8px 24px; background-color: #ffffff;">
          <div style="border-top: 1px solid #e8eaed; height: 1px; line-height: 1px; font-size: 1px;">&nbsp;</div>
        </td>
      </tr>

"""

targets = [
    '      <!-- GREETING + GOOGLE INFO CALLOUT -->',
    '      <!-- 3. AGENCY COST OVERHEAD: agency-cost.png -->',
    '      <!-- 4. DIRECT BENEFITS: direct-benefits.png -->',
    '      <!-- 5. CBSE MANDATORY DISCLOSURE & AUDIT: cbse-compliance.png -->',
    '      <!-- 6. VIRTUAL 360 TOUR: virtual-tour-360.png -->',
    '      <!-- 7. ZERO RISK GUARANTEE: zero-risk-guarantee.png -->',
    '      <!-- GOOGLE STYLE FOOTER -->'
]

for t in targets:
    if t in text:
        text = text.replace(t, divider + t)
        print(f"Inserted divider before: {t.strip()[:40]}")
    else:
        print(f"WARNING: Target not found: {t}")

with open('cseel-next/scripts/update_all_6_variants.py', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated update_all_6_variants.py successfully!")
