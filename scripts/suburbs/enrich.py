# -*- coding: utf-8 -*-
"""Fill postcodes, compute true polygon adjacency, and write enriched.json.

Adjacency matters: the SEO brief asks every suburb page to link to 2-3 geographically
adjacent suburbs. Guessing neighbours produces links that read as filler. Deriving them
from the actual boundary polygons produces links a local would agree with.
"""
import json, math, os, itertools

HERE = os.path.dirname(os.path.abspath(__file__))

POSTCODES = {
 # Eastern Suburbs
 "bondi": "2026", "bondi-beach": "2026", "bondi-junction": "2022", "north-bondi": "2026",
 "tamarama": "2026", "bronte": "2024", "waverley": "2024", "clovelly": "2031",
 "coogee": "2034", "south-coogee": "2034", "randwick": "2031", "kensington": "2033",
 "kingsford": "2032", "maroubra": "2035", "matraville": "2036", "malabar": "2036",
 "little-bay": "2036", "paddington": "2021", "woollahra": "2025", "double-bay": "2028",
 "bellevue-hill": "2023", "rose-bay": "2029", "vaucluse": "2030", "watsons-bay": "2030",
 "dover-heights": "2030", "point-piper": "2027", "darling-point": "2027",
 "edgecliff": "2027", "rushcutters-bay": "2011", "queens-park": "2022",
 "centennial-park": "2021", "eastgardens": "2036", "daceyville": "2032", "moore-park": "2021",
 # Lower North Shore
 "mosman": "2088", "cremorne": "2090", "neutral-bay": "2089", "kirribilli": "2061",
 "milsons-point": "2061", "north-sydney": "2060", "mcmahons-point": "2060",
 "waverton": "2060", "wollstonecraft": "2065", "crows-nest": "2065", "st-leonards": "2065",
 "naremburn": "2065", "cammeray": "2062", "northbridge": "2063", "willoughby": "2068",
 "artarmon": "2064", "chatswood": "2067", "lane-cove": "2066", "lane-cove-north": "2066",
 "longueville": "2066", "riverview": "2066", "greenwich": "2065", "hunters-hill": "2110",
 "woolwich": "2110", "castle-cove": "2069", "middle-cove": "2068",
 "roseville-chase": "2069", "castlecrag": "2068",
 # Upper North Shore & Hornsby
 "roseville": "2069", "lindfield": "2070", "killara": "2071", "east-killara": "2071",
 "gordon": "2072", "pymble": "2073", "turramurra": "2074", "north-turramurra": "2074",
 "south-turramurra": "2074", "warrawee": "2074", "wahroonga": "2076", "st-ives": "2075",
 "st-ives-chase": "2075", "waitara": "2077", "hornsby": "2077", "normanhurst": "2076",
 "thornleigh": "2120", "pennant-hills": "2120", "beecroft": "2119", "cheltenham": "2119",
 "asquith": "2077", "mount-colah": "2079", "berowra": "2081",
 # Northern Beaches
 "manly": "2095", "fairlight": "2094", "balgowlah": "2093", "balgowlah-heights": "2093",
 "seaforth": "2092", "clontarf": "2093", "freshwater": "2096", "curl-curl": "2096",
 "north-curl-curl": "2099", "dee-why": "2099", "narraweena": "2099", "cromer": "2099",
 "collaroy": "2097", "narrabeen": "2101", "north-narrabeen": "2101", "mona-vale": "2103",
 "newport": "2106", "avalon-beach": "2107", "palm-beach": "2108",
 "bilgola-plateau": "2107", "warriewood": "2102", "frenchs-forest": "2086",
 "belrose": "2085", "forestville": "2087", "beacon-hill": "2100",
 "allambie-heights": "2100", "brookvale": "2100", "queenscliff": "2096",
 "north-manly": "2100", "terrey-hills": "2084", "davidson": "2085",
}

COUNCILS = {
 "east": "Waverley, Woollahra, Randwick and Bayside councils",
 "north": "North Sydney, Willoughby, Lane Cove, Mosman and Hunters Hill councils",
 "upper": "Ku-ring-gai and Hornsby Shire councils",
 "beaches": "Northern Beaches Council",
}

TOUCH_DEG = 0.0022   # ~230 m - two simplified rings this close share a border
MAX_NEIGHBOURS = 6


