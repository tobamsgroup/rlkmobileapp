import axios from '@/lib/axios';
import { Badge } from '@/types';
import {
  ChapterPage,
  ChapterPageData,
  KidLearningOverview,
  KidPRofile,
  UpdateKidProfile,
  QuizQuestion,
  QuizResult,
  ReadingProgressProps,
  ScenarioQuizQuestion,
} from "@/types";

export const fetchKidLearning = async (): Promise<KidLearningOverview[]> => {
  const res = await axios.get(`/kid/courses/my`);
  return res?.data?.data;
};

export const fetchKidOverview = async (): Promise<{
  totalBadgesUnlocked: number;
  totalCompletedTracks: number;
  totalLearningHours: number;
}> => {
  const res = await axios.get(`/lesson-progress/overview`);
  return res?.data?.data;
};

export const fetchKidProfile = async (): Promise<KidPRofile> => {
  const res = await axios.get(`/kid/me`);
  return res?.data?.data;
};

export const updateKidProfile = async (
  kidId: string,
  updateData: UpdateKidProfile
): Promise<UpdateKidProfile> => {
  const response = await axios.patch(`/kid/${kidId}`, updateData);
  return response?.data?.data;
};

export const fetchChapterPages = async (
  chapterId: string
): Promise<ChapterPageData | null> => {
  if (!chapterId) return null;
  const res = await axios.get(`/book/${chapterId}/pages`);
  return res?.data?.data;
};

export const fetchAllSeriesChapterPages = async (
  seriesId: string
): Promise<
  | {
      _id: string;
      chapterTitle: string;
      chapterIndex: number;
      pages: ChapterPage[];
    }[]
  | null
> => {
  if (!seriesId) return null;
  const res = await axios.get(`/book/${seriesId}/chapter-pages`);
  return res?.data?.data;
};

export const getReadingProgress = async (): Promise<ReadingProgressProps[]> => {
  const res = await axios.get(`/kid/reading-progress`);
  return res?.data?.data;
};

export const updateReadingProgress = async (
  chapterId: string,
  newPageIndex: number
) => {
  await axios.patch("/kid/reading-progress/update", {
    chapterId,
    newPageIndex,
  });
  return;
};
export const updatePLProgress = async (
  chapterId: string,
  newPageIndex: number
) => {
  await axios.patch("/kid/play-progress/update", {
    chapterId,
    newPageIndex,
  });
  return;
};

export const updateLessonProgress = async (
  lessonId: string,
  activityType: string,
  completedActivities: string[] = [],
  totalTimeSpent: number
) => {
  await axios.patch("/lesson-progress", {
    lessonId,
    activityType,
    completedActivities,
    totalTimeSpent,
  });
  return;
};

export const changeMood = async (mood: string) => {
  await axios.post("/kid/mood/update", {
    mood,
  });
};

export const sendQuizResult = async (result: {
  bookId: string;
  chapterId: string;
  quiz: QuizResult;
}) => {
  await axios.post("/kid/quiz/result", {
    ...result,
  });
};

export const fetchQuiz = async (
  chapterId: string,
  quizType: "mid" | "end"
): Promise<{ questions: QuizQuestion[] }> => {
  const resp = await axios.get(`/ai/quiz/${chapterId}/${quizType}`);
  console.log(resp);
  return resp?.data;
};

export const claimXP = async (xp: number) => {
  await axios.post("/kid/xp/claim", {
    xp,
  });
};

export const loginGuardianAsKid = async (
  kidId: string,
  guardianPassword: string
) => {
  const res = await axios.post(`auth/login-guardian/${kidId}`, {
    password: guardianPassword,
  });
  return res?.data.data;
};

export const trackKidReadingTime = async (payload: {
  taskId: string;
  taskName: string;
  taskType: string;
  timeSpentMinutes: number;
}) => {
  const response = await axios.post("/kid/analytics/time-tracking", payload);
  return response?.data;
};

export const fetchScenarioQuiz = async (
  chapterId: string
): Promise<ScenarioQuizQuestion> => {
  const resp = await axios.get(`/ai/scenario-quiz/${chapterId}`);
  return resp?.data?.questions;
};

export const fetchAllKidAvatars = async () => {
  const response = await axios.get(`/upload/avatars`);
  return response?.data?.data?.avatars;
};



export const getAllBadges = async (): Promise<Badge[]> => {
  const res = await axios.get(`/badges`);
  return res?.data.data;
};
