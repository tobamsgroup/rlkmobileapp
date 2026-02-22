import axios from '@/lib/axios';
import { Badge } from '@/types';

export const getAllBadges = async (): Promise<Badge[]> => {
  const res = await axios.get(`/badges`);
  return res?.data.data;
};
