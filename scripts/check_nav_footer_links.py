import os
import re

app_dir = r"d:\Projects\cseel_next\cseel-next\src\app"

routes = set()
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.startswith("page."):
            rel = os.path.relpath(root, app_dir).replace("\\", "/")
            if rel == ".":
                routes.add("/")
            else:
                parts = [p for p in rel.split("/") if not (p.startswith("(") and p.endswith(")"))]
                routes.add("/" + "/".join(parts))

def exists(link):
    clean = link.rstrip("/")
    if not clean:
        clean = "/"
    if clean in routes:
        return True
    parts = clean.strip("/").split("/")
    for r in routes:
        r_parts = r.strip("/").split("/")
        if len(parts) == len(r_parts):
            match = True
            for p, rp in zip(parts, r_parts):
                if rp.startswith("[") and rp.endswith("]"):
                    continue
                if p != rp:
                    match = False
                    break
            if match:
                return True
        if any("..." in rp for rp in r_parts):
            prefix = []
            for rp in r_parts:
                if "..." in rp:
                    break
                prefix.append(rp)
            if parts[:len(prefix)] == prefix:
                return True
    return False

# 1. Navbar.tsx
with open(r"d:\Projects\cseel_next\cseel-next\src\components\layout\Navbar.tsx", "r", encoding="utf-8") as f:
    nav_text = f.read()

nav_links = re.findall(r'to:\s*[\"\'](/[^\"\'\s#\?]*)[\"\']', nav_text)

print("=== NAVBAR LINKS STATUS ===")
missing_nav = []
for nl in sorted(set(nav_links)):
    ex = exists(nl)
    status = "EXISTS" if ex else "MISSING [X]"
    if not ex:
        missing_nav.append(nl)
    print(f"{nl:<35} -> {status}")

# 2. Footer.tsx
with open(r"d:\Projects\cseel_next\cseel-next\src\components\layout\Footer.tsx", "r", encoding="utf-8") as f:
    footer_text = f.read()

footer_links = re.findall(r'href=[\"\'](/[^\"\'\s#\?]*)[\"\']', footer_text)

print("\n=== FOOTER LINKS STATUS ===")
missing_footer = []
for fl in sorted(set(footer_links)):
    ex = exists(fl)
    status = "EXISTS" if ex else "MISSING [X]"
    if not ex:
        missing_footer.append(fl)
    print(f"{fl:<35} -> {status}")

# 3. Homepage Client.tsx & page.tsx
home_files = [
    r"d:\Projects\cseel_next\cseel-next\src\app\(public)\Client.tsx",
    r"d:\Projects\cseel_next\cseel-next\src\app\(public)\page.tsx",
]
missing_home = []
for hf in home_files:
    if os.path.exists(hf):
        with open(hf, "r", encoding="utf-8") as f:
            ht = f.read()
        h_links = re.findall(r'href=[\"\'](/[^\"\'\s#\?]*)[\"\']', ht)
        for hl in set(h_links):
            if not exists(hl) and not hl.startswith(("/images", "/icons")):
                missing_home.append(hl)

print("\n=== HOMEPAGE MISSING LINKS ===")
for hl in sorted(set(missing_home)):
    print(f"{hl:<35} -> MISSING [X]")

print(f"\nSummary of Missing:")
print(f"Navbar missing: {len(missing_nav)}")
print(f"Footer missing: {len(missing_footer)}")
print(f"Homepage missing: {len(missing_home)}")
