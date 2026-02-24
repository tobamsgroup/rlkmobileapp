import { fetchKidLearning } from '@/actions/kid';
import { useQuery } from '@tanstack/react-query';

const useKidLearningOverview = () => {
  return useQuery({
    queryKey: ['kid-learning'],
    queryFn: async () => {
      return await fetchKidLearning();
    },
  });
};

export default useKidLearningOverview;
