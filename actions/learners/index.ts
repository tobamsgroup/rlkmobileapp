import axios from "@/lib/axios";
import { ChapterCompletionRate, IGuardianKids } from "@/types";

export const fetchKids = async ():Promise<IGuardianKids[]> => {
  const res = await axios.get("/guardian/kids");
  return res?.data?.data?.kidIds;
};

export const loginKidAsGuardian = async (kidId: string) => {
  const res = await axios.post(`/auth/login-as-kid/${kidId}`);
  return res?.data.data;
};

export const getKidAverageQuizScore = async (kidId: string) => {
  const res = await axios.get(`/guardian/analytics/${kidId}/quiz-average`);
  return res?.data.data;
};

export const getKidOverallChapterCompletionRate = async (kidId: string) : Promise<ChapterCompletionRate>=> {
  const res = await axios.get(
    `/guardian/analytics/${kidId}/chapter-completion`
  );
  return res?.data.data;
};

export const fetchTaskAnalyticsData = async (kidId: string) => {
  const res = await axios.get(`/guardian/analytics/${kidId}/time-analytics`);
  return res?.data;
};
