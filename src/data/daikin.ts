/**
 * The Daikin topical cluster: one pillar (/daikin) and nine supporting pages,
 * each written for a genuinely different search intent.
 *
 * Why this exists: the 9–15 September 2026 search-terms report showed Daikin
 * queries taking 40% of paid search spend and 60% of conversions, while the
 * warranty/service queries ("daikin service centre", "daikin aircon repairs",
 * "daikin service near me") clicked and never converted — nothing on the site
 * said that JED is the agent Daikin itself dispatches for warranty work. Each
 * page below answers one of those observed query groups.
 *
 * Every claim is one the business already makes elsewhere on the site or one
 * agreed on the 13 September client call (10-year workmanship warranty, the
 * waived $200 service call, split systems from $1,500 supplied and installed).
 * Prices are indicative ranges, never quotes.
 */

export type DaikinBlock =
  | { type: 'prose'; heading: string; paragraphs: string[] }
  | { type: 'features'; heading: string; intro?: string; items: { title: string; body: string }[] }
  | { type: 'steps'; heading: string; intro?: string; steps: { title: string; body: string }[] }
  | {
      type: 'table';
      heading: string;
      intro?: string;
      columns: string[];
      rows: string[][];
      note?: string;
    }
  | { type: 'compare'; heading: string; intro?: string; columns: [string, string]; rows: { label: string; a: string; b: string }[] }
  | { type: 'checklist'; heading: string; intro?: string; items: string[] }
  | { type: 'callout'; heading: string; body: string; cta?: { label: string; href: string } }
  /** Rendered by the layout from the live suburb data — the local-intent page only. */
  | { type: 'zones'; heading: string; intro?: string };

export interface DaikinPage {
  /** '' for the pillar, which lives at /daikin itself. */
  slug: string;
  navLabel: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  /** Rendered in the gradient accent after h1. */
  h1Accent: string;
  tagline: string;
  intro: string[];
  serviceType: string;
  blocks: DaikinBlock[];
  faqs: { q: string; a: string }[];
  /** Sibling slugs to surface as "next reads" — the two or three closest intents. */
  related: string[];
  quoteHeading: string;
  quoteSub: string;
  /** ISO date; drives the XML sitemap's lastmod. */
  updated: string;
}

export const DAIKIN_BASE = '/daikin';
export const daikinPath = (slug: string) => (slug ? `${DAIKIN_BASE}/${slug}` : DAIKIN_BASE);

const UPDATED = '2026-09-16';

