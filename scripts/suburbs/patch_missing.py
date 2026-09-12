# -*- coding: utf-8 -*-
import json, urllib.request, urllib.parse, time
from fetch_boundaries import rings_of, simplify_ring, centroid, km2, region_of
UA = {"User-Agent": "JED-Air-SuburbPages/1.0 (dion@pndulumdigital.com)"}

# Nominatim returns these as addresstype=town with no "Sydney" in the display name,
# so the main filter rejects them. Query them explicitly instead.
RETRY = {
 "chatswood": ("Chatswood, Willoughby City Council, New South Wales, Australia", "north"),
 "berowra":   ("Berowra NSW 2081", "upper"),
 "manly":     ("Manly NSW 2095", "beaches"),
 "mona-vale": ("Mona Vale NSW 2103", "beaches"),
}
NAMES = {"chatswood": "Chatswood", "berowra": "Berowra", "manly": "Manly", "mona-vale": "Mona Vale"}

cache = json.load(open("boundaries.json", encoding="utf-8"))
for slug, (q, zone) in RETRY.items():
    p = urllib.parse.urlencode({"q": q, "format": "jsonv2", "polygon_geojson": 1,
                                "addressdetails": 1, "limit": 8, "countrycodes": "au"})
    res = json.load(urllib.request.urlopen(urllib.request.Request(
        "https://nominatim.openstreetmap.org/search?" + p, headers=UA), timeout=40))
    best = None
    for c in res:
        if c.get("geojson", {}).get("type") not in ("Polygon", "MultiPolygon"):
            continue
        if c.get("addresstype") not in ("suburb", "town", "neighbourhood", "quarter", "village"):
            continue
        best = c; break
    if not best:
        print(f"  {slug}: STILL NO MATCH"); time.sleep(1.2); continue
    rings = [simplify_ring(r) for r in rings_of(best["geojson"])[:3]]
    cen = centroid(rings[0])
    a = best.get("address", {})
    cache[slug] = {"ok": True, "name": NAMES[slug], "slug": slug, "zone": zone,
                   "osm_id": best.get("osm_id"), "addresstype": best.get("addresstype"),
                   "display_name": best.get("display_name", ""),
                   "region": region_of(best.get("display_name", "")),
                   "postcode": a.get("postcode") or "",
                   "council": a.get("municipality") or a.get("city_district") or a.get("county") or "",
                   "centroid": cen,
                   "area_km2": round(sum(km2(r, cen[1]) for r in rings), 2),
                   "bbox": [round(float(x), 5) for x in best.get("boundingbox", [])],
                   "rings": rings, "points": sum(len(r) for r in rings)}
    print(f"  {slug}: {best.get('addresstype')} {cache[slug]['points']}pts "
          f"{cache[slug]['area_km2']}km2")
    time.sleep(1.2)
json.dump(cache, open("boundaries.json", "w", encoding="utf-8"), separators=(",", ":"))
ok = sum(1 for v in cache.values() if v.get("ok"))
print(f"\n{ok}/{len(cache)} boundaries OK")
