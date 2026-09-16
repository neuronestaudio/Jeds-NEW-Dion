import { SUBURBS } from './suburbs';
import { DAIKIN_PAGES, daikinPath } from './daikin';

/** Falls back to the build date for pages without their own content date. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const byPath = new Map<string, string>([
  ...SUBURBS.map((s): [string, string] => [`/service-area/${s.slug}`, s.updated]),
  ...DAIKIN_PAGES.map((p): [string, string] => [daikinPath(p.slug), p.updated]),
]);

export function pageLastmod(pathname: string): string {
  const clean = pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return byPath.get(clean) ?? BUILD_DATE;
}