export const DAIKIN_PAGES: DaikinPage[] = [
  // ─── Pillar ──────────────────────────────────────────────────────────────
  {
    slug: '',
    navLabel: 'Daikin overview',
    title: 'Daikin Air Conditioning Sydney | Certified Dealer & Warranty Service Agent | JED',
    description:
      'Daikin air conditioning in Sydney from a certified Daikin dealer and Daikin-appointed warranty service agent. Split, ducted and multi-head — supply, install, service, repairs and warranty work, direct.',
    eyebrow: 'Daikin specialists',
    h1: 'Daikin Air Conditioning',
    h1Accent: 'Sydney',
    tagline: 'Sold, installed, serviced and warranty-repaired by the people Daikin sends.',
    intro: [
      'JED Air Conditioning is a certified Daikin dealer and a Daikin-appointed warranty service agent for Sydney. That combination matters: most installers can sell you a Daikin, but when a Daikin needs warranty work in our area, we are the agent Daikin dispatches to do it. Coming to us directly skips the queue.',
      'This guide covers the whole Daikin lifecycle — choosing between split, multi-head and ducted, what installation actually involves and costs, how servicing keeps the manufacturer warranty valid, and what to do when a Daikin stops working. Each section links to a deeper page.',
    ],
    serviceType: 'Daikin Air Conditioning Sales, Installation, Service and Warranty Repairs',
    blocks: [
      {
        type: 'features',
        heading: 'Why Daikin, and why through JED',
        intro:
          'Daikin is the brand Sydney searches for by name more than any other, and it is the brand our own technicians are manufacturer-trained on. Three things set the JED relationship apart.',
        items: [
          {
            title: 'Certified Daikin dealer',
            body: 'We supply the full residential range — Cora, Alira X and Zena wall splits, multi-head systems and Daikin Premium Inverter ducted — and design the installation around your home rather than fitting the unit that happens to be on the truck.',
          },
          {
            title: 'Daikin-appointed warranty agent',
            body: 'Warranty repairs in our service area are dispatched to JED by Daikin. If you have a Daikin under warranty and a fault, you can book us directly instead of waiting in the manufacturer queue for the same technician to be sent.',
          },
          {
            title: '10-year workmanship warranty',
            body: 'Daikin covers the equipment. We cover the installation — every JED install carries a 10-year workmanship warranty on top of the manufacturer’s own, so there is no gap between the two.',
          },
        ],
      },
      {
        type: 'compare',
        heading: 'Split, multi-head or ducted?',
        intro: 'The right Daikin system is decided by the home, not the brochure. This is the short version — each has its own page.',
        columns: ['Daikin split & multi-head', 'Daikin ducted'],
        rows: [
          { label: 'Best for', a: 'One to four rooms, apartments, extensions, retrofits with no roof access', b: 'Whole-home comfort, new builds, homes with usable roof space' },
          { label: 'Typical Sydney install', a: 'Half a day per unit; multi-head one to two days', b: 'One to two days including zoning and commissioning' },
          { label: 'Indicative cost', a: 'From $1,500 supplied and installed per split', b: 'From roughly $9,000 for a single-storey home' },
          { label: 'Running cost', a: 'Lowest — you only cool the room you are in', b: 'Efficient when zoned properly; wasteful when run as one open zone' },
          { label: 'Visual impact', a: 'A wall unit per room, outdoor unit(s) outside', b: 'Ceiling grilles only; one outdoor unit' },
        ],
      },
      {
        type: 'steps',
        heading: 'The Daikin lifecycle, and where each page fits',
        steps: [
          { title: 'Choosing', body: 'Split vs ducted, capacity, which Daikin series suits the room — see Daikin split systems and Daikin ducted.' },
          { title: 'Buying', body: 'What “certified dealer” means, why it affects your warranty, and current supply-and-install offers — see Daikin sales.' },
          { title: 'Installing', body: 'Site assessment, placement, pipe runs, electrical and commissioning — see Daikin installation and the cost guide.' },
          { title: 'Maintaining', body: 'What a Daikin service actually includes and how often it keeps the warranty valid — see Daikin service.' },
          { title: 'Fixing', body: 'Fault diagnosis, common Daikin symptoms, and repair-vs-replace — see Daikin repairs.' },
          { title: 'Claiming', body: 'How Daikin warranty work is dispatched and why booking JED directly is faster — see Daikin warranty.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Have a Daikin fault right now?',
        body: 'Book the warranty agent directly. Tell us the model and the symptom — or the code on the controller — and we will confirm whether it is a warranty repair before anyone comes out.',
        cta: { label: 'Book a Daikin repair', href: '/daikin/repairs' },
      },
    ],
    faqs: [
      {
        q: 'Is JED an authorised Daikin dealer?',
        a: 'Yes. JED Air Conditioning is a certified Daikin dealer for Sydney, and our technicians are manufacturer-trained. We are also a Daikin-appointed warranty service agent, which is a separate appointment from dealership and is what lets us carry out Daikin warranty repairs directly.',
      },
      {
        q: 'What is the difference between a Daikin Specialist Dealer and a Daikin warranty agent?',
        a: 'A Specialist Dealer is authorised to sell and install Daikin equipment. A warranty service agent is the business Daikin dispatches to repair its products under warranty. JED is both, so the same team that installs your system is the team Daikin would send if it ever needed warranty work.',
      },
      {
        q: 'Which Daikin systems do you install?',
        a: 'The full residential range: Cora, Alira X and Zena wall-mounted split systems, multi-head split systems running several indoor units from one outdoor unit, and Daikin ducted systems including the slim-line units for tight roof spaces. We also supply Daikin for light-commercial fit-outs.',
      },
      {
        q: 'How long does a Daikin warranty last in Australia?',
        a: 'Daikin backs its residential systems with a manufacturer warranty on parts and labour — currently five years on most split and ducted ranges when installed by an authorised dealer and serviced as recommended. JED adds a separate 10-year workmanship warranty on the installation itself.',
      },
      {
        q: 'Do you service Daikin systems you did not install?',
        a: 'Yes. We service and repair Daikin systems regardless of who installed them, including warranty repairs on units bought elsewhere — Daikin dispatches warranty work by area, not by the original installer.',
      },
    ],
    related: ['installation', 'service', 'warranty'],
    quoteHeading: 'Talk to Sydney’s Daikin specialists',
    quoteSub: 'Installation, service or a fault — two quick taps, then your details, and we come back within 24 hours.',
    updated: UPDATED,
  },

  // ─── Installation ────────────────────────────────────────────────────────
  {
    slug: 'installation',
    navLabel: 'Installation',
    title: 'Daikin Air Conditioning Installation Sydney | Certified Installers | JED',
    description:
      'Daikin installation in Sydney by a certified Daikin dealer. Split systems from $1,500 supplied and installed, multi-head and ducted — sized on site, installed to Daikin’s specification, 10-year workmanship warranty.',
    eyebrow: 'Daikin installation',
    h1: 'Daikin Installation',
    h1Accent: 'done to Daikin’s specification',
    tagline: 'Sized on site, installed by manufacturer-trained technicians, backed by a 10-year workmanship warranty.',
    intro: [
      'A Daikin performs the way the brochure promises only when the install matches the engineering: correct capacity for the room, the outdoor unit positioned for airflow and service access, refrigerant lines sized and charged properly, and commissioning done rather than skipped. JED installs Daikin systems to the manufacturer’s specification because our technicians are trained on them — it is also the standard Daikin holds us to as one of its warranty agents.',
      'This page covers what a Daikin installation involves in a Sydney home, what changes the price, and how the 10-year workmanship warranty sits alongside Daikin’s own.',
    ],
    serviceType: 'Daikin Air Conditioning Installation',
    blocks: [
      {
        type: 'steps',
        heading: 'How a Daikin install runs with JED',
        intro: 'The same five steps whether it is one wall split or a fully zoned ducted system — the difference is how long each takes.',
        steps: [
          { title: 'Free on-site assessment', body: 'Room dimensions, orientation, glazing and insulation decide the kilowatt rating. Under-sizing means a unit that never catches up on a 38° day; over-sizing means short-cycling, humidity and wasted money. We measure rather than guess.' },
          { title: 'System recommendation', body: 'Which Daikin series suits the job — Cora for value, Alira X for quiet and efficiency, Zena where the unit will be seen, multi-head where several rooms share one outdoor position, ducted for whole-home. You get a written quote with the model numbers on it.' },
          { title: 'Installation day', body: 'Indoor unit mounted level and sealed, outdoor unit on a pad or engineered bracket clear of bedrooms and neighbours, copper lines insulated and pressure-tested, condensate drained to a proper point, dedicated electrical circuit where required.' },
          { title: 'Commissioning', body: 'Vacuum and refrigerant charge to Daikin’s figures, airflow checked, controller and Wi-Fi set up, and a walkthrough so you know how to run it efficiently.' },
          { title: 'Warranty registration', body: 'We hand over the documentation Daikin needs for its manufacturer warranty and register the 10-year JED workmanship warranty against your address.' },
        ],
      },
      {
        type: 'features',
        heading: 'What changes a Daikin installation quote',
        intro: 'The unit is only part of the price. These are the site factors that move a Sydney quote up or down — and the reason we quote after visiting, not over the phone.',
        items: [
          { title: 'Back-to-back or long run', body: 'A back-to-back install (indoor and outdoor units on either side of the same wall) is the baseline. Every extra metre of refrigerant pipe, and every run through a roof or wall cavity, adds labour and materials.' },
          { title: 'Outdoor unit position', body: 'Ground pad is simplest. Wall brackets, balcony mounts, roof positions and anything needing a crane or scaffold are priced separately — common on North Shore slopes and Eastern Suburbs apartments.' },
          { title: 'Electrical work', body: 'Larger splits and every ducted system need a dedicated circuit. If your switchboard is older or full, we itemise the electrical upgrade rather than discovering it on the day.' },
          { title: 'Strata and heritage constraints', body: 'Apartment installs usually need body-corporate approval for the outdoor unit; heritage streets often restrict what is visible from the front. We supply the specifications and place the unit to suit.' },
          { title: 'Removing an old system', body: 'Decommissioning, refrigerant recovery and disposal of an existing unit is included in the quote when you tell us it is there.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Daikin split systems from $1,500 supplied and installed',
        body: 'The current offer for a standard back-to-back Daikin wall split. Multi-head and ducted are quoted on the site assessment. Every install includes the 10-year JED workmanship warranty.',
        cta: { label: 'See the Daikin cost guide', href: '/daikin/cost-guide' },
      },
    ],
    faqs: [
      {
        q: 'How long does a Daikin installation take?',
        a: 'A standard back-to-back wall split is usually done in half a day. A multi-head system with two or three indoor units takes a day, sometimes two. A ducted system with zoning takes one to two days depending on roof access and the number of outlets.',
      },
      {
        q: 'Does installation affect the Daikin warranty?',
        a: 'Yes. Daikin’s manufacturer warranty depends on the system being installed by an authorised installer to its specification. Installing through a certified Daikin dealer like JED protects the warranty from day one, and as a Daikin warranty agent we are the ones who would service it under warranty later.',
      },
      {
        q: 'Do I need council or strata approval to install a Daikin?',
        a: 'Houses generally do not for a standard split, though heritage conservation areas can restrict units visible from the street. Apartments almost always need body-corporate approval for the outdoor unit and for any penetration through common property — we provide the specifications strata committees ask for.',
      },
      {
        q: 'Can you install a Daikin where another brand used to be?',
        a: 'Yes. We remove and decommission the old system, recover the refrigerant, and reuse the existing position and pipe route where it meets Daikin’s specification — which it often does not, in which case we tell you before quoting.',
      },
      {
        q: 'What size Daikin do I need?',
        a: 'Capacity depends on floor area, ceiling height, orientation, glazing and insulation, not floor area alone. As a rough guide a bedroom is 2.5 kW, a living room 5–7 kW, and an open-plan kitchen-living area 7–9 kW — but we size on site because two rooms of the same size can need different units.',
      },
    ],
    related: ['split-systems', 'ducted-air-conditioning', 'cost-guide'],
    quoteHeading: 'Get a Daikin installation quote',
    quoteSub: 'Free on-site assessment across Sydney. Tell us the rooms and we’ll size and quote the right Daikin.',
    updated: UPDATED,
  },

  // ─── Service ─────────────────────────────────────────────────────────────
  {
    slug: 'service',
    navLabel: 'Service',
    title: 'Daikin Air Conditioning Service Sydney | Authorised Service Agent | JED',
    description:
      'Daikin servicing in Sydney by an authorised Daikin service agent. Annual maintenance that keeps efficiency up and the manufacturer warranty valid — filters, coils, refrigerant, drains and controls. Book direct.',
    eyebrow: 'Daikin service',
    h1: 'Daikin Air Conditioning',
    h1Accent: 'Service in Sydney',
    tagline: 'Maintenance by an authorised Daikin service agent — the service that keeps the warranty valid.',
    intro: [
      'A Daikin service is not a filter rinse. Done properly it is the annual check Daikin’s own warranty terms expect: coils cleaned, refrigerant pressures verified against the model’s figures, condensate drain cleared and tested, electrical connections checked, and the system run through every mode. JED is an authorised Daikin service agent, so this is the standard Daikin trains us to and the record it recognises if a warranty question ever comes up.',
      'This page is for routine and preventive servicing. If your Daikin has a fault, the repairs page is the right place; if it is under warranty, the warranty page explains how that is handled.',
    ],
    serviceType: 'Daikin Air Conditioning Servicing and Maintenance',
    blocks: [
      {
        type: 'checklist',
        heading: 'What a JED Daikin service includes',
        intro: 'The same checklist on every visit, every model, whether it is a Cora in a studio or a zoned ducted system in a six-bedroom house.',
        items: [
          'Indoor filters removed, cleaned or replaced, and the fan barrel and evaporator coil cleaned',
          'Outdoor condenser coil cleaned and checked for fin damage, leaf litter and salt-air corrosion',
          'Refrigerant pressures and temperatures verified against Daikin’s figures for the model — a leak shows up here before it becomes a failed compressor',
          'Condensate drain flushed and tested, condensate pump checked where fitted',
          'Electrical terminals, contactors and capacitor checked and tightened',
          'Every mode run — cool, heat, dry, fan — and the controller, timer and Wi-Fi app checked',
          'Ducted systems: zone motors, dampers and return-air filter checked, airflow balanced across outlets',
          'A written service record you can keep with the warranty paperwork',
        ],
      },
      {
        type: 'table',
        heading: 'How often should a Daikin be serviced?',
        intro: 'Daikin recommends regular maintenance to keep the warranty valid; how regular depends on where the unit lives.',
        columns: ['Situation', 'Recommended interval', 'Why'],
        rows: [
          ['Typical Sydney home, inland suburb', 'Every 12 months', 'Keeps efficiency and the manufacturer warranty record current'],
          ['Beachside or harbourside — Manly, Bondi, Mosman, the Northern Beaches', 'Every 6–12 months', 'Salt air corrodes outdoor coils and fasteners; a rinse and inspection twice a year is cheap insurance'],
          ['Ducted system run daily', 'Every 12 months, filters every 3', 'Return-air filters load quickly and choke airflow across the whole house'],
          ['Holiday home or rarely used unit', 'Every 12 months regardless', 'Seals dry out and drains block when a system sits idle'],
          ['Commercial or strata common areas', 'Quarterly', 'Higher duty cycle and usually a maintenance obligation in the lease or by-laws'],
        ],
      },
      {
        type: 'features',
        heading: 'What a service catches before it costs you',
        items: [
          { title: 'Slow refrigerant leaks', body: 'A system that still cools but takes longer than last summer is often low on charge. Caught at service it is a repair; missed, it is a compressor.' },
          { title: 'Blocked condensate drains', body: 'The cause of most “my air conditioner is leaking water” calls. Cleared in ten minutes at service; a ceiling stain if left.' },
          { title: 'Dirty coils', body: 'A coated evaporator or condenser coil makes the unit work harder for less output — you pay for it every month on the bill and eventually in component life.' },
          { title: 'Corrosion on coastal units', body: 'We check the outdoor coil fins and fixings on every beachside service and tell you when a coated-coil replacement is becoming the smarter option.' },
        ],
      },
      {
        type: 'callout',
        heading: 'No $200 call-out fee on Daikin service bookings',
        body: 'The service call fee is currently waived when you book a Daikin service with JED. Book online or call — we confirm the time, the technician and what is included before we arrive.',
        cta: { label: 'Book a Daikin service', href: '#quote' },
      },
    ],
    faqs: [
      {
        q: 'How much does a Daikin service cost in Sydney?',
        a: 'A standard annual service on a wall split is a fixed-price visit; ducted and multi-head systems are priced by the number of indoor units and zones. The $200 service call fee is currently waived on Daikin service bookings. We confirm the price when you book, before anyone comes out.',
      },
      {
        q: 'Does a Daikin need to be serviced to keep the warranty?',
        a: 'Daikin’s warranty terms expect the system to be maintained as recommended, and a documented service history from an authorised agent is what supports a claim if a component fails. Servicing through JED gives you that record.',
      },
      {
        q: 'Can I clean my Daikin filters myself between services?',
        a: 'Yes, and you should — wall-split filters slide out and rinse under a tap, monthly in summer. That is a filter clean, not a service: coils, refrigerant, drains and electrics still need a technician annually.',
      },
      {
        q: 'How long does a Daikin service take?',
        a: 'About 45 minutes to an hour for a wall split, and two to three hours for a ducted system depending on the number of outlets and roof access.',
      },
      {
        q: 'Will you service a Daikin someone else installed?',
        a: 'Yes. Most of the Daikin systems we service were installed by other companies. We are an authorised Daikin service agent for the area, not only for our own installs.',
      },
    ],
    related: ['repairs', 'warranty', 'service-areas'],
    quoteHeading: 'Book a Daikin service',
    quoteSub: 'Choose “Maintenance / Service”, tell us the suburb, and we’ll confirm a time within 24 hours.',
    updated: UPDATED,
  },

  // ─── Repairs ─────────────────────────────────────────────────────────────
  {
    slug: 'repairs',
    navLabel: 'Repairs',
    title: 'Daikin Air Conditioner Repairs Sydney | Authorised Daikin Repair Agent | JED',
    description:
      'Daikin air conditioner repairs across Sydney by an authorised Daikin service and warranty agent. Not cooling, leaking, error code on the controller, won’t turn on — diagnosed and repaired with genuine Daikin parts.',
    eyebrow: 'Daikin repairs',
    h1: 'Daikin Air Conditioner',
    h1Accent: 'Repairs in Sydney',
    tagline: 'Diagnosed by the agent Daikin trains, repaired with genuine parts — under warranty or out of it.',
    intro: [
      'When a Daikin stops cooling, starts leaking or throws a code on the controller, you want the technician who works on Daikins every week, not a generalist reading the manual on your driveway. JED is an authorised Daikin service and warranty agent for Sydney: our technicians are manufacturer-trained, we carry the common Daikin parts, and if the fault turns out to be a warranty matter we can handle it as one — because we are who Daikin would send anyway.',
      'This page covers the faults we see most on Daikin systems in Sydney, what they usually mean, and how a repair visit runs. If the unit is under manufacturer warranty, the warranty page explains the faster route.',
    ],
    serviceType: 'Daikin Air Conditioning Repairs and Fault Diagnosis',
    blocks: [
      {
        type: 'table',
        heading: 'Common Daikin faults and what they usually mean',
        intro: 'Symptoms first, because that is how you will describe it when you call. The cause is confirmed on site — the same symptom can have three different causes.',
        columns: ['What you notice', 'Likely causes', 'Typical fix'],
        rows: [
          ['Running but not cooling (or heating)', 'Low refrigerant from a slow leak, dirty coils, failed capacitor or reversing valve', 'Leak test and re-gas, coil clean, component replacement'],
          ['Water dripping from the indoor unit', 'Blocked condensate drain, failed condensate pump, unit out of level, iced coil thawing', 'Drain clear and test, pump replacement, re-level'],
          ['Error code on the controller', 'Sensor fault, communication error between indoor and outdoor unit, outdoor fan or compressor protection', 'Code read and diagnosed against Daikin’s fault table; part replaced'],
          ['Won’t turn on or trips the breaker', 'Power supply, blown fuse, failed PCB, compressor drawing excess current', 'Electrical test, board or component replacement'],
          ['Loud outdoor unit, rattling or grinding', 'Fan bearing, debris in the fan, loose panel, compressor mount', 'Fan motor or bearing replacement, secure and isolate'],
          ['Bad smell when it starts', 'Mould on the evaporator coil or in the drain pan, stagnant condensate', 'Coil and pan clean, drain flush, anti-microbial treatment'],
          ['Short-cycling — on and off every few minutes', 'Oversized unit, dirty filters, low refrigerant, faulty thermistor', 'Depends on the cause; sometimes the unit was never the right size'],
        ],
      },
      {
        type: 'steps',
        heading: 'How a Daikin repair visit runs',
        steps: [
          { title: 'Tell us the symptom and the model', body: 'The model number is on a sticker on the indoor unit’s side or underneath; the controller code, if there is one, tells us a lot before we arrive. We check warranty status from the serial number.' },
          { title: 'Diagnosis on site', body: 'Pressures, temperatures, electrical readings and Daikin’s own fault diagnostics. We find the cause, not just the symptom — a re-gas without a leak repair is a repeat visit in six months.' },
          { title: 'Fixed price before we start', body: 'You get the repair cost, whether it is covered by warranty, and — if the system is old or the repair is major — an honest repair-versus-replace comparison.' },
          { title: 'Repair with genuine parts', body: 'Common Daikin parts are on the van; anything else is ordered from Daikin Australia, not a generic substitute, so the fix lasts and the warranty stays intact.' },
          { title: 'Test and hand over', body: 'The system is run through every mode and the readings checked again before we leave, and you get a written record of what was found and done.' },
        ],
      },
      {
        type: 'compare',
        heading: 'Repair or replace?',
        intro: 'The honest answer depends on age, the fault and the refrigerant. This is how we frame it on site.',
        columns: ['Usually worth repairing', 'Usually worth replacing'],
        rows: [
          { label: 'Age', a: 'Under 10 years', b: 'Over 12–15 years, especially older R22 systems' },
          { label: 'The fault', a: 'Capacitor, fan motor, sensor, PCB, drain, minor leak', b: 'Compressor failure or a major coil leak on an aged unit' },
          { label: 'Repair cost', a: 'Under about a third of a new system installed', b: 'Approaching half the cost of a new Daikin' },
          { label: 'Running cost', a: 'System still reasonably efficient', b: 'Bills noticeably higher than a current inverter Daikin would run' },
          { label: 'Warranty', a: 'Under Daikin warranty — repair is the obvious call', b: 'Out of warranty with a history of repeat faults' },
        ],
      },
      {
        type: 'callout',
        heading: 'No $200 call-out fee on Daikin repairs',
        body: 'The service call fee is currently waived on Daikin repair bookings with JED. Tell us the symptom, the suburb and the model if you have it, and we’ll come back within 24 hours with a time.',
        cta: { label: 'Book a repair', href: '#quote' },
      },
    ],
    faqs: [
      {
        q: 'My Daikin is showing an error code — what do I do?',
        a: 'Note the code, switch the unit off at the controller and, if it keeps recurring, at the isolator, then call us with the code and the model number. Daikin codes point to a specific subsystem — sensors, communication, outdoor protection — which lets us arrive with the right part rather than diagnosing from scratch.',
      },
      {
        q: 'Is my Daikin repair covered by warranty?',
        a: 'If the system is within Daikin’s manufacturer warranty period and the fault is a component failure rather than damage or neglect, usually yes. We check the serial number when you book and tell you before the visit. As a Daikin warranty agent we carry out the repair directly — see the Daikin warranty page for how that works.',
      },
      {
        q: 'Do you use genuine Daikin parts?',
        a: 'Yes. Common parts are stocked on the van and anything else is ordered from Daikin Australia. Generic substitutes can void the manufacturer warranty and rarely last as long.',
      },
      {
        q: 'How quickly can you repair a Daikin in Sydney?',
        a: 'We respond within 24 hours across our service area, and faults marked urgent are prioritised. Most common repairs are completed on the first visit; where a part has to be ordered we tell you the lead time up front.',
      },
      {
        q: 'Why does my Daikin need re-gassing?',
        a: 'It should not — a sealed system does not use up refrigerant. Low gas means a leak. We find and fix the leak before recharging, because a re-gas alone means the same call in a few months.',
      },
    ],
    related: ['warranty', 'service', 'installation'],
    quoteHeading: 'Book a Daikin repair',
    quoteSub: 'Choose “Repair / Breakdown”, tell us what it is doing, and we’ll confirm a time within 24 hours.',
    updated: UPDATED,
  },

  // ─── Warranty ────────────────────────────────────────────────────────────
  {
    slug: 'warranty',
    navLabel: 'Warranty',
    title: 'Daikin Warranty Service Sydney | Daikin-Appointed Warranty Agent | JED',
    description:
      'Daikin warranty repairs in Sydney, direct from the Daikin-appointed warranty service agent. Skip the manufacturer queue — JED is the technician Daikin sends. How Daikin warranty works, what it covers and how to claim.',
    eyebrow: 'Daikin warranty',
    h1: 'Daikin Warranty Service',
    h1Accent: 'without the queue',
    tagline: 'When Daikin needs a warranty repair done in Sydney, JED is who they send. You can book us directly.',
    intro: [
      'Here is the part most people do not know. When you log a warranty fault with Daikin, Daikin does not have its own vans — it dispatches the job to an appointed warranty service agent in your area. In our service area, that agent is JED Air Conditioning. Going through the manufacturer’s queue can add weeks to the same visit; booking us directly gets the same authorised technician, the same genuine parts and the same warranty coverage, sooner.',
      'This page explains what the Daikin manufacturer warranty covers, how a warranty repair is handled, and how JED’s own 10-year workmanship warranty fits alongside it.',
    ],
    serviceType: 'Daikin Manufacturer Warranty Repairs',
    blocks: [
      {
        type: 'steps',
        heading: 'How a Daikin warranty repair is handled',
        intro: 'Two routes to the same technician. One is shorter.',
        steps: [
          { title: 'You notice a fault', body: 'Not cooling, a controller code, a noise, a leak. Note the model and serial number from the sticker on the indoor unit.' },
          { title: 'Book JED directly', body: 'Call or use the form and tell us it is a Daikin under warranty. We confirm the warranty status from the serial number and book the visit — no manufacturer call centre, no waiting for a job to be allocated.' },
          { title: 'Authorised diagnosis', body: 'A manufacturer-trained technician confirms the fault and whether it is covered. Component failures under the warranty period are; damage, neglect and installation by an unauthorised installer are the usual exclusions.' },
          { title: 'Repair with genuine parts', body: 'Covered repairs are completed under Daikin’s warranty with genuine parts. If a part must be ordered, we tell you the lead time — and we chase it, because we deal with Daikin Australia every week.' },
          { title: 'The record stays with Daikin', body: 'The repair is logged as an authorised warranty repair, so your warranty history is complete and the unit’s coverage continues as normal.' },
        ],
      },
      {
        type: 'compare',
        heading: 'Two warranties, no gap between them',
        intro: 'A Daikin installed by JED is covered twice — by the manufacturer for the equipment and by us for the installation.',
        columns: ['Daikin manufacturer warranty', 'JED 10-year workmanship warranty'],
        rows: [
          { label: 'Covers', a: 'The equipment — compressor, coils, fans, boards, sensors', b: 'The installation — pipework, brackets, drains, electrical connections, sealing, commissioning' },
          { label: 'Term', a: 'Currently five years parts and labour on most residential split and ducted ranges', b: 'Ten years from the date of installation' },
          { label: 'Conditions', a: 'Installed by an authorised installer, maintained as recommended', b: 'Installed by JED; serviced at reasonable intervals' },
          { label: 'Who does the work', a: 'A Daikin-appointed warranty agent — in our area, JED', b: 'JED' },
          { label: 'How to claim', a: 'Book JED directly, or via Daikin who dispatch to us', b: 'Call us' },
        ],
      },
      {
        type: 'checklist',
        heading: 'What Daikin warranty generally covers — and does not',
        intro: 'The specifics are in Daikin Australia’s warranty terms for your model; this is the pattern we see on real claims.',
        items: [
          'Covered: component failures in normal use — compressor, PCB, fan motor, sensors, reversing valve, factory refrigerant leaks',
          'Covered: labour to diagnose and replace a covered component, when done by an appointed agent',
          'Usually not covered: damage from storms, power surges, pests, corrosion in unprotected coastal positions, or physical impact',
          'Usually not covered: faults caused by a non-authorised installation, incorrect sizing, or the system not being maintained',
          'Not covered: consumables and cleaning — filters, coil cleans, drain blockages from lack of servicing',
          'Not covered by Daikin, covered by JED: anything that is the installation’s fault rather than the equipment’s',
        ],
      },
      {
        type: 'callout',
        heading: 'Bought your Daikin somewhere else? Still call us.',
        body: 'Daikin dispatches warranty work by area, not by the original installer. If your Daikin is under warranty and in our service area, JED is the agent who would be sent — you do not need to go back to whoever installed it.',
        cta: { label: 'Check your suburb', href: '/daikin/service-areas' },
      },
    ],
    faqs: [
      {
        q: 'Do I have to go through Daikin to make a warranty claim?',
        a: 'No. You can book the appointed warranty agent directly. In our Sydney service area that is JED — we verify warranty status from the serial number and carry out the repair as an authorised Daikin warranty repair. Going through Daikin’s call centre ends at the same technician, after the job is allocated.',
      },
      {
        q: 'How long is the Daikin warranty on a split system in Australia?',
        a: 'Daikin currently provides a five-year parts and labour warranty on most residential split and ducted systems when installed by an authorised installer and maintained as recommended. Check the terms for your specific model; commercial and light-commercial ranges can differ.',
      },
      {
        q: 'Does the Daikin warranty cover labour?',
        a: 'Yes — Daikin’s residential warranty covers both parts and the labour to fit them, provided the work is done by an appointed warranty agent. That is why you cannot use any technician and claim the labour back.',
      },
      {
        q: 'What voids a Daikin warranty?',
        a: 'The common ones are installation by someone who is not an authorised installer, an install that does not meet Daikin’s specification, no service history, non-genuine parts, and damage from external causes such as storms, surges or corrosion. Installing and servicing through a certified dealer and agent avoids all of the first four.',
      },
      {
        q: 'Is the JED 10-year workmanship warranty the same as the Daikin warranty?',
        a: 'No, and that is the point. Daikin warrants the equipment; JED warrants the installation for ten years. Between the two there is no gap where a fault is nobody’s responsibility.',
      },
    ],
    related: ['repairs', 'service', 'sales'],
    quoteHeading: 'Book a Daikin warranty repair',
    quoteSub: 'Tell us it’s a Daikin under warranty and the symptom. We’ll verify coverage from the serial number and confirm a time.',
    updated: UPDATED,
  },

  // ─── Split systems ───────────────────────────────────────────────────────
  {
    slug: 'split-systems',
    navLabel: 'Split systems',
    title: 'Daikin Split System Air Conditioners Sydney | Cora, Alira X, Zena & Multi-Head | JED',
    description:
      'Daikin split systems in Sydney — Cora, Alira X and Zena wall splits and multi-head systems, explained and compared. Which Daikin split suits which room, what size, and what it costs installed. Certified Daikin dealer.',
    eyebrow: 'Daikin split systems',
    h1: 'Daikin Split Systems',
    h1Accent: 'compared',
    tagline: 'Cora, Alira X, Zena and multi-head — which Daikin split suits which room, and what size.',
    intro: [
      'Daikin’s wall-mounted split systems are the most-searched air conditioners in Sydney for a reason: quiet, efficient inverter compressors, R32 refrigerant, and a range that runs from a value unit for a bedroom to a whisper-quiet design unit for a living room. The differences between the series are real but not obvious from a brochure, and the right choice depends on the room as much as the budget.',
      'This page compares the current Daikin split ranges, explains multi-head systems, and covers sizing — the decision that matters more than the model.',
    ],
    serviceType: 'Daikin Split System Air Conditioning Supply and Installation',
    blocks: [
      {
        type: 'table',
        heading: 'The Daikin split system range',
        intro: 'The residential wall-split series we install most, and where each earns its place.',
        columns: ['Series', 'Best for', 'What sets it apart'],
        rows: [
          ['Daikin Cora', 'Bedrooms, studies, apartments, value installs', 'Daikin’s core inverter split — quiet, reliable, R32, Wi-Fi ready. The sensible default when the room does not need a premium unit.'],
          ['Daikin Alira X', 'Living rooms, master bedrooms, anyone who runs it every day', 'Higher efficiency and lower noise than Cora, enhanced air purification filter, better humidity control. The upgrade you notice on the bill and at night.'],
          ['Daikin Zena', 'Rooms where the unit will be seen — living areas, renovations', 'A slimline designer unit in white or matte finish, with the same Daikin engineering behind it. Chosen for the look without giving up performance.'],
          ['Daikin multi-head', 'Two to five rooms with one outdoor position', 'Several indoor units — any mix of the above — from one outdoor unit. Ideal for apartments and terraces where there is room for one condenser, not three.'],
        ],
      },
      {
        type: 'table',
        heading: 'Sizing a Daikin split — the rough guide',
        intro: 'Indicative only. Orientation, glazing, ceiling height and insulation move these by a size in either direction, which is why we measure on site.',
        columns: ['Room', 'Typical floor area', 'Indicative Daikin capacity'],
        rows: [
          ['Bedroom, study', '10–20 m²', '2.0–2.5 kW'],
          ['Large bedroom, small living', '20–30 m²', '3.5 kW'],
          ['Living room', '30–45 m²', '5.0–6.0 kW'],
          ['Open-plan kitchen and living', '45–60 m²', '7.1–8.0 kW'],
          ['Large open-plan, high ceilings, west-facing glass', '60 m² and up', '9.4 kW, or consider ducted'],
        ],
        note: 'A north- or west-facing room with floor-to-ceiling glass can need the next size up. An oversized unit is not “safer” — it short-cycles, controls humidity poorly and costs more to run.',
      },
      {
        type: 'features',
        heading: 'Why Sydney homes choose Daikin splits',
        items: [
          { title: 'Inverter efficiency', body: 'The compressor modulates rather than switching on and off, holding temperature with a fraction of the energy of a fixed-speed unit — the difference shows up on every summer bill.' },
          { title: 'Genuinely quiet', body: 'Daikin publishes indoor sound levels in the high teens of decibels on low fan for its premium series — quieter than a library. It matters most in bedrooms.' },
          { title: 'Reverse cycle for Sydney winters', body: 'Every Daikin split we install heats as well as cools. For a Sydney winter a reverse-cycle split is the cheapest heating in the house.' },
          { title: 'Coastal options', body: 'Corrosion-treated outdoor coils are available for beachside and harbourside positions — we specify them where the salt air justifies it.' },
          { title: 'App control', body: 'Wi-Fi adapters on current models mean you can pre-cool the house from the car and check it has been turned off from the office.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Daikin splits from $1,500 supplied and installed',
        body: 'The current offer for a standard back-to-back Daikin wall split, installed by a certified Daikin dealer with a 10-year workmanship warranty. Multi-head systems are quoted on site.',
        cta: { label: 'What changes the price', href: '/daikin/cost-guide' },
      },
    ],
    faqs: [
      {
        q: 'Which Daikin split system is the best?',
        a: 'For most rooms, Alira X is the best balance of efficiency, noise and air quality; Cora is the best value where the unit will not run all day; Zena is the one to choose when the unit is on show. “Best” depends on the room, which is why we recommend after seeing it.',
      },
      {
        q: 'What is the difference between Daikin Cora and Alira X?',
        a: 'Alira X is more efficient, quieter on low fan, and adds enhanced filtration and better humidity control. Cora is the core inverter unit and costs less. In a bedroom used eight hours a night the Alira X difference is worth paying for; in a spare room, Cora is the right call.',
      },
      {
        q: 'Can one Daikin outdoor unit run several rooms?',
        a: 'Yes — that is a Daikin multi-head system. One outdoor unit runs two to five indoor units, which can be different sizes and even different series. Each room has its own controller and temperature.',
      },
      {
        q: 'How much does a Daikin split system cost installed in Sydney?',
        a: 'From $1,500 supplied and installed for a standard back-to-back install of a smaller unit, rising with capacity, series and site factors such as long pipe runs, brackets and electrical work. The Daikin cost guide has indicative ranges by size.',
      },
      {
        q: 'Do Daikin split systems heat as well as cool?',
        a: 'Yes. All the Daikin splits we install are reverse-cycle, which for a Sydney winter is generally the most efficient heating available.',
      },
    ],
    related: ['installation', 'cost-guide', 'ducted-air-conditioning'],
    quoteHeading: 'Get a Daikin split system quote',
    quoteSub: 'Tell us the rooms and we’ll size and recommend the right Daikin series — free on-site assessment.',
    updated: UPDATED,
  },

  // ─── Ducted ──────────────────────────────────────────────────────────────
  {
    slug: 'ducted-air-conditioning',
    navLabel: 'Ducted',
    title: 'Daikin Ducted Air Conditioning Sydney | Zoned Whole-Home Systems | JED',
    description:
      'Daikin ducted air conditioning in Sydney — Premium Inverter and slim-line ducted systems, zoning, sizing and what a ducted install involves in an existing home. Certified Daikin dealer, 10-year workmanship warranty.',
    eyebrow: 'Daikin ducted',
    h1: 'Daikin Ducted',
    h1Accent: 'Air Conditioning',
    tagline: 'Whole-home comfort through ceiling grilles — designed around your roof space, zoned around how you live.',
    intro: [
      'A Daikin ducted system conditions the whole house from a single outdoor unit and an indoor unit in the roof, delivering air through discreet ceiling grilles. Done well it is the most comfortable and least visible system a home can have. Done badly — one open zone, undersized ducting, an indoor unit jammed against the roof — it is noisy, uneven and expensive to run. The difference is the design, and the design starts in the roof space, not the showroom.',
      'This page covers the Daikin ducted range, zoning, what an install involves in an existing Sydney home, and when a slim-line unit or a multi-head split is the better answer.',
    ],
    serviceType: 'Daikin Ducted Air Conditioning Design and Installation',
    blocks: [
      {
        type: 'features',
        heading: 'The Daikin ducted range',
        items: [
          { title: 'Daikin Premium Inverter ducted', body: 'The full-height ducted indoor unit — highest efficiency, quietest operation, capacities that cover anything from a townhouse to a large two-storey home. The default where the roof space allows it.' },
          { title: 'Daikin slim-line ducted', body: 'A low-profile indoor unit for roofs with limited clearance — common in period homes, terraces and the lower pitch of newer builds. Same zoning and control, fits where a standard unit will not.' },
          { title: 'Daikin bulkhead and cassette', body: 'Where there is no roof at all: a bulkhead unit in a dropped ceiling or a ceiling cassette for a single large space, often the answer in apartments and commercial fit-outs.' },
          { title: 'Zone control', body: 'Zoned ducted lets you condition the bedrooms at night and the living areas by day, running a fraction of the system at a time. Daikin’s controllers support individual zone temperatures, timers and app control.' },
        ],
      },
      {
        type: 'steps',
        heading: 'A ducted installation in an existing home',
        intro: 'New builds are straightforward. Retrofitting ducted into a home someone lives in is where experience shows.',
        steps: [
          { title: 'Roof-space inspection', body: 'Clearance, access, insulation, existing services and where the indoor unit can physically sit and be serviced later. This decides whether it is a Premium Inverter, a slim-line or not ducted at all.' },
          { title: 'Zone and duct design', body: 'Zones follow how the house is used, not the floor plan. Ducts are sized for airflow, not squeezed to fit; outlet and return positions balance the rooms rather than blasting the hallway.' },
          { title: 'Outdoor unit and electrical', body: 'A ducted outdoor unit needs a dedicated circuit and a position clear of bedrooms and neighbours. Switchboard capacity is checked before quoting, not on the day.' },
          { title: 'Installation', body: 'One to two days: indoor unit hung and isolated, ducting run and insulated, grilles and returns cut in, refrigerant lines and drain run, controller wired.' },
          { title: 'Commissioning and balancing', body: 'Refrigerant charged to Daikin’s figures, airflow measured and balanced at every outlet, zones tested, controller and app configured, walkthrough with you.' },
        ],
      },
      {
        type: 'table',
        heading: 'Sizing a Daikin ducted system',
        intro: 'Indicative only — a ducted system is sized on the whole envelope, and two houses of the same area can differ by a size.',
        columns: ['Home', 'Indicative capacity', 'Typical zones'],
        rows: [
          ['Apartment or small single-storey, 2–3 bedrooms', '7–10 kW', '2–4'],
          ['Single-storey family home, 3–4 bedrooms', '12.5–14 kW', '4–6'],
          ['Two-storey family home', '16–18 kW', '6–8'],
          ['Large two-storey, open-plan, high ceilings', '20 kW or two systems', '8 or more'],
        ],
        note: 'On very large or long homes two smaller systems often run more efficiently and more quietly than one large one. We tell you when that applies.',
      },
      {
        type: 'compare',
        heading: 'Ducted or multi-head split?',
        intro: 'The question we are asked most on the North Shore and in the Eastern Suburbs. Neither is always right.',
        columns: ['Daikin ducted', 'Daikin multi-head split'],
        rows: [
          { label: 'Roof space', a: 'Needs usable roof clearance and access', b: 'Needs none — wall units and pipe runs only' },
          { label: 'Look', a: 'Ceiling grilles only, one outdoor unit', b: 'A wall unit in each room, one outdoor unit' },
          { label: 'Control', a: 'Zones from one controller or app', b: 'Each room fully independent' },
          { label: 'Heritage and strata', a: 'Ceiling penetrations, but nothing on the walls', b: 'Wall units and external pipework need approval in strata' },
          { label: 'Cost', a: 'Higher upfront, usually the best whole-home result', b: 'Lower for two or three rooms; converges at four or five' },
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does Daikin ducted air conditioning cost in Sydney?',
        a: 'Indicatively from around $9,000 supplied and installed for a smaller single-storey home, and $13,000 to $20,000 or more for a zoned two-storey home, depending on capacity, the number of zones and outlets, roof access and electrical work. The Daikin cost guide breaks this down; the exact figure comes from the roof-space inspection.',
      },
      {
        q: 'Can Daikin ducted be installed in an existing house?',
        a: 'Usually, yes. It depends on roof clearance and access — a slim-line Daikin ducted unit fits many period homes and terraces where a standard unit will not. Where ducted genuinely cannot fit, a multi-head split system is the alternative.',
      },
      {
        q: 'How many zones does a Daikin ducted system need?',
        a: 'For most family homes, four to eight. The number matters less than where the boundaries fall — zones should follow how the house is used through the day (bedrooms at night, living areas by day), not simply the floor plan.',
      },
      {
        q: 'Is ducted more expensive to run than split systems?',
        a: 'Run as one open zone, yes. Zoned and used room by room, a Daikin ducted system runs a fraction of its capacity at a time and compares well. The design and the zoning decide the running cost, not the system type.',
      },
      {
        q: 'How long does a Daikin ducted installation take?',
        a: 'One to two days for most homes, longer for very large or difficult roof spaces. We confirm the schedule with the quote.',
      },
    ],
    related: ['split-systems', 'installation', 'cost-guide'],
    quoteHeading: 'Get a Daikin ducted quote',
    quoteSub: 'A roof-space inspection is part of every ducted quote. Tell us the home and we’ll arrange it within 24 hours.',
    updated: UPDATED,
  },

  // ─── Sales & dealer status ───────────────────────────────────────────────
  {
    slug: 'sales',
    navLabel: 'Sales & dealer',
    title: 'Daikin Dealer Sydney | Buy Daikin Air Conditioners from a Certified Dealer | JED',
    description:
      'Buy Daikin air conditioners in Sydney from a certified Daikin dealer that is also a Daikin warranty agent. Why dealer status affects your warranty, what “Specialist Dealer” means, and current supply-and-install offers.',
    eyebrow: 'Daikin sales & dealer status',
    h1: 'Buying a Daikin',
    h1Accent: 'from a certified dealer',
    tagline: 'Why who you buy from decides your warranty — and what makes JED different from a dealer that only sells.',
    intro: [
      'You can buy a Daikin from a lot of places. What you cannot buy from most of them is the warranty relationship that comes with it. Daikin’s manufacturer warranty depends on authorised installation; the authorised warranty repairs, if you ever need them, are dispatched to an appointed service agent. JED is both a certified Daikin dealer and one of those agents, which means the business that sells and installs your Daikin is the same business Daikin would send to fix it.',
      'This page explains the dealer tiers, what to check before you buy, and the current supply-and-install offers.',
    ],
    serviceType: 'Daikin Air Conditioner Sales and Supply',
    blocks: [
      {
        type: 'compare',
        heading: 'Dealer, Specialist Dealer, warranty agent — what the labels mean',
        intro: 'Daikin authorises businesses at different levels. It matters more after the sale than before it.',
        columns: ['Daikin dealer / Specialist Dealer', 'Daikin warranty service agent (JED is both)'],
        rows: [
          { label: 'Can sell and install Daikin', a: 'Yes', b: 'Yes' },
          { label: 'Install protects the manufacturer warranty', a: 'Yes, when done to specification', b: 'Yes' },
          { label: 'Can carry out Daikin warranty repairs', a: 'No — the repair is dispatched to an agent', b: 'Yes — this is the agent it is dispatched to' },
          { label: 'Who fixes it if it fails under warranty', a: 'Someone else, after Daikin allocates the job', b: 'The same team that installed it, booked directly' },
          { label: 'Manufacturer-trained technicians', a: 'Varies', b: 'Yes' },
        ],
      },
      {
        type: 'checklist',
        heading: 'What to check before you buy a Daikin',
        items: [
          'The quote names the model numbers — indoor and outdoor — not just “Daikin 7 kW”',
          'The installer is a current Daikin-authorised dealer; ask, and ask whether they are also a warranty agent',
          'Capacity was decided by a site visit, not a phone call or an online calculator',
          'The quote itemises what is included: brackets, pipe run length, electrical work, old-unit removal, condensate handling',
          'There is a written workmanship warranty on the installation separate from Daikin’s equipment warranty — JED’s is ten years',
          'For apartments, the quote addresses strata approval and outdoor unit placement rather than leaving it to you',
        ],
      },
      {
        type: 'features',
        heading: 'Current Daikin offers through JED',
        intro: 'Agreed offers, not sale-weekend pricing. All subject to a free on-site assessment.',
        items: [
          { title: 'Daikin splits from $1,500 supplied and installed', body: 'For a standard back-to-back Daikin wall split installed by a certified dealer, including the 10-year JED workmanship warranty.' },
          { title: '10-year workmanship warranty on every install', body: 'On top of Daikin’s manufacturer warranty — the installation is covered for ten years, so there is no gap between the equipment warranty and the work.' },
          { title: 'Warranty agent on call', body: 'Buy through JED and the Daikin warranty agent for your area is the business you already know — booked directly, no manufacturer queue.' },
        ],
      },
      {
        type: 'prose',
        heading: 'Daikin and Haier — why we carry both',
        paragraphs: [
          'JED is certified for both Daikin and Haier. Daikin is the premium choice and the brand Sydney asks for by name; Haier is the value alternative where the budget matters more than the last few points of efficiency or the lowest noise figure. Being certified for both means we recommend on the room and the budget rather than pushing the only brand on the truck — and when a customer asks for Daikin, we can explain exactly what the extra buys.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Where can I buy a Daikin air conditioner in Sydney?',
        a: 'Daikin residential systems are sold through authorised dealers who supply and install, rather than off the shelf. JED is a certified Daikin dealer for Sydney and also a Daikin warranty service agent — we quote supply and installation together after a free on-site assessment.',
      },
      {
        q: 'Is it cheaper to buy a Daikin online and have it installed?',
        a: 'Rarely, once installation is priced, and it can cost you the warranty: Daikin’s manufacturer warranty depends on authorised installation, and grey-import or unauthorised units may not be covered at all. A supply-and-install quote from a certified dealer is the price that actually matters.',
      },
      {
        q: 'What does “Daikin Specialist Dealer” mean?',
        a: 'It is Daikin’s programme for authorised dealers who sell and install its products. It does not by itself mean the dealer can carry out Daikin warranty repairs — that requires a separate appointment as a warranty service agent, which JED also holds.',
      },
      {
        q: 'Do you offer finance or payment plans on Daikin systems?',
        a: 'Ask us when you request a quote — options depend on the system and the total. We will tell you what is available rather than list terms here that change.',
      },
      {
        q: 'How do I know I am getting a genuine Daikin?',
        a: 'Buy supply-and-install from an authorised dealer, insist the quote names the model numbers, and keep the serial numbers from the units. JED registers the installation with Daikin as part of the handover.',
      },
    ],
    related: ['installation', 'warranty', 'cost-guide'],
    quoteHeading: 'Get a Daikin supply-and-install quote',
    quoteSub: 'Model numbers on the quote, sized on site, installed by the warranty agent. We respond within 24 hours.',
    updated: UPDATED,
  },

  // ─── Local intent ────────────────────────────────────────────────────────
  {
    slug: 'service-areas',
    navLabel: 'Near you',
    title: 'Daikin Service & Installation Near You | Sydney Service Areas | JED',
    description:
      'Find Daikin installation, service and warranty repairs near you across Sydney’s Lower North Shore, Upper North Shore, Northern Beaches and Eastern Suburbs — 116 suburbs, one Daikin-appointed warranty agent.',
    eyebrow: 'Daikin near you',
    h1: 'Daikin Service',
    h1Accent: 'near you',
    tagline: 'One Daikin certified dealer and warranty agent across 116 Sydney suburbs. Find yours.',
    intro: [
      'Searching for “Daikin service near me” in Sydney usually lands you on the manufacturer’s call centre or a national directory. Here is the shorter answer: across the Lower North Shore, the Upper North Shore and Hornsby, the Northern Beaches and the Eastern Suburbs, the Daikin-appointed warranty service agent is JED Air Conditioning — and you can book us directly for installation, servicing and repairs.',
      'Below, every suburb we cover, grouped by area, with the local factors that shape Daikin work in each. Each suburb has its own page.',
    ],
    serviceType: 'Daikin Air Conditioning Installation, Service and Repairs — Sydney Local Coverage',
    blocks: [
      {
        type: 'zones',
        heading: 'Daikin installation and service by area',
        intro: 'Salt air on the coast, steep blocks and heritage frontages on the harbour, big roof spaces up the line — the right Daikin install changes with the suburb.',
      },
      {
        type: 'features',
        heading: 'What “near you” actually gets you',
        items: [
          { title: 'Response within 24 hours', body: 'Across all four areas. Faults marked urgent are prioritised, and we are working in most of these suburbs most weeks.' },
          { title: 'The local warranty agent', body: 'Daikin warranty repairs in these suburbs are dispatched to JED. Booking us directly is the same visit without the manufacturer queue.' },
          { title: 'Suburb-specific installs', body: 'Coated coils by the beach, discreet placement in heritage streets, strata documentation in apartment-heavy suburbs — decided on site, not assumed.' },
          { title: 'Same team, every visit', body: 'Manufacturer-trained technicians who installed and service Daikins in your street, not a rotating subcontractor.' },
        ],
      },
      {
        type: 'callout',
        heading: 'Not sure your suburb is listed?',
        body: 'Tell us where you are and what the Daikin needs. If it is inside greater Sydney we will confirm availability within 24 hours.',
        cta: { label: 'Check availability', href: '#quote' },
      },
    ],
    faqs: [
      {
        q: 'Which Sydney suburbs do you service Daikin systems in?',
        a: 'All 116 suburbs across the Lower North Shore, the Upper North Shore and Hornsby, the Northern Beaches and the Eastern Suburbs — each has its own page listed above. For anywhere else in greater Sydney, ask and we will confirm.',
      },
      {
        q: 'Is JED the Daikin service centre for the North Shore?',
        a: 'Daikin does not run its own service centres for residential work — it appoints warranty service agents by area. JED is the appointed agent across the North Shore, Northern Beaches and Eastern Suburbs, which is what a “Daikin service centre near me” search is really looking for.',
      },
      {
        q: 'Do you charge extra for travel within your service area?',
        a: 'No. The service area is the area we work in every day; there is no travel surcharge inside it, and the $200 service call fee is currently waived on Daikin service and repair bookings.',
      },
      {
        q: 'How quickly can you get to me?',
        a: 'We respond within 24 hours to confirm a time, and urgent faults are prioritised. Same-week service is typical across the service area outside the peak of a heatwave.',
      },
    ],
    related: ['service', 'repairs', 'installation'],
    quoteHeading: 'Book Daikin service near you',
    quoteSub: 'Tell us the suburb and what the Daikin needs — install, service or a fault — and we’ll confirm a time within 24 hours.',
    updated: UPDATED,
  },

  // ─── Cost guide ──────────────────────────────────────────────────────────
  {
    slug: 'cost-guide',
    navLabel: 'Cost guide',
    title: 'Daikin Air Conditioning Cost Sydney 2026 | Installed Prices by Size | JED',
    description:
      'What a Daikin air conditioner costs installed in Sydney: split systems from $1,500, multi-head and ducted ranges by size, and the site factors that move a quote. Indicative 2026 pricing from a certified Daikin dealer.',
    eyebrow: 'Daikin cost guide',
    h1: 'What a Daikin Costs',
    h1Accent: 'installed in Sydney',
    tagline: 'Real ranges by system and size, and the six things that move a quote — from a dealer that quotes on site.',
    intro: [
      'The honest answer to “how much is a Daikin?” is a range, because the unit is only part of the price — the installation, the position and the electrical work are the rest. But a range is far more useful than “request a quote”, so here are the indicative supply-and-install figures we see across Sydney in 2026, by system type and size, followed by exactly what pushes a quote up or down.',
      'Everything below is indicative and assumes a standard installation. The exact figure comes from a free on-site assessment, with the model numbers on the quote.',
    ],
    serviceType: 'Daikin Air Conditioning Supply and Installation Pricing',
    blocks: [
      {
        type: 'table',
        heading: 'Daikin split systems — indicative installed cost',
        intro: 'Standard back-to-back installation of a single wall split, Sydney, 2026. Series (Cora / Alira X / Zena) moves the figure within each band.',
        columns: ['Capacity', 'Suits', 'Indicative supplied & installed'],
        rows: [
          ['2.0–2.5 kW', 'Bedroom, study', 'From $1,500 to about $2,300'],
          ['3.5 kW', 'Large bedroom, small living', '$1,900 – $2,900'],
          ['5.0–6.0 kW', 'Living room', '$2,400 – $3,600'],
          ['7.1–8.0 kW', 'Open-plan living', '$3,000 – $4,600'],
          ['9.4 kW', 'Large open-plan', '$3,800 – $5,200'],
        ],
        note: '“From $1,500 supplied and installed” is JED’s current offer for a standard back-to-back Daikin wall split. Long pipe runs, brackets, roof positions and electrical work are additional and itemised.',
      },
      {
        type: 'table',
        heading: 'Daikin multi-head and ducted — indicative installed cost',
        columns: ['System', 'Typical home', 'Indicative supplied & installed'],
        rows: [
          ['Multi-head, 2 indoor units', 'Two bedrooms or bedroom + living, apartment', '$5,000 – $7,500'],
          ['Multi-head, 3 indoor units', 'Three rooms from one outdoor unit', '$7,000 – $10,000'],
          ['Ducted, 7–10 kW, 2–4 zones', 'Apartment or small single-storey', '$9,000 – $12,500'],
          ['Ducted, 12.5–14 kW, 4–6 zones', 'Single-storey family home', '$11,500 – $16,000'],
          ['Ducted, 16–18 kW, 6–8 zones', 'Two-storey family home', '$14,500 – $20,000'],
          ['Ducted, 20 kW+, or two systems', 'Large two-storey, open-plan', '$19,000 and up'],
        ],
        note: 'Ducted pricing depends heavily on roof access, the number of outlets, zone motors and whether a slim-line unit is required. It is quoted only after a roof-space inspection.',
      },
      {
        type: 'features',
        heading: 'The six things that move a Daikin quote',
        intro: 'Two identical units can be a thousand dollars apart installed. This is why.',
        items: [
          { title: '1. Capacity and series', body: 'Bigger units cost more; Alira X and Zena cost more than Cora for the same kilowatts. Right-sizing matters more than the series — an oversized unit is the most expensive mistake in the range.' },
          { title: '2. Pipe run length', body: 'Back-to-back is the baseline. Every additional metre of insulated copper, and every run through a cavity or roof, adds material and labour.' },
          { title: '3. Outdoor unit position', body: 'Ground pad is simplest. Wall brackets, balcony mounts, roof positions and anything needing a crane or scaffold are priced separately — common on North Shore slopes and in Eastern Suburbs apartments.' },
          { title: '4. Electrical', body: 'Larger splits and all ducted systems need a dedicated circuit. An older or full switchboard can add an upgrade; we check before quoting.' },
          { title: '5. Removal of an existing system', body: 'Decommissioning, refrigerant recovery and disposal of the old unit is a line item when there is one.' },
          { title: '6. Extras that are worth it', body: 'Condensate pumps where gravity drainage is impossible, coated coils by the coast, and Wi-Fi control add modest cost and are usually worth specifying up front.' },
        ],
      },
      {
        type: 'prose',
        heading: 'Running costs — the number that matters after the install',
        paragraphs: [
          'A current Daikin inverter split running a bedroom overnight in a Sydney summer typically costs well under a dollar a night; a living room through an afternoon a little more. A zoned Daikin ducted system used room by room compares well with several splits; run as one open zone it will not. In every case the install decides the running cost as much as the unit — a correctly sized, properly charged Daikin costs noticeably less to run than the same unit oversized or installed to a lower standard.',
          'If a quote seems too cheap, ask what has been left out: the pipe run, the electrical circuit, the bracket, the old unit. A certified Daikin dealer itemises them; the price you are comparing against usually has not.',
        ],
      },
      {
        type: 'callout',
        heading: 'Get the exact figure',
        body: 'A free on-site assessment across Sydney, a written quote with the model numbers on it, and a 10-year workmanship warranty on the install. No pressure, no phone-estimate that changes on the day.',
        cta: { label: 'Get a Daikin quote', href: '#quote' },
      },
    ],
    faqs: [
      {
        q: 'How much does a Daikin split system cost installed in Sydney?',
        a: 'Indicatively from $1,500 supplied and installed for a standard back-to-back install of a smaller unit, up to around $5,000 for a large-capacity premium unit, with pipe runs, brackets and electrical work additional. Multi-head systems start around $5,000 for two rooms.',
      },
      {
        q: 'How much does Daikin ducted cost in Sydney?',
        a: 'Indicatively $9,000 to $12,500 for a small single-storey home or apartment, $11,500 to $16,000 for a typical single-storey family home, and $14,500 to $20,000 or more for a zoned two-storey home. Roof access, outlets and zones drive the difference.',
      },
      {
        q: 'Why is Daikin more expensive than other brands?',
        a: 'Higher efficiency, lower noise and a strong parts and warranty network cost more to build. Over a ten-year life the running-cost difference on a system used daily usually closes much of the gap, and the resale and reliability record is why Sydney searches for Daikin by name.',
      },
      {
        q: 'Are there hidden costs in air conditioning installation?',
        a: 'There should not be. The common surprises are electrical upgrades, long pipe runs, bracket or roof positions and old-unit removal — all of which a site assessment finds and a proper quote itemises. Phone estimates are where hidden costs come from.',
      },
      {
        q: 'Does the price include the warranty?',
        a: 'Yes. Every JED Daikin installation includes Daikin’s manufacturer warranty on the equipment and JED’s 10-year workmanship warranty on the installation, at no extra cost.',
      },
    ],
    related: ['split-systems', 'ducted-air-conditioning', 'installation'],
    quoteHeading: 'Get an exact Daikin price',
    quoteSub: 'Free on-site assessment, model numbers on the quote, response within 24 hours.',
    updated: UPDATED,
  },
];

export const daikinBySlug = new Map(DAIKIN_PAGES.map((p) => [p.slug, p]));
export const DAIKIN_PILLAR = daikinBySlug.get('')!;
export const DAIKIN_SUPPORTING = DAIKIN_PAGES.filter((p) => p.slug !== '');
