# -*- coding: utf-8 -*-
"""Compose per-suburb page copy from real attributes.

The rule this file exists to enforce: no two pages may be the same sentence with the
suburb name swapped. Google calls that scaled/doorway content and it can suppress the
whole batch, not just the weak pages.

Two things keep these pages apart:
  1. The facts differ. Every page is built from that suburb's own housing stock,
     terrain, install constraint and system recommendation (suburb_facts.py), plus its
     real postcode, area, council group and polygon-derived neighbours.
  2. The structure differs. Openers, HVAC framing and closers are each chosen from a
     set by a stable hash of the slug, so neighbouring suburbs do not read alike.
"""
import hashlib, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
from suburb_facts import FACTS

ZONE_LABEL = {
 "east": "Eastern Suburbs", "north": "Lower North Shore",
 "upper": "Upper North Shore", "beaches": "Northern Beaches",
}
ZONE_PHRASE = {
 "east": "the Eastern Suburbs", "north": "the Lower North Shore",
 "upper": "the Upper North Shore", "beaches": "the Northern Beaches",
}


def pick(slug, salt, options):
    h = hashlib.md5(f"{slug}:{salt}".encode()).hexdigest()
    return options[int(h[:8], 16) % len(options)]


def land_sentence(name, terrain):
    """Terrain is written as a free phrase, so choose a lead-in that stays grammatical."""
    head = " ".join(terrain.split()[:7]).lower()
    if terrain.startswith(("a ", "an ", "one of")):
        return f"{name} sits on {terrain}."
    if any(w in head for w in ("blocks", "streets", "hillsides", "ridge", "valley", "plateau",
                               "peninsula", "bowl", "amphitheatre", "isthmus", "strip")):
        return f"{name} is built on {terrain}."
    return f"The land here is {terrain}."


def oxford(items):
    items = [i for i in items if i]
    if len(items) <= 1:
        return items[0] if items else ""
    if len(items) == 2:
        return f"{items[0]} and {items[1]}"
    return ", ".join(items[:-1]) + f" and {items[-1]}"


# ── paragraph 1 — what the suburb physically is ────────────────────────────────
OPENERS = [
 "{name} is made up of {stock}. {land}",
 "The housing in {name} runs to {stock}. {land}",
 "{land} The stock is {stock}.",
 "Walk {name} and the pattern is {stock}. {land}",
]

# ── paragraph 2 — what that means for the install ──────────────────────────────
HVAC = [
 "The thing that shapes almost every job here is simple enough: {hook}. For most homes "
 "in {name} that points to {system}, but we confirm it on site rather than over the phone.",

 "For air conditioning, one factor does most of the work in {name} — {hook}. That usually "
 "means {system}. What it actually means for your place is a question we answer on site.",

 "{Hook_cap}. It is the reason {system} suits most of {name}, and the reason we quote after "
 "looking at the roof space and the outdoor unit location, not before.",

 "Every {name} quote starts from the same constraint: {hook}. In practice that points to "
 "{system} — though roof space, ceiling cavity and where the outdoor unit can legally sit "
 "all get checked before we put a number on it.",
]

# ── paragraph 3 — proof, geography and process ────────────────────────────────
# Each of these pulls in that suburb's own postcode, area, neighbouring suburbs and
# landmarks, so the paragraph carries unique factual content rather than just a
# different set of proper nouns in a shared sentence.
CLOSERS = [
 "{Name} covers about {area} square kilometres in postcode {pc}, and we work {locals} "
 "regularly. Every quote is the same: a look at the roof space and the switchboard, a "
 "sizing calculation for the rooms you actually use, and a written price with nothing "
 "added later. We cover {nb} on the same run.",

 "{locals} are all inside our regular run through postcode {pc}. You get a free on-site "
 "assessment, a system sized to the rooms rather than the floor area, and a fixed written "
 "quote back within 24 hours. {nb_cap} are next door and booked the same week.",

 "At roughly {area} square kilometres, {name} is a short run for us, and {locals} are all "
 "inside it. Every quote is free, done on site, and back in writing within 24 hours with "
 "the make, model and capacity spelled out. We are in {nb} just as often.",

 "We are across {name} ({pc}) most weeks — {locals} included — and in {nb} on the same "
 "trips. Free on-site assessment, honest advice on whether you need a new system or just "
 "a service, and a written quote inside 24 hours.",
]

