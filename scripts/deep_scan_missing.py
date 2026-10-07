import os
import re

app_dir = r"d:\Projects\cseel_next\cseel-next\src\app"
src_dir = r"d:\Projects\cseel_next\cseel-next\src"

# Collect all routes
routes = set()
dynamic_routes = []
for root, dirs, files in os.walk(app_dir):
    for f in files:
        if f.startswith("page."):
            rel = os.path.relpath(root, app_dir).replace("\\", "/")
            if rel == ".":
                routes.add("/")
            else:
                parts = [p for p in rel.split("/") if not (p.startswith("(") and p.endswith(")"))]
                r_path = "/" + "/".join(parts)
                routes.add(r_path)
                if "[" in r_path:
                    dynamic_routes.append(r_path)

def route_exists(link):
    clean = link.split("?")[0].split("#")[0].rstrip("/")
    if not clean:
        clean = "/"
    if clean in routes:
        return True
    
    parts = [p for p in clean.strip("/").split("/") if p]
    for dr in dynamic_routes:
        dr_parts = [p for p in dr.strip("/").split("/") if p]
        # Check catch-all [[...slug]] or [...slug]
        if any("..." in p for p in dr_parts):
            prefix = []
            for p in dr_parts:
                if "..." in p:
                    break
                prefix.append(p)
            if parts[:len(prefix)] == prefix:
                return True
        elif len(parts) == len(dr_parts):
            match = True
            for lp, rp in zip(parts, dr_parts):
                if rp.startswith("[") and rp.endswith("]"):
                    continue
                if lp != rp:
                    match = False
                    break
            if match:
                return True
    return False

# Patterns to find internal links
patterns = [
    re.compile(r'href\s*[:=]\s*[\"\'](/[^\"\'\s#\?]*)[#\?\"\']'),
    re.compile(r'to\s*[:=]\s*[\"\'](/[^\"\'\s#\?]*)[#\?\"\']'),
    re.compile(r'router\.push\([\"\'](/[^\"\'\s#\?]*)[#\?\"\']'),
    re.compile(r'[\"\'](?:href|to|url|path|route)[\"\']\s*:\s*[\"\'](/[^\"\'\s#\?]*)[#\?\"\']'),
]

all_links = {}

for root, dirs, files in os.walk(src_dir):
    if "node_modules" in root or ".next" in root:
        continue
    for f in files:
        if f.endswith((".tsx", ".jsx", ".ts", ".js", ".json")):
            path = os.path.join(root, f)
            rel_file = os.path.relpath(path, src_dir).replace("\\", "/")
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()
                    for pat in patterns:
                        for m in pat.findall(content):
                            # clean
                            clean_link = m.split("?")[0].split("#")[0].rstrip("/")
                            if not clean_link:
                                clean_link = "/"
                            # Filter out non-pages
                            if clean_link.startswith(("/api", "/images", "/icons", "/fonts")) or clean_link.endswith((".png", ".svg", ".jpg", ".ico", ".webp", ".pdf", ".webmanifest", ".xml", ".txt")):
                                continue
                            if clean_link not in all_links:
                                all_links[clean_link] = set()
                            all_links[clean_link].add(rel_file)
            except Exception:
                pass

missing_links = {}
existing_links = {}

for link, files in all_links.items():
    if route_exists(link):
        existing_links[link] = files
    else:
        # Ignore variable templates like /$1 or /...
        if "$" in link or "..." in link or len(link) <= 1:
            continue
        missing_links[link] = sorted(list(files))

print(f"Total Unique Route Links Scanned: {len(all_links)}")
print(f"Existing / Working Route Links: {len(existing_links)}")
print(f"Missing / Broken Links (Pages that do NOT exist): {len(missing_links)}")
print("\n" + "="*80)
print(f"{'MISSING ROUTE':<40} | {'REFERENCED IN FILES'}")
print("="*80)
for ml, flist in sorted(missing_links.items()):
    files_summary = ", ".join(flist[:2])
    if len(flist) > 2:
        files_summary += f" (+{len(flist)-2} more)"
    print(f"{ml:<40} | {files_summary}")
