import { getKidsSubscriptions, getMySubscription } from '@/actions/subscription';
import { useQuery } from '@tanstack/react-query';

export const useKidsSubscription = () => {
  return useQuery({
    queryKey: ['kids-subscription'],
    queryFn: getKidsSubscriptions,
  });
};
