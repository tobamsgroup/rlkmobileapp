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

export const getBookProgress = async (
  kidId: string,
  seriesId: string,
): Promise<BookProgressResponse> => {
  const res = await axios.get(
    `/guardian/learners/${kidId}/books/${seriesId}`,
  );
  return res?.data?.data;
};
