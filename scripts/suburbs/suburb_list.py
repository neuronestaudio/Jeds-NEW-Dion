# -*- coding: utf-8 -*-
"""The suburb build list for JED Air Conditioning.

Everything east of Homebush, grouped the way Sydney actually talks about itself.
Zone keys match the existing src/data/suburbs.ts `Zone` type, extended with two new
ones for the Northern Beaches and the Inner West.
"""

# zone -> list of suburb names exactly as OpenStreetMap/Geoscape name them
TARGETS = {
 "east": [
  "Bondi", "Bondi Beach", "Bondi Junction", "North Bondi", "Tamarama", "Bronte",
  "Waverley", "Clovelly", "Coogee", "South Coogee", "Randwick", "Kensington",
  "Kingsford", "Maroubra", "Matraville", "Malabar", "Little Bay", "Paddington",
  "Woollahra", "Double Bay", "Bellevue Hill", "Rose Bay", "Vaucluse", "Watsons Bay",
  "Dover Heights", "Point Piper", "Darling Point", "Edgecliff", "Rushcutters Bay",
  "Queens Park", "Centennial Park", "Eastgardens", "Daceyville", "Moore Park",
 ],
 "north": [
  "Mosman", "Cremorne", "Neutral Bay", "Kirribilli", "Milsons Point", "North Sydney",
  "McMahons Point", "Waverton", "Wollstonecraft", "Crows Nest", "St Leonards",
  "Naremburn", "Cammeray", "Northbridge", "Willoughby", "Artarmon", "Chatswood",
  "Lane Cove", "Lane Cove North", "Longueville", "Riverview", "Greenwich",
  "Hunters Hill", "Woolwich", "Castle Cove", "Middle Cove", "Roseville Chase",
  "Castlecrag",
 ],
 "upper": [
  "Roseville", "Lindfield", "Killara", "Gordon", "Pymble", "Turramurra", "Warrawee",
  "Wahroonga", "St Ives", "St Ives Chase", "East Killara", "North Turramurra",
  "South Turramurra", "Waitara", "Hornsby", "Normanhurst", "Thornleigh",
  "Pennant Hills", "Beecroft", "Cheltenham", "Asquith", "Mount Colah", "Berowra",
  "Wahroonga",
 ],
 "beaches": [
  "Manly", "Fairlight", "Balgowlah", "Balgowlah Heights", "Seaforth", "Clontarf",
  "Freshwater", "Curl Curl", "North Curl Curl", "Dee Why", "Narraweena", "Cromer",
  "Collaroy", "Narrabeen", "North Narrabeen", "Mona Vale", "Newport", "Avalon Beach",
  "Palm Beach", "Bilgola Plateau", "Warriewood", "Frenchs Forest", "Belrose",
  "Forestville", "Beacon Hill", "Allambie Heights", "Brookvale", "Queenscliff",
  "North Manly", "Terrey Hills", "Davidson",
 ],
}

# Already live on feat/astro-seo-north-east - keep their hand-written copy, only add
# the map + the new structured fields.
EXISTING = {
 "bondi", "bondi-junction", "double-bay", "rose-bay", "randwick", "edgecliff",
 "paddington", "coogee", "vaucluse", "chatswood", "mosman", "north-sydney",
 "lane-cove", "willoughby", "hornsby", "turramurra", "pymble", "manly", "dee-why",
}

ZONE_LABELS = {
 "east":    ("eastern-suburbs", "Eastern Suburbs", "Eastern Suburbs"),
 "north":   ("lower-north-shore", "Lower North Shore", "Lower North Shore"),
 "upper":   ("upper-north-shore", "Upper North Shore & Hornsby", "Upper North Shore"),
 "beaches": ("northern-beaches", "Northern Beaches", "Northern Beaches"),
}


def slugify(name):
    return name.lower().replace("'", "").replace(" ", "-")


def all_targets():
    seen, out = set(), []
    for zone, names in TARGETS.items():
        for n in names:
            s = slugify(n)
            if s in seen:
                continue
            seen.add(s)
            out.append((zone, n, s))
    return out


if __name__ == "__main__":
    t = all_targets()
    from collections import Counter
    c = Counter(z for z, _, _ in t)
    print(f"{len(t)} unique suburbs")
    for z, n in c.items():
        print(f"  {z:9s} {n}")
    new = [s for _, _, s in t if s not in EXISTING]
    print(f"already live: {len(EXISTING)}   new: {len(new)}")
