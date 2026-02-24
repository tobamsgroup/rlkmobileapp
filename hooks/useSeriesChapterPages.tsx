import { fetchAllSeriesChapterPages } from '@/actions/kid';
import { useQuery } from '@tanstack/react-query';

const useSeriesChapterPages = (seriesId: string) => {
  return useQuery({
    queryKey: ['series-cahpter-pages', seriesId],
    queryFn: async () => {
      return await fetchAllSeriesChapterPages(seriesId!);
    },
  });
};

export default useSeriesChapterPages;
