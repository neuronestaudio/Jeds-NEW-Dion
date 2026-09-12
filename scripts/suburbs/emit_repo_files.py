# -*- coding: utf-8 -*-
"""Emit the files that drop into the jed-air-solutions Astro repo."""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.environ.get("REPO_OUT", os.path.join(HERE, "repo"))
os.makedirs(os.path.join(OUT, "src", "data"), exist_ok=True)
os.makedirs(os.path.join(OUT, "src", "components"), exist_ok=True)

pages = json.load(open(os.path.join(HERE, "pages.json"), encoding="utf-8"))
bounds = json.load(open(os.path.join(HERE, "enriched.json"), encoding="utf-8"))
UPDATED = "2026-09-12"

ZONES = {
 "east":   ("eastern-suburbs", "Eastern Suburbs", "Eastern Suburbs"),
 "north":  ("lower-north-shore", "Lower North Shore", "Lower North Shore"),
 "upper":  ("upper-north-shore", "Upper North Shore & Hornsby", "Upper North Shore"),
 "beaches":("northern-beaches", "Northern Beaches", "Northern Beaches"),
}


def ts(s):
    return "'" + str(s).replace("\\", "\\\\").replace("'", "\\'") + "'"


# ─────────────────────────────────────────────── suburbAreas.ts
def emit_areas():
    L = []
    A = L.append
    A("// GENERATED — do not hand-edit. Regenerate with scripts/suburbs/emit_repo_files.py")
    A("// Source: OpenStreetMap gazetted boundaries + authored per-suburb attributes.")
    A(f"// Built {UPDATED}. {len(pages)} suburbs.")
    A("")
    A("export type AreaZone = 'east' | 'north' | 'upper' | 'beaches';")
    A("")
    A("export const AREA_ZONES: Record<AreaZone, { id: string; label: string; short: string }> = {")
    for k, (i, lab, short) in ZONES.items():
        A(f"  {k}: {{ id: {ts(i)}, label: {ts(lab)}, short: {ts(short)} }},")
    A("};")
    A("")
    A("export interface SuburbArea {")
    A("  slug: string;")
    A("  name: string;")
    A("  zone: AreaZone;")
    A("  /** Install archetype — drives the issues and FAQ blocks. */")
    A("  profile: string;")
    A("  postcode: string;")
    A("  /** Land area in km², computed from the boundary polygon. */")
    A("  areaKm2: number;")
    A("  /** [lng, lat] centroid of the boundary. */")
    A("  centre: [number, number];")
    A("  council: string;")
    A("  tagline: string;")
    A("  metaDescription: string;")
    A("  intro: string[];")
    A("  issues: { title: string; body: string }[];")
    A("  faq: { q: string; a: string }[];")
    A("  /** Slugs whose polygons actually touch this one, nearest first. */")
    A("  neighbours: string[];")
    A("  landmarks: string[];")
    A("  updated: string;")
    A("}")
    A("")
    A("export const SUBURB_AREAS: SuburbArea[] = [")
    for slug in sorted(pages):
        p = pages[slug]
        A("  {")
        A(f"    slug: {ts(p['slug'])},")
        A(f"    name: {ts(p['name'])},")
        A(f"    zone: {ts(p['zone'])},")
        A(f"    profile: {ts(p['profile'])},")
        A(f"    postcode: {ts(p['postcode'])},")
        A(f"    areaKm2: {p['areaKm2']},")
        A(f"    centre: [{p['centre'][0]}, {p['centre'][1]}],")
        A(f"    council: {ts(p['council'])},")
        A(f"    tagline: {ts(p['tagline'])},")
        A(f"    metaDescription: {ts(p['metaDescription'])},")
        A("    intro: [")
        for para in p["intro"]:
            A(f"      {ts(para)},")
        A("    ],")
        A("    issues: [")
        for t, b in p["issues"]:
            A(f"      {{ title: {ts(t)}, body: {ts(b)} }},")
        A("    ],")
        A("    faq: [")
        for q, a in p["faq"]:
            A(f"      {{ q: {ts(q)}, a: {ts(a)} }},")
        A("    ],")
        A("    neighbours: [" + ", ".join(ts(n) for n in p["neighbours"]) + "],")
        A("    landmarks: [" + ", ".join(ts(n) for n in p["landmarks"]) + "],")
        A(f"    updated: {ts(UPDATED)},")
        A("  },")
    A("];")
    A("")
    A("export const AREA_BY_SLUG = new Map(SUBURB_AREAS.map((s) => [s.slug, s]));")
    A("")
    A("export function areasInZone(zone: AreaZone) {")
    A("  return SUBURB_AREAS.filter((s) => s.zone === zone)")
    A("    .sort((a, b) => a.name.localeCompare(b.name));")
    A("}")
    p = os.path.join(OUT, "src", "data", "suburbAreas.ts")
    open(p, "w", encoding="utf-8").write("\n".join(L) + "\n")
    return p


