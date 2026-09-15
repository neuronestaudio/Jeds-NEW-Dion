/**
 * Suburbs are grouped by their real housing-stock pattern, and each group
 * carries the "common issues" and FAQ copy that is genuinely true for that
 * kind of property. Individual suburbs localise the intro and can add their
 * own entries on top; `{suburb}` is replaced with the suburb name at render.
 *
 * Every claim here is general HVAC practice, not a JED-specific promise.
 */

export type GroupKey = 'beachside' | 'harbourside' | 'apartment' | 'suburban';

export interface Issue {
  title: string;
  body: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface SuburbGroup {
  label: string;
  issues: Issue[];
  faq: Faq[];
}

export const SUBURB_GROUPS: Record<GroupKey, SuburbGroup> = {
  beachside: {
    label: 'Beachside / high salt exposure',
    issues: [
      {
        title: 'Salt-air corrosion on outdoor units',
        body: 'Ocean air carries salt that settles on the outdoor unit’s coil fins, fasteners and casing, and it corrodes them noticeably faster than it would a few kilometres inland. For {suburb} installs we specify units with corrosion-protected (coated) coils where the position is exposed, use stainless or coated fixings, and site the unit out of direct sea spray wherever the property allows.',
      },
      {
        title: 'Strata approval for apartment installs',
        body: 'Most apartment buildings in {suburb} require body-corporate approval before an outdoor unit goes on a balcony, wall or roof, because it touches common property. We provide the unit specifications, noise data and mounting details that strata committees typically ask for, so the approval isn’t a surprise partway through the job.',
      },
      {
        title: 'Wind exposure and mounting',
        body: 'Beachside positions cop stronger, more constant wind than inland streets. Bracket choice, mounting height and orientation matter more here — an outdoor unit that vibrates or rattles in a southerly is usually a placement problem, not a faulty unit.',
      },
      {
        title: 'Faster filter and coil build-up',
        body: 'Sand and salt load up filters and coils quicker than in inland suburbs. A beachside system generally needs servicing at least annually, and more often if it sits in a very exposed position, to keep efficiency up and the warranty intact.',
      },
    ],
    faq: [
      {
        q: 'Does salt air really affect an air conditioner in {suburb}?',
        a: 'Yes. Outdoor units close to the coast corrode faster without protection — the coil fins and fasteners are the first to go. We recommend corrosion-protected units and coated fixings for exposed {suburb} positions, and a regular service schedule to rinse and check the outdoor unit.',
      },
      {
        q: 'Do I need body corporate approval to install a split system in a {suburb} apartment?',
        a: 'In most buildings, yes — at least for the outdoor unit, and for any drilling through common property. We supply the technical specifications strata committees usually request.',
      },
      {
        q: 'How often should a beachside system be serviced?',
        a: 'At least once a year for a typical {suburb} install, and every six months if the outdoor unit is directly exposed to sea spray. Regular servicing is also what keeps a manufacturer warranty valid.',
      },
    ],
  },

  harbourside: {
    label: 'Harbourside established / heritage',
    issues: [
      {
        title: 'Heritage and streetscape constraints',
        body: 'Many {suburb} homes are federation or inter-war houses in heritage conservation areas, where an outdoor unit visible from the street can be restricted. Discreet placement down a side passage or at the rear, or a ducted system with concealed ceiling vents, usually solves it without compromising the home’s frontage.',
      },
      {
        title: 'Steep blocks, established gardens and access',
        body: 'Harbourside slopes and mature gardens make outdoor-unit placement and access a real design question in {suburb}. We plan the pipe run, the condenser position and service access during the site assessment rather than discovering the problem on install day.',
      },
      {
        title: 'Older wiring and switchboards',
        body: 'Period homes often have switchboards and circuits that predate modern ducted systems. We check capacity and safety-switch protection as part of the assessment, and flag any electrical upgrade before quoting so there are no surprises.',
      },
      {
        title: 'Ducted retrofits into existing roof spaces',
        body: 'Retrofitting ducted air conditioning into an older {suburb} home is usually achievable, but roof pitch, ceiling insulation and access all affect the design. A roof-space inspection is part of every ducted quote.',
      },
    ],
    faq: [
      {
        q: 'Can ducted air conditioning be retrofitted into a federation or period home in {suburb}?',
        a: 'Often, yes. It depends on roof-space clearance, access and insulation, which we assess on site. Where a full ducted system isn’t practical, a multi-head split system with discreet indoor units is the usual alternative.',
      },
      {
        q: 'Where can the outdoor unit go on a heritage home?',
        a: 'Typically a side passage or the rear of the property, positioned so it isn’t visible from the street and meets noise clearances to neighbours. We confirm placement during the site assessment.',
      },
      {
        q: 'Will my older switchboard cope with a new system?',
        a: 'We check this before quoting. Some period homes in {suburb} need a circuit or safety-switch upgrade to run a ducted system safely; if so, it’s itemised in the quote rather than added later.',
      },
    ],
  },

  apartment: {
    label: 'Dense apartment / strata-heavy',
    issues: [
      {
        title: 'Body-corporate approval',
        body: 'Apartment installs in {suburb} almost always need strata approval for the outdoor unit and for any penetration through common property. We supply the specifications and mounting details committees ask for, and can advise on what by-laws typically allow.',
      },
      {
        title: 'Balcony placement, noise and clearances',
        body: 'Where the outdoor unit can go is often the whole question in a unit. We select quieter units, respect minimum clearances to neighbouring balconies and windows, and use brackets appropriate for balcony or wall mounting.',
      },
      {
        title: 'Condensate drainage',
        body: 'Indoor units produce condensate that has to drain somewhere — in an apartment that means planning a route to an approved drain, not onto a neighbour’s balcony. It’s designed in from the start on every {suburb} unit install.',
      },
      {
        title: 'Cooling several rooms from limited outdoor space',
        body: 'Most {suburb} apartments have room for one outdoor unit at best. A multi-head system runs two or more indoor units from a single outdoor unit, which is usually the right answer for a two- or three-bedroom apartment.',
      },
    ],
    faq: [
      {
        q: 'Do I need body corporate approval to install air conditioning in my {suburb} apartment?',
        a: 'Yes, in nearly every building — for the outdoor unit, and for any drilling through walls or slabs that count as common property. We provide the specifications strata committees usually request.',
      },
      {
        q: 'Can I air-condition multiple rooms with one outdoor unit?',
        a: 'Yes. A multi-head split system runs several indoor units from one outdoor unit, which suits {suburb} apartments where balcony or wall space is limited.',
      },
      {
        q: 'What about noise for my neighbours?',
        a: 'Unit selection and placement handle most of it — quieter models, correct clearances and vibration-isolating brackets. We size and position the outdoor unit to stay within the noise limits strata schemes and councils apply.',
      },
    ],
  },

  suburban: {
    label: 'Established suburban / standalone homes',
    issues: [
      {
        title: 'Ducted retrofits into existing roof spaces',
        body: 'The most common {suburb} job is fitting ducted air conditioning into an existing standalone home. Roof-space clearance, insulation and access determine the design, so a roof inspection is part of every ducted assessment.',
      },
      {
        title: 'Sizing and zoning larger homes',
        body: 'Bigger and two-storey homes in {suburb} benefit from zoning — running only the rooms in use — which affects both the system capacity we recommend and the running costs you’ll see.',
      },
      {
        title: 'Switchboard capacity',
        body: 'Older established homes sometimes need a circuit or switchboard upgrade before a ducted system can be installed safely. We check this during the assessment and itemise it in the quote if it’s needed.',
      },
      {
        title: 'Tree cover and leaf litter',
        body: 'Leafy streets are part of why people live in {suburb}, and they also mean leaf litter and debris collecting around outdoor units. Placement away from heavy drop zones and regular servicing keep airflow and efficiency up.',
      },
    ],
    faq: [
      {
        q: 'Can my existing {suburb} home take a ducted system?',
        a: 'In many cases, yes. We assess roof space, structure and insulation on site to design a system that fits; where ducted isn’t practical, a multi-head split system is the usual alternative.',
      },
      {
        q: 'Ducted or split system for a larger home?',
        a: 'Ducted with zoning is usually the better whole-home answer for a larger {suburb} property; split systems suit individual rooms or extensions. We recommend based on layout, insulation and how you actually use the house.',
      },
      {
        q: 'How long does a ducted installation take?',
        a: 'Typical installations take 1–2 days depending on home layout and capacity. Split systems are usually completed within a day.',
      },
    ],
  },

};

export function fillSuburb(text: string, suburb: string): string {
  return text.replaceAll('{suburb}', suburb);
}