TAGLINES = {
 "coastal": ["Coastal installs built for salt air, not just square metres.",
             "Beachside systems specified to survive the salt.",
             "Salt-air protection and sensible outdoor-unit siting."],
 "strata":  ["Strata approvals, quiet placement and tidy line runs.",
             "Apartment installs done to the by-laws, not around them.",
             "Body-corporate ready systems for {name} apartments."],
 "heritage":["Concealed installs that leave a heritage frontage alone.",
             "Nothing visible from the street, nothing on the record.",
             "Heritage-sensitive work, planned before it is quoted."],
 "estate":  ["Multi-zone ducted for homes with real roof space.",
             "Zoned systems designed around how the house is used.",
             "Whole-home ducted, zoned properly the first time."],
 "steep":   ["Split-level homes, steep access, zoned properly.",
             "Steep blocks and multi-level homes, planned on site.",
             "Access-first design for {name}'s steep blocks."],
 "bush":    ["Bushland-edge installs with serviceable, protected plant.",
             "Long runs, leaf load and plant you can actually reach.",
             "Bush-block systems specified for debris and distance."],
 "postwar": ["Post-war roofs assessed before anything is promised.",
             "Low-pitch roofs, honest answers on what will fit.",
             "Ducted where the roof allows, multi-head where it does not."],
 "mixed":   ["Mixed housing, so every quote starts on site.",
             "Houses and units, each assessed on its own terms.",
             "No two {name} jobs are the same, so nothing is assumed."],
}

ISSUES = {
 "coastal": [("Salt-air corrosion on the outdoor unit",
   "Coastal air strips an untreated condenser coil years before its time. We specify "
   "corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind."),
  ("Outdoor unit placement on exposed blocks",
   "Wind exposure affects both efficiency and noise. Placement gets decided on site, not "
   "from a floor plan."),
  ("Condensate and drainage in humid air",
   "Higher humidity means more condensate. Drainage gets planned properly rather than "
   "run to the nearest garden bed.")],
 "strata": [("Body-corporate approval",
   "Most blocks need written approval before an outdoor unit goes up. We provide the "
   "specification, noise data and placement drawing strata will ask for."),
  ("Noise limits to neighbouring units",
   "Outdoor units near a neighbour's bedroom window cause more disputes than any other "
   "part of the job. We check clearances and select for sound power, not just capacity."),
  ("Common property penetrations",
   "Running pipework through common property has rules. We plan the route before quoting "
   "so there are no surprises at approval stage.")],
 "heritage": [("Nothing visible from the street",
   "Conservation controls generally rule out street-facing equipment. Outdoor units go to "
   "the rear, the side or the lane, and line runs are concealed."),
  ("Working around original fabric",
   "Lath and plaster ceilings, slate roofs and original joinery all need care. We plan "
   "penetrations to avoid them rather than patch afterwards."),
  ("Limited or no roof cavity",
   "Many period homes have little usable roof space. Where ducted will not fit honestly, "
   "we say so and design around it.")],
 "estate": [("Zoning a large floor plan",
   "One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is "
   "designed around the rooms actually in use at each time of day."),
  ("Duct run length and static pressure",
   "Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts "
   "for the run, not just the room."),
  ("Roof access on period rooftops",
   "Slate and terracotta need an installer who has worked on them before. Access is "
   "planned and protected.")],
 "steep": [("Equipment access on steep blocks",
   "On some blocks the plant has to be carried, winched or craned in. We work that out "
   "during the assessment so the quote holds."),
  ("Zoning across split levels",
   "Heat behaves differently on each level of a split-level home. Separate zones — "
   "sometimes separate systems — are what make it comfortable."),
  ("Line-run length between indoor and outdoor units",
   "Steep sites push the outdoor unit further from the indoor. Refrigerant line length "
   "affects performance and gets designed for, not ignored.")],
 "bush": [("Leaf litter in the condenser",
   "Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it "
   "for airflow and easy clearing, and cover it in the service plan."),
  ("Long duct runs on large blocks",
   "Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is "
   "the most common reason a system underperforms."),
  ("Bushfire-interface considerations",
   "On interface blocks, outdoor unit placement and screening are worth getting right. "
   "We work to the relevant standard for the site.")],
 "postwar": [("Low-pitch roofs and tight ceiling cavities",
   "Post-war roofs often have far less usable cavity than owners expect. We measure it "
   "before promising ducted."),
  ("Original insulation and wiring",
   "Older ceiling spaces bring their own surprises. We check the switchboard capacity at "
   "the same visit."),
  ("Bulkhead and multi-head alternatives",
   "Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the "
   "same result without pretending the roof space exists.")],
 "mixed": [("Two very different housing types",
   "The same street can hold a freestanding home and a walk-up block. The right system "
   "differs completely between them."),
  ("Roof space varies house to house",
   "Assessment on site is the only reliable way to know whether ducted is realistic."),
  ("Strata where it applies",
   "For the unit stock, approval and placement come before capacity.")],
}

