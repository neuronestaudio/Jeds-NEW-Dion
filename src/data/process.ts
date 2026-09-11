import { ClipboardCheck, FileText, Wrench, ThumbsUp, CalendarCheck } from 'lucide-react';

/** The five-step install process, shared by the homepage animation and the static suburb pages. */
export const PROCESS_STEPS = [
  {
    icon: ClipboardCheck,
    step: '01',
    title: 'On-Site Assessment & Sizing',
    description: 'We assess room size, insulation, layout and usage to determine the correct system capacity.',
  },
  {
    icon: FileText,
    step: '02',
    title: 'System Recommendation',
    description: 'We recommend the right Daikin or Haier system based on performance, efficiency and budget.',
  },
  {
    icon: Wrench,
    step: '03',
    title: 'Professional Installation',
    description: 'Installed to Australian standards and manufacturer guidelines.',
  },
  {
    icon: ThumbsUp,
    step: '04',
    title: 'Testing & Commissioning',
    description: 'Full system testing, airflow balancing and operational walkthrough.',
  },
  {
    icon: CalendarCheck,
    step: '05',
    title: 'Warranty & Aftercare',
    description: 'Backed by manufacturer warranty and workmanship guarantee.',
  },
];
