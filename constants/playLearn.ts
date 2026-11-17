// Play & Learn content for chapters whose content isn't on the backend yet.
// Every chapter follows the same 8 steps; only the introduction video and
// the mission challenge differ. Once a chapter has `introVideoUrl` or
// `mission` on the backend (PUT /chapters/:id/mission), that wins and the
// entry here can be deleted.

import { Chapter } from '@/types';
import { Mission, toMission } from '@/types/mission';
import { DREAM_LADDER, MATCH_THE_INVENTOR, RECYCLE_HERO } from './missions';

const ECO_EXPLORER_VIDEO =
  'https://recycled-learning-test.s3.eu-north-1.amazonaws.com/67cc66426ebf092e6728f7d4/video/2ce7ab0e-e6d4-4f98-ab63-66d8374d8f91/RLK+ECO+EXPLORER.mp4';
const FUTURE_ENTREPRENEUR_VIDEO =
  'https://recycled-learning-test.s3.eu-north-1.amazonaws.com/67cc66426ebf092e6728f7d4/video/18413afa-e9c6-4960-9f29-f89404d2b3ae/FUTURE+ENTREPENEUR.mov';

type PlayLearnContent = {
  introVideoUrl?: string;
  mission?: Mission;
};

// Keyed by chapter id
const LOCAL_PLAY_LEARN: Record<string, PlayLearnContent> = {
  // Think Sustainability · Eco Explorers · What Is Eco Exploring?
  '6836c8b01607a7982ff81eb4': {
    introVideoUrl: ECO_EXPLORER_VIDEO,
    mission: RECYCLE_HERO,
  },
  // Think Leadership · Big Ideas, Big Dreams · Dreaming Big
  '6836c8b91607a7982ff81fe6': {
    // Placeholder: this chapter reuses the Eco Explorer video
    introVideoUrl: ECO_EXPLORER_VIDEO,
    mission: DREAM_LADDER,
  },
  // Think Entrepreneurship · Spark Your Ideas · The Power of Ideas
  '6836c8bf1607a7982ff82061': {
    introVideoUrl: FUTURE_ENTREPRENEUR_VIDEO,
    mission: MATCH_THE_INVENTOR,
  },
};

/** A chapter's intro video and mission: backend first, then the dummy content. */
export function getPlayLearnContent(
  chapter: Pick<Chapter, '_id' | 'introVideoUrl' | 'mission'> | undefined,
): PlayLearnContent {
  if (!chapter) return {};
  const local = LOCAL_PLAY_LEARN[chapter._id];
  return {
    introVideoUrl: chapter.introVideoUrl || local?.introVideoUrl,
    mission: chapter.mission
      ? (toMission(chapter._id, chapter.mission) ?? undefined)
      : local?.mission,
  };
}
