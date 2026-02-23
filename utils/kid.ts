import { AssignedChapter, KidLearningOverview } from "@/types";

type ChapterProps = AssignedChapter & {
  bookImage: string;
  seriesTitle: string;
  bookId: string;
};

export function getTopTwoChapters(data: KidLearningOverview[]): ChapterProps[] {
  const allChapters: ChapterProps[] = [];

  for (const entry of data) {
    const bookImage = entry.bookId.image;

    for (const chapter of entry.assignedChapters) {
      if (chapter.progress < 100) {
        const seriesId = chapter?.chapterId?.seriesId;

        if (!seriesId) continue;

        const matchedSeries = entry.assignedSeries.find(
          (s) => s.seriesId._id === seriesId
        );

        allChapters.push({
          ...chapter,
          bookImage,
          seriesTitle: matchedSeries?.seriesId.title || "",
          bookId: entry.bookId._id,
        });
      }
    }
  }

  return allChapters.sort((a, b) => b.progress - a.progress).slice(0, 2);
}