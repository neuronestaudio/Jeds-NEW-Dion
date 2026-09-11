import type { Faq, GroupKey, Issue } from './suburbGroups';

export type Zone = 'north' | 'east' | 'regional';

export const ZONES: Record<Zone, { id: string; label: string; short: string }> = {
  north: { id: 'north-shore', label: 'North Shore & Northern Sydney', short: 'North Shore' },
  east: { id: 'eastern-suburbs', label: 'Eastern Suburbs', short: 'Eastern Suburbs' },
  regional: { id: 'regional', label: 'Regional NSW & ACT', short: 'Regional' },
};

export interface Suburb {
  slug: string;
  name: string;
  zone: Zone;
  group: GroupKey;
  postcode: string;
  /** Positioning line under the H1. */
  tagline: string;
  /** Meta description — unique per page, ≤160 chars. */
  metaDescription: string;
  /** Genuinely local intro copy. Only verifiable facts about the area. */
  intro: string[];
  /** Neighbouring suburbs — slugs that have their own page link through; plain names don't. */
  neighbours: string[];
  /** Suburb-specific issues added ahead of the group's. */
  issues?: Issue[];
  /** Suburb-specific FAQs added ahead of the group's. */
  faq?: Faq[];
  /** ISO date of the last content change — drives the sitemap's lastmod. */
  updated: string;
}

const UPDATED = '2026-09-11';

