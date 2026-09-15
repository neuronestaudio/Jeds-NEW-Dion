# -*- coding: utf-8 -*-
"""Rewrite src/data/suburbs.ts with all 116 Sydney suburbs.

Merge rule: where a suburb already had hand-written copy, that copy wins. The
generated data only adds what the old file did not have — boundary-derived area and
centre, landmarks, the install profile, and neighbour slugs computed from the real
polygons (which turns several previously plain-text neighbours into real links).
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("SUBURBS_TS", os.path.join(HERE, "repo", "src", "data", "suburbs.ts"))
os.makedirs(os.path.dirname(OUT), exist_ok=True)

existing = {s["slug"]: s for s in json.load(open(os.path.join(HERE, "existing_suburbs.json"), encoding="utf-8"))}
pages = json.load(open(os.path.join(HERE, "pages.json"), encoding="utf-8"))

UPDATED = "2026-09-13"

PROFILE_GROUP = {
    "coastal": "beachside", "strata": "apartment", "heritage": "harbourside",
    "estate": "suburban", "steep": "harbourside", "bush": "suburban",
    "postwar": "suburban", "mixed": "suburban",
}
ZONE_DEFS = [
    ("north",    "lower-north-shore",  "Lower North Shore",           "Lower North Shore"),
    ("upper",    "upper-north-shore",  "Upper North Shore & Hornsby", "Upper North Shore"),
    ("beaches",  "northern-beaches",   "Northern Beaches",            "Northern Beaches"),
    ("east",     "eastern-suburbs",    "Eastern Suburbs",             "Eastern Suburbs"),
]
ZONE_ORDER = ["north", "upper", "beaches", "east"]


def q(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'") + "'"


def arr(items, indent):
    pad = " " * indent
    if not items:
        return "[]"
    return "[\n" + "".join(f"{pad}  {q(i)},\n" for i in items) + pad + "]"


def merged():
    out = []
    for slug in sorted(pages):
        gen = pages[slug]
        old = existing.get(slug)
        rec = {
            "slug": slug,
            "name": gen["name"],
            "zone": gen["zone"],
            "group": (old or {}).get("group") or PROFILE_GROUP[gen["profile"]],
            "profile": gen["profile"],
            "postcode": (old or {}).get("postcode") or gen["postcode"],
            "areaKm2": gen["areaKm2"],
            "centre": gen["centre"],
            "tagline": (old or {}).get("tagline") or gen["tagline"],
            "metaDescription": (old or {}).get("metaDescription") or gen["metaDescription"],
            "intro": (old or {}).get("intro") or gen["intro"],
            # polygon-derived, and an upgrade on the old hand-typed lists: every entry
            # is a slug that now has a page, so every neighbour becomes a real link
            "neighbours": gen["neighbours"],
            "landmarks": gen["landmarks"],
            "issues": (old or {}).get("issues") or [{"title": t, "body": b} for t, b in gen["issues"]],
            "faq": (old or {}).get("faq") or [{"q": a, "a": b} for a, b in gen["faq"]],
            "handwritten": bool(old),
            "updated": UPDATED if not old else old.get("updated", UPDATED),
        }
        out.append(rec)
    order = {z: i for i, z in enumerate(ZONE_ORDER)}
    out.sort(key=lambda r: (order[r["zone"]], r["name"]))
    return out


def emit(rows):
    L = []
    A = L.append
    A("import type { Faq, GroupKey, Issue } from './suburbGroups';")
    A("")
    A("/**")
    A(" * Service-area pages.")
    A(" *")
    A(" * Suburb boundaries, land area, centroid and the neighbour graph are derived from")
    A(" * OpenStreetMap's gazetted suburb polygons — see src/data/suburbBoundaries.ts and")
    A(" * scripts/suburbs/. Neighbours are the suburbs whose polygons actually touch this")
    A(" * one, nearest first, so 'also servicing' reads the way a local would draw it.")
    A(" *")
    A(" * Regenerate with scripts/suburbs/emit_suburbs_ts.py. Hand-written copy is")
    A(" * preserved across regeneration — see the merge rule in that script.")
    A(" */")
    A("")
    A("export type Zone = 'north' | 'upper' | 'beaches' | 'east';")
    A("")
    A("export const ZONES: Record<Zone, { id: string; label: string; short: string }> = {")
    for key, zid, label, short in ZONE_DEFS:
        A(f"  {key}: {{ id: {q(zid)}, label: {q(label)}, short: {q(short)} }},")
    A("};")
    A("")
    A("/** Install archetype — what actually changes the job in this suburb. */")
    A("export type Profile =")
    A("  | 'coastal' | 'strata' | 'heritage' | 'estate'")
    A("  | 'steep' | 'bush' | 'postwar' | 'mixed';")
    A("")
    A("export interface Suburb {")
    A("  slug: string;")
    A("  name: string;")
    A("  zone: Zone;")
    A("  group: GroupKey;")
    A("  profile?: Profile;")
    A("  postcode: string;")
    A("  /** Land area in km², computed from the boundary polygon. */")
    A("  areaKm2?: number;")
    A("  /** [lng, lat] centroid of the boundary polygon. */")
    A("  centre?: [number, number];")
    A("  /** Positioning line under the H1. */")
    A("  tagline: string;")
    A("  /** Meta description — unique per page, ≤160 chars. */")
    A("  metaDescription: string;")
    A("  /** Genuinely local intro copy. Only verifiable facts about the area. */")
    A("  intro: string[];")
    A("  /** Neighbouring suburb slugs, nearest first. */")
    A("  neighbours: string[];")
    A("  /** Real local reference points used in the copy. */")
    A("  landmarks?: string[];")
    A("  /** Suburb-specific issues, shown ahead of the group's. */")
    A("  issues?: Issue[];")
    A("  /** Suburb-specific FAQs, shown ahead of the group's. */")
    A("  faq?: Faq[];")
    A("  /** True where the intro was written by hand rather than composed. */")
    A("  handwritten?: boolean;")
    A("  /** ISO date of the last content change — drives the sitemap's lastmod. */")
    A("  updated: string;")
    A("}")
    A("")
    A("export const SUBURBS: Suburb[] = [")
    zone_seen = set()
    for r in rows:
        if r["zone"] not in zone_seen:
            zone_seen.add(r["zone"])
            label = dict((z[0], z[2]) for z in ZONE_DEFS)[r["zone"]]
            A(f"  // ─── {label} " + "─" * max(0, 60 - len(label)))
        A("  {")
        A(f"    slug: {q(r['slug'])},")
        A(f"    name: {q(r['name'])},")
        A(f"    zone: {q(r['zone'])},")
        A(f"    group: {q(r['group'])},")
        if r["profile"]:
            A(f"    profile: {q(r['profile'])},")
        A(f"    postcode: {q(r['postcode'])},")
        if r["areaKm2"] is not None:
            A(f"    areaKm2: {r['areaKm2']},")
        if r["centre"]:
            A(f"    centre: [{r['centre'][0]}, {r['centre'][1]}],")
        A(f"    tagline: {q(r['tagline'])},")
        A(f"    metaDescription:")
        A(f"      {q(r['metaDescription'])},")
        A("    intro: " + arr(r["intro"], 4) + ",")
        A("    neighbours: [" + ", ".join(q(n) for n in r["neighbours"]) + "],")
        if r["landmarks"]:
            A("    landmarks: [" + ", ".join(q(n) for n in r["landmarks"]) + "],")
        if r["issues"]:
            A("    issues: [")
            for i in r["issues"]:
                A("      {")
                A(f"        title: {q(i['title'])},")
                A(f"        body: {q(i['body'])},")
                A("      },")
            A("    ],")
        if r["faq"]:
            A("    faq: [")
            for f in r["faq"]:
                A("      {")
                A(f"        q: {q(f['q'])},")
                A(f"        a: {q(f['a'])},")
                A("      },")
            A("    ],")
        if r["handwritten"]:
            A("    handwritten: true,")
        A(f"    updated: {q(r['updated'])},")
        A("  },")
    A("];")
    A("")
    A("export const suburbBySlug = new Map(SUBURBS.map((s) => [s.slug, s]));")
    A("")
    A("export function suburbsInZone(zone: Zone): Suburb[] {")
    A("  return SUBURBS.filter((s) => s.zone === zone);")
    A("}")
    A("")
    A("/** Resolve a neighbour entry to a link where a page exists, else a plain label. */")
    A("export function neighbourLink(entry: string): { name: string; href?: string } {")
    A("  const page = suburbBySlug.get(entry);")
    A("  return page ? { name: page.name, href: `/service-area/${page.slug}` } : { name: entry };")
    A("}")
    open(OUT, "w", encoding="utf-8").write("\n".join(L) + "\n")


if __name__ == "__main__":
    rows = merged()
    emit(rows)
    from collections import Counter
    c = Counter(r["zone"] for r in rows)
    hw = sum(1 for r in rows if r["handwritten"])
    unresolved = sum(1 for r in rows for n in r["neighbours"]
                     if n not in {x["slug"] for x in rows})
    print(f"{len(rows)} suburb pages -> {OUT} ({os.path.getsize(OUT)//1024} KB)")
    for z in ZONE_ORDER:
        print(f"   {z:9s} {c[z]}")
    print(f"hand-written copy preserved: {hw}")
    print(f"neighbour slugs with no page: {unresolved}")
