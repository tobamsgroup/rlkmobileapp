import { fetchScenarioQuiz } from '@/actions/kid';
import { useQuery } from '@tanstack/react-query';

const useScenarioQuizQuestions = (chapterId: string) => {
  return useQuery({
    queryKey: [`scenario-quiz`, chapterId],
    queryFn: async () => {
      return await fetchScenarioQuiz(chapterId);
    },
  });
};

export default useScenarioQuizQuestions;
