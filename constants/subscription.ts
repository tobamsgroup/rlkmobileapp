import type { SubscriptionPlan } from '@/actions/subscription';

export type PlanDetail = {
  name: string;
  price: number;
  desc: string;
  noOfBooks: number;
  isPopular: boolean;
  themeBg: string;
  themeText: string;
  beName:string
};

export const PLAN_DETAILS: Record<SubscriptionPlan, PlanDetail> = {
  free: {
    name: 'Free Trial' ,
    price: 0,
    desc: 'Basic access for new learners.',
    noOfBooks: 1,
    isPopular: false,
    themeBg: '#D3D2D31A',
    themeText: '#474348',
    beName:"free"
  },
  starter: {
    name: 'Starter',
    price: 7.99,
    desc: 'Great for children starting their learning journey.',
    noOfBooks: 3,
    isPopular: false,
    themeBg: '#3F69921A',
    themeText: '#3F6992',
    beName:"starter"

  },
  explorer: {
    name: 'Explorer',
    price: 13.99,
    desc: 'Explore multiple future skills.',
    noOfBooks: 6,
    isPopular: true,
    themeBg: '#3F92431A',
    themeText: '#3F9243',
    beName:"explorer"

  },
  builder: {
    name: 'Builder',
    price: 24.99,
    desc: 'Build deeper knowledge across several topics.',
    noOfBooks: 12,
    isPopular: false,
    themeBg: '#D5B3001A',
    themeText: '#D5B300',
    beName:"builder"
    
  },
  future_skills: {
    name: 'Future Skills',
    price: 39.99,
    desc: 'Unlock a large bundle of future-skills learning.',
    noOfBooks: 20,
    isPopular: false,
    themeBg: '#A858B71A',
    themeText: '#A858B7',
    beName:"future_skills"
    
  },
  library_pass: {
    name: 'Library Pass',
    price: 79.99,
    desc: 'Build knowledge by gaining full access to the RLKids digital Library.',
    noOfBooks: 54,
    isPopular: false,
    themeBg: '#23C2A51A',
    themeText: '#23C2A5',
    beName:"library_pass"
    
  },
};

export const PLAN_ORDER: SubscriptionPlan[] = [
  'free',
  'starter',
  'explorer',
  'builder',
  'future_skills',
  'library_pass',
];

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateShort = (dateStr?: string): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const getBillingCycle = (currentPeriodEnd?: string): string => {
  if (!currentPeriodEnd) return '—';
  const end = new Date(currentPeriodEnd);
  const start = new Date(end);
  start.setMonth(start.getMonth() - 1);
  return `${formatDateShort(start.toISOString())} – ${formatDateShort(currentPeriodEnd)}`;
};