def bbox(rings):
    xs = [p[0] for r in rings for p in r]
    ys = [p[1] for r in rings for p in r]
    return min(xs), min(ys), max(xs), max(ys)


def bbox_gap(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    dx = max(0.0, max(bx1 - ax2, ax1 - bx2))
    dy = max(0.0, max(by1 - ay2, ay1 - by2))
    return math.hypot(dx, dy)


def min_vertex_gap(ra, rb, cutoff):
    best = 9e9
    pb = [p for r in rb for p in r]
    for r in ra:
        for x1, y1 in r:
            for x2, y2 in pb:
                d = (x1 - x2) ** 2 + (y1 - y2) ** 2
                if d < best:
                    best = d
                    if best < cutoff:
                        return math.sqrt(best)
    return math.sqrt(best)


def haversine_km(a, b):
    lon1, lat1 = a; lon2, lat2 = b
    p = math.pi / 180
    h = (0.5 - math.cos((lat2 - lat1) * p) / 2
         + math.cos(lat1 * p) * math.cos(lat2 * p) * (1 - math.cos((lon2 - lon1) * p)) / 2)
    return round(12742 * math.asin(math.sqrt(h)), 2)


def main():
    b = json.load(open(os.path.join(HERE, "boundaries.json"), encoding="utf-8"))
    subs = {k: v for k, v in b.items() if v.get("ok")}
    for k, v in subs.items():
        if not v.get("postcode") and k in POSTCODES:
            v["postcode"] = POSTCODES[k]
        v["council_group"] = COUNCILS.get(v["zone"], "")
        v["bounds"] = bbox(v["rings"])

    cut = TOUCH_DEG ** 2
    keys = sorted(subs)
    adj = {k: [] for k in keys}
    checked = 0
    for a, c in itertools.combinations(keys, 2):
        A, C = subs[a], subs[c]
        if bbox_gap(A["bounds"], C["bounds"]) > TOUCH_DEG:
            continue
        checked += 1
        g = min_vertex_gap(A["rings"], C["rings"], cut)
        if g <= TOUCH_DEG:
            d = haversine_km(A["centroid"], C["centroid"])
            adj[a].append((d, c)); adj[c].append((d, a))

    # A handful of suburbs are cut off by national park or water and touch nothing in
    # the set. Backfill those from nearest centroid in the same zone so every page still
    # links somewhere sensible - flagged so the copy can say "nearby" not "neighbouring".
    for k in keys:
        adj[k].sort()
        near = [n for _, n in adj[k]]
        subs[k]["adjacent"] = near[:MAX_NEIGHBOURS]
        if len(near) < 3:
            same = sorted(
                ((haversine_km(subs[k]["centroid"], subs[o]["centroid"]), o)
                 for o in keys if o != k and o not in near and subs[o]["zone"] == subs[k]["zone"]))
            near = near + [o for _, o in same[:3 - len(near)]]
        subs[k]["neighbours"] = near[:MAX_NEIGHBOURS]
        subs[k]["neighbour_km"] = {
            n: haversine_km(subs[k]["centroid"], subs[n]["centroid"])
            for n in subs[k]["neighbours"]}

    json.dump(subs, open(os.path.join(HERE, "enriched.json"), "w", encoding="utf-8"),
              separators=(",", ":"))

    no_pc = [k for k in keys if not subs[k].get("postcode")]
    orphans = [k for k in keys if not subs[k]["neighbours"]]
    backfilled = [k for k in keys if len(subs[k]["adjacent"]) < 3]
    counts = [len(subs[k]["neighbours"]) for k in keys]
    print(f"{len(keys)} suburbs enriched, {checked} polygon pairs compared")
    print(f"neighbours: min {min(counts)}, max {max(counts)}, avg {sum(counts)/len(counts):.1f}")
    print(f"missing postcode: {no_pc or 'none'}")
    print(f"no neighbours   : {orphans or 'none'}")
    print(f"backfilled ({len(backfilled)}): {', '.join(backfilled) or 'none'}")
    for s in ("bondi", "mosman", "turramurra", "manly", "palm-beach"):
        if s in subs:
            print(f"  {s:16s} pc {subs[s]['postcode']}  ->  {', '.join(subs[s]['neighbours'])}")


if __name__ == "__main__":
    main()
