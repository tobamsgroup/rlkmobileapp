import { getMySubscription } from '@/actions/subscription';
import { useQuery } from '@tanstack/react-query';

export const useSubscription = () => {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: getMySubscription,
  });
};
