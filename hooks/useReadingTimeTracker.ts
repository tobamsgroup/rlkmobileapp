import { recordReadingTime } from '@/actions/learner-progress';
import { applyUsageUpdate } from '@/hooks/useLearningTimeGuard';
import {
  getLearningTimeScreen,
  subscribeLearningTimeScreen,
} from '@/hooks/useLearningTimeOverlay';
import { localDateKey } from '@/utils/learningTime';
import { useEffect } from 'react';
import { AppState } from 'react-native';

const FLUSH_INTERVAL_MS = 30_000;
// Backend rejects heartbeats above 120 seconds
const MAX_HEARTBEAT_SECONDS = 120;
// Ignore accidental opens shorter than this
const MIN_SECONDS = 5;

/**
 * Sends reading time for the open chapter to /kid/reading-time while the app
 * is in the foreground: every 30s, when the app is backgrounded, and when the
 * chapter changes or the reader closes. Time spent behind a learning time
 * screen (a break, a reminder) isn't counted. Feeds the guardian's reading
 * streak and reading time stats, and the daily learning limit.
 */
const useReadingTimeTracker = (chapterId?: string, enabled = true) => {
  useEffect(() => {
    if (!enabled || !chapterId) return;

    const counting = () =>
      AppState.currentState === 'active' && !getLearningTimeScreen();
    let startedAt: number | null = counting() ? Date.now() : null;

    const flush = () => {
      if (startedAt === null) return;
      const now = Date.now();
      let seconds = Math.round((now - startedAt) / 1000);
      startedAt = now;
      if (seconds < MIN_SECONDS) return;

      const date = localDateKey();
      while (seconds > 0) {
        const chunk = Math.min(seconds, MAX_HEARTBEAT_SECONDS);
        seconds -= chunk;
        recordReadingTime({ chapterId, seconds: chunk, date })
          .then((res) => applyUsageUpdate(res?.usage))
          .catch(() => {
            // Tracking is best-effort; never interrupt reading
          });
      }
    };

    const interval = setInterval(flush, FLUSH_INTERVAL_MS);
    const update = () => {
      if (counting()) {
        startedAt ??= Date.now();
      } else {
        flush();
        startedAt = null;
      }
    };
    const subscription = AppState.addEventListener('change', update);
    const unsubscribeScreen = subscribeLearningTimeScreen(update);

    return () => {
      clearInterval(interval);
      subscription.remove();
      unsubscribeScreen();
      flush();
    };
  }, [chapterId, enabled]);
};

export default useReadingTimeTracker;
