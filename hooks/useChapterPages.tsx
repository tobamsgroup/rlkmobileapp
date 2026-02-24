import { fetchChapterPages, fetchKidLearning } from '@/actions/kid';
import { useQuery } from '@tanstack/react-query';

const useChapterPages = (chapterId:string) => {
  return useQuery({
    queryKey: ['chapter-pages', chapterId],
    queryFn: async () => {
      return await fetchChapterPages(chapterId)
    },
  });
};

export default useChapterPages;