# ─────────────────────────────────────────────── suburbBoundaries.ts
def emit_boundaries():
    L = []
    A = L.append
    A("// GENERATED — do not hand-edit.")
    A("// Gazetted suburb outlines from OpenStreetMap, simplified with Ramer-Douglas-Peucker")
    A("// to ~20 m tolerance and rounded to 5 decimal places. Rings are [lng, lat].")
    A("// Stored locally so no boundary API is ever called at runtime.")
    A("")
    A("export type Ring = [number, number][];")
    A("")
    A("export interface SuburbBoundary {")
    A("  rings: Ring[];")
    A("  /** [west, south, east, north] */")
    A("  bbox: [number, number, number, number];")
    A("}")
    A("")
    A("export const SUBURB_BOUNDARIES: Record<string, SuburbBoundary> = {")
    for slug in sorted(bounds):
        b = bounds[slug]
        rings = "[" + ",".join(
            "[" + ",".join(f"[{x},{y}]" for x, y in r) + "]" for r in b["rings"]) + "]"
        bb = b["bounds"]
        A(f"  {ts(slug)}: {{ rings: {rings}, bbox: [{bb[0]},{bb[1]},{bb[2]},{bb[3]}] }},")
    A("};")
    A("")
    A("/** GeoJSON FeatureCollection for one suburb — what the map component consumes. */")
    A("export function boundaryGeoJson(slug: string, name?: string) {")
    A("  const b = SUBURB_BOUNDARIES[slug];")
    A("  if (!b) return null;")
    A("  return {")
    A("    type: 'FeatureCollection' as const,")
    A("    features: b.rings.map((ring) => ({")
    A("      type: 'Feature' as const,")
    A("      properties: { name: name ?? slug },")
    A("      geometry: { type: 'Polygon' as const, coordinates: [ring] },")
    A("    })),")
    A("  };")
    A("}")
    p = os.path.join(OUT, "src", "data", "suburbBoundaries.ts")
    open(p, "w", encoding="utf-8").write("\n".join(L) + "\n")
    return p


