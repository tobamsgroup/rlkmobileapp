// Play & Learn mission content. Each game model is one reusable engine;
// a chapter only supplies a Mission config. The shape is plain JSON (images
// are URLs) so the backend can serve it on a lesson as-is — local dummy
// configs also accept bundled require() images.

export type MissionImage = string | number;

export type MissionFeedback = {
  correct?: string;
  incorrect?: string;
};

type MissionBase = {
  id: string;
  title: string;
  // Short story or instruction shown above the game
  introduction?: string;
  // Default feedback; an item's own feedback takes priority
  feedback?: MissionFeedback;
  reward?: {
    title?: string;
    message?: string;
  };
  background?: MissionImage;
  // Character art (e.g. Robo) that guides the child through the game
  mascot?: MissionImage;
  // Sound for a correct drop
  correctSound?: 'correct' | 'trashDrop';
};

/* Model 1: Pick & Drop — drag each item into the right container */

export type PickDropCategory = {
  id: string;
  label?: string;
  image?: MissionImage;
  // Emoji shown when there's no image, e.g. "🤖"
  icon?: string;
  // Shown while an item hovers over the container (e.g. an open bin)
  activeImage?: MissionImage;
};

export type PickDropItem = {
  id: string;
  label?: string;
  image?: MissionImage;
  // Emoji shown when there's no image, e.g. "📷"
  icon?: string;
  categoryId: string;
  feedback?: MissionFeedback;
};

export type PickDropMission = MissionBase & {
  model: 'pick_drop';
  // 'scatter': items float around the scene; 'tray': items sit in a grid
  layout?: 'scatter' | 'tray';
  counterLabel?: string;
  categories: PickDropCategory[];
  items: PickDropItem[];
};

/* Model 4: Match the Inventor — drag each answer onto its partner */

export type MatchSide = {
  label: string;
  image?: MissionImage;
  // Emoji shown when there's no image
  icon?: string;
};

export type MatchPair = {
  id: string;
  prompt: MatchSide;
  answer: MatchSide;
  feedback?: MissionFeedback;
};

export type MatchMission = MissionBase & {
  model: 'match';
  pairs: MatchPair[];
};

/* Model 2: Spin the Wheel — each spin lands on a challenge to answer */

export type WheelChallenge = {
  id: string;
  // Short segment name, e.g. "AI at Home"
  label: string;
  image?: MissionImage;
  scenario?: string;
  question: string;
  // Multiple choice; leave out for an open answer in the child's own words
  options?: string[];
  answerIndex?: number;
  feedback?: MissionFeedback;
  // Open answers: an example answer shown after the child replies
  modelAnswer?: string;
};

export type SpinWheelMission = MissionBase & {
  model: 'spin_wheel';
  challenges: WheelChallenge[];
  // How many segments to show, picked at random from challenges (max 10)
  segmentCount?: number;
  // Answers needed to finish; defaults to every segment
  spins?: number;
  // Segment colours, repeated around the wheel
  colors?: string[];
};

/* Model 3: Dream Ladder — put the steps in order, one rung at a time */

export type LadderCard = {
  id: string;
  label: string;
  image?: MissionImage;
};

export type LadderStep = LadderCard & {
  // Shown when the child tries this step too early
  hint?: string;
};

export type DreamLadderMission = MissionBase & {
  model: 'dream_ladder';
  // In the correct order, bottom rung first
  steps: LadderStep[];
  // Cards that don't belong on the ladder at all
  distractors?: (LadderCard & { feedback?: string })[];
  goal?: LadderCard;
};

/* Model 5: Mystery Detective — reveal clues, then solve the case */

export type MysteryCase = {
  id: string;
  title: string;
  mystery: string;
  question: string;
  image?: MissionImage;
  // Emoji shown when there's no image
  icon?: string;
  // Show the image as a dark silhouette until the case is solved
  silhouette?: boolean;
  clues: string[];
  options: { label: string; image?: MissionImage }[];
  answerIndex: number;
  // Explanation shown once the case is solved
  resolution: string;
  feedback?: MissionFeedback;
};

export type MysteryMission = MissionBase & {
  model: 'mystery';
  cases: MysteryCase[];
  // Points for solving after 1, 2, 3... clues
  points?: number[];
};

/* Model 6: Choose Your Adventure — choices change what happens next */

export type AdventureChoice = {
  label: string;
  image?: MissionImage;
  outcome: string;
  // A good decision; counted towards the final outcome
  strong?: boolean;
  // Stage to go to next; defaults to the following stage
  next?: string;
};

export type AdventureStage = {
  id: string;
  title?: string;
  story: string;
  question: string;
  image?: MissionImage;
  // Emoji shown when there's no image
  icon?: string;
  choices: AdventureChoice[];
  // Shown after any choice at this stage
  lesson?: string;
};

export type AdventureMission = MissionBase & {
  model: 'adventure';
  stages: AdventureStage[];
  // Final result by number of strong decisions, highest threshold first
  outcomes?: { minStrong: number; title: string; message?: string }[];
};

export type Mission =
  | PickDropMission
  | MatchMission
  | SpinWheelMission
  | DreamLadderMission
  | MysteryMission
  | AdventureMission;

export type MissionFormat = Mission['model'];

export const MISSION_FORMATS: MissionFormat[] = [
  'pick_drop',
  'spin_wheel',
  'dream_ladder',
  'match',
  'mystery',
  'adventure',
];

type MissionContent<M> = M extends Mission ? Omit<M, 'id' | 'model'> : never;

// A chapter's mission as the backend stores it (PUT /chapters/:id/mission)
export type ChapterMission = {
  format: MissionFormat;
  content: MissionContent<Mission>;
};

/** Turns a chapter's stored mission into the config a game engine renders. */
export const toMission = (
  chapterId: string,
  { format, content }: ChapterMission,
): Mission | null => {
  // A format added after this app version shows as "Coming soon"
  if (!MISSION_FORMATS.includes(format)) return null;
  return { ...content, id: chapterId, model: format } as Mission;
};
