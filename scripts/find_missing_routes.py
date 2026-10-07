import os
import re

app_dir = r"d:\Projects\cseel_next\cseel-next\src\app"
src_dir = r"d:\Projects\cseel_next\cseel-next\src"

# 1. Collect all existing routes
existing_routes = set()
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.startswith("page."):
            rel = os.path.relpath(root, app_dir)
            if rel == ".":
                route = "/"
            else:
                parts = rel.replace("\\", "/").split("/")
                filtered_parts = [p for p in parts if not (p.startswith("(") and p.endswith(")"))]
                route = "/" + "/".join(filtered_parts)
            existing_routes.add(route)

print(f"Total existing route paths in src/app: {len(existing_routes)}")

# 2. Collect internal hrefs
links = {}
href_pattern = re.compile(r'href=[\"\'](/[^\"\'\s#\?]*)[#\?\"\']')
# Also find router.push('/...') or links in JSON data
push_pattern = re.compile(r'router\.push\([\"\'](/[^\"\'\s#\?]*)[#\?\"\']')
link_key_pattern = re.compile(r'[\"\'](?:href|url|link|path)[\"\']\s*:\s*[\"\'](/[^\"\'\s#\?]*)[#\?\"\']')

for root, dirs, files in os.walk(src_dir):
    if "node_modules" in root or ".next" in root:
        continue
    for f in files:
        if f.endswith((".tsx", ".jsx", ".ts", ".js", ".json")):
            path = os.path.join(root, f)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()
                    matches = href_pattern.findall(content) + push_pattern.findall(content) + link_key_pattern.findall(content)
                    for m in matches:
                        clean_m = m.rstrip("/")
                        if not clean_m:
                            clean_m = "/"
                        if clean_m not in links:
                            links[clean_m] = []
                        links[clean_m].append(os.path.relpath(path, src_dir))
            except Exception as e:
                pass

print(f"Total unique internal links found: {len(links)}")

def match_route(link, routes):
    if link in routes:
        return True
    link_parts = link.strip("/").split("/")
    for r in routes:
        r_parts = r.strip("/").split("/")
        if len(link_parts) == len(r_parts):
            matched = True
            for lp, rp in zip(link_parts, r_parts):
                if rp.startswith("[") and rp.endswith("]"):
                    continue
                if lp != rp:
                    matched = False
                    break
            if matched:
                return True
        # catch-all routes [...slug] or [[...slug]]
        if any("..." in rp for rp in r_parts):
            prefix = []
            for rp in r_parts:
                if "..." in rp:
                    break
                prefix.append(rp)
            if link_parts[:len(prefix)] == prefix:
                return True
    return False

missing = {}
found = {}
for link, files in links.items():
    if link.startswith("/images") or link.startswith("/api") or link.startswith("/icons") or link.endswith((".png", ".svg", ".jpg", ".ico", ".pdf", ".webp", ".webmanifest", ".xml", ".txt")):
        continue
    if match_route(link, existing_routes):
        found[link] = len(files)
    else:
        missing[link] = sorted(list(set(files)))

print(f"Valid routes: {len(found)}")
print(f"Missing routes: {len(missing)}")
print("\n=== COMPLETE LIST OF MISSING ROUTES ===")
for m in sorted(missing.keys()):
    files_str = ", ".join(missing[m][:2])
    if len(missing[m]) > 2:
        files_str += f" (+{len(missing[m])-2} more)"
    print(f"Route: {m:<35} | Used in: {files_str}")
