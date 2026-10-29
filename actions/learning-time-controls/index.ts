import axios from '@/lib/axios';
import {
  KidLearningTimeControls,
  LearningTimeControls,
  LearningTimeControlsUpdate,
} from '@/types/learningTimeControls';

// ─── Guardian ───────────────────────────────────────────────────────────────

export const getLearningTimeControls = async (
  kidId: string,
): Promise<LearningTimeControls> => {
  const res = await axios.get(
    `/guardian/learners/${kidId}/learning-time-controls`,
  );
  return res?.data?.data;
};

export const updateLearningTimeControls = async (
  kidId: string,
  payload: LearningTimeControlsUpdate,
): Promise<LearningTimeControls> => {
  const res = await axios.patch(
    `/guardian/learners/${kidId}/learning-time-controls`,
    payload,
  );
  return res?.data?.data;
};

export const resetLearningTimeControls = async (
  kidId: string,
): Promise<LearningTimeControls> => {
  const res = await axios.post(
    `/guardian/learners/${kidId}/learning-time-controls/reset`,
  );
  return res?.data?.data;
};

// ─── Kid ────────────────────────────────────────────────────────────────────

export const getKidLearningTimeControls = async (
  date: string,
): Promise<KidLearningTimeControls> => {
  const res = await axios.get('/kid-learning-time-controls', {
    params: { date },
  });
  return res?.data?.data;
};

export const reportBreakReminder = async () => {
  const res = await axios.post('/kid-learning-time-controls/break-reminder');
  return res?.data?.data;
};
