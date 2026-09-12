import type { Faq, GroupKey, Issue } from './suburbGroups';

/**
 * Service-area pages.
 *
 * Suburb boundaries, land area, centroid and the neighbour graph are derived from
 * OpenStreetMap's gazetted suburb polygons — see src/data/suburbBoundaries.ts and
 * scripts/suburbs/. Neighbours are the suburbs whose polygons actually touch this
 * one, nearest first, so 'also servicing' reads the way a local would draw it.
 *
 * Regenerate with scripts/suburbs/emit_suburbs_ts.py. Hand-written copy is
 * preserved across regeneration — see the merge rule in that script.
 */

export type Zone = 'north' | 'upper' | 'beaches' | 'east' | 'regional';

export const ZONES: Record<Zone, { id: string; label: string; short: string }> = {
  north: { id: 'lower-north-shore', label: 'Lower North Shore', short: 'Lower North Shore' },
  upper: { id: 'upper-north-shore', label: 'Upper North Shore & Hornsby', short: 'Upper North Shore' },
  beaches: { id: 'northern-beaches', label: 'Northern Beaches', short: 'Northern Beaches' },
  east: { id: 'eastern-suburbs', label: 'Eastern Suburbs', short: 'Eastern Suburbs' },
  regional: { id: 'regional', label: 'Regional NSW & ACT', short: 'Regional' },
};

/** Install archetype — what actually changes the job in this suburb. */
export type Profile =
  | 'coastal' | 'strata' | 'heritage' | 'estate'
  | 'steep' | 'bush' | 'postwar' | 'mixed';

export interface Suburb {
  slug: string;
  name: string;
  zone: Zone;
  group: GroupKey;
  /** Absent on the regional pages, which are not a single suburb. */
  profile?: Profile;
  postcode: string;
  /** Land area in km², computed from the boundary polygon. */
  areaKm2?: number;
  /** [lng, lat] centroid of the boundary polygon. */
  centre?: [number, number];
  /** Positioning line under the H1. */
  tagline: string;
  /** Meta description — unique per page, ≤160 chars. */
  metaDescription: string;
  /** Genuinely local intro copy. Only verifiable facts about the area. */
  intro: string[];
  /** Neighbouring suburb slugs, nearest first. */
  neighbours: string[];
  /** Real local reference points used in the copy. */
  landmarks?: string[];
  /** Suburb-specific issues, shown ahead of the group's. */
  issues?: Issue[];
  /** Suburb-specific FAQs, shown ahead of the group's. */
  faq?: Faq[];
  /** True where the intro was written by hand rather than composed. */
  handwritten?: boolean;
  /** ISO date of the last content change — drives the sitemap's lastmod. */
  updated: string;
}