# ─────────────────────────────────────────────── SuburbMap.astro
MAP_ASTRO = r"""---
/**
 * SuburbMap — draws a suburb's real gazetted boundary on a map.
 *
 * Uses Google Maps when PUBLIC_GOOGLE_MAPS_API_KEY is set, and falls back to
 * OpenStreetMap tiles via Leaflet when it is not, so the page never ships a broken
 * or empty map. The polygon is identical either way and is inlined as a prop, so
 * only this suburb's geometry reaches the browser — not all 116.
 */
import { boundaryGeoJson, SUBURB_BOUNDARIES } from '../data/suburbBoundaries';

interface Props {
  slug: string;
  name: string;
  /** [lng, lat] */
  centre: [number, number];
  height?: string;
  /** Boundary stroke. Defaults to the brand accent. */
  colour?: string;
}

const { slug, name, centre, height = '320px', colour = '#C4552E' } = Astro.props;

const geo = boundaryGeoJson(slug, name);
const bbox = SUBURB_BOUNDARIES[slug]?.bbox ?? null;
const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const id = `suburb-map-${slug}`;
---

{geo ? (
  <figure class="suburb-map" style={`--map-h:${height}`}>
    <div
      id={id}
      class="suburb-map__canvas"
      data-geo={JSON.stringify(geo)}
      data-bbox={JSON.stringify(bbox)}
      data-centre={JSON.stringify(centre)}
      data-colour={colour}
      data-key={apiKey}
      role="img"
      aria-label={`Map showing the boundary of ${name}`}
    />
    <figcaption>{name} service boundary</figcaption>
  </figure>
) : null}

<style>
  .suburb-map { margin: 0; }
  .suburb-map__canvas {
    height: var(--map-h, 320px);
    width: 100%;
    border: 1px solid hsl(var(--border, 0 0% 88%));
    border-radius: 0.6rem;
    overflow: hidden;
    background: hsl(var(--muted, 0 0% 96%));
  }
  .suburb-map figcaption {
    margin-top: 0.5rem;
    font-size: 0.78rem;
    opacity: 0.7;
  }
  :global(.leaflet-container) { font: inherit; }
</style>

<script>
  type Ring = [number, number][];

  function initOne(el: HTMLElement) {
    const geo = JSON.parse(el.dataset.geo!);
    const bbox = el.dataset.bbox ? JSON.parse(el.dataset.bbox) : null;
    const centre = JSON.parse(el.dataset.centre!) as [number, number];
    const colour = el.dataset.colour || '#C4552E';
    const key = el.dataset.key || '';

    if (key) {
      loadGoogle(key).then(() => drawGoogle(el, geo, bbox, centre, colour)).catch(() => drawLeaflet(el, geo, bbox, colour));
    } else {
      drawLeaflet(el, geo, bbox, colour);
    }
  }

  let googlePromise: Promise<void> | null = null;
  function loadGoogle(key: string) {
    if (googlePromise) return googlePromise;
    googlePromise = new Promise<void>((resolve, reject) => {
      if ((window as any).google?.maps) return resolve();
      const s = document.createElement('script');
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('maps failed'));
      document.head.appendChild(s);
    });
    return googlePromise;
  }

  function drawGoogle(el: HTMLElement, geo: any, bbox: number[] | null, centre: [number, number], colour: string) {
    const g = (window as any).google;
    const map = new g.maps.Map(el, {
      center: { lat: centre[1], lng: centre[0] },
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
    });
    map.data.addGeoJson(geo);
    map.data.setStyle({
      strokeColor: colour, strokeWeight: 2.5, strokeOpacity: 0.95,
      fillColor: colour, fillOpacity: 0.12, clickable: false,
    });
    if (bbox) {
      map.fitBounds(new g.maps.LatLngBounds(
        { lat: bbox[1], lng: bbox[0] },
        { lat: bbox[3], lng: bbox[2] },
      ), 16);
    }
  }

  async function drawLeaflet(el: HTMLElement, geo: any, bbox: number[] | null, colour: string) {
    await ensureLeaflet();
    const L = (window as any).L;
    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);
    const layer = L.geoJSON(geo, {
      style: { color: colour, weight: 2.5, opacity: 0.95, fillColor: colour, fillOpacity: 0.12 },
    }).addTo(map);
    map.fitBounds(layer.getBounds(), { padding: [14, 14] });
  }

  function ensureLeaflet(): Promise<void> {
    if ((window as any).L) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(css);
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('leaflet failed'));
      document.head.appendChild(s);
    });
  }

  // Only build the map once it is near the viewport — it is below the fold on every
  // suburb page and there is no reason to pay for it on load.
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        obs.unobserve(e.target);
        initOne(e.target as HTMLElement);
      }
    }
  }, { rootMargin: '200px' });

  document.querySelectorAll<HTMLElement>('.suburb-map__canvas').forEach((el) => io.observe(el));
</script>
"""


def emit_component():
    p = os.path.join(OUT, "src", "components", "SuburbMap.astro")
    open(p, "w", encoding="utf-8").write(MAP_ASTRO)
    return p


if __name__ == "__main__":
    for p in (emit_areas(), emit_boundaries(), emit_component()):
        print(f"  {os.path.relpath(p, OUT):48s} {os.path.getsize(p)//1024:>5} KB")
    print(f"\n{len(pages)} suburbs, {len(bounds)} boundaries -> {OUT}")
