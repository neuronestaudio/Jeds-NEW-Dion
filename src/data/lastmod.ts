import { SUBURBS } from './suburbs';

/** Falls back to the build date for pages without their own content date. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const byPath = new Map<string, string>(SUBURBS.map((s) => [`/service-area/${s.slug}`, s.updated]));

export function pageLastmod(pathname: string): string {
  const clean = pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return byPath.get(clean) ?? BUILD_DATE;
}
