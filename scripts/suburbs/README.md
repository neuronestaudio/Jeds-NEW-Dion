# Suburb page data

Generates `src/data/suburbs.ts` and `src/data/suburbBoundaries.ts` — 116 Sydney
suburb pages.

Nothing here runs at build time or at runtime. Boundaries are fetched once and
committed, so the site never calls a geocoding API.

## Regenerating

```bash
cd scripts/suburbs
python fetch_boundaries.py     # OpenStreetMap gazetted polygons, 1 req/sec
python patch_missing.py        # the four suburbs the main query misses
python enrich.py               # postcodes, area, centroid, polygon adjacency
python compose.py              # page copy — fails loudly on duplicate text
python emit_suburbs_ts.py      # -> src/data/suburbs.ts
python emit_repo_files.py      # -> src/data/suburbBoundaries.ts
```

On Windows, prefix with `PYTHONIOENCODING=utf-8`.

## The two rules this pipeline exists to enforce

**Neighbours are derived, not guessed.** `enrich.py` compares every pair of suburb
polygons whose bounding boxes come within 230 m and treats them as adjacent. That is
what makes the "also servicing" links read the way a local would draw them.

**No two pages may be the same sentence with the suburb swapped.** Google's
scaled-content policy can suppress a whole batch, not just the weak pages.
`compose.py` reports duplicate intro paragraphs after masking every proper noun, and
duplicate meta descriptions. Both must be zero.

Copy is composed from `suburb_facts.py` — the housing stock, terrain, install
constraint and recommended system for each suburb, across eight install archetypes.
That file is authored by hand and is the thing worth editing.

## Merge rule

`emit_suburbs_ts.py` preserves hand-written copy. Where a suburb already had a
`tagline`, `metaDescription`, `intro`, `issues` or `faq` in `suburbs.ts`, that text
wins and the generated copy is discarded. Only boundary-derived fields (area, centre,
neighbours, landmarks, profile) are overwritten. Regenerating is therefore safe.
