import axios from '@/lib/axios';
import {
  AssignedBooksQuery,
  AssignedBooksResponse,
  BookProgressResponse,
  ReadingOverview,
} from '@/types/learnerProgress';

export const getReadingOverview = async (
  kidId: string,
): Promise<ReadingOverview> => {
  const res = await axios.get(`/guardian/learners/${kidId}/reading-overview`);
  return res?.data?.data;
};

export const getAssignedBooks = async (
  kidId: string,
  query: AssignedBooksQuery,
): Promise<AssignedBooksResponse> => {
  const res = await axios.get(`/guardian/learners/${kidId}/books`, {
    params: query,
  });
  return res?.data?.data;
};

// Kid-only reading-time heartbeat (max 120 seconds per call)
export const recordReadingTime = async (payload: {
  chapterId: string;
  seconds: number;
  date: string;
}) => {
  const res = await axios.post('/kid/reading-time', payload);
  return res?.data?.data;
};

export const getBookProgress = async (
  kidId: string,
  seriesId: string,
): Promise<BookProgressResponse> => {
  const res = await axios.get(
    `/guardian/learners/${kidId}/books/${seriesId}`,
  );
  return res?.data?.data;
};
