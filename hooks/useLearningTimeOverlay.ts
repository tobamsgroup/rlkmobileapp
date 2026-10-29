import { useSyncExternalStore } from 'react';

/**
 * The full-screen learning time screens a kid can see. Raised from anywhere
 * (entry points, the in-session guard) and shown by `LearningTimeOverlay`,
 * which is mounted once at the root.
 */
export type LearningTimeScreen =
  | { kind: 'not_available' }
  | { kind: 'limit_paused' }
  | { kind: 'limit_reminder' }
  | { kind: 'short_break' }
  | { kind: 'on_break'; endsAt: number }
  | { kind: 'break_complete' };

let current: LearningTimeScreen | null = null;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const set = (screen: LearningTimeScreen | null) => {
  current = screen;
  listeners.forEach((listener) => listener());
};

export const showLearningTimeScreen = (screen: LearningTimeScreen) =>
  set(screen);

export const hideLearningTimeScreen = () => set(null);

export const getLearningTimeScreen = () => current;

// Learning time isn't counted while one of these screens covers the lesson
export const subscribeLearningTimeScreen = subscribe;

const useLearningTimeOverlay = () =>
  useSyncExternalStore(subscribe, getLearningTimeScreen, getLearningTimeScreen);

export default useLearningTimeOverlay;