export const SUBURBS: Suburb[] = [
  // ─── Eastern Suburbs ───────────────────────────────────────────────────────
  {
    slug: 'bondi',
    name: 'Bondi',
    zone: 'east',
    group: 'beachside',
    postcode: '2026',
    tagline: 'Beachside installs built for salt air, strata rules and summer crowds.',
    metaDescription:
      'Air conditioning installation, service and repairs in Bondi. Corrosion-protected beachside installs, strata-ready apartment systems, Daikin & Haier certified. Free quotes.',
    intro: [
      'Bondi is a mix of beachfront apartment blocks along Campbell Parade, older unit buildings up Bondi Road, and semi-detached and federation homes on the streets behind them — and each brings its own install considerations. The one every Bondi property shares is proximity to the ocean: salt air reaches well back from the beach and works on an outdoor unit faster than it does inland.',
      'For apartments, the outdoor unit is usually the whole question — where it can go, what strata will approve, and how to keep it quiet for the neighbours. For the houses further back, it is more often about fitting ducted or multi-head systems into older layouts without touching the street frontage. We assess both on site before quoting.',
    ],
    neighbours: ['bondi-junction', 'rose-bay', 'vaucluse', 'Tamarama', 'Bronte', 'Waverley'],
    updated: UPDATED,
  },
  {
    slug: 'bondi-junction',
    name: 'Bondi Junction',
    zone: 'east',
    group: 'apartment',
    postcode: '2022',
    tagline: 'Apartment towers, strata approvals and tight outdoor-unit placement, handled.',
    metaDescription:
      'Air conditioning installation and repairs for Bondi Junction apartments and homes. Strata-ready split and multi-head systems, quiet placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Bondi Junction is the Eastern Suburbs’ transport and retail hub — Westfield, the Oxford Street mall and the rail and bus interchange sit at its centre, ringed by high-rise apartment towers and older three- and four-storey unit blocks. That density shapes almost every air conditioning job here: the outdoor unit has to go somewhere strata will approve, within noise clearances, with condensate drained properly.',
      'Multi-head split systems, running two or three rooms from a single outdoor unit, are the workhorse for Bondi Junction apartments. For the terraces and houses on the quieter streets towards Waverley and Queens Park, ducted systems and single splits are more usual.',
    ],
    neighbours: ['bondi', 'paddington', 'randwick', 'Waverley', 'Woollahra', 'Queens Park'],
    updated: UPDATED,
  },
  {
    slug: 'double-bay',
    name: 'Double Bay',
    zone: 'east',
    group: 'harbourside',
    postcode: '2028',
    tagline: 'Discreet systems for harbourside apartments and heritage homes.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Double Bay. Discreet ducted and multi-head systems for harbourside apartments and heritage homes. Daikin & Haier certified.',
    intro: [
      'Double Bay’s village centre around Bay Street and Knox Street is surrounded by a mix of prestige apartments along New South Head Road and the harbour, and heritage houses on the slopes behind. Both value discretion: an outdoor unit that spoils a frontage or a balcony outlook is not an acceptable outcome here.',
      'That usually means concealed ducted systems with ceiling vents for the houses, and carefully placed, quieter units with strata sign-off for the apartments. We plan placement and pipe runs during the site assessment so the finished install is invisible where it should be.',
    ],
    neighbours: ['edgecliff', 'rose-bay', 'Bellevue Hill', 'Point Piper', 'Darling Point'],
    updated: UPDATED,
  },
  {
    slug: 'rose-bay',
    name: 'Rose Bay',
    zone: 'east',
    group: 'harbourside',
    postcode: '2029',
    tagline: 'Harbourside homes and apartments, from the water up to Old South Head Road.',
    metaDescription:
      'Air conditioning installation, service and repairs in Rose Bay. Ducted and split systems for harbourside apartments and larger family homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Rose Bay runs from apartment blocks along the harbour and New South Head Road up the hill to the larger family homes around Old South Head Road. The harbourside properties get salt air off the water; the homes on the slopes deal more with steep blocks, established gardens and the access questions that come with them.',
      'Larger Rose Bay homes are natural candidates for zoned ducted systems, so only the rooms in use are running. For the apartments closer to the water, placement, strata approval and corrosion protection on the outdoor unit are the main design points.',
    ],
    neighbours: ['double-bay', 'vaucluse', 'bondi', 'Bellevue Hill', 'Dover Heights'],
    updated: UPDATED,
  },
  {
    slug: 'randwick',
    name: 'Randwick',
    zone: 'east',
    group: 'apartment',
    postcode: '2031',
    tagline: 'Older unit blocks, period homes and the racecourse end of the East.',
    metaDescription:
      'Air conditioning installation and repairs in Randwick. Split, multi-head and ducted systems for older apartment blocks and period homes near the racecourse and hospital. Free quotes.',
    intro: [
      'Randwick is one of the more varied Eastern Suburbs: a high concentration of older brick apartment blocks around Belmore Road and The Spot, Victorian and federation houses on the streets between, and the racecourse, Prince of Wales Hospital and the UNSW edge at Kensington shaping the traffic and the tenant mix.',
      'Older unit blocks bring strata approval, tight outdoor-unit positions and ageing wiring into most jobs. The period homes tend to need ducted retrofits designed around existing roof spaces, or multi-head systems where the roof won’t allow ducting.',
    ],
    neighbours: ['coogee', 'bondi-junction', 'Kensington', 'Kingsford', 'Clovelly'],
    updated: UPDATED,
  },
  {
    slug: 'edgecliff',
    name: 'Edgecliff',
    zone: 'east',
    group: 'apartment',
    postcode: '2027',
    tagline: 'Apartment living on the ridge above the harbour.',
    metaDescription:
      'Air conditioning installation, service and repairs for Edgecliff apartments. Strata-ready split and multi-head systems with quiet placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Edgecliff sits on the ridge between Rushcutters Bay and Double Bay, and it is predominantly apartments — from the towers around Edgecliff station and the Edgecliff Centre on New South Head Road to smaller unit blocks on the side streets. Almost every job here is an apartment job, which means strata approval, balcony or wall placement, and condensate drainage are settled before anything is installed.',
      'Multi-head split systems suit most Edgecliff apartments, running several rooms from the one outdoor unit that a balcony can accommodate.',
    ],
    neighbours: ['double-bay', 'paddington', 'Darling Point', 'Rushcutters Bay', 'Woollahra'],
    updated: UPDATED,
  },
  {
    slug: 'paddington',
    name: 'Paddington',
    zone: 'east',
    group: 'harbourside',
    postcode: '2021',
    tagline: 'Victorian terraces need a different approach — and get one.',
    metaDescription:
      'Air conditioning for Paddington terraces and heritage homes. Discreet split and multi-head systems, courtyard and rooftop placement, heritage-aware installs. Daikin & Haier certified.',
    intro: [
      'Paddington is Sydney’s best-known terrace suburb: rows of Victorian terraces running off Oxford Street inside a heritage conservation area. Narrow frontages, shared walls, small rear courtyards and heritage rules on what can be visible from the street make a standard install approach unworkable here.',
      'The answer is usually a multi-head split system with the outdoor unit in the courtyard or on a rear roof, slim indoor units chosen to suit the rooms, and pipe runs planned so nothing shows on the facade. Ducted is possible in some terraces with usable roof space, and we assess that on site.',
    ],
    issues: [
      {
        title: 'Terrace frontages and heritage rules',
        body: 'Paddington’s heritage conservation area restricts external units visible from the street. Placement is almost always the rear courtyard or roof, with pipework routed internally or down the rear wall.',
      },
    ],
    neighbours: ['edgecliff', 'bondi-junction', 'Woollahra', 'Darlinghurst', 'Surry Hills', 'Centennial Park'],
    updated: UPDATED,
  },
  {
    slug: 'coogee',
    name: 'Coogee',
    zone: 'east',
    group: 'beachside',
    postcode: '2034',
    tagline: 'Beach-facing apartments and houses that see real salt air.',
    metaDescription:
      'Air conditioning installation, service and repairs in Coogee. Corrosion-protected beachside installs, strata-ready apartment systems, Daikin & Haier certified. Free quotes.',
    intro: [
      'Coogee’s apartments along Arden Street and Coogee Bay Road face the beach directly, and the houses climbing the hill behind still sit well within the salt-air zone. Like Bondi, outdoor-unit corrosion and exposure are the first things we design around here, followed by strata approval for the many unit blocks.',
      'The larger houses towards Randwick and Clovelly are more often ducted or multi-head jobs, with the outdoor unit positioned out of the direct sea breeze where the block allows.',
    ],
    neighbours: ['randwick', 'bondi', 'Clovelly', 'South Coogee', 'Maroubra'],
    updated: UPDATED,
  },
  {
    slug: 'vaucluse',
    name: 'Vaucluse',
    zone: 'east',
    group: 'harbourside',
    postcode: '2030',
    tagline: 'Large homes exposed to both harbour and ocean weather.',
    metaDescription:
      'Air conditioning installation and servicing in Vaucluse. Zoned ducted systems for large harbourside homes, corrosion-aware outdoor placement, Daikin & Haier certified. Free quotes.',
    intro: [
      'Vaucluse occupies the peninsula between Sydney Harbour and the ocean, with large homes along Old South Head Road and the streets down towards Nielsen Park and Watsons Bay. Many are exposed to harbour winds on one side and ocean weather on the other, which makes outdoor-unit position and corrosion protection matter more than in a sheltered suburb.',
      'These are mostly zoned ducted jobs — larger, often multi-level homes where running only the occupied rooms makes a real difference to comfort and running costs. Heritage frontages and steep, landscaped blocks shape where equipment can go.',
    ],
    issues: [
      {
        title: 'Two-sided weather exposure',
        body: 'Vaucluse homes often face harbour winds and ocean salt at the same time. Outdoor units are positioned on the more sheltered side of the property and specified with corrosion-protected coils where exposure is unavoidable.',
      },
    ],
    neighbours: ['rose-bay', 'bondi', 'Dover Heights', 'Watsons Bay'],
    updated: UPDATED,
  },

  // ─── North Shore & Northern Sydney ────────────────────────────────────────
  {
    slug: 'chatswood',
    name: 'Chatswood',
    zone: 'north',
    group: 'apartment',
    postcode: '2067',
    tagline: 'High-rise units by the station, established homes on the streets around them.',
    metaDescription:
      'Air conditioning installation, service and repairs in Chatswood. Strata-ready apartment systems and ducted installs for established homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Chatswood’s centre — Westfield, Chatswood Chase, Victoria Avenue and the rail and metro interchange — is ringed by high-rise apartment towers, while the streets east and west settle into established houses on generous blocks. The two halves need different thinking: strata-approved, quiet apartment installs near the station, and ducted or multi-head systems for the houses.',
      'Apartment jobs here turn on where the outdoor unit can go and what the building’s by-laws allow. The houses are more often ducted retrofits into existing roof spaces, sized and zoned for family homes.',
    ],
    neighbours: ['willoughby', 'lane-cove', 'north-sydney', 'Artarmon', 'Roseville'],
    updated: UPDATED,
  },
  {
    slug: 'mosman',
    name: 'Mosman',
    zone: 'north',
    group: 'harbourside',
    postcode: '2088',
    tagline: 'Federation homes and harbourside apartments from Military Road to Balmoral.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Mosman. Discreet ducted retrofits for federation homes and quiet apartment installs near Balmoral. Daikin & Haier certified.',
    intro: [
      'Mosman is largely federation and inter-war homes on the slopes running down to the harbour, with apartments along Military Road, Spit Road and the Balmoral Beach end. Heritage streetscapes, steep blocks and mature gardens are the norm, so where an outdoor unit sits and how the pipework is routed are decided during the site visit, not on install day.',
      'Concealed ducted systems suit the larger family homes; multi-head splits with discreet indoor units cover the apartments and the homes where roof space won’t take ducting. Balmoral-side properties get some harbour salt air, which we account for in unit selection.',
    ],
    neighbours: ['north-sydney', 'manly', 'Cremorne', 'Neutral Bay', 'Balmoral', 'Clifton Gardens'],
    updated: UPDATED,
  },
  {
    slug: 'north-sydney',
    name: 'North Sydney',
    zone: 'north',
    group: 'apartment',
    postcode: '2060',
    tagline: 'Residential towers and commercial fit-outs in one of Sydney’s busiest centres.',
    metaDescription:
      'Air conditioning installation and repairs in North Sydney. Strata-ready apartment systems and commercial fit-outs for offices around Miller Street and the Pacific Highway. Free quotes.',
    intro: [
      'North Sydney is a commercial centre first — office towers along Miller Street and the Pacific Highway — with a large and growing residential population in apartment towers around it and older unit blocks towards Kirribilli and Neutral Bay. That gives us two kinds of work here: commercial fit-outs and servicing for offices and retail, and strata-approved apartment installs.',
      'For apartments, multi-head systems from a single balcony-mounted outdoor unit are the usual answer. For commercial spaces, we handle design, installation and commissioning to suit the tenancy.',
    ],
    neighbours: ['mosman', 'chatswood', 'lane-cove', 'Crows Nest', 'Neutral Bay', 'Kirribilli', 'McMahons Point'],
    updated: UPDATED,
  },
  {
    slug: 'lane-cove',
    name: 'Lane Cove',
    zone: 'north',
    group: 'suburban',
    postcode: '2066',
    tagline: 'Leafy standalone homes and newer apartments around the village.',
    metaDescription:
      'Air conditioning installation, service and repairs in Lane Cove. Ducted retrofits for leafy standalone homes and multi-head systems for apartments near the village. Daikin & Haier certified.',
    intro: [
      'Lane Cove pairs a village centre on Longueville Road with quiet, tree-lined streets of standalone homes running towards the Lane Cove River and national park, plus newer apartment buildings close to the village. Most residential work here is ducted air conditioning retrofitted into existing homes, sized and zoned for family use.',
      'The bushland edge means heavy tree cover on many blocks — good for the street, but something we place outdoor units away from so leaf litter doesn’t choke airflow. Apartment installs near the village follow the usual strata process.',
    ],
    neighbours: ['chatswood', 'willoughby', 'north-sydney', 'Artarmon', 'St Leonards', 'Riverview', 'Longueville'],
    updated: UPDATED,
  },
  {
    slug: 'willoughby',
    name: 'Willoughby',
    zone: 'north',
    group: 'suburban',
    postcode: '2068',
    tagline: 'Established homes on quiet streets, a short hop from Chatswood.',
    metaDescription:
      'Air conditioning installation, servicing and repairs in Willoughby. Ducted and split systems for established federation and bungalow homes, Daikin & Haier certified. Free quotes.',
    intro: [
      'Willoughby is largely established housing — federation homes and Californian bungalows on the streets off Penshurst Street and Willoughby Road — with pockets of units closer to the Chatswood end. It is classic ducted-retrofit territory: family homes with usable roof space, where zoning the system pays for itself in running costs.',
      'Older homes here sometimes need a switchboard or circuit upgrade to support a ducted system safely, which we check during the assessment and itemise up front rather than discovering it mid-install.',
    ],
    neighbours: ['chatswood', 'lane-cove', 'Artarmon', 'Castlecrag', 'Naremburn', 'Northbridge'],
    updated: UPDATED,
  },
  {
    slug: 'hornsby',
    name: 'Hornsby',
    zone: 'north',
    group: 'suburban',
    postcode: '2077',
    tagline: 'Larger blocks, bushland edges and units near the station.',
    metaDescription:
      'Air conditioning installation, service and repairs in Hornsby. Ducted systems for family homes on larger blocks and split systems for units near the station. Daikin & Haier certified.',
    intro: [
      'Hornsby marks the top of the North Shore: Westfield and the station at its centre, apartment buildings close in, and family homes on larger blocks spreading out to the bushland of the Berowra Valley. Summers run warmer here than on the harbour, which pushes sizing and zoning for the larger homes.',
      'Ducted systems dominate the house work; split and multi-head systems cover the units near the station. Bushland-edge properties get outdoor units placed clear of heavy leaf drop.',
    ],
    neighbours: ['turramurra', 'pymble', 'Waitara', 'Asquith', 'Hornsby Heights', 'Wahroonga'],
    updated: UPDATED,
  },
  {
    slug: 'turramurra',
    name: 'Turramurra',
    zone: 'north',
    group: 'suburban',
    postcode: '2074',
    tagline: 'Upper North Shore homes on big, tree-covered blocks.',
    metaDescription:
      'Air conditioning installation and servicing in Turramurra. Zoned ducted systems for larger upper North Shore homes on leafy blocks, Daikin & Haier certified. Free quotes.',
    intro: [
      'Turramurra is upper North Shore in the traditional sense — large blocks, tall trees and substantial older homes along the Pacific Highway and the streets either side of it. The work here is overwhelmingly ducted: bigger houses, often two storeys, where zoning is the difference between a comfortable home and an expensive one to run.',
      'Tree cover is heavier than almost anywhere else on the Shore, so outdoor-unit placement away from leaf litter and regular servicing both matter more here.',
    ],
    neighbours: ['pymble', 'hornsby', 'Wahroonga', 'St Ives', 'North Turramurra'],
    updated: UPDATED,
  },
  {
    slug: 'pymble',
    name: 'Pymble',
    zone: 'north',
    group: 'suburban',
    postcode: '2073',
    tagline: 'Family homes on leafy blocks along the Pacific Highway.',
    metaDescription:
      'Air conditioning installation, service and repairs in Pymble. Ducted retrofits and multi-head systems for established family homes on the upper North Shore. Daikin & Haier certified.',
    intro: [
      'Pymble is established family housing on generous, leafy blocks either side of the Pacific Highway and the station, with some apartments close to the highway. Like its neighbours, the typical job is fitting a zoned ducted system into an existing home, designed around the roof space and insulation the house already has.',
      'Where roof space won’t allow ducting, a multi-head split system with discreet indoor units is the usual alternative. Heavy tree cover means outdoor units go where leaf litter won’t collect.',
    ],
    neighbours: ['turramurra', 'hornsby', 'Gordon', 'St Ives', 'West Pymble', 'Killara'],
    updated: UPDATED,
  },
  {
    slug: 'manly',
    name: 'Manly',
    zone: 'north',
    group: 'beachside',
    postcode: '2095',
    tagline: 'Ocean on one side, harbour on the other — salt air everywhere.',
    metaDescription:
      'Air conditioning installation, service and repairs in Manly. Corrosion-protected beachside installs and strata-ready apartment systems near the Corso, Daikin & Haier certified. Free quotes.',
    intro: [
      'Manly sits between the ocean beach and the harbour, with apartments along the Corso, North Steyne and the ferry end, and houses climbing towards Fairlight and Balgowlah. Very little of Manly is out of the salt-air zone, so corrosion protection and outdoor-unit placement are the starting point for every job.',
      'Apartment installs go through the usual strata process; the houses on the hill are more often ducted or multi-head systems positioned with the prevailing wind in mind.',
    ],
    neighbours: ['dee-why', 'mosman', 'Fairlight', 'Balgowlah', 'Queenscliff'],
    updated: UPDATED,
  },
  {
    slug: 'dee-why',
    name: 'Dee Why',
    zone: 'north',
    group: 'beachside',
    postcode: '2099',
    tagline: 'One of the Northern Beaches’ most apartment-dense suburbs.',
    metaDescription:
      'Air conditioning installation and repairs in Dee Why. Strata-ready, corrosion-protected systems for beachside apartments and Northern Beaches homes. Daikin & Haier certified. Free quotes.',
    intro: [
      'Dee Why’s town centre along Pittwater Road is one of the most apartment-dense parts of the Northern Beaches, with the beach and the lagoon a few streets east and houses spreading back towards Narraweena and Cromer. Strata approval, balcony placement and salt-air corrosion protection come up on most jobs here.',
      'Multi-head systems suit the apartments; the houses further back are typically ducted or single-split installs, with outdoor units sited out of the direct sea breeze.',
    ],
    neighbours: ['manly', 'Brookvale', 'Collaroy', 'Narraweena', 'Cromer', 'Mona Vale'],
    updated: UPDATED,
  },

  // ─── Regional (existing coverage, scheduled visits) ───────────────────────
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
    updated: UPDATED,
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
    updated: UPDATED,
  },
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
    updated: UPDATED,
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
    updated: UPDATED,
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
    updated: UPDATED,
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
