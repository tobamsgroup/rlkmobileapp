import { KidCourseWithPopulatedKid } from '@/actions/curriculum';
import type { SubscriptionPlan } from '@/actions/subscription';
import { IGuardianKids } from '@/types';

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

export const formatDate = (dateStr?: string|null): string => {
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

export const getBillingCycle = (currentPeriodEnd?: string | null): string => {
  if (!currentPeriodEnd) return '—';
  const end = new Date(currentPeriodEnd);
  const start = new Date(end);
  start.setMonth(start.getMonth() - 1);
  return `${formatDateShort(start.toISOString())} – ${formatDateShort(currentPeriodEnd)}`;
};

export function getDistinctSeriesAssignedCount(
  assignments: KidCourseWithPopulatedKid[],
  kidId: string,
): number {
  const seriesIds = new Set<string>();

  assignments.forEach((a) => {
    const assignmentKidId =
      typeof a.kidId === 'string' ? a.kidId : a.kidId?._id;

    if (assignmentKidId === kidId) {
      (a.assignedSeries || []).forEach((s) => {
        //@ts-ignore
        if (s.seriesId) seriesIds.add(s.seriesId);
      });
    }
  });

  return seriesIds.size;
}


function checkKidSeriesEligibility(
  kid: IGuardianKids,
  assignments: KidCourseWithPopulatedKid[],
  planDetails: Record<SubscriptionPlan, PlanDetail>,
): KidSeriesEligibility {
  const plan = kid.subscription?.plan;
  const status = kid.subscription?.status;
  const planDetail = planDetails[plan];

  const seriesAssigned = getDistinctSeriesAssignedCount(assignments, kid._id);

  if (!planDetail) {
    return {
      kidId: kid._id,
      username: kid.username,
      plan,
      subscriptionStatus: status,
      seriesAssigned,
      maxSeriesAllowed: 0,
      remainingSlots: 0,
      canAssignMoreSeries: false,
      reason: `Unknown plan "${plan}" — no plan details found`,
    };
  }

  if (status !== 'active') {
    return {
      kidId: kid._id,
      username: kid.username,
      plan,
      subscriptionStatus: status,
      seriesAssigned,
      maxSeriesAllowed: planDetail.noOfBooks,
      remainingSlots: 0,
      canAssignMoreSeries: false,
      reason: `Subscription status is "${status}", not active`,
    };
  }

  const remainingSlots = Math.max(planDetail.noOfBooks - seriesAssigned, 0);

  return {
    kidId: kid._id,
    username: kid.username,
    plan,
    subscriptionStatus: status,
    seriesAssigned,
    maxSeriesAllowed: planDetail.noOfBooks,
    remainingSlots,
    canAssignMoreSeries: remainingSlots > 0,
  };
}

export function checkKidsSeriesAssignmentEligibility(
  kids: IGuardianKids[],
  assignments: KidCourseWithPopulatedKid[],
  planDetails: Record<SubscriptionPlan, PlanDetail>,
): KidSeriesEligibility[] {
  return kids.map((kid) =>
    checkKidSeriesEligibility(kid, assignments, planDetails),
  );
}

interface KidSeriesEligibility {
  kidId: string;
  username: string;
  plan: SubscriptionPlan;
  subscriptionStatus: string;
  seriesAssigned: number;
  maxSeriesAllowed: number;
  remainingSlots: number;
  canAssignMoreSeries: boolean;
  reason?: string;
}
