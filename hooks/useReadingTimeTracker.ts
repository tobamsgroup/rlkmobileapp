import { recordReadingTime } from '@/actions/learner-progress';
import {
  isLearningIdle,
  markLearningActive,
} from '@/hooks/useLearningActivity';
import { applyUsageUpdate } from '@/hooks/useLearningTimeGuard';
import { getLearningTimeScreen } from '@/hooks/useLearningTimeOverlay';
import { localDateKey } from '@/utils/learningTime';
import { useEffect } from 'react';
import { AppState } from 'react-native';

const TICK_MS = 5_000;
const FLUSH_INTERVAL_MS = 30_000;
// Backend rejects heartbeats above 120 seconds
const MAX_HEARTBEAT_SECONDS = 120;
// Ignore accidental opens shorter than this
const MIN_SECONDS = 5;

/**
 * Sends learning time for the open chapter to /kid/reading-time: every 30s,
 * when the app is backgrounded, and when the chapter changes or the screen
 * closes. Only engaged time counts — not time in the background, behind a
 * learning time screen (a break, a reminder), or idle (see
 * useLearningActivity). Feeds the guardian's reading streak and reading time
 * stats, and the daily learning limit.
 */
const useReadingTimeTracker = (chapterId?: string, enabled = true) => {
  useEffect(() => {
    if (!enabled || !chapterId) return;

    // Opening the screen is itself an interaction
    markLearningActive();
    let pendingSeconds = 0;
    let last = Date.now();

    const tick = () => {
      const now = Date.now();
      // Timers stop in the background, so never credit more than ~one tick
      const elapsed = Math.min(now - last, TICK_MS * 2);
      last = now;
      if (
        AppState.currentState === 'active' &&
        !getLearningTimeScreen() &&
        !isLearningIdle(now)
      ) {
        pendingSeconds += elapsed / 1000;
      }
    };

    const flush = () => {
      tick();
      let seconds = Math.round(pendingSeconds);
      if (seconds < MIN_SECONDS) return;
      pendingSeconds = 0;

      const date = localDateKey();
      while (seconds > 0) {
        const chunk = Math.min(seconds, MAX_HEARTBEAT_SECONDS);
        seconds -= chunk;
        recordReadingTime({ chapterId, seconds: chunk, date })
          .then((res) => applyUsageUpdate(res?.usage))
          .catch(() => {
            // Tracking is best-effort; never interrupt learning
          });
      }
    };

    const tickInterval = setInterval(tick, TICK_MS);
    const flushInterval = setInterval(flush, FLUSH_INTERVAL_MS);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        last = Date.now();
        markLearningActive();
      } else {
        flush();
      }
    });

    return () => {
      clearInterval(tickInterval);
      clearInterval(flushInterval);
      subscription.remove();
      flush();
    };
  }, [chapterId, enabled]);
};

export default useReadingTimeTracker;
