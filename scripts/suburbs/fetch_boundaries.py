# -*- coding: utf-8 -*-
"""Fetch real suburb boundaries from OpenStreetMap (via Nominatim), simplify them,
and compute centroid, area and true polygon adjacency.

Nominatim usage policy: max 1 request/second, identifying User-Agent, cache results.
We fetch once and commit the output, so the site never calls this at runtime.
"""
import json, os, math, time, sys, io, urllib.request, urllib.parse
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
from suburb_list import all_targets

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "boundaries.json")
UA = {"User-Agent": "JED-Air-SuburbPages/1.0 (dion@pndulumdigital.com)"}
SYDNEY_HINTS = ("Sydney", "Eastern Suburbs", "North Shore", "Northern Beaches",
                "Inner West", "Hornsby", "Ku-ring-gai", "Northern Sydney")


# ------------------------------------------------------------------ geometry
def perp_dist(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p, a, b
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = max(0, min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)))
    return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))


def rdp(pts, eps):
    """Ramer-Douglas-Peucker. Iterative, so a 4,000-point ring cannot blow the stack."""
    if len(pts) < 3:
        return pts[:]
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        dmax, idx = 0.0, i
        for k in range(i + 1, j):
            d = perp_dist(pts[k], pts[i], pts[j])
            if d > dmax:
                dmax, idx = d, k
        if dmax > eps:
            keep[idx] = True
            stack.append((i, idx)); stack.append((idx, j))
    return [p for p, k in zip(pts, keep) if k]


def simplify_ring(ring, eps=0.00018, ndp=5):
    s = rdp([(float(x), float(y)) for x, y in ring], eps)
    if s[0] != s[-1]:
        s.append(s[0])
    out, prev = [], None
    for x, y in s:
        p = [round(x, ndp), round(y, ndp)]
        if p != prev:
            out.append(p); prev = p
    if out[0] != out[-1]:
        out.append(out[0])
    return out


def rings_of(geom):
    """Return the outer rings of a Polygon or MultiPolygon, biggest first."""
    t, c = geom.get("type"), geom.get("coordinates", [])
    polys = [c] if t == "Polygon" else (c if t == "MultiPolygon" else [])
    rings = [p[0] for p in polys if p and len(p[0]) >= 4]
    rings.sort(key=ring_area, reverse=True)
    return rings


def ring_area(ring):
    """Shoelace area in square degrees - only used for ranking and rough km2."""
    a = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]; x2, y2 = ring[i + 1]
        a += float(x1) * float(y2) - float(x2) * float(y1)
    return abs(a) / 2


def centroid(ring):
    cx = cy = a = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]; x2, y2 = ring[i + 1]
        f = x1 * y2 - x2 * y1
        a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f
    if a == 0:
        xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
        return [sum(xs) / len(xs), sum(ys) / len(ys)]
    a *= 0.5
    return [round(cx / (6 * a), 6), round(cy / (6 * a), 6)]


def km2(ring, lat):
    """Square degrees -> km2 at this latitude."""
    return ring_area(ring) * (111.32 ** 2) * math.cos(math.radians(lat))


# ------------------------------------------------------------------ fetch
def fetch(name):
    p = urllib.parse.urlencode({
        "q": f"{name}, New South Wales, Australia", "format": "jsonv2",
        "polygon_geojson": 1, "addressdetails": 1, "limit": 6, "countrycodes": "au"})
    req = urllib.request.Request("https://nominatim.openstreetmap.org/search?" + p, headers=UA)
    with urllib.request.urlopen(req, timeout=40) as r:
        res = json.load(r)
    best = None
    for c in res:
        dn = c.get("display_name", "")
        if not any(h in dn for h in SYDNEY_HINTS):
            continue
        if c.get("addresstype") not in ("suburb", "neighbourhood", "town", "village", "quarter"):
            continue
        if c.get("geojson", {}).get("type") not in ("Polygon", "MultiPolygon"):
            continue
        if best is None or c.get("addresstype") == "suburb":
            best = c
            if c.get("addresstype") == "suburb":
                break
    return best


def region_of(display_name):
    parts = [p.strip() for p in display_name.split(",")]
    for p in parts[1:4]:
        if p in ("Eastern Suburbs", "Lower North Shore", "Upper North Shore",
                 "Northern Beaches", "Inner West", "Northern Sydney", "Sydney"):
            return p
    return parts[1] if len(parts) > 1 else ""


def main():
    cache = {}
    if os.path.exists(OUT):
        cache = json.load(open(OUT, encoding="utf-8"))
    targets = all_targets()
    for i, (zone, name, slug) in enumerate(targets, 1):
        if slug in cache and cache[slug].get("ok"):
            continue
        try:
            c = fetch(name)
        except Exception as e:
            print(f"  [{i}/{len(targets)}] {name}: ERROR {e}", flush=True)
            cache[slug] = {"ok": False, "name": name, "zone": zone, "error": str(e)}
            time.sleep(1.2); continue
        if not c:
            print(f"  [{i}/{len(targets)}] {name}: NO MATCH", flush=True)
            cache[slug] = {"ok": False, "name": name, "zone": zone, "error": "no-match"}
            time.sleep(1.2); continue
        rings = rings_of(c["geojson"])
        if not rings:
            cache[slug] = {"ok": False, "name": name, "zone": zone, "error": "no-rings"}
            time.sleep(1.2); continue
        simp = [simplify_ring(r) for r in rings[:3]]
        cen = centroid(simp[0])
        a = c.get("address", {})
        cache[slug] = {
            "ok": True, "name": name, "slug": slug, "zone": zone,
            "osm_id": c.get("osm_id"), "addresstype": c.get("addresstype"),
            "display_name": c.get("display_name", ""),
            "region": region_of(c.get("display_name", "")),
            "postcode": a.get("postcode") or "",
            "council": a.get("municipality") or a.get("city_district") or a.get("county") or "",
            "centroid": cen,
            "area_km2": round(sum(km2(r, cen[1]) for r in simp), 2),
            "bbox": [round(float(x), 5) for x in c.get("boundingbox", [])],
            "rings": simp,
            "points": sum(len(r) for r in simp),
        }
        print(f"  [{i}/{len(targets)}] {name}: {c.get('addresstype')} "
              f"{cache[slug]['points']}pts {cache[slug]['area_km2']}km2 "
              f"pc={cache[slug]['postcode']} region={cache[slug]['region']}", flush=True)
        if i % 10 == 0:
            json.dump(cache, open(OUT, "w", encoding="utf-8"), separators=(",", ":"))
        time.sleep(1.15)
    json.dump(cache, open(OUT, "w", encoding="utf-8"), separators=(",", ":"))
    ok = sum(1 for v in cache.values() if v.get("ok"))
    print(f"\n{ok}/{len(targets)} boundaries fetched -> {OUT} "
          f"({os.path.getsize(OUT)//1024} KB)")


if __name__ == "__main__":
    main()