FAQ_BY_PROFILE = {
 "coastal": [("Will the salt air wreck my outdoor unit in {name}?",
   "It will shorten its life if the unit is not specified for it. We use corrosion-treated "
   "coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden "
   "wind. A rinse-down as part of an annual service does the rest."),
  ("How often should a system near the beach be serviced?",
   "Annually at minimum for coastal properties. Salt accelerates everything, and an annual "
   "service is also what keeps most manufacturer warranties valid.")],
 "strata": [("Do I need strata approval for air conditioning in {name}?",
   "Almost always, yes — the outdoor unit usually sits on common property or an external "
   "wall. We give you the model specification, sound data and a placement plan to submit, "
   "and we work to whatever the by-laws allow."),
  ("Can you install without drilling through common property?",
   "Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. "
   "We work that out at the assessment and tell you honestly what the building will allow.")],
 "heritage": [("Will an air conditioner affect my heritage listing in {name}?",
   "Not if it is planned properly. The controls are about what is visible and what fabric is "
   "altered. We keep plant off the street elevation and conceal line runs, which is usually "
   "what an assessment turns on."),
  ("Can ducted go into a period home with no roof space?",
   "Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. "
   "Where it genuinely will not fit we will tell you, rather than force it and leave you "
   "with a system that underperforms.")],
 "estate": [("How many zones does a home in {name} actually need?",
   "For most homes on these blocks, four to eight. The number matters less than where the "
   "boundaries sit — zones should follow how the house is used through the day, not just "
   "the floor plan."),
  ("Is one ducted system enough for a large home?",
   "Usually, if it is sized and zoned properly. On very large or long homes, two smaller "
   "systems can run more efficiently than one oversized one — we will tell you which applies.")],
 "steep": [("Can you get equipment into a steep block in {name}?",
   "Yes, but how we do it changes the plan. Some sites are a straightforward carry, some "
   "need a winch or a crane. We establish that at the assessment so the quote does not move."),
  ("Should a split-level home have one system or two?",
   "It depends on the fall between levels and how the rooms are used. Zoning one system "
   "handles most homes; a genuinely separated lower level sometimes justifies its own.")],
 "bush": [("How much maintenance does a system on a bush block need?",
   "More than an open suburban block, mostly because of leaf litter in the condenser. An "
   "annual service and a clear surround handles it. We site the outdoor unit so it can "
   "actually be reached."),
  ("Does bushfire risk change where the outdoor unit goes?",
   "On interface blocks it can. Placement, screening and materials are worth getting right, "
   "and we work to the standard that applies to the site.")],
 "postwar": [("Can I get ducted air conditioning in a post-war home in {name}?",
   "Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity "
   "than they look like they do. We measure before we promise — and where it will not fit, "
   "a bulkhead run or multi-head system gets you the same comfort."),
  ("Is my switchboard up to running ducted?",
   "Sometimes it is not, particularly on original post-war boards. We check capacity at the "
   "assessment so any electrical work is in the quote rather than a surprise later.")],
 "mixed": [("What system suits a home in {name}?",
   "It depends which part of {name} you are in — the housing is genuinely mixed here. Roof "
   "space, ceiling cavity and whether you are in strata all change the answer, which is why "
   "the assessment is on site and free."),
  ("How long does an installation take?",
   "A single split system is usually a day. Ducted is typically one to two days depending "
   "on the layout and how much roof access there is.")],
}


