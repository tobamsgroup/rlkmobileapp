import { useEffect } from 'react';

// Learning time only counts while the kid is engaged: a touch, page turn or
// read-aloud within this window. Long enough to read a page without
// touching the screen; any longer and the kid has likely walked away.
export const IDLE_TIMEOUT_MS = 60_000;
const KEEP_ACTIVE_MS = 10_000;

let lastActiveAt = Date.now();

export const markLearningActive = () => {
  lastActiveAt = Date.now();
};

export const isLearningIdle = (now = Date.now()) =>
  now - lastActiveAt > IDLE_TIMEOUT_MS;

/** Keeps the kid "engaged" while something plays without touches (read-aloud). */
export const useKeepLearningActive = (active: boolean) => {
  useEffect(() => {
    if (!active) return;
    markLearningActive();
    const interval = setInterval(markLearningActive, KEEP_ACTIVE_MS);
    return () => {
      clearInterval(interval);
      // Idle countdown starts when playback stops
      markLearningActive();
    };
  }, [active]);
};
