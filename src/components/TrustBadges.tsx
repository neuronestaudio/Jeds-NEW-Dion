import { Award, BadgeCheck, Clock, Shield } from 'lucide-react';

/** The business's own published claims, as shown in the footer and homepage. */
const BADGES = [
  { icon: Award, label: 'Daikin & Haier Certified Dealer' },
  { icon: Shield, label: '5-Year Workmanship Warranty' },
  { icon: BadgeCheck, label: 'Fully Licensed & Insured' },
  { icon: Clock, label: '10+ Years Experience' },
];

type Props = { layout?: 'row' | 'stack' };

export function TrustBadges({ layout = 'row' }: Props) {
  const grid =
    layout === 'stack'
      ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1'
      : 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';
  return (
    <ul className={grid}>
      {BADGES.map((b) => (
        <li key={b.label} className="trust-badge">
          <b.icon className="h-4 w-4 text-primary flex-shrink-0" />
          <span>{b.label}</span>
        </li>
      ))}
    </ul>
  );
}

export default TrustBadges;
