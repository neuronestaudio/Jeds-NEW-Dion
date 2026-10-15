import type { Zone } from './suburbs';

/**
 * Region hub pages: /service-areas/north-shore, /service-areas/northern-beaches,
 * /service-areas/eastern-suburbs.
 *
 * These are the pages for the searches people actually type with a region in
 * them ("air conditioning north shore", "air conditioning eastern suburbs",
 * "air con service northern beaches") — a step above the 116 suburb pages and
 * a step below /service-areas. Each one gathers its zone(s) of suburbs, says
 * what genuinely changes the job in that part of Sydney, and links down to
 * every suburb page it covers.
 *
 * Every claim here is one the suburb pages already make (see suburbGroups.ts):
 * salt-air corrosion, strata approval, heritage frontages, roof space,
 * bush-block leaf load. Nothing about JED is promised here that the rest of
 * the site does not already say.
 */

export interface Hub {
  slug: string;
  /** Short region name, used in headings: "the North Shore". */
  name: string;
  /** The region name without the article, for titles and breadcrumbs. */
  label: string;
  zones: Zone[];
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string[];
  /** What changes the job in this part of Sydney. */
  notes: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
}

export const HUBS: Hub[] = [
  {
    slug: 'north-shore',
    name: 'the North Shore',
    label: 'North Shore',
    zones: ['north', 'upper'],
    title: 'Air Conditioning North Shore Sydney | JED Air Conditioning',
    description:
      'Air conditioning installation, service and repairs across the Lower and Upper North Shore, Mosman to Hornsby. Daikin & Haier certified. 10-year workmanship warranty.',
    h1: 'Air Conditioning on the North Shore',
    tagline: 'Mosman to Hornsby — ducted and split systems designed for the houses the North Shore actually has.',
    intro: [
      'The North Shore is where a one-size install goes wrong. Federation homes on deep Ku-ring-gai blocks have the roof space for a properly zoned ducted system; a Chatswood or St Leonards apartment has a strata committee, a balcony and a noise limit; a split-level house built into the fall at Northbridge or Castle Cove has an outdoor-unit position that has to be worked out before anything is quoted.',
      'JED installs, services and repairs across both the Lower North Shore and the Upper North Shore and Hornsby — fifty-one suburbs with their own page below. We are certified Daikin and Haier dealers and manufacturer-trained service agents, every installation carries a 10-year workmanship warranty, and the price is confirmed before anyone comes out.',
    ],
    notes: [
      {
        title: 'Heritage streets and conservation areas',
        body: 'Much of Mosman, Hunters Hill, Lindfield and Wahroonga sits in heritage conservation areas, where the outdoor unit cannot simply go on the front elevation. We site condensers out of the street view, keep pipe runs off visible brickwork, and advise on the council position before the install is booked rather than after.',
      },
      {
        title: 'Big blocks, real roof space, long duct runs',
        body: 'Upper North Shore homes on 900–1,500 m² blocks usually have the ceiling cavity a ducted system wants — and a floor plan that needs zoning so the bedrooms are not conditioned to cool a lounge nobody is in. Duct-run length and return-air placement decide how even the house feels; we design them from the plan, not from the ceiling hatch on the day.',
      },
      {
        title: 'Apartments from St Leonards to Chatswood',
        body: 'Most strata schemes need body-corporate approval before an outdoor unit touches common property. We supply the unit specifications, noise data and mounting detail committees ask for, so approval is a formality rather than a hold-up partway through the job.',
      },
      {
        title: 'Bushland-interface blocks',
        body: 'St Ives, Hornsby Heights, Castle Cove and the suburbs along the national-park edge fill condenser coils with leaf litter and run through more debris in a year than an inner suburb sees in five. Accessible outdoor-unit positions and an annual service matter more here than almost anywhere else in Sydney.',
      },
    ],
    faqs: [
      {
        q: 'Which North Shore suburbs do you cover?',
        a: 'Every suburb listed on this page — the Lower North Shore from Mosman and Neutral Bay through Chatswood and Lane Cove, and the Upper North Shore and Hornsby from Roseville to Berowra. Each suburb has its own page with the install, service and repair notes that apply there.',
      },
      {
        q: 'How quickly can you get to a North Shore job?',
        a: 'Service and repair bookings are usually onsite within one to two business days. For installations we inspect first, and the quote comes back within 24 hours of the visit.',
      },
      {
        q: 'Can a ducted system go into an older Federation or interwar home?',
        a: 'Usually, yes — these homes tend to have the roof space ducted needs. What changes is the design: zoning, outlet positions that suit high ceilings and the return-air location in a long hallway. Where the roof space is genuinely tight, a multi-head split system is the honest alternative and we will say so.',
      },
      {
        q: 'Do you only install Daikin and Haier?',
        a: 'We are certified dealers for both and recommend them for new installations because we are accountable to the manufacturer for how they are fitted. We service and repair all major brands.',
      },
    ],
  },
  {
    slug: 'northern-beaches',
    name: 'the Northern Beaches',
    label: 'Northern Beaches',
    zones: ['beaches'],
    title: 'Air Conditioning Northern Beaches | JED Air Conditioning',
    description:
      'Air conditioning installation, service and repairs across the Northern Beaches, Manly to Palm Beach. Salt-air specified units, Daikin & Haier certified, 10-year warranty.',
    h1: 'Air Conditioning on the Northern Beaches',
    tagline: 'Manly to Palm Beach — systems specified for salt air, not just for square metres.',
    intro: [
      'Ocean on one side, Middle Harbour and Pittwater on the other: almost every Northern Beaches job has salt in it. An outdoor unit that would last fifteen years in Ryde can corrode noticeably in five on an exposed Dee Why balcony, which is why the equipment, the fixings and the position are specified differently here.',
      'JED installs, services and repairs across thirty-one Northern Beaches suburbs — beachfront apartment blocks at Manly and Dee Why, steep bush blocks at Seaforth and Belrose, and the Pittwater peninsula. Certified Daikin and Haier dealers, manufacturer-trained service agents, 10-year workmanship warranty, price confirmed before we come out.',
    ],
    notes: [
      {
        title: 'Salt-air corrosion',
        body: 'Sea air settles salt on coil fins, fasteners and casings and eats them faster than inland air ever will. For exposed positions we specify units with corrosion-protected coils, use stainless or coated fixings, and site the condenser out of direct spray wherever the property allows.',
      },
      {
        title: 'Beachfront apartment density',
        body: 'Manly, Dee Why, Collaroy and Narrabeen stack apartments along the beach, and most schemes need strata approval before an outdoor unit goes on a balcony or wall. We provide the specifications and noise data committees ask for up front.',
      },
      {
        title: 'Steep bush blocks',
        body: 'Seaforth, Belrose, Bayview and the slopes above Pittwater put the outdoor unit on a steep site with leaf load and difficult access. Bracket choice, a serviceable position and an annual coil clean decide whether the system is still efficient in year eight.',
      },
      {
        title: 'Wind exposure',
        body: 'Headlands and beachfront positions cop stronger, more constant wind. An outdoor unit that rattles in a southerly is nearly always a mounting or placement problem rather than a faulty unit, and it is designed out at the start.',
      },
    ],
    faqs: [
      {
        q: 'Do beachside systems really need a different unit?',
        a: 'Often, yes. Manufacturers make corrosion-protected versions of their outdoor units for coastal positions, and on an exposed site they are worth the difference. On a sheltered block a few streets back a standard unit with coated fixings is usually fine — we tell you which applies after seeing the position.',
      },
      {
        q: 'How often should a Northern Beaches system be serviced?',
        a: 'At least annually, and more often in a very exposed position. Sand and salt load filters and coils faster than inland, and a coil that is not cleaned loses efficiency and shortens the life of the compressor.',
      },
      {
        q: 'Which Northern Beaches suburbs do you cover?',
        a: 'All thirty-one suburbs listed on this page, from Manly and Balgowlah up through Dee Why, Mona Vale and Avalon to Palm Beach, plus Frenchs Forest, Belrose and Terrey Hills inland. Each has its own page.',
      },
      {
        q: 'How quickly can you get to a Northern Beaches job?',
        a: 'Service and repair bookings are usually onsite within one to two business days. Installations are inspected first and quoted within 24 hours of the visit.',
      },
    ],
  },
  {
    slug: 'eastern-suburbs',
    name: 'the Eastern Suburbs',
    label: 'Eastern Suburbs',
    zones: ['east'],
    title: 'Air Conditioning Eastern Suburbs Sydney | JED Air Conditioning',
    description:
      'Air conditioning installation, service and repairs across Sydney’s Eastern Suburbs, Bondi to Vaucluse and Randwick to Double Bay. Daikin & Haier certified, 10-year warranty.',
    h1: 'Air Conditioning in the Eastern Suburbs',
    tagline: 'Bondi to Vaucluse, Paddington to Maroubra — installs that work around salt air, strata rules and heritage frontages.',
    intro: [
      'The Eastern Suburbs bring three constraints into almost every job: salt air along the coast from Bondi to Maroubra, strata rules in the apartment blocks that line it, and heritage controls on the Victorian terraces of Paddington and Woollahra. The harbourside homes of Rose Bay, Vaucluse and Double Bay add a fourth — large floor plans that only feel right when the ducted system is properly zoned.',
      'JED installs, services and repairs across thirty-four Eastern Suburbs, each with its own page below. Certified Daikin and Haier dealers and manufacturer-trained service agents, 10-year workmanship warranty on every installation, and the price confirmed before anyone comes out.',
    ],
    notes: [
      {
        title: 'Terraces and heritage frontages',
        body: 'A Paddington or Woollahra terrace has no front elevation to spare and often no roof space to speak of. Outdoor units go to the rear or a courtyard, pipe runs stay off visible brickwork, and where ducted will not fit, a multi-head split system with slim indoor units is the design that respects the house.',
      },
      {
        title: 'Beachfront apartments and strata',
        body: 'Campbell Parade, Coogee Bay Road and the blocks behind them need body-corporate approval before an outdoor unit touches a balcony, wall or roof. We supply the specifications, noise data and mounting detail committees ask for, so the approval does not stall the job.',
      },
      {
        title: 'Salt air from Bondi to Maroubra',
        body: 'Within a few streets of the beach, standard outdoor units corrode well ahead of their time. We specify corrosion-protected coils and stainless or coated fixings for exposed positions and site the unit out of direct spray.',
      },
      {
        title: 'Harbourside homes and zoning',
        body: 'Rose Bay, Vaucluse, Bellevue Hill and Double Bay homes are large enough that an unzoned ducted system wastes energy conditioning rooms nobody is in. Zoning by living, sleeping and guest areas, with the return air placed for the floor plan, is what makes these houses feel even.',
      },
    ],
    faqs: [
      {
        q: 'Which Eastern Suburbs do you cover?',
        a: 'All thirty-four suburbs listed on this page — the coast from Bondi through Bronte, Coogee and Maroubra, the harbourside from Rose Bay to Vaucluse and Watsons Bay, and Paddington, Woollahra, Randwick and Kensington inland. Each suburb has its own page.',
      },
      {
        q: 'Can you air condition a terrace house?',
        a: 'Yes. The usual answer is a multi-head split system — one outdoor unit in the courtyard or at the rear, slim indoor units in the rooms that need them — because a terrace rarely has the ceiling cavity a ducted system needs. Where the roof space exists we will say so and quote both.',
      },
      {
        q: 'Do I need strata approval for a split system in my apartment?',
        a: 'Almost always, because the outdoor unit touches common property. We provide the paperwork strata committees typically ask for — unit specifications, noise data and mounting details — before the install date is set.',
      },
      {
        q: 'How quickly can you get to an Eastern Suburbs job?',
        a: 'Service and repair bookings are usually onsite within one to two business days. Installations are inspected first and the quote comes back within 24 hours of the visit.',
      },
    ],
  },
];

export const hubBySlug = (slug: string) => HUBS.find((h) => h.slug === slug);

/** The hub a suburb zone rolls up to — breadcrumbs and footer links use it. */
export const hubForZone = (zone: Zone) => HUBS.find((h) => h.zones.includes(zone))!;

export const hubPath = (hub: Hub) => `/service-areas/${hub.slug}`;
