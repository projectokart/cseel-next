import os
import sys

# Read the exact template written from user
with open('cseel-next/data/email_templates/school_website_outreach.html', 'r', encoding='utf-8') as f:
    user_html = f.read()

# Build MASTER_HTML by parameterizing the variant-specific parts:
# 1. Title: <title>Urgent: {{school_name}} official website is currently unreachable</title>
master = user_html.replace(
    '<title>Urgent: {{school_name}} official website is currently unreachable</title>',
    '<title>{{TITLE}}</title>'
)

# 2. Preheader:
master = master.replace(
    "{{school_name}}'s website is currently offline. Bumper offer: pay after work, no agency charges. Live in 7 to 10 days.",
    "{{PREHEADER}}"
)

# 3. Category Chip:
master = master.replace(
    '<td style="background-color: #fce8e6; color: #c5221f; font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 11.5px; font-weight: 600; letter-spacing: 0.3px; padding: 4px 14px; border-radius: 50px;">\n                &#9888;&#65039; Urgent: Website Inaccessible &amp; Offline\n              </td>',
    '<td style="background-color: {{CHIP_BG}}; color: {{CHIP_COLOR}}; font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 11.5px; font-weight: 600; letter-spacing: 0.3px; padding: 4px 14px; border-radius: 50px;">\n                {{CHIP_TEXT}}\n              </td>'
)

# 4. Main Heading:
master = master.replace(
    '<div class="h1-title" style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 21px; font-weight: 400; line-height: 1.32; text-align: center; color: #1f1f1f; max-width: 440px; margin: 0 auto 10px auto;">\n            &#9888;&#65039; Urgent: {{school_name}} official website is currently unreachable\n          </div>',
    '<div class="h1-title" style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 21px; font-weight: 400; line-height: 1.32; text-align: center; color: #1f1f1f; max-width: 440px; margin: 0 auto 10px auto;">\n            {{HEADLINE}}\n          </div>'
)

# 5. Subheading:
master = master.replace(
    '<div class="subhead" style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 1.55; text-align: center; color: #444746; max-width: 420px; margin: 0 auto 14px auto;">\n            Today&rsquo;s parent Googles your school before visiting. When they click your link, they are greeted with an error screen &mdash; and choose another school.\n          </div>',
    '<div class="subhead" style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 1.55; text-align: center; color: #444746; max-width: 420px; margin: 0 auto 14px auto;">\n            {{SUBHEADING}}\n          </div>'
)

# 6. Hero Illustration:
master = master.replace(
    'src="https://cdn.jsdelivr.net/gh/projectokart/cseel-next@87c0871/public/email_assets/school_template/hero-offline.png"',
    'src="{{HERO_ILLUSTRATION}}"'
)

# 7. Callout text:
master = master.replace(
    '<td valign="top" style="padding: 14px 14px 14px 10px; font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 20px; color: #041e49;">\n                During our technical web audit of CBSE schools in your district, we noticed that <strong style="font-weight: 600;">{{school_name}}&rsquo;s official website is currently DOWN and unreachable</strong> (Domain / DNS / Server Error).\n              </td>',
    '<td valign="top" style="padding: 14px 14px 14px 10px; font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 20px; color: #041e49;">\n                {{CALLOUT_TEXT}}\n              </td>'
)

# 8. Card Title:
master = master.replace(
    '<div style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 14px; line-height: 20px; font-weight: 600; color: #1f1f1f; padding-bottom: 6px;">\n                  A school with an inactive or broken website:\n                </div>',
    '<div style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 14px; line-height: 20px; font-weight: 600; color: #1f1f1f; padding-bottom: 6px;">\n                  {{CARD_TITLE}}\n                </div>'
)

# 9. Bullets:
old_bullets = """                  <tr>
  <td width="38" valign="top" style="padding: 8px 0;">
    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="28" height="28" align="center" valign="middle" style="width: 28px; height: 28px; border-radius: 50%; background-color: #fce8e6; color: #c5221f; font-family: Arial, sans-serif; font-size: 14px; line-height: 28px; font-weight: 700;">
          &#10005;
        </td>
      </tr>
    </table>
  </td>
  <td valign="middle" style="padding: 8px 0;">
    <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 19px; color: #202124;">
      Loses admission enquiries to competing schools who show up online first
    </div>
  </td>
</tr>
<tr>
  <td width="38" valign="top" style="padding: 8px 0;">
    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="28" height="28" align="center" valign="middle" style="width: 28px; height: 28px; border-radius: 50%; background-color: #fce8e6; color: #c5221f; font-family: Arial, sans-serif; font-size: 14px; line-height: 28px; font-weight: 700;">
          &#10005;
        </td>
      </tr>
    </table>
  </td>
  <td valign="middle" style="padding: 8px 0;">
    <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 19px; color: #202124;">
      Gives parents the impression that the school is unmanaged or closed
    </div>
  </td>
</tr>
<tr>
  <td width="38" valign="top" style="padding: 8px 0;">
    <table border="0" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td width="28" height="28" align="center" valign="middle" style="width: 28px; height: 28px; border-radius: 50%; background-color: #fce8e6; color: #c5221f; font-family: Arial, sans-serif; font-size: 14px; line-height: 28px; font-weight: 700;">
          &#10005;
        </td>
      </tr>
    </table>
  </td>
  <td valign="middle" style="padding: 8px 0;">
    <div style="font-family: 'Google Sans', Roboto, Arial, sans-serif; font-size: 13.5px; line-height: 19px; color: #202124;">
      Violates CBSE Mandatory Public Disclosure norms requiring a live, accessible portal
    </div>
  </td>
</tr>"""

if old_bullets in master:
    master = master.replace(old_bullets, "{{BULLETS_HTML}}")
    print("Replaced old bullets with {{BULLETS_HTML}}")
else:
    print("Warning: old bullets exact match failed")

# 10. Promise text:
master = master.replace(
    '<div style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #444746; text-align: center;">\n            We can completely restore, modernize, and re-launch your school portal in <strong style="font-weight: 600; color: #1f1f1f;">7 to 10 working days</strong> on ultra-fast cloud servers.\n          </div>',
    '<div style="font-family: \'Google Sans\', Roboto, Arial, sans-serif; font-size: 14px; line-height: 22px; color: #444746; text-align: center;">\n            {{PROMISE_TEXT}}\n          </div>'
)

# Now read update_all_6_variants.py
with open('cseel-next/scripts/update_all_6_variants.py', 'r', encoding='utf-8') as f:
    script_text = f.read()

# Replace MASTER_HTML in the script
# Find where MASTER_HTML starts and where VARIANTS starts
m_start = script_text.find('MASTER_HTML = ')
v_start = script_text.find('VARIANTS = {')

if m_start != -1 and v_start != -1:
    new_script = script_text[:m_start] + 'MASTER_HTML = """' + master + '"""\n\n' + script_text[v_start:]
    with open('cseel-next/scripts/update_all_6_variants.py', 'w', encoding='utf-8') as f:
        f.write(new_script)
    print("Successfully updated MASTER_HTML in cseel-next/scripts/update_all_6_variants.py")
else:
    print(f"Error: m_start={m_start}, v_start={v_start}")