def compose(slug, b):
    f = FACTS[slug]
    name = b["name"]
    zone = b["zone"]
    prof = f["profile"]
    locals_ = oxford(f["local"])
    hook = f["hook"]
    land = land_sentence(name, f["terrain"])

    p1 = pick(slug, "open", OPENERS).format(name=name, stock=f["stock"], land=land)
    p2 = pick(slug, "hvac", HVAC).format(
        name=name, hook=hook, Hook_cap=hook[0].upper() + hook[1:], system=f["system"])
    nb_names = [n.replace("-", " ").title() for n in b["neighbours"][:3]]
    nb = oxford(nb_names)
    p3 = pick(slug, "close", CLOSERS).format(
        name=name, Name=name, locals=locals_, pc=b["postcode"],
        area=f"{b['area_km2']:.1f}", nb=nb, nb_cap=nb)

    tagline = pick(slug, "tag", TAGLINES[prof]).format(name=name)

    meta = (f"Air conditioning installation, service and repairs in {name} {b['postcode']}. "
            f"{f['system'][0].upper() + f['system'][1:]}. Daikin & Haier certified, free quotes.")
    if len(meta) > 160:
        meta = (f"Air conditioning installation, service and repairs in {name} {b['postcode']}. "
                f"Daikin & Haier certified installers. Free on-site quotes.")
    if len(meta) > 160:
        meta = f"Air conditioning installation, service and repairs in {name} {b['postcode']}. Free quotes."

    faqs = [(q.format(name=name), a.format(name=name)) for q, a in FAQ_BY_PROFILE[prof]]
    issues = ISSUES[prof]

    return {
        "slug": slug, "name": name, "zone": zone, "zoneLabel": ZONE_LABEL[zone],
        "zonePhrase": ZONE_PHRASE[zone], "profile": prof,
        "postcode": b["postcode"], "areaKm2": b["area_km2"],
        "centre": b["centroid"], "bounds": b["bounds"],
        "council": b.get("council_group", ""),
        "tagline": tagline, "metaDescription": meta,
        "intro": [p1, p2, p3],
        "issues": issues, "faq": faqs,
        "neighbours": b["neighbours"], "neighbourKm": b["neighbour_km"],
        "adjacent": b.get("adjacent", []),
        "landmarks": f["local"], "system": f["system"], "hook": hook,
    }


def build_all():
    b = json.load(open(os.path.join(HERE, "enriched.json"), encoding="utf-8"))
    return {s: compose(s, v) for s, v in sorted(b.items()) if s in FACTS}


if __name__ == "__main__":
    pages = build_all()
    json.dump(pages, open(os.path.join(HERE, "pages.json"), "w", encoding="utf-8"),
              indent=1, ensure_ascii=False)
    # uniqueness check - the whole point of the file
    intros = {}
    for s, p in pages.items():
        for para in p["intro"]:
            key = re.sub(r"[A-Z][a-z]+", "X", para)
            intros.setdefault(key, []).append(s)
    dupes = {k: v for k, v in intros.items() if len(v) > 1}
    metas = {}
    for s, p in pages.items():
        metas.setdefault(p["metaDescription"], []).append(s)
    meta_dupes = {k: v for k, v in metas.items() if len(v) > 1}
    over = [s for s, p in pages.items() if len(p["metaDescription"]) > 160]
    print(f"{len(pages)} pages composed")
    print(f"intro paragraphs identical after name-masking: {len(dupes)}")
    for k, v in list(dupes.items())[:5]:
        print(f"   {len(v)}x {v[:4]} :: {k[:90]}")
    print(f"duplicate meta descriptions: {len(meta_dupes)}")
    print(f"meta descriptions over 160 chars: {len(over)}")
    avg = sum(len(" ".join(p["intro"]).split()) for p in pages.values()) / len(pages)
    print(f"average intro length: {avg:.0f} words")
