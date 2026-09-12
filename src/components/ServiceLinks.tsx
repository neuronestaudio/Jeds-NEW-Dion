import { Building, Settings, Thermometer, Wind, Wrench } from 'lucide-react';

const SERVICES = [
  {
    icon: Thermometer,
    title: 'Split System Installation',
    href: '/service/split-system-installation',
    blurb: 'Single rooms, extensions and apartments — sized and placed for the space.',
  },
  {
    icon: Wind,
    title: 'Ducted Air Conditioning',
    href: '/service/ducted-air-conditioning',
    blurb: 'Whole-home comfort with zoning, designed around your existing roof space.',
  },
  {
    icon: Wrench,
    title: 'Repairs & Diagnostics',
    href: '/service/aircon-repair',
    blurb: 'Fast, accurate diagnosis and repair for all major brands.',
  },
  {
    icon: Settings,
    title: 'Servicing & Maintenance',
    href: '/service/aircon-repair',
    blurb: 'Regular servicing to keep efficiency up and warranties valid.',
  },
  {
    icon: Building,
    title: 'Commercial Air Conditioning',
    href: '/services',
    blurb: 'Offices, retail and strata — design, installation and commissioning.',
  },
];

export function ServiceLinks() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {SERVICES.map((s) => (
        <a
          key={s.title}
          href={s.href}
          className="group rounded-2xl border border-border bg-card/90 p-5 transition-all hover:border-primary/40 hover:bg-card"
        >
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
            <s.icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold mb-1 transition-colors group-hover:text-primary">{s.title}</h3>
          <p className="text-sm text-muted-foreground">{s.blurb}</p>
        </a>
      ))}
    </div>
  );
}

export default ServiceLinks;