export const SUBURBS: Suburb[] = [
  // ─── Lower North Shore ───────────────────────────────────────────
  {
    slug: 'artarmon',
    name: 'Artarmon',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2064',
    areaKm2: 2.54,
    centre: [151.186042, -33.810965],
    tagline: 'No two Artarmon jobs are the same, so nothing is assumed.',
    metaDescription:
      'Air conditioning installation, service and repairs in Artarmon 2064. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Artarmon and the pattern is federation and interwar homes on the residential side, apartments near the station, light industry to the west. Artarmon is built on level, with easy access on most streets.',
      'One suburb with genuinely different jobs — houses, apartments and commercial units. It is the reason ducted residentially, cassette and split systems commercially suits most of Artarmon, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Artarmon (2064) most weeks — Hampden Road, Artarmon Reserve and Gore Hill included — and in Willoughby, St Leonards and Naremburn on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['willoughby', 'st-leonards', 'naremburn', 'chatswood', 'lane-cove', 'greenwich'],
    landmarks: ['Hampden Road', 'Artarmon Reserve', 'Gore Hill'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Artarmon?',
        a: 'It depends which part of Artarmon you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'cammeray',
    name: 'Cammeray',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2062',
    areaKm2: 1.58,
    centre: [151.214215, -33.822188],
    tagline: 'Mixed housing, so every quote starts on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Cammeray 2062. Ducted for the houses, multi-head for the flats. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is undulating, with the golf course and Tunks Park shaping the lower streets. The stock is federation and interwar homes with a band of apartments along Miller Street.',
      'The thing that shapes almost every job here is simple enough: mixed stock where the same street can hold a bungalow and a walk-up block. For most homes in Cammeray that points to ducted for the houses, multi-head for the flats, but we confirm it on site rather than over the phone.',
      'Miller Street, Cammeray Golf Course and Tunks Park are all inside our regular run through postcode 2062. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Crows Nest, Cremorne and Northbridge are next door and booked the same week.',
    ],
    neighbours: ['crows-nest', 'cremorne', 'northbridge', 'naremburn', 'neutral-bay', 'north-sydney'],
    landmarks: ['Miller Street', 'Cammeray Golf Course', 'Tunks Park'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Cammeray?',
        a: 'It depends which part of Cammeray you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'castle-cove',
    name: 'Castle Cove',
    zone: 'north',
    group: 'suburban',
    profile: 'bush',
    postcode: '2069',
    areaKm2: 2.25,
    centre: [151.214958, -33.786099],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Castle Cove 2069. Zoned ducted with accessible outdoor plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Castle Cove runs to post-war and modern split-level homes on bush blocks above Middle Harbour. The land here is steep, treed and bounded by Garigal National Park.',
      'Split-level bush homes where zoning matters and condensers fill with leaf litter. It is the reason zoned ducted with accessible outdoor plant suits most of Castle Cove, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Castle Cove covers about 2.2 square kilometres in postcode 2069, and we work Deepwater Road, Castle Cove Golf Club and Middle Harbour regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Middle Cove, Roseville Chase and Roseville on the same run.',
    ],
    neighbours: ['middle-cove', 'roseville-chase', 'roseville', 'chatswood'],
    landmarks: ['Deepwater Road', 'Castle Cove Golf Club', 'Middle Harbour'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'castlecrag',
    name: 'Castlecrag',
    zone: 'north',
    group: 'suburban',
    profile: 'bush',
    postcode: '2068',
    areaKm2: 1.51,
    centre: [151.219579, -33.800555],
    tagline: 'Bush-block systems specified for debris and distance.',
    metaDescription:
      'Air conditioning installation, service and repairs in Castlecrag 2068. Concealed ducted, plant sited off the sightlines. Daikin & Haier certified, free quotes.',
    intro: [
      'Castlecrag is made up of Griffin-designed and modernist homes on bush blocks, many heritage-listed. The land here is steep, rocky and heavily treed with narrow winding streets.',
      'For air conditioning, one factor does most of the work in Castlecrag — architecturally significant homes where the install must not read on the building at all. That usually means concealed ducted, plant sited off the sightlines. What it actually means for your place is a question we answer on site.',
      'At roughly 1.5 square kilometres, Castlecrag is a short run for us, and The Griffin houses, Edinburgh Road and Sugarloaf Bay are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Middle Cove, Northbridge and Willoughby just as often.',
    ],
    neighbours: ['middle-cove', 'northbridge', 'willoughby'],
    landmarks: ['The Griffin houses', 'Edinburgh Road', 'Sugarloaf Bay'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'chatswood',
    name: 'Chatswood',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2067',
    areaKm2: 4.94,
    centre: [151.181107, -33.796254],
    tagline: 'High-rise units by the station, established homes on the streets around them.',
    metaDescription:
      'Air conditioning installation, service and repairs in Chatswood. Strata-ready apartment systems and ducted installs for established homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Chatswood’s centre — Westfield, Chatswood Chase, Victoria Avenue and the rail and metro interchange — is ringed by high-rise apartment towers, while the streets east and west settle into established houses on generous blocks. The two halves need different thinking: strata-approved, quiet apartment installs near the station, and ducted or multi-head systems for the houses.',
      'Apartment jobs here turn on where the outdoor unit can go and what the building’s by-laws allow. The houses are more often ducted retrofits into existing roof spaces, sized and zoned for family homes.',
    ],
    neighbours: ['roseville', 'artarmon', 'willoughby', 'lane-cove-north', 'lindfield', 'middle-cove'],
    landmarks: ['Victoria Avenue', 'Chatswood Chase', 'the Concourse'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Chatswood?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'cremorne',
    name: 'Cremorne',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2090',
    areaKm2: 1.64,
    centre: [151.226056, -33.826827],
    tagline: 'Apartment installs done to the by-laws, not around them.',
    metaDescription:
      'Air conditioning installation, service and repairs in Cremorne 2090. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Cremorne sits on a ridge with steep fall to both Neutral and Shell Coves. The stock is a dense band of interwar and 1960s apartment blocks, with federation homes towards the point.',
      'The thing that shapes almost every job here is simple enough: one of the highest apartment densities on the North Shore — strata approval is the first step. For most homes in Cremorne that points to multi-head splits, with ducted reserved for the freestanding stock, but we confirm it on site rather than over the phone.',
      'Cremorne covers about 1.6 square kilometres in postcode 2090, and we work Military Road, The Orpheum and Cremorne Point regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Neutral Bay, Cammeray and Mosman on the same run.',
    ],
    neighbours: ['neutral-bay', 'cammeray', 'mosman'],
    landmarks: ['Military Road', 'The Orpheum', 'Cremorne Point'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Cremorne?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'crows-nest',
    name: 'Crows Nest',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2065',
    areaKm2: 0.76,
    centre: [151.203627, -33.825857],
    tagline: 'Body-corporate ready systems for Crows Nest apartments.',
    metaDescription:
      'Air conditioning installation, service and repairs in Crows Nest 2065. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Crows Nest is built on ridge-top, level, with rear lanes behind many terrace rows. The stock is terraces and workers cottages alongside a heavy band of apartments near the highway.',
      'Every Crows Nest quote starts from the same constraint: terraces with no side access and apartments with strict by-laws, often on the same street. In practice that points to multi-head splits, concealed runs, lane-side plant — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Crows Nest covers about 0.8 square kilometres in postcode 2065, and we work Willoughby Road, Hume Street Park and the Pacific Highway regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Naremburn, St Leonards and Cammeray on the same run.',
    ],
    neighbours: ['naremburn', 'st-leonards', 'cammeray', 'wollstonecraft', 'north-sydney', 'waverton'],
    landmarks: ['Willoughby Road', 'Hume Street Park', 'the Pacific Highway'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Crows Nest?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'greenwich',
    name: 'Greenwich',
    zone: 'north',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2065',
    areaKm2: 1.66,
    centre: [151.184805, -33.829431],
    tagline: 'Access-first design for Greenwich\'s steep blocks.',
    metaDescription:
      'Air conditioning installation, service and repairs in Greenwich 2065. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is steep fall to the river on both sides of the ridge. The stock is federation homes and cottages on steep harbourside streets, with a small unit pocket.',
      'Every Greenwich quote starts from the same constraint: steep streets and older homes with modest ceiling cavities. In practice that points to compact ducted where possible, multi-head where it is not — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'We are across Greenwich (2065) most weeks — Greenwich Road, Greenwich Wharf and Gore Cove included — and in Wollstonecraft, St Leonards and Artarmon on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['wollstonecraft', 'st-leonards', 'artarmon', 'lane-cove'],
    landmarks: ['Greenwich Road', 'Greenwich Wharf', 'Gore Cove'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Greenwich?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'hunters-hill',
    name: 'Hunters Hill',
    zone: 'north',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2110',
    areaKm2: 3.64,
    centre: [151.145639, -33.830658],
    tagline: 'Heritage-sensitive work, planned before it is quoted.',
    metaDescription:
      'Air conditioning installation, service and repairs in Hunters Hill 2110. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Hunters Hill sits on a leafy peninsula with steep water-frontage streets. The stock is sandstone and federation homes across one of Sydney\'s largest heritage conservation areas.',
      'One of Sydney\'s strictest heritage areas — nothing visible from the street survives assessment. It is the reason fully concealed ducted with plant screened at the rear suits most of Hunters Hill, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 3.6 square kilometres, Hunters Hill is a short run for us, and Gladesville Bridge, Boronia Park and Woolwich Road are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Longueville, Woolwich and Riverview just as often.',
    ],
    neighbours: ['longueville', 'woolwich', 'riverview'],
    landmarks: ['Gladesville Bridge', 'Boronia Park', 'Woolwich Road'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Hunters Hill?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'kirribilli',
    name: 'Kirribilli',
    zone: 'north',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2061',
    areaKm2: 0.44,
    centre: [151.215956, -33.84771],
    tagline: 'Nothing visible from the street, nothing on the record.',
    metaDescription:
      'Air conditioning installation, service and repairs in Kirribilli 2061. Compact multi-head systems with concealed runs. Daikin & Haier certified, free quotes.',
    intro: [
      'Kirribilli sits on a steep harbour peninsula with very limited street access. The stock is art-deco apartment buildings and a small number of heritage houses.',
      'Every Kirribilli quote starts from the same constraint: heritage buildings and harbour views mean plant has to be invisible and quiet. In practice that points to compact multi-head systems with concealed runs — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Kirribilli House, Burton Street and Jeffrey Street Wharf are all inside our regular run through postcode 2061. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Milsons Point, North Sydney and Mcmahons Point are next door and booked the same week.',
    ],
    neighbours: ['milsons-point', 'north-sydney', 'mcmahons-point'],
    landmarks: ['Kirribilli House', 'Burton Street', 'Jeffrey Street Wharf'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Kirribilli?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'lane-cove',
    name: 'Lane Cove',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2066',
    areaKm2: 2.57,
    centre: [151.167053, -33.817539],
    tagline: 'Leafy standalone homes and newer apartments around the village.',
    metaDescription:
      'Air conditioning installation, service and repairs in Lane Cove. Ducted retrofits for leafy standalone homes and multi-head systems for apartments near the village. Daikin & Haier certified.',
    intro: [
      'Lane Cove pairs a village centre on Longueville Road with quiet, tree-lined streets of standalone homes running towards the Lane Cove River and national park, plus newer apartment buildings close to the village. Most residential work here is ducted air conditioning retrofitted into existing homes, sized and zoned for family use.',
      'The bushland edge means heavy tree cover on many blocks — good for the street, but something we place outdoor units away from so leaf litter doesn’t choke airflow. Apartment installs near the village follow the usual strata process.',
    ],
    neighbours: ['riverview', 'longueville', 'lane-cove-north', 'artarmon', 'greenwich'],
    landmarks: ['Longueville Road', 'Lane Cove Plaza', 'Lane Cove National Park'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Lane Cove?',
        a: 'It depends which part of Lane Cove you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'lane-cove-north',
    name: 'Lane Cove North',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2066',
    areaKm2: 2.34,
    centre: [151.161703, -33.805957],
    tagline: 'Mixed housing, so every quote starts on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Lane Cove North 2066. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Lane Cove North is made up of post-war homes and a substantial newer apartment precinct at Mowbray Road. The land here is gently undulating, with parkland to the north.',
      'New apartment stock alongside post-war houses with low-pitch roofs. It is the reason splits in the new blocks, ducted or bulkhead in the older homes suits most of Lane Cove North, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Mowbray Road, Blackman Park and Epping Road are all inside our regular run through postcode 2066. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Lane Cove, Chatswood and Artarmon are next door and booked the same week.',
    ],
    neighbours: ['lane-cove', 'chatswood', 'artarmon'],
    landmarks: ['Mowbray Road', 'Blackman Park', 'Epping Road'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Lane Cove North?',
        a: 'It depends which part of Lane Cove North you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'longueville',
    name: 'Longueville',
    zone: 'north',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2066',
    areaKm2: 1.0,
    centre: [151.168851, -33.829341],
    tagline: 'Split-level homes, steep access, zoned properly.',
    metaDescription:
      'Air conditioning installation, service and repairs in Longueville 2066. Zoned ducted with carefully sited outdoor units. Daikin & Haier certified, free quotes.',
    intro: [
      'Longueville sits on a steep peninsula with narrow streets and water frontage. The stock is large freestanding homes on tightly held waterfront and near-waterfront blocks.',
      'For air conditioning, one factor does most of the work in Longueville — steep peninsula blocks where plant placement and line runs need planning before quoting. That usually means zoned ducted with carefully sited outdoor units. What it actually means for your place is a question we answer on site.',
      'Longueville Road, Kingsford Smith Oval and Woodford Bay are all inside our regular run through postcode 2066. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Riverview, Lane Cove and Hunters Hill are next door and booked the same week.',
    ],
    neighbours: ['riverview', 'lane-cove', 'hunters-hill'],
    landmarks: ['Longueville Road', 'Kingsford Smith Oval', 'Woodford Bay'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Longueville?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'mcmahons-point',
    name: 'McMahons Point',
    zone: 'north',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2060',
    areaKm2: 0.36,
    centre: [151.203031, -33.844909],
    tagline: 'Access-first design for McMahons Point\'s steep blocks.',
    metaDescription:
      'Air conditioning installation, service and repairs in McMahons Point 2060. Compact splits and multi-heads. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk McMahons Point and the pattern is terraces and cottages stepping down to the water, with apartment blocks at the ridge. McMahons Point is built on very steep, narrow streets with harbour frontage.',
      'Every McMahons Point quote starts from the same constraint: narrow steep streets where equipment often has to be carried rather than driven in. In practice that points to compact splits and multi-heads — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'We are across McMahons Point (2060) most weeks — Blues Point Road, Lavender Bay and Henry Lawson Avenue included — and in Waverton, North Sydney and Milsons Point on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['waverton', 'north-sydney', 'milsons-point'],
    landmarks: ['Blues Point Road', 'Lavender Bay', 'Henry Lawson Avenue'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in McMahons Point?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'middle-cove',
    name: 'Middle Cove',
    zone: 'north',
    group: 'suburban',
    profile: 'bush',
    postcode: '2068',
    areaKm2: 1.12,
    centre: [151.212179, -33.792479],
    tagline: 'Long runs, leaf load and plant you can actually reach.',
    metaDescription:
      'Air conditioning installation, service and repairs in Middle Cove 2068. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Middle Cove and the pattern is detached split-level homes on large bushland blocks. The land here is steep and heavily treed, backing onto reserve.',
      'The thing that shapes almost every job here is simple enough: long duct runs across split levels, and plant that has to stay clear of the canopy. For most homes in Middle Cove that points to zoned ducted systems, but we confirm it on site rather than over the phone.',
      'Middle Cove covers about 1.1 square kilometres in postcode 2068, and we work Sugarloaf Bay, Harold Reid Reserve and Eastern Valley Way regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Castle Cove, Castlecrag and Chatswood on the same run.',
    ],
    neighbours: ['castle-cove', 'castlecrag', 'chatswood', 'roseville'],
    landmarks: ['Sugarloaf Bay', 'Harold Reid Reserve', 'Eastern Valley Way'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'milsons-point',
    name: 'Milsons Point',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2061',
    areaKm2: 0.19,
    centre: [151.211342, -33.84711],
    tagline: 'Strata approvals, quiet placement and tidy line runs.',
    metaDescription:
      'Air conditioning installation, service and repairs in Milsons Point 2061. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is steep and compact, with almost no off-street work space. The stock is high-rise apartments at the bridge approach, a handful of heritage terraces.',
      'For air conditioning, one factor does most of the work in Milsons Point — high-rise work where crane access and building rules set the schedule, not the weather. That usually means multi-head and ducted cassette systems within building provisions. What it actually means for your place is a question we answer on site.',
      'Milsons Point covers about 0.2 square kilometres in postcode 2061, and we work Luna Park, the Harbour Bridge and Alfred Street regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Kirribilli, North Sydney and Mcmahons Point on the same run.',
    ],
    neighbours: ['kirribilli', 'north-sydney', 'mcmahons-point'],
    landmarks: ['Luna Park', 'the Harbour Bridge', 'Alfred Street'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Milsons Point?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'mosman',
    name: 'Mosman',
    zone: 'north',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2088',
    areaKm2: 8.69,
    centre: [151.244663, -33.829076],
    tagline: 'Federation homes and harbourside apartments from Military Road to Balmoral.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Mosman. Discreet ducted retrofits for federation homes and quiet apartment installs near Balmoral. Daikin & Haier certified.',
    intro: [
      'Mosman is largely federation and inter-war homes on the slopes running down to the harbour, with apartments along Military Road, Spit Road and the Balmoral Beach end. Heritage streetscapes, steep blocks and mature gardens are the norm, so where an outdoor unit sits and how the pipework is routed are decided during the site visit, not on install day.',
      'Concealed ducted systems suit the larger family homes; multi-head splits with discreet indoor units cover the apartments and the homes where roof space won’t take ducting. Balmoral-side properties get some harbour salt air, which we account for in unit selection.',
    ],
    neighbours: ['cremorne', 'seaforth', 'neutral-bay'],
    landmarks: ['Military Road', 'Balmoral Beach', 'Taronga Zoo'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Mosman?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'naremburn',
    name: 'Naremburn',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2065',
    areaKm2: 1.27,
    centre: [151.200663, -33.816918],
    tagline: 'Houses and units, each assessed on its own terms.',
    metaDescription:
      'Air conditioning installation, service and repairs in Naremburn 2065. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'Naremburn is built on gently sloping, consistent blocks, good roof access. The stock is californian bungalows and federation cottages, largely detached, with newer rear additions.',
      'Consistent bungalow stock with real roof space — among the most straightforward ducted suburbs here. It is the reason zoned ducted systems suits most of Naremburn, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Naremburn covers about 1.3 square kilometres in postcode 2065, and we work Willoughby Road, Naremburn Park and Flat Rock Gully regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover St Leonards, Crows Nest and Willoughby on the same run.',
    ],
    neighbours: ['st-leonards', 'crows-nest', 'willoughby', 'cammeray', 'artarmon', 'northbridge'],
    landmarks: ['Willoughby Road', 'Naremburn Park', 'Flat Rock Gully'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Naremburn?',
        a: 'It depends which part of Naremburn you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'neutral-bay',
    name: 'Neutral Bay',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2089',
    areaKm2: 1.27,
    centre: [151.217977, -33.834815],
    tagline: 'Body-corporate ready systems for Neutral Bay apartments.',
    metaDescription:
      'Air conditioning installation, service and repairs in Neutral Bay 2089. Wall-mounted and multi-head splits. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Neutral Bay and the pattern is walk-up and mid-rise apartments through the centre, semis and cottages on the side streets. Neutral Bay is built on ridge and gully, with plenty of split-level homes.',
      'The thing that shapes almost every job here is simple enough: older walk-ups with no lift and no obvious plant location — access and siting drive the quote. For most homes in Neutral Bay that points to wall-mounted and multi-head splits, but we confirm it on site rather than over the phone.',
      'Neutral Bay covers about 1.3 square kilometres in postcode 2089, and we work Military Road, Hayberry Street and Anderson Park regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover North Sydney, Cremorne and Cammeray on the same run.',
    ],
    neighbours: ['north-sydney', 'cremorne', 'cammeray'],
    landmarks: ['Military Road', 'Hayberry Street', 'Anderson Park'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Neutral Bay?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-sydney',
    name: 'North Sydney',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2060',
    areaKm2: 1.47,
    centre: [151.208729, -33.83662],
    tagline: 'Residential towers and commercial fit-outs in one of Sydney’s busiest centres.',
    metaDescription:
      'Air conditioning installation and repairs in North Sydney. Strata-ready apartment systems and commercial fit-outs for offices around Miller Street and the Pacific Highway. Free quotes.',
    intro: [
      'North Sydney is a commercial centre first — office towers along Miller Street and the Pacific Highway — with a large and growing residential population in apartment towers around it and older unit blocks towards Kirribilli and Neutral Bay. That gives us two kinds of work here: commercial fit-outs and servicing for offices and retail, and strata-approved apartment installs.',
      'For apartments, multi-head systems from a single balcony-mounted outdoor unit are the usual answer. For commercial spaces, we handle design, installation and commissioning to suit the tenancy.',
    ],
    neighbours: ['neutral-bay', 'mcmahons-point', 'waverton', 'milsons-point', 'crows-nest', 'wollstonecraft'],
    landmarks: ['Miller Street', 'North Sydney Oval', 'Blues Point'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in North Sydney?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'northbridge',
    name: 'Northbridge',
    zone: 'north',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2063',
    areaKm2: 2.73,
    centre: [151.218016, -33.810834],
    tagline: 'Steep blocks and multi-level homes, planned on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Northbridge 2063. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Northbridge is made up of large freestanding homes, many split-level and built into the fall. Northbridge is built on steep bushland-edged blocks running down to Middle Harbour.',
      'For air conditioning, one factor does most of the work in Northbridge — split-level homes on steep bush blocks where one system rarely serves every level well. That usually means zoned ducted, sometimes with a second system for the lower level. What it actually means for your place is a question we answer on site.',
      'We are across Northbridge (2063) most weeks — Sailors Bay Road, Northbridge Golf Club and Tunks Park included — and in Castlecrag, Cammeray and Naremburn on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['castlecrag', 'cammeray', 'naremburn', 'willoughby'],
    landmarks: ['Sailors Bay Road', 'Northbridge Golf Club', 'Tunks Park'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Northbridge?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'riverview',
    name: 'Riverview',
    zone: 'north',
    group: 'suburban',
    profile: 'bush',
    postcode: '2066',
    areaKm2: 1.38,
    centre: [151.160266, -33.82396],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Riverview 2066. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is steep, heavily treed and bordered by the Lane Cove River. The stock is large homes on bushland blocks, many backing directly onto reserve.',
      'The thing that shapes almost every job here is simple enough: bushland blocks mean leaf litter, longer duct runs and condensers that need regular clearing. For most homes in Riverview that points to zoned ducted, with serviceable plant clear of the canopy, but we confirm it on site rather than over the phone.',
      'Riverview covers about 1.4 square kilometres in postcode 2066, and we work Saint Ignatius College, Tambourine Bay and Lane Cove River regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Lane Cove, Longueville and Hunters Hill on the same run.',
    ],
    neighbours: ['lane-cove', 'longueville', 'hunters-hill'],
    landmarks: ['Saint Ignatius College', 'Tambourine Bay', 'Lane Cove River'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'roseville-chase',
    name: 'Roseville Chase',
    zone: 'north',
    group: 'suburban',
    profile: 'bush',
    postcode: '2069',
    areaKm2: 1.27,
    centre: [151.199603, -33.775067],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Roseville Chase 2069. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Roseville Chase is made up of post-war and modern homes on sloping bush blocks near Middle Harbour. The land here is steep, treed and close to the waterway.',
      'Bushland setting with real debris load on outdoor units. It is the reason ducted with serviceable, clear-standing plant suits most of Roseville Chase, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Babbage Road, Echo Point and Garigal National Park are all inside our regular run through postcode 2069. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Roseville, Castle Cove and Forestville are next door and booked the same week.',
    ],
    neighbours: ['roseville', 'castle-cove', 'forestville'],
    landmarks: ['Babbage Road', 'Echo Point', 'Garigal National Park'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'st-leonards',
    name: 'St Leonards',
    zone: 'north',
    group: 'apartment',
    profile: 'strata',
    postcode: '2065',
    areaKm2: 0.8,
    centre: [151.192819, -33.822819],
    tagline: 'Apartment installs done to the by-laws, not around them.',
    metaDescription:
      'Air conditioning installation, service and repairs in St Leonards 2065. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk St Leonards and the pattern is high-rise residential towers around the station and hospital, older cottages behind. St Leonards is built on ridge-top and level, dominated by tall buildings.',
      'Every St Leonards quote starts from the same constraint: tower living with building-wide rules on penetrations and plant. In practice that points to multi-head and cassette systems within building provisions — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'We are across St Leonards (2065) most weeks — Royal North Shore Hospital, the Pacific Highway and Newlands Park included — and in Naremburn, Greenwich and Crows Nest on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['naremburn', 'greenwich', 'crows-nest', 'wollstonecraft', 'artarmon'],
    landmarks: ['Royal North Shore Hospital', 'the Pacific Highway', 'Newlands Park'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in St Leonards?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'waverton',
    name: 'Waverton',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2060',
    areaKm2: 0.72,
    centre: [151.197793, -33.839823],
    tagline: 'No two Waverton jobs are the same, so nothing is assumed.',
    metaDescription:
      'Air conditioning installation, service and repairs in Waverton 2060. Ducted through the roof cavity, plant to the rear. Daikin & Haier certified, free quotes.',
    intro: [
      'Waverton is made up of federation cottages and semis, with a few low-rise unit blocks near the station. The land here is undulating with harbour-side fall towards Balls Head.',
      'The thing that shapes almost every job here is simple enough: tightly held federation stock where owners want the install to leave no trace. For most homes in Waverton that points to ducted through the roof cavity, plant to the rear, but we confirm it on site rather than over the phone.',
      'At roughly 0.7 square kilometres, Waverton is a short run for us, and Balls Head Reserve, Bay Road and Waverton station are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Mcmahons Point, Wollstonecraft and North Sydney just as often.',
    ],
    neighbours: ['mcmahons-point', 'wollstonecraft', 'north-sydney', 'crows-nest'],
    landmarks: ['Balls Head Reserve', 'Bay Road', 'Waverton station'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Waverton?',
        a: 'It depends which part of Waverton you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'willoughby',
    name: 'Willoughby',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2068',
    areaKm2: 1.61,
    centre: [151.20005, -33.806197],
    tagline: 'Established homes on quiet streets, a short hop from Chatswood.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Willoughby. Ducted and split systems for established federation and bungalow homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Willoughby is largely established housing — federation homes and Californian bungalows on the streets off Penshurst Street and Willoughby Road — with pockets of units closer to the Chatswood end. It is classic ducted-retrofit territory: family homes with usable roof space, where zoning the system pays for itself in running costs.',
      'Older homes here sometimes need a switchboard or circuit upgrade to support a ducted system safely, which we check during the assessment and itemise up front rather than discovering it mid-install.',
    ],
    neighbours: ['naremburn', 'artarmon', 'northbridge', 'castlecrag', 'chatswood'],
    landmarks: ['Penshurst Street', 'Willoughby Park', 'the Incinerator'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Willoughby?',
        a: 'It depends which part of Willoughby you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'wollstonecraft',
    name: 'Wollstonecraft',
    zone: 'north',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2065',
    areaKm2: 1.19,
    centre: [151.195187, -33.832574],
    tagline: 'No two Wollstonecraft jobs are the same, so nothing is assumed.',
    metaDescription:
      'Air conditioning installation, service and repairs in Wollstonecraft 2065. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Wollstonecraft is made up of a mix of freestanding homes, semis and garden apartment blocks. The land here is leafy and sloping, with bushland reserve at the edges.',
      'Leaf litter from the reserves clogs condensers faster here than in open suburbs. It is the reason ducted for houses, splits for the unit stock, with serviceable plant placement suits most of Wollstonecraft, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Wollstonecraft covers about 1.2 square kilometres in postcode 2065, and we work Berry Island Reserve, Shirley Road and Smoothey Park regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Waverton, Greenwich and Crows Nest on the same run.',
    ],
    neighbours: ['waverton', 'greenwich', 'crows-nest', 'st-leonards', 'north-sydney'],
    landmarks: ['Berry Island Reserve', 'Shirley Road', 'Smoothey Park'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Wollstonecraft?',
        a: 'It depends which part of Wollstonecraft you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'woolwich',
    name: 'Woolwich',
    zone: 'north',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2110',
    areaKm2: 0.5,
    centre: [151.171798, -33.839806],
    tagline: 'Nothing visible from the street, nothing on the record.',
    metaDescription:
      'Air conditioning installation, service and repairs in Woolwich 2110. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Woolwich and the pattern is a small peninsula of heritage homes and a few apartments. The land here is steep, narrow and surrounded by water on three sides.',
      'The thing that shapes almost every job here is simple enough: heritage controls and marine air in the same job. For most homes in Woolwich that points to concealed ducted or discreet splits with protected coils, but we confirm it on site rather than over the phone.',
      'At roughly 0.5 square kilometres, Woolwich is a short run for us, and Woolwich Dock, Clarkes Point Reserve and Woolwich Road are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Hunters Hill, Longueville and Greenwich just as often.',
    ],
    neighbours: ['hunters-hill', 'longueville', 'greenwich'],
    landmarks: ['Woolwich Dock', 'Clarkes Point Reserve', 'Woolwich Road'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Woolwich?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  // ─── Upper North Shore & Hornsby ─────────────────────────────────
  {
    slug: 'asquith',
    name: 'Asquith',
    zone: 'upper',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2077',
    areaKm2: 3.48,
    centre: [151.116329, -33.687129],
    tagline: 'Low-pitch roofs, honest answers on what will fit.',
    metaDescription:
      'Air conditioning installation, service and repairs in Asquith 2077. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is gently undulating with bushland to the east. The stock is post-war brick and fibro homes with newer duplex and townhouse infill.',
      'For air conditioning, one factor does most of the work in Asquith — low-pitch post-war roofs where ducted is not always feasible. That usually means multi-head splits, or ducted where the roof cavity allows. What it actually means for your place is a question we answer on site.',
      'We are across Asquith (2077) most weeks — Asquith Oval, the Pacific Highway and Asquith Golf Club included — and in Hornsby, Mount Colah and North Turramurra on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['hornsby', 'mount-colah', 'north-turramurra'],
    landmarks: ['Asquith Oval', 'the Pacific Highway', 'Asquith Golf Club'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Asquith?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'beecroft',
    name: 'Beecroft',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2119',
    areaKm2: 4.85,
    centre: [151.06119, -33.753152],
    tagline: 'Whole-home ducted, zoned properly the first time.',
    metaDescription:
      'Air conditioning installation, service and repairs in Beecroft 2119. Zoned ducted with concealed grilles. Daikin & Haier certified, free quotes.',
    intro: [
      'Beecroft is made up of federation and interwar homes on large blocks in a heritage conservation area. The land here is leafy and undulating with deep bushland gullies.',
      'A conservation area with large period homes — concealed work and careful roof access. It is the reason zoned ducted with concealed grilles suits most of Beecroft, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Beecroft (2119) most weeks — Beecroft Village, Chilworth Reserve and Cheltenham Road included — and in Cheltenham, Pennant Hills and Thornleigh on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['cheltenham', 'pennant-hills', 'thornleigh'],
    landmarks: ['Beecroft Village', 'Chilworth Reserve', 'Cheltenham Road'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Beecroft actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'berowra',
    name: 'Berowra',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2081',
    areaKm2: 9.26,
    centre: [151.151274, -33.628721],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Berowra 2081. Zoned ducted with screened, serviceable plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Berowra runs to detached homes on large bushland blocks, some with water access to the Hawkesbury. The land here is steep, heavily treed and surrounded by national park.',
      'The thing that shapes almost every job here is simple enough: the far end of the line — bushfire exposure, long driveways and heavy leaf load. For most homes in Berowra that points to zoned ducted with screened, serviceable plant, but we confirm it on site rather than over the phone.',
      'We are across Berowra (2081) most weeks — Berowra Waters, Berowra Valley National Park and Berowra Oval included — and in Mount Colah, North Turramurra and Asquith on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['mount-colah', 'north-turramurra', 'asquith'],
    landmarks: ['Berowra Waters', 'Berowra Valley National Park', 'Berowra Oval'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'cheltenham',
    name: 'Cheltenham',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2119',
    areaKm2: 1.73,
    centre: [151.078452, -33.757132],
    tagline: 'Whole-home ducted, zoned properly the first time.',
    metaDescription:
      'Air conditioning installation, service and repairs in Cheltenham 2119. Multi-zone ducted. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Cheltenham runs to large federation homes on generous blocks, tightly held and leafy. The land here is gently sloping with reserve frontage on several streets.',
      'The thing that shapes almost every job here is simple enough: period homes with high ceilings that reward proper zoning and sizing. For most homes in Cheltenham that points to multi-zone ducted, but we confirm it on site rather than over the phone.',
      'We are across Cheltenham (2119) most weeks — Cheltenham Oval, The Crescent and Devlins Creek included — and in Beecroft, Pennant Hills and South Turramurra on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['beecroft', 'pennant-hills', 'south-turramurra'],
    landmarks: ['Cheltenham Oval', 'The Crescent', 'Devlins Creek'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Cheltenham actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'east-killara',
    name: 'East Killara',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2071',
    areaKm2: 3.18,
    centre: [151.181537, -33.755344],
    tagline: 'Long runs, leaf load and plant you can actually reach.',
    metaDescription:
      'Air conditioning installation, service and repairs in East Killara 2071. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk East Killara and the pattern is post-war and modern homes on the bushland side of the ridge. East Killara is built on sloping to the Lane Cove valley with reserve frontage.',
      'For air conditioning, one factor does most of the work in East Killara — bushland-edge homes with leaf load and longer duct runs. That usually means zoned ducted systems. What it actually means for your place is a question we answer on site.',
      'At roughly 3.2 square kilometres, East Killara is a short run for us, and Koola Avenue, Lane Cove National Park and Allan Small Park are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Davidson, Gordon and Killara just as often.',
    ],
    neighbours: ['davidson', 'gordon', 'killara', 'forestville', 'lindfield', 'st-ives'],
    landmarks: ['Koola Avenue', 'Lane Cove National Park', 'Allan Small Park'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'gordon',
    name: 'Gordon',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2072',
    areaKm2: 3.8,
    centre: [151.153421, -33.755619],
    tagline: 'Zoned systems designed around how the house is used.',
    metaDescription:
      'Air conditioning installation, service and repairs in Gordon 2072. Zoned ducted with a quiet indoor fan coil. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Gordon and the pattern is federation homes on large blocks, with a growing apartment cluster around the station. Gordon is built on ridge-top, mostly level, with fall to the east and west.',
      'The thing that shapes almost every job here is simple enough: large family homes where zoning and quiet running matter more than headline capacity. For most homes in Gordon that points to zoned ducted with a quiet indoor fan coil, but we confirm it on site rather than over the phone.',
      'At roughly 3.8 square kilometres, Gordon is a short run for us, and the Pacific Highway, Gordon Golf Club and Ravenswood are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Killara, Pymble and East Killara just as often.',
    ],
    neighbours: ['killara', 'pymble', 'east-killara', 'st-ives'],
    landmarks: ['the Pacific Highway', 'Gordon Golf Club', 'Ravenswood'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Gordon actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'hornsby',
    name: 'Hornsby',
    zone: 'upper',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2077',
    areaKm2: 8.45,
    centre: [151.09593, -33.697998],
    tagline: 'Larger blocks, bushland edges and units near the station.',
    metaDescription:
      'Air conditioning installation, service and repairs in Hornsby. Ducted systems for family homes on larger blocks and split systems for units near the station. Daikin & Haier certified.',
    intro: [
      'Hornsby marks the top of the North Shore: Westfield and the station at its centre, apartment buildings close in, and family homes on larger blocks spreading out to the bushland of the Berowra Valley. Summers run warmer here than on the harbour, which pushes sizing and zoning for the larger homes.',
      'Ducted systems dominate the house work; split and multi-head systems cover the units near the station. Bushland-edge properties get outdoor units placed clear of heavy leaf drop.',
    ],
    neighbours: ['waitara', 'asquith', 'normanhurst', 'thornleigh', 'wahroonga', 'mount-colah'],
    landmarks: ['Westfield Hornsby', 'the Water Clock', 'Hornsby Park'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Hornsby?',
        a: 'It depends which part of Hornsby you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'killara',
    name: 'Killara',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2071',
    areaKm2: 4.67,
    centre: [151.157035, -33.768023],
    tagline: 'Multi-zone ducted for homes with real roof space.',
    metaDescription:
      'Air conditioning installation, service and repairs in Killara 2071. Zoned ducted with careful roof access. Daikin & Haier certified, free quotes.',
    intro: [
      'Killara is made up of large federation and Victorian homes on some of the biggest blocks on the line. The land here is gently undulating with heavy tree cover and long driveways.',
      'Heritage-era homes with slate and tile roofs that need care during install. It is the reason zoned ducted with careful roof access suits most of Killara, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 4.7 square kilometres, Killara is a short run for us, and Springdale Road, Killara Golf Club and Fiddens Wharf Road are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Gordon, Lindfield and East Killara just as often.',
    ],
    neighbours: ['gordon', 'lindfield', 'east-killara'],
    landmarks: ['Springdale Road', 'Killara Golf Club', 'Fiddens Wharf Road'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Killara actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'lindfield',
    name: 'Lindfield',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2070',
    areaKm2: 5.2,
    centre: [151.161912, -33.780173],
    tagline: 'Whole-home ducted, zoned properly the first time.',
    metaDescription:
      'Air conditioning installation, service and repairs in Lindfield 2070. Zoned ducted, typically six to eight zones. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is undulating, leafy, with deep setbacks. The stock is large federation and interwar homes on generous blocks, apartments near the station.',
      'Every Lindfield quote starts from the same constraint: big homes with multiple living zones — a single-zone system leaves half the house wrong. In practice that points to zoned ducted, typically six to eight zones — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Lindfield Avenue, Tryon Road and Queen Elizabeth Reserve are all inside our regular run through postcode 2070. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Killara, Roseville and Chatswood are next door and booked the same week.',
    ],
    neighbours: ['killara', 'roseville', 'chatswood', 'east-killara'],
    landmarks: ['Lindfield Avenue', 'Tryon Road', 'Queen Elizabeth Reserve'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Lindfield actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'mount-colah',
    name: 'Mount Colah',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2079',
    areaKm2: 11.65,
    centre: [151.128242, -33.666821],
    tagline: 'Bush-block systems specified for debris and distance.',
    metaDescription:
      'Air conditioning installation, service and repairs in Mount Colah 2079. Zoned ducted with protected outdoor units. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Mount Colah runs to detached homes on large bush blocks, many backing the national park. The land here is elevated, heavily treed, with bushfire-interface frontage.',
      'For air conditioning, one factor does most of the work in Mount Colah — bushfire-interface property where plant siting and ember screening matter. That usually means zoned ducted with protected outdoor units. What it actually means for your place is a question we answer on site.',
      'We are across Mount Colah (2079) most weeks — Ku-ring-gai Chase National Park, Mount Colah Oval and the Pacific Highway included — and in Asquith, North Turramurra and Hornsby on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['asquith', 'north-turramurra', 'hornsby'],
    landmarks: ['Ku-ring-gai Chase National Park', 'Mount Colah Oval', 'the Pacific Highway'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'normanhurst',
    name: 'Normanhurst',
    zone: 'upper',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2076',
    areaKm2: 2.19,
    centre: [151.095971, -33.723818],
    tagline: 'Post-war roofs assessed before anything is promised.',
    metaDescription:
      'Air conditioning installation, service and repairs in Normanhurst 2076. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is gently sloping and leafy, straightforward access. The stock is post-war brick homes and californian bungalows on regular blocks.',
      'The thing that shapes almost every job here is simple enough: post-war roofs with lower pitch — ceiling space is the first thing to check. For most homes in Normanhurst that points to ducted where the roof allows, bulkhead or multi-head where it does not, but we confirm it on site rather than over the phone.',
      'Normanhurst covers about 2.2 square kilometres in postcode 2076, and we work Normanhurst Boys High, Denman Parade and the Pacific Highway regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Thornleigh, Wahroonga and Waitara on the same run.',
    ],
    neighbours: ['thornleigh', 'wahroonga', 'waitara', 'hornsby'],
    landmarks: ['Normanhurst Boys High', 'Denman Parade', 'the Pacific Highway'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Normanhurst?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-turramurra',
    name: 'North Turramurra',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2074',
    areaKm2: 11.65,
    centre: [151.153322, -33.688138],
    tagline: 'Long runs, leaf load and plant you can actually reach.',
    metaDescription:
      'Air conditioning installation, service and repairs in North Turramurra 2074. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is elevated and heavily treed, bordering Ku-ring-gai Chase. The stock is post-war and modern homes on large bush blocks close to the national park.',
      'For air conditioning, one factor does most of the work in North Turramurra — bushfire-interface blocks where debris and ember screening affect outdoor unit siting. That usually means zoned ducted with protected, clear-standing plant. What it actually means for your place is a question we answer on site.',
      'Bobbin Head Road, North Turramurra Golf and Ku-ring-gai Chase are all inside our regular run through postcode 2074. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. St Ives Chase, Mount Colah and Asquith are next door and booked the same week.',
    ],
    neighbours: ['st-ives-chase', 'mount-colah', 'asquith', 'st-ives', 'wahroonga', 'turramurra'],
    landmarks: ['Bobbin Head Road', 'North Turramurra Golf', 'Ku-ring-gai Chase'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'pennant-hills',
    name: 'Pennant Hills',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2120',
    areaKm2: 6.22,
    centre: [151.074054, -33.738421],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Pennant Hills 2120. Zoned ducted with accessible plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Pennant Hills runs to post-war and federation homes on large treed blocks, with units near the station. The land here is undulating and heavily treed, bordering Lane Cove National Park.',
      'Big treed blocks where condensers fill with leaf litter through autumn. It is the reason zoned ducted with accessible plant suits most of Pennant Hills, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Pennant Hills (2120) most weeks — Pennant Hills Park, Britannia Street and Lane Cove National Park included — and in Thornleigh, Beecroft and Cheltenham on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['thornleigh', 'beecroft', 'cheltenham', 'south-turramurra', 'wahroonga'],
    landmarks: ['Pennant Hills Park', 'Britannia Street', 'Lane Cove National Park'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'pymble',
    name: 'Pymble',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2073',
    areaKm2: 6.53,
    centre: [151.140348, -33.744585],
    tagline: 'Family homes on leafy blocks along the Pacific Highway.',
    metaDescription:
      'Air conditioning installation, service and repairs in Pymble. Ducted retrofits and multi-head systems for established family homes on the upper North Shore. Daikin & Haier certified.',
    intro: [
      'Pymble is established family housing on generous, leafy blocks either side of the Pacific Highway and the station, with some apartments close to the highway. Like its neighbours, the typical job is fitting a zoned ducted system into an existing home, designed around the roof space and insulation the house already has.',
      'Where roof space won’t allow ducting, a multi-head split system with discreet indoor units is the usual alternative. Heavy tree cover means outdoor units go where leaf litter won’t collect.',
    ],
    neighbours: ['turramurra', 'gordon', 'st-ives'],
    landmarks: ['Pymble Ladies College', 'Avondale Golf Club', 'Grandview Street'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Pymble actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'roseville',
    name: 'Roseville',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2069',
    areaKm2: 3.88,
    centre: [151.182095, -33.783188],
    tagline: 'Zoned systems designed around how the house is used.',
    metaDescription:
      'Air conditioning installation, service and repairs in Roseville 2069. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Roseville and the pattern is federation and californian bungalows on wide blocks, with a small unit pocket near the station. Roseville is built on level to gently sloping, leafy streets with mature trees.',
      'For air conditioning, one factor does most of the work in Roseville — classic upper North Shore roof space — ducted is nearly always the right answer. That usually means zoned ducted systems. What it actually means for your place is a question we answer on site.',
      'Hill Street, Roseville Park and the Pacific Highway are all inside our regular run through postcode 2069. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Chatswood, Roseville Chase and Lindfield are next door and booked the same week.',
    ],
    neighbours: ['chatswood', 'roseville-chase', 'lindfield', 'middle-cove', 'castle-cove'],
    landmarks: ['Hill Street', 'Roseville Park', 'the Pacific Highway'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Roseville actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'south-turramurra',
    name: 'South Turramurra',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2074',
    areaKm2: 3.09,
    centre: [151.10835, -33.752385],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in South Turramurra 2074. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in South Turramurra runs to mid-century and modern homes on sloping blocks backing Lane Cove National Park. The land here is steep, treed, with reserve frontage on many streets.',
      'Split-level homes on bush blocks — zoning and access both matter. It is the reason zoned ducted systems suits most of South Turramurra, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across South Turramurra (2074) most weeks — Kissing Point Road, Comenarra Parkway and Lane Cove National Park included — and in Turramurra, Wahroonga and Pennant Hills on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['turramurra', 'wahroonga', 'pennant-hills'],
    landmarks: ['Kissing Point Road', 'Comenarra Parkway', 'Lane Cove National Park'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'st-ives',
    name: 'St Ives',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2075',
    areaKm2: 14.32,
    centre: [151.172353, -33.724971],
    tagline: 'Whole-home ducted, zoned properly the first time.',
    metaDescription:
      'Air conditioning installation, service and repairs in St Ives 2075. Zoned ducted, six zones and up. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk St Ives and the pattern is post-war and modern family homes on large blocks, with townhouse pockets near the shops. St Ives is built on elevated plateau with bushland reserve on three sides.',
      'For air conditioning, one factor does most of the work in St Ives — big, open-plan family homes where zoning is what makes the system efficient. That usually means zoned ducted, six zones and up. What it actually means for your place is a question we answer on site.',
      'At roughly 14.3 square kilometres, St Ives is a short run for us, and Mona Vale Road, St Ives Shopping Village and Ku-ring-gai Wildflower Garden are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Davidson, St Ives Chase and East Killara just as often.',
    ],
    neighbours: ['davidson', 'st-ives-chase', 'east-killara', 'belrose', 'pymble', 'gordon'],
    landmarks: ['Mona Vale Road', 'St Ives Shopping Village', 'Ku-ring-gai Wildflower Garden'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in St Ives actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'st-ives-chase',
    name: 'St Ives Chase',
    zone: 'upper',
    group: 'suburban',
    profile: 'bush',
    postcode: '2075',
    areaKm2: 3.51,
    centre: [151.16466, -33.703642],
    tagline: 'Bush-block systems specified for debris and distance.',
    metaDescription:
      'Air conditioning installation, service and repairs in St Ives Chase 2075. Zoned ducted with screened, serviceable plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk St Ives Chase and the pattern is detached homes on large bush blocks against the national park. The land here is heavily treed and sloping, with bushfire-interface frontage.',
      'Bushfire-interface siting and heavy leaf load on outdoor units. It is the reason zoned ducted with screened, serviceable plant suits most of St Ives Chase, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Warrimoo Avenue, Ku-ring-gai Chase National Park and Cowan Creek are all inside our regular run through postcode 2075. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. North Turramurra, St Ives and Turramurra are next door and booked the same week.',
    ],
    neighbours: ['north-turramurra', 'st-ives', 'turramurra'],
    landmarks: ['Warrimoo Avenue', 'Ku-ring-gai Chase National Park', 'Cowan Creek'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'thornleigh',
    name: 'Thornleigh',
    zone: 'upper',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2120',
    areaKm2: 3.88,
    centre: [151.082021, -33.723688],
    tagline: 'Low-pitch roofs, honest answers on what will fit.',
    metaDescription:
      'Air conditioning installation, service and repairs in Thornleigh 2120. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Thornleigh and the pattern is post-war and 1970s homes on good-sized blocks, with townhouse infill. The land here is undulating with bushland gullies to the west.',
      'Mixed roof pitches across the same street, so no two quotes here are identical. It is the reason ducted for the higher-pitch stock, multi-head elsewhere suits most of Thornleigh, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Thornleigh covers about 3.9 square kilometres in postcode 2120, and we work Thornleigh Oval, Pennant Hills Road and Ruddock Park regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Normanhurst, Pennant Hills and Wahroonga on the same run.',
    ],
    neighbours: ['normanhurst', 'pennant-hills', 'wahroonga', 'hornsby'],
    landmarks: ['Thornleigh Oval', 'Pennant Hills Road', 'Ruddock Park'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Thornleigh?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'turramurra',
    name: 'Turramurra',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2074',
    areaKm2: 6.04,
    centre: [151.129167, -33.732958],
    tagline: 'Upper North Shore homes on big, tree-covered blocks.',
    metaDescription:
      'Air conditioning installation and servicing in Turramurra. Zoned ducted systems for larger upper North Shore homes on leafy blocks, Daikin & Haier certified. Free quotes.',
    intro: [
      'Turramurra is upper North Shore in the traditional sense — large blocks, tall trees and substantial older homes along the Pacific Highway and the streets either side of it. The work here is overwhelmingly ducted: bigger houses, often two storeys, where zoning is the difference between a comfortable home and an expensive one to run.',
      'Tree cover is heavier than almost anywhere else on the Shore, so outdoor-unit placement away from leaf litter and regular servicing both matter more here.',
    ],
    neighbours: ['warrawee', 'pymble', 'wahroonga', 'south-turramurra', 'st-ives', 'north-turramurra'],
    landmarks: ['Rohini Street', 'Karuah Park', 'Ku-ring-gai Chase National Park'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Turramurra actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'wahroonga',
    name: 'Wahroonga',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2076',
    areaKm2: 9.79,
    centre: [151.114466, -33.721801],
    tagline: 'Multi-zone ducted for homes with real roof space.',
    metaDescription:
      'Air conditioning installation, service and repairs in Wahroonga 2076. Zoned ducted with discreet outdoor plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Wahroonga and the pattern is large federation and interwar homes on wide blocks, with a heritage precinct around the station. Wahroonga is built on ridge-top and leafy, with steep fall to the north.',
      'The thing that shapes almost every job here is simple enough: big homes, heritage streets and mature trees — plant siting has to respect all three. For most homes in Wahroonga that points to zoned ducted with discreet outdoor plant, but we confirm it on site rather than over the phone.',
      'Redleaf Avenue, Wahroonga Park and Abbotsleigh are all inside our regular run through postcode 2076. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Warrawee, Waitara and Normanhurst are next door and booked the same week.',
    ],
    neighbours: ['warrawee', 'waitara', 'normanhurst', 'turramurra', 'thornleigh', 'hornsby'],
    landmarks: ['Redleaf Avenue', 'Wahroonga Park', 'Abbotsleigh'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Wahroonga actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'waitara',
    name: 'Waitara',
    zone: 'upper',
    group: 'apartment',
    profile: 'strata',
    postcode: '2077',
    areaKm2: 0.72,
    centre: [151.105951, -33.709273],
    tagline: 'Strata approvals, quiet placement and tidy line runs.',
    metaDescription:
      'Air conditioning installation, service and repairs in Waitara 2077. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Waitara is made up of a dense apartment precinct around the station and hospital, with post-war houses behind. Waitara is built on ridge-top and level, dominated by mid-rise blocks.',
      'For air conditioning, one factor does most of the work in Waitara — apartment density means by-laws, balcony siting and noise limits before anything else. That usually means multi-head splits within the building\'s approved locations. What it actually means for your place is a question we answer on site.',
      'At roughly 0.7 square kilometres, Waitara is a short run for us, and Hornsby Hospital, the Pacific Highway and Waitara Oval are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Hornsby, Wahroonga and Normanhurst just as often.',
    ],
    neighbours: ['hornsby', 'wahroonga', 'normanhurst'],
    landmarks: ['Hornsby Hospital', 'the Pacific Highway', 'Waitara Oval'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Waitara?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'warrawee',
    name: 'Warrawee',
    zone: 'upper',
    group: 'suburban',
    profile: 'estate',
    postcode: '2074',
    areaKm2: 1.35,
    centre: [151.122499, -33.727421],
    tagline: 'Multi-zone ducted for homes with real roof space.',
    metaDescription:
      'Air conditioning installation, service and repairs in Warrawee 2074. Multi-zone ducted with concealed grilles. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is level to gently sloping with mature gardens and long driveways. The stock is very large federation and Victorian homes on estate-sized blocks, many heritage-listed.',
      'Every Warrawee quote starts from the same constraint: heritage homes where roof access and slate tiling need an installer who has done it before. In practice that points to multi-zone ducted with concealed grilles — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Warrawee covers about 1.4 square kilometres in postcode 2074, and we work the Pacific Highway, Warrawee station and Knox Grammar regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Turramurra, Wahroonga and Normanhurst on the same run.',
    ],
    neighbours: ['turramurra', 'wahroonga', 'normanhurst'],
    landmarks: ['the Pacific Highway', 'Warrawee station', 'Knox Grammar'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Warrawee actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  // ─── Northern Beaches ────────────────────────────────────────────
  {
    slug: 'allambie-heights',
    name: 'Allambie Heights',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2100',
    areaKm2: 6.56,
    centre: [151.248854, -33.769585],
    tagline: 'Post-war roofs assessed before anything is promised.',
    metaDescription:
      'Air conditioning installation, service and repairs in Allambie Heights 2100. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is undulating and treed, bordering the Manly Dam reserve. The stock is post-war and 1970s homes on sloping blocks above Manly Dam.',
      'Reserve-edge homes with leaf litter and mixed roof pitches. It is the reason ducted or multi-head depending on the roof cavity suits most of Allambie Heights, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Manly Dam, Allambie Heights Oval and Kentwell Road are all inside our regular run through postcode 2100. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Brookvale, Beacon Hill and North Manly are next door and booked the same week.',
    ],
    neighbours: ['brookvale', 'beacon-hill', 'north-manly', 'seaforth', 'frenchs-forest'],
    landmarks: ['Manly Dam', 'Allambie Heights Oval', 'Kentwell Road'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Allambie Heights?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'avalon-beach',
    name: 'Avalon Beach',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2107',
    areaKm2: 5.35,
    centre: [151.327246, -33.629378],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Avalon Beach 2107. Ducted with treated coils and accessible plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Avalon Beach is made up of beach cottages, modern rebuilds and low-rise units around the village. Avalon Beach sits on a valley between two headlands, with steep bush blocks either side.',
      'Beach valley homes with bushland behind — salt from the front, leaf litter from the back. It is the reason ducted with treated coils and accessible plant suits most of Avalon Beach, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Avalon Beach (2107) most weeks — Avalon Beach, Old Barrenjoey Road and Careel Bay included — and in Bilgola Plateau, Palm Beach and Newport on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['bilgola-plateau', 'palm-beach', 'newport'],
    landmarks: ['Avalon Beach', 'Old Barrenjoey Road', 'Careel Bay'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Avalon Beach?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'balgowlah',
    name: 'Balgowlah',
    zone: 'beaches',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2093',
    areaKm2: 1.95,
    centre: [151.261789, -33.794713],
    tagline: 'Houses and units, each assessed on its own terms.',
    metaDescription:
      'Air conditioning installation, service and repairs in Balgowlah 2093. Ducted for houses, multi-head for the units. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Balgowlah and the pattern is post-war and federation homes with a strong apartment cluster around Stockland. Balgowlah is built on undulating, with the ridge falling to both the harbour and Manly.',
      'The thing that shapes almost every job here is simple enough: far enough from the surf to ease the salt load, close enough to still plan for it. For most homes in Balgowlah that points to ducted for houses, multi-head for the units, but we confirm it on site rather than over the phone.',
      'Stockland Balgowlah, Sydney Road and Balgowlah Oval are all inside our regular run through postcode 2093. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Fairlight, Balgowlah Heights and Clontarf are next door and booked the same week.',
    ],
    neighbours: ['fairlight', 'balgowlah-heights', 'clontarf', 'seaforth'],
    landmarks: ['Stockland Balgowlah', 'Sydney Road', 'Balgowlah Oval'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Balgowlah?',
        a: 'It depends which part of Balgowlah you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'balgowlah-heights',
    name: 'Balgowlah Heights',
    zone: 'beaches',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2093',
    areaKm2: 1.67,
    centre: [151.265134, -33.806828],
    tagline: 'Access-first design for Balgowlah Heights\'s steep blocks.',
    metaDescription:
      'Air conditioning installation, service and repairs in Balgowlah Heights 2093. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in Balgowlah Heights runs to large detached homes on steep harbour-facing blocks. The land here is steep, elevated and heavily treed, with harbour views.',
      'For air conditioning, one factor does most of the work in Balgowlah Heights — steep multi-level homes where zoning and equipment access both drive the design. That usually means zoned ducted, sometimes with two outdoor units. What it actually means for your place is a question we answer on site.',
      'We are across Balgowlah Heights (2093) most weeks — Dobroyd Head, Tania Park and Beatty Street included — and in Clontarf, Balgowlah and Fairlight on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['clontarf', 'balgowlah', 'fairlight'],
    landmarks: ['Dobroyd Head', 'Tania Park', 'Beatty Street'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Balgowlah Heights?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'beacon-hill',
    name: 'Beacon Hill',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2100',
    areaKm2: 2.76,
    centre: [151.258452, -33.75241],
    tagline: 'Ducted where the roof allows, multi-head where it does not.',
    metaDescription:
      'Air conditioning installation, service and repairs in Beacon Hill 2100. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Beacon Hill is built on high and exposed, with steep streets on the flanks. The stock is post-war brick homes on an elevated ridge, many with district views.',
      'For air conditioning, one factor does most of the work in Beacon Hill — elevated and wind-exposed, with low-pitch post-war roofs. That usually means ducted where the cavity allows, otherwise multi-head. What it actually means for your place is a question we answer on site.',
      'Beacon Hill covers about 2.8 square kilometres in postcode 2100, and we work Beacon Hill Reserve, Willandra Road and Manly Dam regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Narraweena, Brookvale and Allambie Heights on the same run.',
    ],
    neighbours: ['narraweena', 'brookvale', 'allambie-heights', 'frenchs-forest'],
    landmarks: ['Beacon Hill Reserve', 'Willandra Road', 'Manly Dam'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Beacon Hill?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'belrose',
    name: 'Belrose',
    zone: 'beaches',
    group: 'suburban',
    profile: 'bush',
    postcode: '2085',
    areaKm2: 14.0,
    centre: [151.210994, -33.721813],
    tagline: 'Bush-block systems specified for debris and distance.',
    metaDescription:
      'Air conditioning installation, service and repairs in Belrose 2085. Zoned ducted with screened, serviceable plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is elevated and heavily treed, bordering Garigal National Park. The stock is 1970s and modern detached homes on large bush blocks.',
      'Every Belrose quote starts from the same constraint: bushfire-interface blocks with heavy leaf load on outdoor units. In practice that points to zoned ducted with screened, serviceable plant — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'At roughly 14.0 square kilometres, Belrose is a short run for us, and Glenrose Village, Garigal National Park and Forest Way are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Davidson, Frenchs Forest and St Ives just as often.',
    ],
    neighbours: ['davidson', 'frenchs-forest', 'st-ives', 'terrey-hills'],
    landmarks: ['Glenrose Village', 'Garigal National Park', 'Forest Way'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'bilgola-plateau',
    name: 'Bilgola Plateau',
    zone: 'beaches',
    group: 'suburban',
    profile: 'bush',
    postcode: '2107',
    areaKm2: 1.31,
    centre: [151.314731, -33.644585],
    tagline: 'Long runs, leaf load and plant you can actually reach.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bilgola Plateau 2107. Zoned ducted with clear-standing plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Bilgola Plateau and the pattern is modern and mid-century homes on elevated bush blocks. Bilgola Plateau is built on high plateau with steep treed fall on both sides.',
      'Every Bilgola Plateau quote starts from the same constraint: elevated bush blocks with leaf load and long driveways. In practice that points to zoned ducted with clear-standing plant — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Bilgola Plateau covers about 1.3 square kilometres in postcode 2107, and we work Bilgola Beach, Plateau Road and Bilgola Bends regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Newport, Avalon Beach and Mona Vale on the same run.',
    ],
    neighbours: ['newport', 'avalon-beach', 'mona-vale'],
    landmarks: ['Bilgola Beach', 'Plateau Road', 'Bilgola Bends'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'brookvale',
    name: 'Brookvale',
    zone: 'beaches',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2100',
    areaKm2: 2.19,
    centre: [151.26971, -33.763372],
    tagline: 'No two Brookvale jobs are the same, so nothing is assumed.',
    metaDescription:
      'Air conditioning installation, service and repairs in Brookvale 2100. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is flat and open with good vehicle access. The stock is post-war homes and newer apartments alongside the beaches\' main industrial and retail precinct.',
      'Every Brookvale quote starts from the same constraint: the commercial heart of the beaches — as much shop and warehouse work as residential. In practice that points to cassette and ducted systems commercially, splits residentially — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Brookvale covers about 2.2 square kilometres in postcode 2100, and we work Warringah Mall, Brookvale Oval and Pittwater Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover North Manly, Narraweena and Beacon Hill on the same run.',
    ],
    neighbours: ['north-manly', 'narraweena', 'beacon-hill', 'north-curl-curl', 'curl-curl', 'freshwater'],
    landmarks: ['Warringah Mall', 'Brookvale Oval', 'Pittwater Road'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Brookvale?',
        a: 'It depends which part of Brookvale you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'clontarf',
    name: 'Clontarf',
    zone: 'beaches',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2093',
    areaKm2: 0.85,
    centre: [151.256471, -33.807458],
    tagline: 'Steep blocks and multi-level homes, planned on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Clontarf 2093. Zoned ducted with corrosion-protected plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is steep, treed and fronting Middle Harbour. The stock is a small pocket of detached homes on steep waterfront and near-waterfront blocks.',
      'Waterfront blocks with limited access and real marine exposure. It is the reason zoned ducted with corrosion-protected plant suits most of Clontarf, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Clontarf covers about 0.8 square kilometres in postcode 2093, and we work Clontarf Reserve, Sandy Bay and the Spit Bridge regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Balgowlah Heights, Balgowlah and Seaforth on the same run.',
    ],
    neighbours: ['balgowlah-heights', 'balgowlah', 'seaforth'],
    landmarks: ['Clontarf Reserve', 'Sandy Bay', 'the Spit Bridge'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Clontarf?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'collaroy',
    name: 'Collaroy',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2097',
    areaKm2: 2.74,
    centre: [151.300915, -33.738096],
    tagline: 'Salt-air protection and sensible outdoor-unit siting.',
    metaDescription:
      'Air conditioning installation, service and repairs in Collaroy 2097. Treated splits at the beach, ducted on the plateau. Daikin & Haier certified, free quotes.',
    intro: [
      'Collaroy sits on a narrow beachfront strip with a steep rise to Collaroy Plateau. The stock is beachfront apartment blocks and post-war homes climbing the plateau behind.',
      'For air conditioning, one factor does most of the work in Collaroy — front-line beach exposure on one street and sheltered elevation two streets back. That usually means treated splits at the beach, ducted on the plateau. What it actually means for your place is a question we answer on site.',
      'We are across Collaroy (2097) most weeks — Collaroy Beach, Pittwater Road and Long Reef included — and in Dee Why, Narrabeen and Cromer on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['dee-why', 'narrabeen', 'cromer'],
    landmarks: ['Collaroy Beach', 'Pittwater Road', 'Long Reef'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Collaroy?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'cromer',
    name: 'Cromer',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2099',
    areaKm2: 6.34,
    centre: [151.268681, -33.730327],
    tagline: 'Post-war roofs assessed before anything is promised.',
    metaDescription:
      'Air conditioning installation, service and repairs in Cromer 2099. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Cromer is made up of post-war homes and duplexes with newer infill, plus a light-industrial pocket. The land here is undulating, bordered by Narrabeen Lagoon and bushland.',
      'The thing that shapes almost every job here is simple enough: mixed residential and small-commercial work in the same suburb. For most homes in Cromer that points to ducted and split systems residentially, cassettes commercially, but we confirm it on site rather than over the phone.',
      'Cromer covers about 6.3 square kilometres in postcode 2099, and we work Cromer Golf Club, Narrabeen Lagoon and South Creek Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Narraweena, Narrabeen and Dee Why on the same run.',
    ],
    neighbours: ['narraweena', 'narrabeen', 'dee-why', 'collaroy'],
    landmarks: ['Cromer Golf Club', 'Narrabeen Lagoon', 'South Creek Road'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Cromer?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'curl-curl',
    name: 'Curl Curl',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2096',
    areaKm2: 1.02,
    centre: [151.289748, -33.769119],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Curl Curl 2096. Coastal-grade splits and ducted with treated coils. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is flat near the lagoon, rising to the headland. The stock is post-war and rebuilt detached homes, with low-rise flats near the lagoon.',
      'Every Curl Curl quote starts from the same constraint: direct beach frontage and a lagoon that keeps the air humid. In practice that points to coastal-grade splits and ducted with treated coils — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'At roughly 1.0 square kilometres, Curl Curl is a short run for us, and Curl Curl Beach, Curl Curl Lagoon and Greendale Creek are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in North Curl Curl, Freshwater and North Manly just as often.',
    ],
    neighbours: ['north-curl-curl', 'freshwater', 'north-manly', 'brookvale'],
    landmarks: ['Curl Curl Beach', 'Curl Curl Lagoon', 'Greendale Creek'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Curl Curl?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'davidson',
    name: 'Davidson',
    zone: 'beaches',
    group: 'suburban',
    profile: 'bush',
    postcode: '2085',
    areaKm2: 2.56,
    centre: [151.190989, -33.739551],
    tagline: 'Bush-block systems specified for debris and distance.',
    metaDescription:
      'Air conditioning installation, service and repairs in Davidson 2085. Zoned ducted with protected, accessible plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Davidson and the pattern is 1970s and modern detached homes on bush blocks against Garigal National Park. The land here is elevated and heavily treed with reserve frontage.',
      'Every Davidson quote starts from the same constraint: national-park frontage brings both leaf load and bushfire considerations. In practice that points to zoned ducted with protected, accessible plant — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Garigal National Park, Davidson Park and Warringah Road are all inside our regular run through postcode 2085. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. East Killara, St Ives and Belrose are next door and booked the same week.',
    ],
    neighbours: ['east-killara', 'st-ives', 'belrose', 'frenchs-forest'],
    landmarks: ['Garigal National Park', 'Davidson Park', 'Warringah Road'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'dee-why',
    name: 'Dee Why',
    zone: 'beaches',
    group: 'beachside',
    profile: 'strata',
    postcode: '2099',
    areaKm2: 3.41,
    centre: [151.289714, -33.751901],
    tagline: 'One of the Northern Beaches’ most apartment-dense suburbs.',
    metaDescription:
      'Air conditioning installation and repairs in Dee Why. Strata-ready, corrosion-protected systems for beachside apartments and Northern Beaches homes. Daikin & Haier certified. Free quotes.',
    intro: [
      'Dee Why’s town centre along Pittwater Road is one of the most apartment-dense parts of the Northern Beaches, with the beach and the lagoon a few streets east and houses spreading back towards Narraweena and Cromer. Strata approval, balcony placement and salt-air corrosion protection come up on most jobs here.',
      'Multi-head systems suit the apartments; the houses further back are typically ducted or single-split installs, with outdoor units sited out of the direct sea breeze.',
    ],
    neighbours: ['north-curl-curl', 'narraweena', 'collaroy', 'brookvale', 'cromer'],
    landmarks: ['Dee Why Beach', 'Pittwater Road', 'Dee Why Lagoon'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Dee Why?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'fairlight',
    name: 'Fairlight',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2094',
    areaKm2: 1.18,
    centre: [151.273924, -33.794038],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Fairlight 2094. Multi-head splits with treated coils. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Fairlight runs to interwar flats and federation homes on a steep harbour slope. The land here is steep fall to the harbour with narrow streets.',
      'The thing that shapes almost every job here is simple enough: harbourside salt and steep access in the same job. For most homes in Fairlight that points to multi-head splits with treated coils, but we confirm it on site rather than over the phone.',
      'We are across Fairlight (2094) most weeks — Fairlight Beach, Lauderdale Avenue and the Manly to Spit walk included — and in Balgowlah, Manly and Queenscliff on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['balgowlah', 'manly', 'queenscliff'],
    landmarks: ['Fairlight Beach', 'Lauderdale Avenue', 'the Manly to Spit walk'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Fairlight?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'forestville',
    name: 'Forestville',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2087',
    areaKm2: 4.49,
    centre: [151.210964, -33.759987],
    tagline: 'Low-pitch roofs, honest answers on what will fit.',
    metaDescription:
      'Air conditioning installation, service and repairs in Forestville 2087. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is gently undulating with bushland gullies at the edges. The stock is post-war brick homes on regular blocks with newer rear additions.',
      'For air conditioning, one factor does most of the work in Forestville — consistent post-war stock where roof pitch decides ducted or not. That usually means ducted where possible, multi-head as the fallback. What it actually means for your place is a question we answer on site.',
      'At roughly 4.5 square kilometres, Forestville is a short run for us, and Forestville Shopping Village, Bantry Bay Road and Garigal National Park are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Frenchs Forest, Roseville Chase and East Killara just as often.',
    ],
    neighbours: ['frenchs-forest', 'roseville-chase', 'east-killara'],
    landmarks: ['Forestville Shopping Village', 'Bantry Bay Road', 'Garigal National Park'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Forestville?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'frenchs-forest',
    name: 'Frenchs Forest',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2086',
    areaKm2: 8.42,
    centre: [151.224464, -33.748211],
    tagline: 'Post-war roofs assessed before anything is promised.',
    metaDescription:
      'Air conditioning installation, service and repairs in Frenchs Forest 2086. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Frenchs Forest is built on elevated plateau, bordered by Garigal National Park. The stock is post-war and 1970s brick homes on regular blocks, with the hospital precinct at its centre.',
      'The thing that shapes almost every job here is simple enough: 1970s roofs with variable pitch and a lot of original insulation to work around. For most homes in Frenchs Forest that points to ducted where the cavity allows, multi-head where it does not, but we confirm it on site rather than over the phone.',
      'Northern Beaches Hospital, Warringah Road and Forestville RSL are all inside our regular run through postcode 2086. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Forestville, Beacon Hill and Belrose are next door and booked the same week.',
    ],
    neighbours: ['forestville', 'beacon-hill', 'belrose', 'davidson', 'allambie-heights', 'east-killara'],
    landmarks: ['Northern Beaches Hospital', 'Warringah Road', 'Forestville RSL'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Frenchs Forest?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'freshwater',
    name: 'Freshwater',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2096',
    areaKm2: 1.85,
    centre: [151.284373, -33.776116],
    tagline: 'Salt-air protection and sensible outdoor-unit siting.',
    metaDescription:
      'Air conditioning installation, service and repairs in Freshwater 2096. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Freshwater and the pattern is interwar cottages and semis, with unit blocks on the streets above the beach. Freshwater sits on a valley to the beach with steep streets on both sides.',
      'Beachside valley where salt air settles and lingers. It is the reason treated splits near the sand, ducted further up the hill suits most of Freshwater, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Freshwater (2096) most weeks — Freshwater Beach, Lawrence Street and Harbord Diggers included — and in Queenscliff, Curl Curl and North Manly on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['queenscliff', 'curl-curl', 'north-manly', 'brookvale', 'manly'],
    landmarks: ['Freshwater Beach', 'Lawrence Street', 'Harbord Diggers'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Freshwater?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'manly',
    name: 'Manly',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2095',
    areaKm2: 5.64,
    centre: [151.291339, -33.804899],
    tagline: 'Ocean on one side, harbour on the other — salt air everywhere.',
    metaDescription:
      'Air conditioning installation, service and repairs in Manly. Corrosion-protected beachside installs and strata-ready apartment systems near the Corso, Daikin & Haier certified. Free quotes.',
    intro: [
      'Manly sits between the ocean beach and the harbour, with apartments along the Corso, North Steyne and the ferry end, and houses climbing towards Fairlight and Balgowlah. Very little of Manly is out of the salt-air zone, so corrosion protection and outdoor-unit placement are the starting point for every job.',
      'Apartment installs go through the usual strata process; the houses on the hill are more often ducted or multi-head systems positioned with the prevailing wind in mind.',
    ],
    neighbours: ['fairlight', 'queenscliff', 'freshwater', 'north-manly'],
    landmarks: ['The Corso', 'Manly Beach', 'Shelly Beach'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Manly?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'mona-vale',
    name: 'Mona Vale',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2103',
    areaKm2: 4.87,
    centre: [151.303673, -33.675956],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Mona Vale 2103. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Mona Vale sits on a plain between the beach and the escarpment, largely level. The stock is post-war and modern homes, with unit blocks near the village and the beach.',
      'A service hub for the northern peninsula, with genuine beachside salt exposure. It is the reason ducted for the homes, treated splits nearer the sand suits most of Mona Vale, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 4.9 square kilometres, Mona Vale is a short run for us, and Mona Vale Beach, Barrenjoey Road and Mona Vale Hospital are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Warriewood, Newport and North Narrabeen just as often.',
    ],
    neighbours: ['warriewood', 'newport', 'north-narrabeen'],
    landmarks: ['Mona Vale Beach', 'Barrenjoey Road', 'Mona Vale Hospital'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Mona Vale?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'narrabeen',
    name: 'Narrabeen',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2101',
    areaKm2: 4.58,
    centre: [151.288716, -33.715624],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Narrabeen 2101. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Narrabeen and the pattern is a mix of beachside units, post-war homes and lakeside properties. The land here is between ocean and lagoon, mostly low-lying.',
      'For air conditioning, one factor does most of the work in Narrabeen — salt from the ocean and humidity from the lagoon on the same block. That usually means corrosion-protected systems, sized for the humidity load. What it actually means for your place is a question we answer on site.',
      'At roughly 4.6 square kilometres, Narrabeen is a short run for us, and Narrabeen Lagoon, Narrabeen Beach and Ocean Street are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in North Narrabeen, Cromer and Collaroy just as often.',
    ],
    neighbours: ['north-narrabeen', 'cromer', 'collaroy', 'warriewood'],
    landmarks: ['Narrabeen Lagoon', 'Narrabeen Beach', 'Ocean Street'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Narrabeen?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'narraweena',
    name: 'Narraweena',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2099',
    areaKm2: 1.75,
    centre: [151.273165, -33.749372],
    tagline: 'Post-war roofs assessed before anything is promised.',
    metaDescription:
      'Air conditioning installation, service and repairs in Narraweena 2099. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Narraweena and the pattern is post-war brick and fibro homes on a high inland ridge. The land here is elevated and open, with easy street access.',
      'Every Narraweena quote starts from the same constraint: low-pitch post-war roofs are the recurring constraint here. In practice that points to ducted where the cavity allows, multi-head where it does not — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Narraweena covers about 1.8 square kilometres in postcode 2099, and we work Narraweena Oval, Alfred Road and Cromer Heights regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Beacon Hill, Dee Why and Brookvale on the same run.',
    ],
    neighbours: ['beacon-hill', 'dee-why', 'brookvale', 'cromer'],
    landmarks: ['Narraweena Oval', 'Alfred Road', 'Cromer Heights'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Narraweena?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'newport',
    name: 'Newport',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2106',
    areaKm2: 3.77,
    centre: [151.315258, -33.656623],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Newport 2106. Zoned ducted on the hill, treated splits on the flat. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Newport and the pattern is detached homes on the hill and beachfront units on the flat. Newport is built on steep hillsides falling to both Pittwater and the ocean.',
      'For air conditioning, one factor does most of the work in Newport — ocean on one side, Pittwater on the other, and steep blocks between them. That usually means zoned ducted on the hill, treated splits on the flat. What it actually means for your place is a question we answer on site.',
      'Newport covers about 3.8 square kilometres in postcode 2106, and we work Newport Beach, Barrenjoey Road and Bungan Head regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Bilgola Plateau, Mona Vale and Avalon Beach on the same run.',
    ],
    neighbours: ['bilgola-plateau', 'mona-vale', 'avalon-beach'],
    landmarks: ['Newport Beach', 'Barrenjoey Road', 'Bungan Head'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Newport?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-curl-curl',
    name: 'North Curl Curl',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2099',
    areaKm2: 1.47,
    centre: [151.290732, -33.763149],
    tagline: 'Salt-air protection and sensible outdoor-unit siting.',
    metaDescription:
      'Air conditioning installation, service and repairs in North Curl Curl 2099. Ducted with protected outdoor plant. Daikin & Haier certified, free quotes.',
    intro: [
      'North Curl Curl is made up of post-war brick homes and duplexes on the hill above the beach. The land here is elevated and exposed, sloping to the lagoon.',
      'Exposed elevation catches both the salt and the southerly. It is the reason ducted with protected outdoor plant suits most of North Curl Curl, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'North Curl Curl covers about 1.5 square kilometres in postcode 2099, and we work North Curl Curl Beach, John Fisher Park and Abbott Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Curl Curl, Dee Why and Brookvale on the same run.',
    ],
    neighbours: ['curl-curl', 'dee-why', 'brookvale', 'north-manly'],
    landmarks: ['North Curl Curl Beach', 'John Fisher Park', 'Abbott Road'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in North Curl Curl?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-manly',
    name: 'North Manly',
    zone: 'beaches',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2100',
    areaKm2: 1.22,
    centre: [151.272578, -33.7744],
    tagline: 'Low-pitch roofs, honest answers on what will fit.',
    metaDescription:
      'Air conditioning installation, service and repairs in North Manly 2100. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is flat and low-lying beside Manly Lagoon. The stock is post-war brick homes and duplexes inland of the lagoon.',
      'For air conditioning, one factor does most of the work in North Manly — low-lying and humid, with post-war roof cavities to work within. That usually means ducted where the roof allows, multi-head elsewhere. What it actually means for your place is a question we answer on site.',
      'North Manly covers about 1.2 square kilometres in postcode 2100, and we work Manly Lagoon, Kentwell Road and Griffiths Park regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Freshwater, Brookvale and Queenscliff on the same run.',
    ],
    neighbours: ['freshwater', 'brookvale', 'queenscliff', 'curl-curl', 'north-curl-curl', 'allambie-heights'],
    landmarks: ['Manly Lagoon', 'Kentwell Road', 'Griffiths Park'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in North Manly?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-narrabeen',
    name: 'North Narrabeen',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2101',
    areaKm2: 3.01,
    centre: [151.290231, -33.703542],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in North Narrabeen 2101. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in North Narrabeen runs to post-war homes, duplexes and low-rise units between the lagoon and the beach. The land here is flat and low-lying with water on two sides.',
      'Every North Narrabeen quote starts from the same constraint: consistently humid, salt-laden air year round. In practice that points to treated coils and properly sized dehumidification capacity — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'North Narrabeen covers about 3.0 square kilometres in postcode 2101, and we work North Narrabeen Rock Pool, Narrabeen Lagoon and Powderworks Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Narrabeen, Warriewood and Mona Vale on the same run.',
    ],
    neighbours: ['narrabeen', 'warriewood', 'mona-vale'],
    landmarks: ['North Narrabeen Rock Pool', 'Narrabeen Lagoon', 'Powderworks Road'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in North Narrabeen?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'palm-beach',
    name: 'Palm Beach',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2108',
    areaKm2: 2.71,
    centre: [151.325727, -33.597973],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Palm Beach 2108. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Palm Beach sits on a steep peninsula with ocean on one side and Pittwater on the other. The stock is large detached homes on steep blocks, many used seasonally.',
      'The thing that shapes almost every job here is simple enough: the most exposed position on the peninsula, and often unoccupied for weeks at a time. For most homes in Palm Beach that points to zoned ducted with marine-grade protection and remote monitoring, but we confirm it on site rather than over the phone.',
      'Barrenjoey Lighthouse, Palm Beach Wharf and Ocean Road are all inside our regular run through postcode 2108. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Avalon Beach, Bilgola Plateau and Newport are next door and booked the same week.',
    ],
    neighbours: ['avalon-beach', 'bilgola-plateau', 'newport'],
    landmarks: ['Barrenjoey Lighthouse', 'Palm Beach Wharf', 'Ocean Road'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Palm Beach?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'queenscliff',
    name: 'Queenscliff',
    zone: 'beaches',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2096',
    areaKm2: 0.44,
    centre: [151.285373, -33.78286],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Queenscliff 2096. Coastal-grade splits with treated coils. Daikin & Haier certified, free quotes.',
    intro: [
      'Walk Queenscliff and the pattern is interwar flats and semis on a narrow strip between the beach and the lagoon. The land here is low-lying and hemmed in, with limited street access.',
      'For air conditioning, one factor does most of the work in Queenscliff — front-line salt exposure with lagoon humidity behind it. That usually means coastal-grade splits with treated coils. What it actually means for your place is a question we answer on site.',
      'We are across Queenscliff (2096) most weeks — Queenscliff Beach, Manly Lagoon and the Queenscliff bridge included — and in Freshwater, North Manly and Manly on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['freshwater', 'north-manly', 'manly'],
    landmarks: ['Queenscliff Beach', 'Manly Lagoon', 'the Queenscliff bridge'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Queenscliff?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'seaforth',
    name: 'Seaforth',
    zone: 'beaches',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2092',
    areaKm2: 3.09,
    centre: [151.24194, -33.79206],
    tagline: 'Steep blocks and multi-level homes, planned on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Seaforth 2092. Zoned ducted with per-level control. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is very steep with bushland reserve and water frontage. The stock is split-level and modern detached homes on steep blocks above Middle Harbour.',
      'Every Seaforth quote starts from the same constraint: split-level homes on steep bush blocks — one thermostat will never suit the whole house. In practice that points to zoned ducted with per-level control — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Seaforth Oval, Bantry Bay and Sydney Road are all inside our regular run through postcode 2092. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Balgowlah, Clontarf and Allambie Heights are next door and booked the same week.',
    ],
    neighbours: ['balgowlah', 'clontarf', 'allambie-heights', 'mosman'],
    landmarks: ['Seaforth Oval', 'Bantry Bay', 'Sydney Road'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Seaforth?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'terrey-hills',
    name: 'Terrey Hills',
    zone: 'beaches',
    group: 'suburban',
    profile: 'bush',
    postcode: '2084',
    areaKm2: 8.97,
    centre: [151.219383, -33.689497],
    tagline: 'Bushland-edge installs with serviceable, protected plant.',
    metaDescription:
      'Air conditioning installation, service and repairs in Terrey Hills 2084. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Terrey Hills is made up of large properties and acreage on the plateau, some semi-rural. Terrey Hills is built on high, flat plateau surrounded by national park.',
      'The thing that shapes almost every job here is simple enough: large homes on acreage where duct runs get long and bushfire siting matters. For most homes in Terrey Hills that points to multi-zone ducted, sometimes two systems for a single home, but we confirm it on site rather than over the phone.',
      'Terrey Hills Village, Ku-ring-gai Chase National Park and Mona Vale Road are all inside our regular run through postcode 2084. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Belrose, Davidson and Cromer are next door and booked the same week.',
    ],
    neighbours: ['belrose', 'davidson', 'cromer'],
    landmarks: ['Terrey Hills Village', 'Ku-ring-gai Chase National Park', 'Mona Vale Road'],
    issues: [
      {
        title: 'Leaf litter in the condenser',
        body: 'Bushland blocks load an outdoor unit with leaf and bark through autumn. We site it for airflow and easy clearing, and cover it in the service plan.',
      },
      {
        title: 'Long duct runs on large blocks',
        body: 'Bigger homes on bigger blocks mean longer runs. Undersized ductwork on a long run is the most common reason a system underperforms.',
      },
      {
        title: 'Bushfire-interface considerations',
        body: 'On interface blocks, outdoor unit placement and screening are worth getting right. We work to the relevant standard for the site.',
      },
    ],
    faq: [
      {
        q: 'How much maintenance does a system on a bush block need?',
        a: 'More than an open suburban block, mostly because of leaf litter in the condenser. An annual service and a clear surround handles it. We site the outdoor unit so it can actually be reached.',
      },
      {
        q: 'Does bushfire risk change where the outdoor unit goes?',
        a: 'On interface blocks it can. Placement, screening and materials are worth getting right, and we work to the standard that applies to the site.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'warriewood',
    name: 'Warriewood',
    zone: 'beaches',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2102',
    areaKm2: 4.21,
    centre: [151.295606, -33.688838],
    tagline: 'No two Warriewood jobs are the same, so nothing is assumed.',
    metaDescription:
      'Air conditioning installation, service and repairs in Warriewood 2102. Ducted retrofits, splits in the townhouses. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Warriewood runs to newer estate housing and townhouses alongside older homes and a business park. Warriewood sits on a valley behind the beach, largely level.',
      'Newer estate homes often have the roof space but no ducting provision. It is the reason ducted retrofits, splits in the townhouses suits most of Warriewood, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 4.2 square kilometres, Warriewood is a short run for us, and Warriewood Beach, Warriewood Square and Narrabeen Lagoon are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Mona Vale, North Narrabeen and Narrabeen just as often.',
    ],
    neighbours: ['mona-vale', 'north-narrabeen', 'narrabeen'],
    landmarks: ['Warriewood Beach', 'Warriewood Square', 'Narrabeen Lagoon'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Warriewood?',
        a: 'It depends which part of Warriewood you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  // ─── Eastern Suburbs ─────────────────────────────────────────────
  {
    slug: 'bellevue-hill',
    name: 'Bellevue Hill',
    zone: 'east',
    group: 'suburban',
    profile: 'estate',
    postcode: '2023',
    areaKm2: 2.37,
    centre: [151.25563, -33.880825],
    tagline: 'Zoned systems designed around how the house is used.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bellevue Hill 2023. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Bellevue Hill is made up of large freestanding homes on substantial blocks, plus interwar apartment buildings along the main roads. Bellevue Hill sits on one of the higher ridges in the east, with long views and windy elevated positions.',
      'For air conditioning, one factor does most of the work in Bellevue Hill — big homes, big roof spaces, and multi-storey layouts that genuinely need zoning. That usually means zoned ducted systems, often with a second unit for the upper level. What it actually means for your place is a question we answer on site.',
      'Victoria Road, Cooper Park and Bellevue Park are all inside our regular run through postcode 2023. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Double Bay, Woollahra and Bondi Junction are next door and booked the same week.',
    ],
    neighbours: ['double-bay', 'woollahra', 'bondi-junction', 'rose-bay', 'point-piper', 'bondi'],
    landmarks: ['Victoria Road', 'Cooper Park', 'Bellevue Park'],
    issues: [
      {
        title: 'Zoning a large floor plan',
        body: 'One thermostat for a five-bedroom home wastes energy and satisfies nobody. Zoning is designed around the rooms actually in use at each time of day.',
      },
      {
        title: 'Duct run length and static pressure',
        body: 'Long runs on big blocks lose capacity if the ductwork is undersized. Sizing accounts for the run, not just the room.',
      },
      {
        title: 'Roof access on period rooftops',
        body: 'Slate and terracotta need an installer who has worked on them before. Access is planned and protected.',
      },
    ],
    faq: [
      {
        q: 'How many zones does a home in Bellevue Hill actually need?',
        a: 'For most homes on these blocks, four to eight. The number matters less than where the boundaries sit — zones should follow how the house is used through the day, not just the floor plan.',
      },
      {
        q: 'Is one ducted system enough for a large home?',
        a: 'Usually, if it is sized and zoned properly. On very large or long homes, two smaller systems can run more efficiently than one oversized one — we will tell you which applies.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'bondi',
    name: 'Bondi',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2026',
    areaKm2: 0.88,
    centre: [151.264549, -33.893895],
    tagline: 'Beachside installs built for salt air, strata rules and summer crowds.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bondi. Corrosion-protected beachside installs, strata-ready apartment systems, Daikin & Haier certified. Free quotes.',
    intro: [
      'Bondi is a mix of beachfront apartment blocks along Campbell Parade, older unit buildings up Bondi Road, and semi-detached and federation homes on the streets behind them — and each brings its own install considerations. The one every Bondi property shares is proximity to the ocean: salt air reaches well back from the beach and works on an outdoor unit faster than it does inland.',
      'For apartments, the outdoor unit is usually the whole question — where it can go, what strata will approve, and how to keep it quiet for the neighbours. For the houses further back, it is more often about fitting ducted or multi-head systems into older layouts without touching the street frontage. We assess both on site before quoting.',
    ],
    neighbours: ['tamarama', 'bondi-beach', 'bronte', 'waverley', 'bondi-junction', 'bellevue-hill'],
    landmarks: ['Campbell Parade', 'Bondi Road', 'Hall Street'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Bondi?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'bondi-beach',
    name: 'Bondi Beach',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2026',
    areaKm2: 1.22,
    centre: [151.272453, -33.889669],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bondi Beach 2026. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in Bondi Beach runs to 1920s and 1930s walk-up flats, a handful of newer boutique blocks, very little detached housing. The land here is flat along the promenade, rising sharply at both headlands.',
      'The thing that shapes almost every job here is simple enough: front-line salt exposure — an uncoated condenser here can show corrosion within a couple of summers. For most homes in Bondi Beach that points to coastal-grade split systems with treated coils, sited away from the prevailing southerly, but we confirm it on site rather than over the phone.',
      'Bondi Beach covers about 1.2 square kilometres in postcode 2026, and we work Bondi Pavilion, Notts Avenue and Campbell Parade regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover North Bondi, Bondi and Tamarama on the same run.',
    ],
    neighbours: ['north-bondi', 'bondi', 'tamarama', 'rose-bay', 'bellevue-hill'],
    landmarks: ['Bondi Pavilion', 'Notts Avenue', 'Campbell Parade'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Bondi Beach?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'bondi-junction',
    name: 'Bondi Junction',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2022',
    areaKm2: 1.06,
    centre: [151.250843, -33.893084],
    tagline: 'Apartment towers, strata approvals and tight outdoor-unit placement, handled.',
    metaDescription:
      'Air conditioning installation and repairs for Bondi Junction apartments and homes. Strata-ready split and multi-head systems, quiet placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Bondi Junction is the Eastern Suburbs’ transport and retail hub — Westfield, the Oxford Street mall and the rail and bus interchange sit at its centre, ringed by high-rise apartment towers and older three- and four-storey unit blocks. That density shapes almost every air conditioning job here: the outdoor unit has to go somewhere strata will approve, within noise clearances, with condensate drained properly.',
      'Multi-head split systems, running two or three rooms from a single outdoor unit, are the workhorse for Bondi Junction apartments. For the terraces and houses on the quieter streets towards Waverley and Queens Park, ducted systems and single splits are more usual.',
    ],
    neighbours: ['queens-park', 'woollahra', 'waverley', 'bondi', 'bellevue-hill', 'centennial-park'],
    landmarks: ['Oxford Street Mall', 'Westfield', 'the bus and rail interchange'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Bondi Junction?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'bronte',
    name: 'Bronte',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2024',
    areaKm2: 1.32,
    centre: [151.263992, -33.904181],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bronte 2024. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in Bronte runs to federation semis and cottages in the valley, apartments on the ridges either side. Bronte sits on a valley running down to the beach, so homes sit at every angle to the sea.',
      'For air conditioning, one factor does most of the work in Bronte — valley homes catch sea breeze and salt funnelled straight up from the beach. That usually means ducted for the cottages once roof space is checked, splits for the flats. What it actually means for your place is a question we answer on site.',
      'At roughly 1.3 square kilometres, Bronte is a short run for us, and Bronte Road, Bronte Park and the Bogey Hole are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Waverley, Tamarama and Clovelly just as often.',
    ],
    neighbours: ['waverley', 'tamarama', 'clovelly', 'bondi', 'bondi-junction'],
    landmarks: ['Bronte Road', 'Bronte Park', 'the Bogey Hole'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Bronte?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'centennial-park',
    name: 'Centennial Park',
    zone: 'east',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2021',
    areaKm2: 2.21,
    centre: [151.23362, -33.897854],
    tagline: 'Nothing visible from the street, nothing on the record.',
    metaDescription:
      'Air conditioning installation, service and repairs in Centennial Park 2021. Concealed ducted with rear-sited plant. Daikin & Haier certified, free quotes.',
    intro: [
      'The land here is level, leafy and tightly controlled. The stock is a very small residential pocket of grand homes bordering the parklands.',
      'Heritage-sensitive frontages with strict controls on anything visible from the street. It is the reason concealed ducted with rear-sited plant suits most of Centennial Park, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 2.2 square kilometres, Centennial Park is a short run for us, and Centennial Parklands, Martin Road and Lang Road are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Moore Park, Queens Park and Woollahra just as often.',
    ],
    neighbours: ['moore-park', 'queens-park', 'woollahra', 'paddington', 'bondi-junction', 'randwick'],
    landmarks: ['Centennial Parklands', 'Martin Road', 'Lang Road'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Centennial Park?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'clovelly',
    name: 'Clovelly',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2031',
    areaKm2: 0.84,
    centre: [151.26313, -33.911866],
    tagline: 'Salt-air protection and sensible outdoor-unit siting.',
    metaDescription:
      'Air conditioning installation, service and repairs in Clovelly 2031. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Clovelly is made up of interwar brick cottages and semis, low-rise flats near the beach. Clovelly sits on a steep valley to the bay with narrow streets and limited off-street parking.',
      'The thing that shapes almost every job here is simple enough: narrow streets and steep blocks make equipment access as much of a factor as the system itself. For most homes in Clovelly that points to ducted in the cottages, multi-head where roof space is tight, but we confirm it on site rather than over the phone.',
      'Clovelly Road, Burrows Park and the Clovelly Bowling Club are all inside our regular run through postcode 2031. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Bronte, Coogee and Waverley are next door and booked the same week.',
    ],
    neighbours: ['bronte', 'coogee', 'waverley', 'randwick'],
    landmarks: ['Clovelly Road', 'Burrows Park', 'the Clovelly Bowling Club'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Clovelly?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'coogee',
    name: 'Coogee',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2034',
    areaKm2: 1.97,
    centre: [151.254629, -33.919781],
    tagline: 'Beach-facing apartments and houses that see real salt air.',
    metaDescription:
      'Air conditioning installation, service and repairs in Coogee. Corrosion-protected beachside installs, strata-ready apartment systems, Daikin & Haier certified. Free quotes.',
    intro: [
      'Coogee’s apartments along Arden Street and Coogee Bay Road face the beach directly, and the houses climbing the hill behind still sit well within the salt-air zone. Like Bondi, outdoor-unit corrosion and exposure are the first things we design around here, followed by strata approval for the many unit blocks.',
      'The larger houses towards Randwick and Clovelly are more often ducted or multi-head jobs, with the outdoor unit positioned out of the direct sea breeze where the block allows.',
    ],
    neighbours: ['clovelly', 'randwick', 'south-coogee'],
    landmarks: ['Arden Street', 'Coogee Bay Road', 'Dolphins Point'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Coogee?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'daceyville',
    name: 'Daceyville',
    zone: 'east',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2032',
    areaKm2: 0.48,
    centre: [151.225698, -33.928797],
    tagline: 'Nothing visible from the street, nothing on the record.',
    metaDescription:
      'Air conditioning installation, service and repairs in Daceyville 2032. Discreet split systems, plant to the rear. Daikin & Haier certified, free quotes.',
    intro: [
      'Daceyville is built on flat, planned streets with consistent setbacks. The stock is Australia\'s first government garden suburb — interwar cottages under a conservation overlay.',
      'Every Daceyville quote starts from the same constraint: a heritage conservation area, so external changes are assessed on how visible they are. In practice that points to discreet split systems, plant to the rear — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Daceyville covers about 0.5 square kilometres in postcode 2032, and we work Daceyville Public School, Banks Avenue and the garden suburb layout regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Kingsford, Maroubra and Kensington on the same run.',
    ],
    neighbours: ['kingsford', 'maroubra', 'kensington'],
    landmarks: ['Daceyville Public School', 'Banks Avenue', 'the garden suburb layout'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Daceyville?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'darling-point',
    name: 'Darling Point',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2027',
    areaKm2: 0.67,
    centre: [151.236825, -33.872406],
    tagline: 'Strata approvals, quiet placement and tidy line runs.',
    metaDescription:
      'Air conditioning installation, service and repairs in Darling Point 2027. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Darling Point sits on a steep harbour headland with limited street parking. The stock is prestige apartment buildings alongside a handful of large freestanding homes.',
      'Every Darling Point quote starts from the same constraint: older prestige buildings with strict by-laws — approvals and plant location come before capacity. In practice that points to quiet multi-head systems, or ducted where the building allows — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Darling Point covers about 0.7 square kilometres in postcode 2027, and we work Darling Point Road, McKell Park and Yarranabbe Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Edgecliff, Rushcutters Bay and Double Bay on the same run.',
    ],
    neighbours: ['edgecliff', 'rushcutters-bay', 'double-bay', 'paddington'],
    landmarks: ['Darling Point Road', 'McKell Park', 'Yarranabbe Road'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Darling Point?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'double-bay',
    name: 'Double Bay',
    zone: 'east',
    group: 'harbourside',
    profile: 'strata',
    postcode: '2028',
    areaKm2: 0.79,
    centre: [151.243836, -33.877766],
    tagline: 'Discreet systems for harbourside apartments and heritage homes.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Double Bay. Discreet ducted and multi-head systems for harbourside apartments and heritage homes. Daikin & Haier certified.',
    intro: [
      'Double Bay’s village centre around Bay Street and Knox Street is surrounded by a mix of prestige apartments along New South Head Road and the harbour, and heritage houses on the slopes behind. Both value discretion: an outdoor unit that spoils a frontage or a balcony outlook is not an acceptable outcome here.',
      'That usually means concealed ducted systems with ceiling vents for the houses, and carefully placed, quieter units with strata sign-off for the apartments. We plan placement and pipe runs during the site assessment so the finished install is invisible where it should be.',
    ],
    neighbours: ['edgecliff', 'darling-point', 'woollahra', 'bellevue-hill', 'point-piper'],
    landmarks: ['Knox Street', 'Transvaal Avenue', 'Redleaf Pool'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Double Bay?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'dover-heights',
    name: 'Dover Heights',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2030',
    areaKm2: 1.0,
    centre: [151.28112, -33.873396],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Dover Heights 2030. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Dover Heights and the pattern is post-war and rebuilt detached homes on a high clifftop grid. The land here is high, flat-topped and fully exposed to the easterly weather.',
      'For air conditioning, one factor does most of the work in Dover Heights — clifftop wind and salt together are the harshest combination in the eastern suburbs. That usually means ducted with treated coils, outdoor unit sheltered on the western side. What it actually means for your place is a question we answer on site.',
      'Dover Heights covers about 1.0 square kilometres in postcode 2030, and we work Rodney Reserve, Military Road and the Dover Heights cliff walk regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Rose Bay, North Bondi and Vaucluse on the same run.',
    ],
    neighbours: ['rose-bay', 'north-bondi', 'vaucluse'],
    landmarks: ['Rodney Reserve', 'Military Road', 'the Dover Heights cliff walk'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Dover Heights?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'eastgardens',
    name: 'Eastgardens',
    zone: 'east',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2036',
    areaKm2: 0.54,
    centre: [151.225734, -33.945108],
    tagline: 'Ducted where the roof allows, multi-head where it does not.',
    metaDescription:
      'Air conditioning installation, service and repairs in Eastgardens 2036. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Eastgardens and the pattern is post-war brick homes, townhouse infill and apartments near the shopping centre. The land here is flat and open with easy vehicle access.',
      'Low-pitch roofs on the original stock limit ducted options more often than not. It is the reason ducted where the roof allows, bulkhead or multi-head elsewhere suits most of Eastgardens, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Westfield Eastgardens, Bunnerong Road and Heffron Park are all inside our regular run through postcode 2036. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Maroubra, Daceyville and Matraville are next door and booked the same week.',
    ],
    neighbours: ['maroubra', 'daceyville', 'matraville'],
    landmarks: ['Westfield Eastgardens', 'Bunnerong Road', 'Heffron Park'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Eastgardens?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'edgecliff',
    name: 'Edgecliff',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2027',
    areaKm2: 0.31,
    centre: [151.236496, -33.879402],
    tagline: 'Apartment living on the ridge above the harbour.',
    metaDescription:
      'Air conditioning installation, service and repairs for Edgecliff apartments. Strata-ready split and multi-head systems with quiet placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Edgecliff sits on the ridge between Rushcutters Bay and Double Bay, and it is predominantly apartments — from the towers around Edgecliff station and the Edgecliff Centre on New South Head Road to smaller unit blocks on the side streets. Almost every job here is an apartment job, which means strata approval, balcony or wall placement, and condensate drainage are settled before anything is installed.',
      'Multi-head split systems suit most Edgecliff apartments, running several rooms from the one outdoor unit that a balcony can accommodate.',
    ],
    neighbours: ['double-bay', 'darling-point', 'paddington', 'rushcutters-bay', 'woollahra'],
    landmarks: ['Edgecliff Centre', 'New South Head Road', 'Trumper Park'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Edgecliff?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'kensington',
    name: 'Kensington',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2033',
    areaKm2: 2.68,
    centre: [151.220759, -33.913414],
    tagline: 'Body-corporate ready systems for Kensington apartments.',
    metaDescription:
      'Air conditioning installation, service and repairs in Kensington 2033. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Kensington is made up of interwar semis and bungalows alongside a heavy concentration of student and investor apartments. The land here is gently sloping, level building platforms, easy access.',
      'A lot of the work here is retrofitting units in blocks that were never designed for air conditioning. It is the reason wall-mounted splits and multi-heads, sited to satisfy strata and the neighbours suits most of Kensington, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Kensington covers about 2.7 square kilometres in postcode 2033, and we work Anzac Parade, UNSW and Kensington Park regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Kingsford, Randwick and Moore Park on the same run.',
    ],
    neighbours: ['kingsford', 'randwick', 'moore-park', 'centennial-park'],
    landmarks: ['Anzac Parade', 'UNSW', 'Kensington Park'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Kensington?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'kingsford',
    name: 'Kingsford',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2032',
    areaKm2: 2.01,
    centre: [151.228999, -33.925188],
    tagline: 'Body-corporate ready systems for Kingsford apartments.',
    metaDescription:
      'Air conditioning installation, service and repairs in Kingsford 2032. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is flat, with rear lanes serving many of the older blocks. The stock is red-brick walk-ups and newer infill apartments, with pockets of post-war brick houses.',
      'For air conditioning, one factor does most of the work in Kingsford — older walk-ups rarely have a tidy place for an outdoor unit — finding one is the job. That usually means multi-head splits, with the outdoor unit on a bracket or in the light well. What it actually means for your place is a question we answer on site.',
      'Anzac Parade, Gardeners Road and Kingsford Nine Ways are all inside our regular run through postcode 2032. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Daceyville, Kensington and Randwick are next door and booked the same week.',
    ],
    neighbours: ['daceyville', 'kensington', 'randwick', 'maroubra'],
    landmarks: ['Anzac Parade', 'Gardeners Road', 'Kingsford Nine Ways'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Kingsford?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'little-bay',
    name: 'Little Bay',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2036',
    areaKm2: 2.55,
    centre: [151.245839, -33.982732],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Little Bay 2036. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Little Bay and the pattern is modern master-planned townhouses and apartments on the former hospital site, plus older detached homes. The land here is open, elevated coastal land with new-estate access.',
      'New builds often arrive without ducting provision even where the roof space is perfect. It is the reason ducted retrofits in the townhouses, multi-head splits in the apartments suits most of Little Bay, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'The Coast Golf Club, Little Bay Beach and Prince Henry are all inside our regular run through postcode 2036. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Malabar, Matraville and Maroubra are next door and booked the same week.',
    ],
    neighbours: ['malabar', 'matraville', 'maroubra'],
    landmarks: ['The Coast Golf Club', 'Little Bay Beach', 'Prince Henry'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Little Bay?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'malabar',
    name: 'Malabar',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2036',
    areaKm2: 3.73,
    centre: [151.253895, -33.964467],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in Malabar 2036. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Malabar sits on a bowl running down to Long Bay, with elevated streets on both sides. The stock is post-war homes and duplexes, a small number of low-rise units near the bay.',
      'Every Malabar quote starts from the same constraint: the bay funnels salt air inland, so protection matters further back than owners expect. In practice that points to ducted for detached homes, treated splits for the units — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'Malabar covers about 3.7 square kilometres in postcode 2036, and we work Long Bay, Malabar Beach and Franklin Street regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Matraville, Little Bay and Maroubra on the same run.',
    ],
    neighbours: ['matraville', 'little-bay', 'maroubra'],
    landmarks: ['Long Bay', 'Malabar Beach', 'Franklin Street'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Malabar?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'maroubra',
    name: 'Maroubra',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2035',
    areaKm2: 6.05,
    centre: [151.24454, -33.944045],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in Maroubra 2035. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Maroubra is made up of post-war brick homes and duplexes inland, unit blocks along the beach and Maroubra Road. Maroubra sits on a long slope from the beach up to the ridge at Maroubra Junction.',
      'The thing that shapes almost every job here is simple enough: the suburb runs from beachfront to well inland, so salt exposure varies street by street. For most homes in Maroubra that points to ducted inland, corrosion-protected splits nearer the sand, but we confirm it on site rather than over the phone.',
      'We are across Maroubra (2035) most weeks — Maroubra Beach, Anzac Parade and Heffron Park included — and in South Coogee, Eastgardens and Matraville on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['south-coogee', 'eastgardens', 'matraville', 'daceyville', 'malabar', 'kingsford'],
    landmarks: ['Maroubra Beach', 'Anzac Parade', 'Heffron Park'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Maroubra?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'matraville',
    name: 'Matraville',
    zone: 'east',
    group: 'suburban',
    profile: 'postwar',
    postcode: '2036',
    areaKm2: 3.63,
    centre: [151.232737, -33.963034],
    tagline: 'Low-pitch roofs, honest answers on what will fit.',
    metaDescription:
      'Air conditioning installation, service and repairs in Matraville 2036. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in Matraville runs to post-war brick and fibro homes on regular blocks, with newer duplex infill. The land here is flat and open, straightforward access.',
      'The thing that shapes almost every job here is simple enough: low-pitch post-war roofs are the constraint — ceiling space is often tighter than it looks. For most homes in Matraville that points to ducted where the roof allows, bulkhead or multi-head where it does not, but we confirm it on site rather than over the phone.',
      'At roughly 3.6 square kilometres, Matraville is a short run for us, and Bunnerong Road, Matraville Public School and Jack Vanny Reserve are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Malabar, Maroubra and Little Bay just as often.',
    ],
    neighbours: ['malabar', 'maroubra', 'little-bay'],
    landmarks: ['Bunnerong Road', 'Matraville Public School', 'Jack Vanny Reserve'],
    issues: [
      {
        title: 'Low-pitch roofs and tight ceiling cavities',
        body: 'Post-war roofs often have far less usable cavity than owners expect. We measure it before promising ducted.',
      },
      {
        title: 'Original insulation and wiring',
        body: 'Older ceiling spaces bring their own surprises. We check the switchboard capacity at the same visit.',
      },
      {
        title: 'Bulkhead and multi-head alternatives',
        body: 'Where ducted genuinely will not fit, a bulkhead run or a multi-head system gets the same result without pretending the roof space exists.',
      },
    ],
    faq: [
      {
        q: 'Can I get ducted air conditioning in a post-war home in Matraville?',
        a: 'Often yes, but the roof pitch decides it. Many post-war roofs have less usable cavity than they look like they do. We measure before we promise — and where it will not fit, a bulkhead run or multi-head system gets you the same comfort.',
      },
      {
        q: 'Is my switchboard up to running ducted?',
        a: 'Sometimes it is not, particularly on original post-war boards. We check capacity at the assessment so any electrical work is in the quote rather than a surprise later.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'moore-park',
    name: 'Moore Park',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2021',
    areaKm2: 1.81,
    centre: [151.2215, -33.895383],
    tagline: 'Body-corporate ready systems for Moore Park apartments.',
    metaDescription:
      'Air conditioning installation, service and repairs in Moore Park 2021. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Moore Park and the pattern is modern apartment developments and shop-top housing beside the sporting precinct. The land here is flat, with new-build service access.',
      'The thing that shapes almost every job here is simple enough: newer buildings often have provision, but capacity and balcony siting still need checking. For most homes in Moore Park that points to split and multi-head systems within the building\'s approved locations, but we confirm it on site rather than over the phone.',
      'We are across Moore Park (2021) most weeks — the SCG, Allianz Stadium and Moore Park Golf included — and in Centennial Park, Paddington and Kensington on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['centennial-park', 'paddington', 'kensington'],
    landmarks: ['the SCG', 'Allianz Stadium', 'Moore Park Golf'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Moore Park?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'north-bondi',
    name: 'North Bondi',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2026',
    areaKm2: 1.26,
    centre: [151.278324, -33.884568],
    tagline: 'Beachside systems specified to survive the salt.',
    metaDescription:
      'Air conditioning installation, service and repairs in North Bondi 2026. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'North Bondi is built on steep streets falling to the beach and to the golf links. The stock is post-war brick homes and duplexes on the hill, newer knock-down rebuilds closer to Ben Buckler.',
      'Every North Bondi quote starts from the same constraint: exposed headland positions get the full brunt of the salt and the wind. In practice that points to ducted where the roof allows, splits where the ceiling space does not — though roof space, ceiling cavity and where the outdoor unit can legally sit all get checked before we put a number on it.',
      'We are across North Bondi (2026) most weeks — Ben Buckler, Hastings Parade and North Bondi RSL included — and in Bondi Beach, Dover Heights and Rose Bay on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['bondi-beach', 'dover-heights', 'rose-bay', 'bellevue-hill'],
    landmarks: ['Ben Buckler', 'Hastings Parade', 'North Bondi RSL'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in North Bondi?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'paddington',
    name: 'Paddington',
    zone: 'east',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2021',
    areaKm2: 1.65,
    centre: [151.228437, -33.883832],
    tagline: 'Victorian terraces need a different approach — and get one.',
    metaDescription:
      'Air conditioning for Paddington terraces and heritage homes. Discreet split and multi-head systems, courtyard and rooftop placement, heritage-aware installs. Daikin & Haier certified.',
    intro: [
      'Paddington is Sydney’s best-known terrace suburb: rows of Victorian terraces running off Oxford Street inside a heritage conservation area. Narrow frontages, shared walls, small rear courtyards and heritage rules on what can be visible from the street make a standard install approach unworkable here.',
      'The answer is usually a multi-head split system with the outdoor unit in the courtyard or on a rear roof, slim indoor units chosen to suit the rooms, and pipe runs planned so nothing shows on the facade. Ducted is possible in some terraces with usable roof space, and we assess that on site.',
    ],
    neighbours: ['edgecliff', 'rushcutters-bay', 'moore-park', 'woollahra', 'darling-point', 'centennial-park'],
    landmarks: ['Oxford Street', 'Five Ways', 'Paddington Reserve'],
    issues: [
      {
        title: 'Terrace frontages and heritage rules',
        body: 'Paddington’s heritage conservation area restricts external units visible from the street. Placement is almost always the rear courtyard or roof, with pipework routed internally or down the rear wall.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Paddington?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'point-piper',
    name: 'Point Piper',
    zone: 'east',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2027',
    areaKm2: 0.36,
    centre: [151.251621, -33.867382],
    tagline: 'Access-first design for Point Piper\'s steep blocks.',
    metaDescription:
      'Air conditioning installation, service and repairs in Point Piper 2027. Zoned ducted, discreetly placed plant. Daikin & Haier certified, free quotes.',
    intro: [
      'Point Piper sits on a steep harbour promontory, most homes stepping down the slope. The stock is a very small number of large waterfront and near-waterfront homes.',
      'For air conditioning, one factor does most of the work in Point Piper — tight streets and steep frontages make access planning as important as the system. That usually means zoned ducted, discreetly placed plant. What it actually means for your place is a question we answer on site.',
      'At roughly 0.4 square kilometres, Point Piper is a short run for us, and Wolseley Road, Lady Martins Beach and Wentworth Street are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Double Bay, Bellevue Hill and Rose Bay just as often.',
    ],
    neighbours: ['double-bay', 'bellevue-hill', 'rose-bay'],
    landmarks: ['Wolseley Road', 'Lady Martins Beach', 'Wentworth Street'],
    issues: [
      {
        title: 'Equipment access on steep blocks',
        body: 'On some blocks the plant has to be carried, winched or craned in. We work that out during the assessment so the quote holds.',
      },
      {
        title: 'Zoning across split levels',
        body: 'Heat behaves differently on each level of a split-level home. Separate zones — sometimes separate systems — are what make it comfortable.',
      },
      {
        title: 'Line-run length between indoor and outdoor units',
        body: 'Steep sites push the outdoor unit further from the indoor. Refrigerant line length affects performance and gets designed for, not ignored.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Point Piper?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'queens-park',
    name: 'Queens Park',
    zone: 'east',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2022',
    areaKm2: 0.84,
    centre: [151.247159, -33.899447],
    tagline: 'Mixed housing, so every quote starts on site.',
    metaDescription:
      'Air conditioning installation, service and repairs in Queens Park 2022. Zoned ducted systems. Daikin & Haier certified, free quotes.',
    intro: [
      'The housing in Queens Park runs to federation and interwar houses backing the park, semis and a few small unit blocks. The land here is gently sloping to the parkland, mostly level building platforms.',
      'The thing that shapes almost every job here is simple enough: quiet detached stock with usable roof space — one of the easier ducted suburbs in the east. For most homes in Queens Park that points to zoned ducted systems, but we confirm it on site rather than over the phone.',
      'Queens Park covers about 0.8 square kilometres in postcode 2022, and we work Queens Park, York Road and Centennial Parklands regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Bondi Junction, Waverley and Centennial Park on the same run.',
    ],
    neighbours: ['bondi-junction', 'waverley', 'centennial-park', 'randwick'],
    landmarks: ['Queens Park', 'York Road', 'Centennial Parklands'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Queens Park?',
        a: 'It depends which part of Queens Park you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'randwick',
    name: 'Randwick',
    zone: 'east',
    group: 'apartment',
    profile: 'mixed',
    postcode: '2031',
    areaKm2: 5.36,
    centre: [151.241055, -33.915431],
    tagline: 'Older unit blocks, period homes and the racecourse end of the East.',
    metaDescription:
      'Air conditioning installation and repairs in Randwick. Split, multi-head and ducted systems for older apartment blocks and period homes near the racecourse and hospital. Free quotes.',
    intro: [
      'Randwick is one of the more varied Eastern Suburbs: a high concentration of older brick apartment blocks around Belmore Road and The Spot, Victorian and federation houses on the streets between, and the racecourse, Prince of Wales Hospital and the UNSW edge at Kensington shaping the traffic and the tenant mix.',
      'Older unit blocks bring strata approval, tight outdoor-unit positions and ageing wiring into most jobs. The period homes tend to need ducted retrofits designed around existing roof spaces, or multi-head systems where the roof won’t allow ducting.',
    ],
    neighbours: ['coogee', 'kingsford', 'queens-park', 'kensington', 'waverley', 'centennial-park'],
    landmarks: ['Royal Randwick', 'The Spot', 'Prince of Wales Hospital'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Randwick?',
        a: 'It depends which part of Randwick you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'rose-bay',
    name: 'Rose Bay',
    zone: 'east',
    group: 'harbourside',
    profile: 'coastal',
    postcode: '2029',
    areaKm2: 2.54,
    centre: [151.268929, -33.8738],
    tagline: 'Harbourside homes and apartments, from the water up to Old South Head Road.',
    metaDescription:
      'Air conditioning installation, service and repairs in Rose Bay. Ducted and split systems for harbourside apartments and larger family homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Rose Bay runs from apartment blocks along the harbour and New South Head Road up the hill to the larger family homes around Old South Head Road. The harbourside properties get salt air off the water; the homes on the slopes deal more with steep blocks, established gardens and the access questions that come with them.',
      'Larger Rose Bay homes are natural candidates for zoned ducted systems, so only the rooms in use are running. For the apartments closer to the water, placement, strata approval and corrosion protection on the outdoor unit are the main design points.',
    ],
    neighbours: ['dover-heights', 'bellevue-hill', 'north-bondi', 'point-piper', 'bondi-beach', 'vaucluse'],
    landmarks: ['Lyne Park', 'New South Head Road', 'the flying boat base'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Rose Bay?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'rushcutters-bay',
    name: 'Rushcutters Bay',
    zone: 'east',
    group: 'apartment',
    profile: 'strata',
    postcode: '2011',
    areaKm2: 0.15,
    centre: [151.228064, -33.874738],
    tagline: 'Apartment installs done to the by-laws, not around them.',
    metaDescription:
      'Air conditioning installation, service and repairs in Rushcutters Bay 2011. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The land here is flat around the bay, rising quickly on all three sides. The stock is art-deco and 1960s apartment blocks around the park, some shop-top housing.',
      'Older blocks with no provision for outdoor units — placement is negotiated, not assumed. It is the reason wall-mounted and multi-head splits with carefully planned line runs suits most of Rushcutters Bay, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'Rushcutters Bay covers about 0.1 square kilometres in postcode 2011, and we work Rushcutters Bay Park, the Cruising Yacht Club and Bayswater Road regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Darling Point, Edgecliff and Paddington on the same run.',
    ],
    neighbours: ['darling-point', 'edgecliff', 'paddington'],
    landmarks: ['Rushcutters Bay Park', 'the Cruising Yacht Club', 'Bayswater Road'],
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Most blocks need written approval before an outdoor unit goes up. We provide the specification, noise data and placement drawing strata will ask for.',
      },
      {
        title: 'Noise limits to neighbouring units',
        body: 'Outdoor units near a neighbour\'s bedroom window cause more disputes than any other part of the job. We check clearances and select for sound power, not just capacity.',
      },
      {
        title: 'Common property penetrations',
        body: 'Running pipework through common property has rules. We plan the route before quoting so there are no surprises at approval stage.',
      },
    ],
    faq: [
      {
        q: 'Do I need strata approval for air conditioning in Rushcutters Bay?',
        a: 'Almost always, yes — the outdoor unit usually sits on common property or an external wall. We give you the model specification, sound data and a placement plan to submit, and we work to whatever the by-laws allow.',
      },
      {
        q: 'Can you install without drilling through common property?',
        a: 'Sometimes. It depends on where the outdoor unit can go and how the line run reaches it. We work that out at the assessment and tell you honestly what the building will allow.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'south-coogee',
    name: 'South Coogee',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2034',
    areaKm2: 1.16,
    centre: [151.254648, -33.932461],
    tagline: 'Coastal installs built for salt air, not just square metres.',
    metaDescription:
      'Air conditioning installation, service and repairs in South Coogee 2034. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'South Coogee is built on high, exposed clifftop streets with long ocean frontage. The stock is post-war and modern detached homes, duplexes, few apartments.',
      'The thing that shapes almost every job here is simple enough: clifftop exposure is as harsh as it gets — coil treatment is not optional here. For most homes in South Coogee that points to ducted where the roof pitch allows, coastal-grade outdoor units either way, but we confirm it on site rather than over the phone.',
      'South Coogee covers about 1.2 square kilometres in postcode 2034, and we work Malabar Road, Lurline Bay and Trenerry Reserve regularly. Every quote is the same: a look at the roof space and the switchboard, a sizing calculation for the rooms you actually use, and a written price with nothing added later. We cover Coogee, Maroubra and Randwick on the same run.',
    ],
    neighbours: ['coogee', 'maroubra', 'randwick'],
    landmarks: ['Malabar Road', 'Lurline Bay', 'Trenerry Reserve'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in South Coogee?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'tamarama',
    name: 'Tamarama',
    zone: 'east',
    group: 'beachside',
    profile: 'coastal',
    postcode: '2026',
    areaKm2: 0.31,
    centre: [151.270388, -33.898635],
    tagline: 'Salt-air protection and sensible outdoor-unit siting.',
    metaDescription:
      'Air conditioning installation, service and repairs in Tamarama 2026. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Tamarama is made up of a small number of houses and low-rise flats on very steep ground above the beach. Tamarama sits on one of the steepest pockets in the east — access is the first thing we assess.',
      'For air conditioning, one factor does most of the work in Tamarama — steep driveways and split-level homes make outdoor-unit placement and crane access the whole job. That usually means multi-head splits, zoned to the levels the family actually uses. What it actually means for your place is a question we answer on site.',
      'We are across Tamarama (2026) most weeks — Tamarama Marine Drive, the coastal walk and Tamarama Park included — and in Bondi, Bronte and Bondi Beach on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['bondi', 'bronte', 'bondi-beach'],
    landmarks: ['Tamarama Marine Drive', 'the coastal walk', 'Tamarama Park'],
    issues: [
      {
        title: 'Salt-air corrosion on the outdoor unit',
        body: 'Coastal air strips an untreated condenser coil years before its time. We specify corrosion-treated coils and site the outdoor unit out of the prevailing salt-laden wind.',
      },
      {
        title: 'Outdoor unit placement on exposed blocks',
        body: 'Wind exposure affects both efficiency and noise. Placement gets decided on site, not from a floor plan.',
      },
      {
        title: 'Condensate and drainage in humid air',
        body: 'Higher humidity means more condensate. Drainage gets planned properly rather than run to the nearest garden bed.',
      },
    ],
    faq: [
      {
        q: 'Will the salt air wreck my outdoor unit in Tamarama?',
        a: 'It will shorten its life if the unit is not specified for it. We use corrosion-treated coils on coastal jobs and site the outdoor unit away from the prevailing salt-laden wind. A rinse-down as part of an annual service does the rest.',
      },
      {
        q: 'How often should a system near the beach be serviced?',
        a: 'Annually at minimum for coastal properties. Salt accelerates everything, and an annual service is also what keeps most manufacturer warranties valid.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'vaucluse',
    name: 'Vaucluse',
    zone: 'east',
    group: 'harbourside',
    profile: 'steep',
    postcode: '2030',
    areaKm2: 3.09,
    centre: [151.2771, -33.855888],
    tagline: 'Large homes exposed to both harbour and ocean weather.',
    metaDescription:
      'Air conditioning installation and servicing in Vaucluse. Zoned ducted systems for large harbourside homes, corrosion-aware outdoor placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Vaucluse occupies the peninsula between Sydney Harbour and the ocean, with large homes along Old South Head Road and the streets down towards Nielsen Park and Watsons Bay. Many are exposed to harbour winds on one side and ocean weather on the other, which makes outdoor-unit position and corrosion protection matter more than in a sheltered suburb.',
      'These are mostly zoned ducted jobs — larger, often multi-level homes where running only the occupied rooms makes a real difference to comfort and running costs. Heritage frontages and steep, landscaped blocks shape where equipment can go.',
    ],
    neighbours: ['watsons-bay', 'dover-heights', 'rose-bay'],
    landmarks: ['Vaucluse House', 'Nielsen Park', 'Hopetoun Avenue'],
    issues: [
      {
        title: 'Two-sided weather exposure',
        body: 'Vaucluse homes often face harbour winds and ocean salt at the same time. Outdoor units are positioned on the more sheltered side of the property and specified with corrosion-protected coils where exposure is unavoidable.',
      },
    ],
    faq: [
      {
        q: 'Can you get equipment into a steep block in Vaucluse?',
        a: 'Yes, but how we do it changes the plan. Some sites are a straightforward carry, some need a winch or a crane. We establish that at the assessment so the quote does not move.',
      },
      {
        q: 'Should a split-level home have one system or two?',
        a: 'It depends on the fall between levels and how the rooms are used. Zoning one system handles most homes; a genuinely separated lower level sometimes justifies its own.',
      },
    ],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'watsons-bay',
    name: 'Watsons Bay',
    zone: 'east',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2030',
    areaKm2: 0.63,
    centre: [151.282018, -33.840783],
    tagline: 'Heritage-sensitive work, planned before it is quoted.',
    metaDescription:
      'Air conditioning installation, service and repairs in Watsons Bay 2030. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Watsons Bay is made up of a small, tightly held mix of cottages, semis and low-rise flats. Watsons Bay sits on a narrow peninsula, exposed on both the harbour and ocean sides.',
      'Ocean on one side and harbour on the other — there is no sheltered aspect here. It is the reason compact split systems with coastal-grade protection suits most of Watsons Bay, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'We are across Watsons Bay (2030) most weeks — Camp Cove, The Gap and Marine Parade included — and in Vaucluse, Dover Heights and Rose Bay on the same trips. Free on-site assessment, honest advice on whether you need a new system or just a service, and a written quote inside 24 hours.',
    ],
    neighbours: ['vaucluse', 'dover-heights', 'rose-bay'],
    landmarks: ['Camp Cove', 'The Gap', 'Marine Parade'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Watsons Bay?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'waverley',
    name: 'Waverley',
    zone: 'east',
    group: 'suburban',
    profile: 'mixed',
    postcode: '2024',
    areaKm2: 0.6,
    centre: [151.255735, -33.901417],
    tagline: 'Houses and units, each assessed on its own terms.',
    metaDescription:
      'Air conditioning installation, service and repairs in Waverley 2024. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'The housing in Waverley runs to federation and interwar houses, semis, and a steady run of unit blocks along Bronte Road. Waverley is built on ridge-top, mostly level, with good roof access on the detached stock.',
      'Far enough back from the water to escape the worst salt, close enough to still need sensible siting. It is the reason ducted suits the detached homes; the unit blocks are split-system territory suits most of Waverley, and the reason we quote after looking at the roof space and the outdoor unit location, not before.',
      'At roughly 0.6 square kilometres, Waverley is a short run for us, and Waverley Park, Bronte Road and Waverley Cemetery are all inside it. Every quote is free, done on site, and back in writing within 24 hours with the make, model and capacity spelled out. We are in Bronte, Queens Park and Bondi Junction just as often.',
    ],
    neighbours: ['bronte', 'queens-park', 'bondi-junction', 'bondi', 'clovelly', 'randwick'],
    landmarks: ['Waverley Park', 'Bronte Road', 'Waverley Cemetery'],
    issues: [
      {
        title: 'Two very different housing types',
        body: 'The same street can hold a freestanding home and a walk-up block. The right system differs completely between them.',
      },
      {
        title: 'Roof space varies house to house',
        body: 'Assessment on site is the only reliable way to know whether ducted is realistic.',
      },
      {
        title: 'Strata where it applies',
        body: 'For the unit stock, approval and placement come before capacity.',
      },
    ],
    faq: [
      {
        q: 'What system suits a home in Waverley?',
        a: 'It depends which part of Waverley you are in — the housing is genuinely mixed here. Roof space, ceiling cavity and whether you are in strata all change the answer, which is why the assessment is on site and free.',
      },
      {
        q: 'How long does an installation take?',
        a: 'A single split system is usually a day. Ducted is typically one to two days depending on the layout and how much roof access there is.',
      },
    ],
    updated: '2026-09-13',
  },
  {
    slug: 'woollahra',
    name: 'Woollahra',
    zone: 'east',
    group: 'harbourside',
    profile: 'heritage',
    postcode: '2025',
    areaKm2: 1.27,
    centre: [151.243893, -33.886947],
    tagline: 'Heritage-sensitive work, planned before it is quoted.',
    metaDescription:
      'Air conditioning installation, service and repairs in Woollahra 2025. Daikin & Haier certified installers. Free on-site quotes.',
    intro: [
      'Walk Woollahra and the pattern is Victorian terraces and freestanding federation homes, a conservation area for most of its extent. The land here is rolling, with rear lanes behind most terrace rows.',
      'For air conditioning, one factor does most of the work in Woollahra — heritage controls mean nothing visible from the street — outdoor units go to the rear or the lane. That usually means concealed ducted where the ceiling allows, otherwise discreet multi-head. What it actually means for your place is a question we answer on site.',
      'Queen Street, Moncur Street and Cooper Park are all inside our regular run through postcode 2025. You get a free on-site assessment, a system sized to the rooms rather than the floor area, and a fixed written quote back within 24 hours. Bondi Junction, Double Bay and Edgecliff are next door and booked the same week.',
    ],
    neighbours: ['bondi-junction', 'double-bay', 'edgecliff', 'bellevue-hill', 'paddington', 'centennial-park'],
    landmarks: ['Queen Street', 'Moncur Street', 'Cooper Park'],
    issues: [
      {
        title: 'Nothing visible from the street',
        body: 'Conservation controls generally rule out street-facing equipment. Outdoor units go to the rear, the side or the lane, and line runs are concealed.',
      },
      {
        title: 'Working around original fabric',
        body: 'Lath and plaster ceilings, slate roofs and original joinery all need care. We plan penetrations to avoid them rather than patch afterwards.',
      },
      {
        title: 'Limited or no roof cavity',
        body: 'Many period homes have little usable roof space. Where ducted will not fit honestly, we say so and design around it.',
      },
    ],
    faq: [
      {
        q: 'Will an air conditioner affect my heritage listing in Woollahra?',
        a: 'Not if it is planned properly. The controls are about what is visible and what fabric is altered. We keep plant off the street elevation and conceal line runs, which is usually what an assessment turns on.',
      },
      {
        q: 'Can ducted go into a period home with no roof space?',
        a: 'Sometimes, using a compact indoor unit and a shortened duct layout — and sometimes not. Where it genuinely will not fit we will tell you, rather than force it and leave you with a system that underperforms.',
      },
    ],
    updated: '2026-09-13',
  },
  // ─── Regional NSW & ACT ──────────────────────────────────────────
  {
    slug: 'blue-mountains',
    name: 'Blue Mountains',
    zone: 'regional',
    group: 'regional',
    postcode: '2780',
    tagline: 'Cold winters at altitude — heating performance comes first.',
    metaDescription:
      'Reverse-cycle air conditioning installation and servicing in the Blue Mountains, scheduled in advance. Systems sized for cold mountain winters and older homes. Daikin & Haier certified.',
    intro: [
      'The Blue Mountains sit high enough that winters are genuinely cold — Katoomba and the upper mountains regularly see frost and occasional snow — so a system here is chosen for its heating performance at least as much as its cooling. Many homes are older weatherboard or brick cottages with limited insulation, which affects sizing.',
      'Blue Mountains installs and servicing are scheduled in advance. Send us your suburb and job details to confirm availability.',
    ],
    neighbours: ['Katoomba', 'Leura', 'Springwood', 'Blaxland', 'Wentworth Falls'],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'canberra',
    name: 'Canberra',
    zone: 'regional',
    group: 'regional',
    postcode: '2600',
    tagline: 'Hot summers, cold winters — reverse-cycle sized for both.',
    metaDescription:
      'Reverse-cycle air conditioning installation and servicing in Canberra, scheduled in advance. Ducted and split systems sized for the ACT’s hot summers and cold winters. Free quotes.',
    intro: [
      'Canberra’s inland climate swings further than Sydney’s — hot, dry summers and cold winters with regular frosts — so systems are specified for heating capacity as carefully as cooling. Ducted reverse-cycle is common in the larger family homes across the ACT’s suburbs.',
      'Canberra installs and servicing are scheduled in advance. Send through your job details to confirm availability and timing.',
    ],
    neighbours: ['Belconnen', 'Woden', 'Gungahlin', 'Tuggeranong', 'Queanbeyan'],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'central-coast',
    name: 'Central Coast',
    zone: 'regional',
    group: 'regional',
    postcode: '2250',
    tagline: 'Coastal and lakeside homes between Sydney and Newcastle.',
    metaDescription:
      'Air conditioning installation and servicing on the Central Coast, scheduled in advance. Corrosion-aware coastal installs for homes around Gosford, Terrigal and the lakes. Free quotes.',
    intro: [
      'The Central Coast runs from Gosford and the lakes out to the beaches at Terrigal and Avoca, with a housing mix from older weatherboard cottages to new estates. Humidity and salt exposure vary block by block, which is why unit selection and outdoor placement are assessed on site rather than assumed.',
      'Central Coast jobs are scheduled in advance. Get in touch with your suburb and job details and we’ll confirm availability.',
    ],
    neighbours: ['newcastle', 'Gosford', 'Terrigal', 'Erina', 'The Entrance', 'Woy Woy'],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'newcastle',
    name: 'Newcastle',
    zone: 'regional',
    group: 'regional',
    postcode: '2300',
    tagline: 'Scheduled installs and servicing in Newcastle and the Hunter.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Newcastle, scheduled in advance. Systems sized for humid coastal summers and salt air. Daikin & Haier certified. Free quotes.',
    intro: [
      'Newcastle’s coastal position means humid summers and salt air near the beaches from Newcastle through Merewether, with a mix of inner-city terraces and suburban family homes. Coastal corrosion protection and sizing for humidity are the design points that differ from an inland Sydney job.',
      'Work in Newcastle and the Hunter is scheduled in advance. Send through your job details and we’ll confirm availability and timing.',
    ],
    neighbours: ['central-coast', 'Merewether', 'Hamilton', 'Lake Macquarie', 'Maitland'],
    handwritten: true,
    updated: '2026-09-11',
  },
  {
    slug: 'wollongong',
    name: 'Wollongong',
    zone: 'regional',
    group: 'regional',
    postcode: '2500',
    tagline: 'Coastal Illawarra homes under the escarpment.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Wollongong and the Illawarra, scheduled in advance. Corrosion-aware coastal installs, Daikin & Haier certified. Free quotes.',
    intro: [
      'Wollongong and the Illawarra run along a narrow strip between the escarpment and the ocean, so salt air reaches most suburbs and summers are warm and humid. Housing ranges from older cottages near the city centre to newer homes in the northern and southern suburbs.',
      'Illawarra jobs are scheduled in advance. Tell us your suburb and what you need and we’ll confirm availability.',
    ],
    neighbours: ['North Wollongong', 'Fairy Meadow', 'Figtree', 'Shellharbour', 'Thirroul'],
    handwritten: true,
    updated: '2026-09-11',
  },
];

export const suburbBySlug = new Map(SUBURBS.map((s) => [s.slug, s]));

export function suburbsInZone(zone: Zone): Suburb[] {
  return SUBURBS.filter((s) => s.zone === zone);
}

/** Resolve a neighbour entry to a link where a page exists, else a plain label. */
export function neighbourLink(entry: string): { name: string; href?: string } {
  const page = suburbBySlug.get(entry);
  return page ? { name: page.name, href: `/service-area/${page.slug}` } : { name: entry };
}
