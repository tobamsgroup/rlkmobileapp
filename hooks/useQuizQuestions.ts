import { fetchQuiz } from '@/actions/kid';
import { useQuery } from '@tanstack/react-query';

const useQuizQuestions = (
  chapterId: string,
  quizType: 'mid' | 'end',
  disabled = false,
) => {
  return useQuery({
    queryKey: [`quiz-${chapterId}-${quizType}`],
    queryFn: async () => {
      return await fetchQuiz(chapterId, quizType);
    },
  });
};

export default useQuizQuestions;
