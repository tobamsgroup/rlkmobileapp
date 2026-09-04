import { queryClient } from "@/app/_layout";

export const invalidateQueries = (key:string | string[]) => {
  return queryClient.invalidateQueries({
    queryKey: Array.isArray(key) ? [...key] : [key],
  });
};

/**
 * Progress lives in two caches: `reading-progress` (/kid/reading-progress) and
 * `kid-learning` (/kid/courses/my, backing the home + my-learning cards).
 * A page turn or quiz moves both server-side, so both have to be invalidated.
 */
export const invalidateProgress = () =>
  Promise.all([
    invalidateQueries('reading-progress'),
    invalidateQueries('kid-learning'),
  ]);
