import { getAllKids } from '@/actions/curriculum';
import {
  getLearningTimeControls,
  resetLearningTimeControls,
  updateLearningTimeControls,
} from '@/actions/learning-time-controls';
import {
  LearningTimeControls,
  LearningTimeControlsUpdate,
} from '@/types/learningTimeControls';
import { showToast } from '@/utils/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export type LearnerOption = { _id: string; name: string; picture?: string };

export const learningTimeControlsKey = (kidId: string) => [
  'learning-time-controls',
  kidId,
];

// Learner name/avatar from the same list the KidSwitcher uses
export const useLearnerOption = (kidId?: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['kids'],
    queryFn: async () => await getAllKids(),
  });
  const learner = (data as LearnerOption[] | undefined)?.find(
    (k) => k?._id === kidId,
  );
  return { learner, isLoading };
};

export const useLearningTimeControls = (kidId?: string) =>
  useQuery({
    queryKey: learningTimeControlsKey(kidId ?? ''),
    queryFn: async () => await getLearningTimeControls(kidId!),
    enabled: !!kidId,
  });

const errorMessage = (error: any, fallback: string) => {
  const message = error?.response?.data?.message;
  return Array.isArray(message) ? message[0] : message || fallback;
};

export const useSaveLearningTimeControls = (kidId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LearningTimeControlsUpdate) =>
      await updateLearningTimeControls(kidId!, payload),
    onSuccess: (data: LearningTimeControls) => {
      queryClient.setQueryData(learningTimeControlsKey(kidId!), data);
    },
    onError: (error) =>
      showToast('error', errorMessage(error, 'Could not save changes')),
  });
};

type Section = 'dailyLimit' | 'breakReminder' | 'schedule' | 'notifications';

/**
 * Local edit state for one settings screen. Save/Cancel are enabled only when
 * the draft differs from what's saved; switching learner reloads the draft.
 */
export const useControlDraft = <S extends Section>(
  kidId: string | undefined,
  section: S,
  successMessage: string,
) => {
  const { data: controls, isLoading } = useLearningTimeControls(kidId);
  const save = useSaveLearningTimeControls(kidId);
  const saved = controls?.[section] as LearningTimeControls[S] | undefined;
  const savedKey = JSON.stringify(saved ?? null);

  const [draft, setDraft] = useState<LearningTimeControls[S] | undefined>(
    saved,
  );

  useEffect(() => {
    setDraft(saved);
    // savedKey captures saved's content; saved itself changes identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedKey, kidId]);

  const dirty = !!draft && JSON.stringify(draft) !== savedKey;

  const update = (patch: Partial<LearningTimeControls[S]>) =>
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));

  const submit = () => {
    if (!draft || !dirty) return;
    save.mutate({ [section]: draft } as LearningTimeControlsUpdate, {
      onSuccess: () => {
        showToast('success', successMessage);
        router.back();
      },
    });
  };

  return {
    controls,
    draft,
    update,
    dirty,
    isLoading: isLoading || !draft,
    saving: save.isPending,
    submit,
    cancel: () => setDraft(saved),
  };
};

export const useResetLearningTimeControls = (kidId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await resetLearningTimeControls(kidId!),
    onSuccess: (data: LearningTimeControls) => {
      queryClient.setQueryData(learningTimeControlsKey(kidId!), data);
    },
    onError: (error) =>
      showToast('error', errorMessage(error, 'Could not reset controls')),
  });
};
