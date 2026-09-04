import {
  AssignedChapter,
  AudioMark,
  ChapterPage,
  KidLearningOverview,
  PageParagraph,
  ReadingProgressProps,
} from '@/types';
import { router } from 'expo-router';

type ChapterProps = AssignedChapter & {
  bookImage: string;
  seriesTitle: string;
  bookId: string;
};

export function getTopTwoChapters(data: KidLearningOverview[]): ChapterProps[] {
  const inProgress: ChapterProps[] = [];
  const startedOrCompleted: ChapterProps[] = [];
  const allChapters: ChapterProps[] = [];

  for (const entry of data) {
    const bookImage = entry?.bookId?.image;
    if(!entry?.assignedChapters) continue

    for (const chapter of entry?.assignedChapters) {
      const seriesId = chapter?.chapterId?.seriesId;
      if (!seriesId) continue;

      const matchedSeries = entry.assignedSeries.find(
        (s) => s.seriesId._id === seriesId,
      );

      const formattedChapter: ChapterProps = {
        ...chapter,
        bookImage,
        seriesTitle: matchedSeries?.seriesId.title || '',
        bookId: entry.bookId._id,
      };

      allChapters.push(formattedChapter);

      const progress = Number(
        calculateChapterProgress({
          currentPLIndex: chapter?.currentPLIndex,
          currentPageIndex: chapter.currentPageIndex,
          totalPages: chapter?.chapterId?.pages?.length,
        }) || 0,
      );

      if (progress > 0 && progress < 100) {
        inProgress.push(formattedChapter);
      }

      if (progress > 0) {
        startedOrCompleted.push(formattedChapter);
      }
    }
  }

  let source: ChapterProps[] = [];

  if (inProgress.length > 0) {
    source = inProgress;
  } else if (startedOrCompleted.length > 0) {
    source = startedOrCompleted;
  } else {
    source = allChapters; // final fallback
  }

  return source.sort((a, b) => b.progress - a.progress).slice(0, 2);
}

// How much of a chapter each mode is worth. Play & Learn is not released yet
// (Playground shows a "Coming Soon" modal instead of switching), so reading a
// chapter has to count for the whole chapter - otherwise progress caps at 50%.
// Set READ_WEIGHT back to 50 when Play & Learn ships.
export const READ_WEIGHT = 100;
export const PLAY_WEIGHT = 100 - READ_WEIGHT;

export function calculateChapterProgress({
  currentPLIndex,
  currentPageIndex,
  totalPages,
}: {
  currentPLIndex: number;
  currentPageIndex: number;
  totalPages: number;
}) {
  if (!totalPages) return '0';

  // currentPageIndex is the 1-based page the kid is sitting on, so landing on
  // page 1 means nothing has been read yet. Reaching the last page counts the
  // chapter as fully read.
  const pagesRead =
    currentPageIndex >= totalPages
      ? totalPages
      : Math.max((currentPageIndex || 0) - 1, 0);

  const pageProgress = (pagesRead / totalPages) * READ_WEIGHT;

  const plProgress =
    ((currentPLIndex === 1 ? 0 : currentPLIndex || 0) / 8) * PLAY_WEIGHT;

  const total = Math.min(pageProgress + plProgress, 100);

  return total.toFixed(0);
}

export const getPLProgress = (
  currentBookProgress: ReadingProgressProps,
  chapterId: string,
) => {
  if (!chapterId || !currentBookProgress) return null;

  const targetChapter = currentBookProgress?.chapters?.find(
    (c) => c.chapterId === chapterId,
  );

  return targetChapter?.currentPLIndex;
};

export const filterAssignedChapters = (
  allSeriesPage: {
    _id: string;
    chapterTitle: string;
    chapterIndex: number;
    pages: ChapterPage[];
  }[],
  assignedChapters: ReadingProgressProps,
) => {
  const assignedChapterIds = new Set(
    assignedChapters?.chapters?.map((c) => c.chapterId),
  );
  return (
    allSeriesPage?.filter((chapter) => assignedChapterIds.has(chapter._id)) ||
    []
  );
};

export const getSeriesProgress = (
  seriesId: string,
  assignedChapters: AssignedChapter[],
) => {
  const targetChapters = assignedChapters?.filter(
    (c) => c?.chapterId?.seriesId === seriesId,
  );
  const chapterProgresses = targetChapters.map((chapter) =>
    Number(
      calculateChapterProgress({
        currentPageIndex: chapter?.currentPageIndex,
        currentPLIndex: chapter?.currentPLIndex,
        totalPages: chapter?.chapterId?.pages?.length,
      }),
    ),
  );
  if (!chapterProgresses.length) return 0;

  const avgProgress =
    chapterProgresses.reduce((sum, p) => sum + p, 0) /
    chapterProgresses?.length;

  return Number(avgProgress.toFixed(0)) || 0;
};

/**
 * Series progress straight off /kid/reading-progress. Preferred over
 * getSeriesProgress inside the Playground: that endpoint is refetched after
 * every page turn / quiz and carries totalPages explicitly, whereas the
 * kid-learning payload is only as fresh as its last refetch and relies on
 * chapterId.pages being populated.
 */
export const getSeriesReadingProgress = (
  seriesId: string,
  readingProgress: ReadingProgressProps[] | undefined,
) => {
  const targetSeries = readingProgress?.find((r) => r.seriesId === seriesId);
  const chapters = targetSeries?.chapters || [];
  if (!chapters.length) return 0;

  const chapterProgresses = chapters.map((chapter) =>
    Number(
      calculateChapterProgress({
        currentPageIndex: chapter?.currentPageIndex,
        currentPLIndex: chapter?.currentPLIndex,
        totalPages: chapter?.totalPages,
      }),
    ),
  );

  const avgProgress =
    chapterProgresses.reduce((sum, p) => sum + p, 0) / chapterProgresses.length;

  return Number(avgProgress.toFixed(0)) || 0;
};

type XpInfo = {
  currentLevel: number;
  xpToNextLevel: number;
  nextLevelXp: number;
  currentXp: number;
  progressPercent: number;
};

const XP_THRESHOLDS = [0, 100, 250, 400, 600, 850, 1100, 1400, 1750, 2200];

export const calculateXpLevel = (totalXp: number): XpInfo => {
  let currentLevel = 1;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_THRESHOLDS[i]) {
      currentLevel = i + 1;
      break;
    }
  }

  const isMaxLevel = currentLevel >= XP_THRESHOLDS.length;
  const previousLevelXp = XP_THRESHOLDS[currentLevel - 1];
  const nextLevelXp = isMaxLevel ? XP_THRESHOLDS[XP_THRESHOLDS.length - 1] : XP_THRESHOLDS[currentLevel];
  const xpToNextLevel = isMaxLevel ? 0 : nextLevelXp - totalXp;
  const xpInLevel = nextLevelXp - previousLevelXp;
  const progressPercent = isMaxLevel ? 100 : ((totalXp - previousLevelXp) / xpInLevel) * 100;

  return {
    currentLevel,
    xpToNextLevel,
    nextLevelXp,
    currentXp: totalXp,
    progressPercent: Math.min(progressPercent, 100),
  };
};

export type SeriesOverview = {
  seriesIndex: number;
  seriesTitle: string;
  bookTitle: string;
  progressPercentage: number;
  completedAssignments: number;
  totalAssignments: number;
};

export function getFormattedSeriesOverview(
  data: KidLearningOverview[],
): SeriesOverview[] {
  return data.flatMap((entry) => {
    const completedAssignments = entry.completedAssignments?.length || 0;
    const totalAssignments = entry.assignedChapters?.length || 0;
    const progressPercentage = entry.progressPercentage ?? 0;

    return entry.assignedSeries.map((series) => ({
      seriesIndex: series.seriesId.index,
      seriesTitle: series.seriesId.title,
      bookTitle: entry.bookId.title,
      progressPercentage,
      completedAssignments,
      totalAssignments,
    }));
  });
}


export type SegmentKind =
  | "title"
  | "header"
  | "subColumnHeader"
  | "content"
  | "subContent"
  | "list-title"
  | "list-content";

export type Segment = {
  pid: number;
  kind: SegmentKind;
  listIndex?: number;
  text: string;
};

/**
 * Collapses runs of newlines. Must be applied when BUILDING segments as well as
 * when rendering them: the karaoke charIndex is an offset into the segment text,
 * so if the renderer normalizes and the segment does not, every collapsed
 * newline shifts the highlight one word further behind the audio.
 */
export function normalizeNewlines(text: string): string {
  if (!text) return '';
  return text.replace(/\n+/g, '\n');
}

export function buildSegments(page: ChapterPage | null): Segment[] {
  if (!page?.paragraphs?.length) return [];

  const segments: Segment[] = [];

  // The backend narrates the page title first (assemblePageText /
  // buildNarrationSegments). Omitting it here offset every mark on the page by
  // however long the title takes to read.
  if (page.title) segments.push({ pid: -1, kind: "title", text: page.title });

  page.paragraphs.forEach((p, pid) => {
    if (p.header) {
      segments.push({ pid, kind: "header", text: p.header });
    }

    const subCol = p.subColumnHeader ?? p.subHeader;
    if (subCol) {
      segments.push({ pid, kind: "subColumnHeader", text: subCol });
    }

    if (p.content) {
      segments.push({ pid, kind: "content", text: normalizeNewlines(p.content) });
    }

    if (p.subContent) {
      segments.push({
        pid,
        kind: "subContent",
        text: normalizeNewlines(p.subContent),
      });
    }

    if (Array.isArray(p.list) && p.list.length) {
      p.list.forEach((item, li) => {
        if (item?.title) {
          segments.push({
            pid,
            kind: "list-title",
            listIndex: li,
            text: item.title,
          });
        }
        if (item?.content) {
          segments.push({
            pid,
            kind: "list-content",
            listIndex: li,
            text: normalizeNewlines(item.content),
          });
        }
      });
    }
  });

  return segments;
}

/**
 * Karaoke timing model.
 *
 * The TTS endpoint returns a bare audioUrl with no speech marks, so the only
 * signal available is `currentTime / duration`. Mapping that ratio linearly
 * over character count assumes a constant speaking rate, which TTS does not
 * have: it inserts real silence at sentence ends, clauses and paragraph
 * breaks. Those pauses burn audio time while consuming zero characters, so a
 * flat mapping drifts back and forth across a page.
 *
 * Instead each character gets a cost of 1 and every pause-inducing boundary
 * gets a cost equal to the characters that could have been spoken during it.
 * CHARS_PER_SECOND matches the estimate already used by createManualKaraoke.
 */
const CHARS_PER_SECOND = 15;

const PAUSE_COST = {
  sentence: 0.4 * CHARS_PER_SECOND, // . ! ?
  clause: 0.18 * CHARS_PER_SECOND, // , ; :
  newline: 0.3 * CHARS_PER_SECOND,
  segment: 0.5 * CHARS_PER_SECOND, // gap between two segments
};

export type KaraokeTimeline = {
  /** Cumulative cost at the start of each character slot. */
  cumulative: Float64Array;
  /** Which segment owns each slot. */
  segmentOf: Int32Array;
  /** Offset of the slot within its own segment. */
  charOf: Int32Array;
  total: number;
};

export function buildKaraokeTimeline(
  segments: Segment[],
): KaraokeTimeline | null {
  const slots = segments.reduce((n, seg) => n + seg.text.length, 0);
  if (!slots) return null;

  const cumulative = new Float64Array(slots);
  const segmentOf = new Int32Array(slots);
  const charOf = new Int32Array(slots);

  let cost = 0;
  let k = 0;

  segments.forEach((seg, si) => {
    const { text } = seg;
    for (let c = 0; c < text.length; c++) {
      cumulative[k] = cost;
      segmentOf[k] = si;
      charOf[k] = c;
      k++;

      cost += 1;
      const ch = text[c];
      if (ch === '.' || ch === '!' || ch === '?') cost += PAUSE_COST.sentence;
      else if (ch === ',' || ch === ';' || ch === ':') cost += PAUSE_COST.clause;
      else if (ch === '\n') cost += PAUSE_COST.newline;
    }
    if (si < segments.length - 1) cost += PAUSE_COST.segment;
  });

  return { cumulative, segmentOf, charOf, total: cost };
}

/**
 * Maps a 0-1 playback ratio onto a segment + character offset. Binary search,
 * so it is cheap enough to run on every animation tick.
 */
export function resolveKaraokePosition(
  timeline: KaraokeTimeline,
  ratio: number,
): { segIndex: number; charIndex: number } {
  const target = Math.max(0, Math.min(ratio, 1)) * timeline.total;

  let lo = 0;
  let hi = timeline.cumulative.length - 1;
  let best = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (timeline.cumulative[mid] <= target) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return { segIndex: timeline.segmentOf[best], charIndex: timeline.charOf[best] };
}

/**
 * Exact position from real TTS timepoints. Returns the last mark at or before
 * `currentTime`, so the highlight lands on the word actually being spoken
 * rather than on an estimate. Preferred over resolveKaraokePosition whenever
 * the endpoint returned marks.
 */
export function resolveMarkPosition(
  marks: AudioMark[],
  currentTime: number,
): { segIndex: number; charIndex: number } | null {
  if (!marks.length) return null;
  if (currentTime < marks[0].time) {
    return { segIndex: marks[0].segIndex, charIndex: marks[0].charIndex };
  }

  let lo = 0;
  let hi = marks.length - 1;
  let best = 0;

  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (marks[mid].time <= currentTime) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return { segIndex: marks[best].segIndex, charIndex: marks[best].charIndex };
}

/** Start of the whitespace-delimited word containing `index`. */
export function wordStartAt(text: string, index: number): number {
  let start = Math.max(0, Math.min(index, text.length));
  while (start > 0 && !/\s/.test(text[start - 1])) start--;
  return start;
}

export const createManualKaraoke = (
  text: string,
  rate: number,
  onCharIndexUpdate: (index: number) => void
) => {
  let intervalRef: NodeJS.Timeout | null = null;
  let boundaryFiredRef = false;
  let startTimeRef = 0;
  let pausedTimeRef = 0;
  let totalPausedDurationRef = 0;
  let isPausedRef = false;

  const estimateWordTiming = (text: string, rate: number) => {
    const words = text.split(/\s+/);
    const avgCharsPerSecond = 15 * rate;
    let charPosition = 0;

    return words.map((word) => {
      const start = charPosition;
      charPosition += word.length + 1;
      const duration = (word.length / avgCharsPerSecond) * 1000;
      return { start, duration };
    });
  };

  return {
    startManualTiming: () => {
      if (boundaryFiredRef) return;

      const timings = estimateWordTiming(text, rate);
      let currentIndex = 0;
      startTimeRef = Date.now();
      totalPausedDurationRef = 0;
      isPausedRef = false;

      intervalRef = setInterval(() => {
        if (boundaryFiredRef) {
          if (intervalRef) {
            clearInterval(intervalRef);
            intervalRef = null;
          }
          return;
        }

        // Skip timing updates when paused
        if (isPausedRef) {
          return;
        }

        const elapsed = Date.now() - startTimeRef - totalPausedDurationRef;
        let cumulativeDuration = 0;

        for (let i = 0; i < timings.length; i++) {
          cumulativeDuration += timings[i].duration;
          if (elapsed < cumulativeDuration) {
            if (i !== currentIndex) {
              currentIndex = i;
              onCharIndexUpdate(timings[i].start);
            }
            break;
          }
        }
      }, 50);
    },

    pauseManualTiming: () => {
      if (!isPausedRef && intervalRef) {
        isPausedRef = true;
        pausedTimeRef = Date.now();
      }
    },

    resumeManualTiming: () => {
      if (isPausedRef) {
        const pauseDuration = Date.now() - pausedTimeRef;
        totalPausedDurationRef += pauseDuration;
        isPausedRef = false;
      }
    },

    stopManualTiming: () => {
      if (intervalRef) {
        clearInterval(intervalRef);
        intervalRef = null;
      }
      isPausedRef = false;
      totalPausedDurationRef = 0;
    },

    notifyBoundaryFired: () => {
      boundaryFiredRef = true;
      if (intervalRef) {
        clearInterval(intervalRef);
        intervalRef = null;
      }
    },

    resetBoundaryFlag: () => {
      boundaryFiredRef = false;
    },
  };
};

type ParamEntry = [string, string | undefined];

export const handleParams = (params: ParamEntry[]) => {
  const query = Object.fromEntries(
    params.filter(([, value]) => value !== undefined)
  ) as Record<string, string>;

  router.setParams(query);
}

type Page = {
  index: number | string;
  title?: string;
  paragraphs?: PageParagraph[];
  chapterTitle?: string;
};

type Chapter = {
  _id: string;
  chapterTitle: string;
  chapterIndex: number;
  pages: Page[];
};

type Lessons = {
  assignments?: [];
  chapterId?: string;
  createdAt?: string;
  durationMinutes?: number;
  index: string | number;
  title?: string;
  updatedAt?: string;
  _id?: string;
};

type Activity = {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  seriesId: string;
  lessons: Lessons[];
  index: number;
};

export function addExtraPagesToChapters(chapters: Chapter[]): Chapter[] {
  return chapters.map((chapter) => {
    if (chapter?.pages?.length < 1) {
      return chapter;
    }
    const pages = [...(chapter?.pages ? chapter?.pages : [])];
    const totalLength = pages?.length || 0

    const medianIndex = Math.floor(totalLength / 2);

    const midQuizPage: Page = {
      index: "mid",
      chapterTitle: "Mid Chapter Quiz",
    };
    const endQuizPage: Page = {
      index: "end",
      chapterTitle: "Test Your Knowledge",
    };

    if (totalLength > 0) {
      pages.splice(medianIndex, 0, midQuizPage);
    } else {
      pages.push(midQuizPage);
    }

    pages.push(endQuizPage);

    return { ...chapter, pages };
  });
}

export function formatActivityPages(activity: Activity[]): Activity[] {
  return activity.map((act) => {
    if (!act?.lessons?.[0]?._id) return { ...act, lessons: [] };
    const structuredLessons: Lessons[] = [
      { _id: act?.lessons?.[0]?._id, index: 1, title: "Introduction" },
      { _id: "learn", index: "learn", title: "Learning Module" },
      {
        _id: "mid",
        index: "mid",
        title: "Mid-Chapter Checkpoint",
      },
      {
        _id: "scenario",
        index: "scenario",
        title: "Scenario-Based Application",
      },
      {
        _id: "journal",
        index: "journal",
        title: "Reflective Journal",
      },
      { _id: act?.lessons?.[3]?._id, index: 5, title: "Mission Challenge" },
      { _id: "end", index: "end", title: "Mastery Quiz" },
      { _id: "rewards", index: "rewards", title: "Rewards" },
    ];

    return { ...act, lessons: structuredLessons };
  });
}

export const getPlayProgress = (page: string) => {
  switch (page) {
    case "mid":
      return 3;
    case "end":
      return 7;
    case "journal":
      return 5;
    case "learn":
      return 2;
    case "scenario":
      return 4;
    case "rewards":
      return 8;
    case "1":
      return 1;
    case "5":
      return 6;
    default:
      return 0;
  }
};

export function addExtraPagesToActivity(activity: Activity[]): Activity[] {
  return activity.map((act) => {
    if (act?.lessons?.length < 1) {
      return act;
    }
    const lessons = [...act.lessons];
    const totalLength = lessons.length;

    const medianIndex = Math.floor(totalLength / 2);

    const midQuizPage: Lessons = {
      index: "mid",
      title: "Mid Chapter Quiz",
    };
    const endQuizPage: Lessons = {
      index: "end",
      title: "Test Your Knowledge",
    };

    if (totalLength > 0) {
      lessons.splice(medianIndex, 0, midQuizPage);
    } else {
      lessons.push(midQuizPage);
    }

    lessons.push(endQuizPage);

    return { ...act, lessons };
  });
}

export type Scenario = {
  quizType: "mid" | "end";
  title: string;
  desc: string;
  grade: "perfect" | "above_average" | "low";
  retry: boolean;
};

export const SCENARIOS: Scenario[] = [
  {
    quizType: "mid",
    title: "Perfect Run",
    desc: "Amazing, you nailed every question on the first try!",
    grade: "perfect",
    retry: false,
  },
  {
    quizType: "mid",
    title: "Good Job",
    desc: "Nice work! You did really well",
    grade: "above_average",
    retry: false,
  },
  {
    quizType: "mid",
    title: "You Did It",
    desc: "You kept trying and got them all right. that’s real learning power. Keep it up!",
    grade: "perfect",
    retry: true,
  },
  {
    quizType: "mid",
    title: "Good Try",
    desc: "Nice effort! Try more next time to boost your score.",
    grade: "low",
    retry: true,
  },
  {
    quizType: "end",
    title: "Mastery Unlocked",
    desc: "Outstanding! You got a perfect score on your first try!",
    grade: "perfect",
    retry: false,
  },
  {
    quizType: "end",
    title: "Good Job",
    desc: "Excellent performance! You’ve shown strong understanding of this chapter.",
    grade: "above_average",
    retry: false,
  },
  {
    quizType: "end",
    title: "Great Job",
    desc: "You worked hard and mastered this chapter, well done!",
    grade: "perfect",
    retry: true,
  },
  {
    quizType: "end",
    title: "Keep Going",
    desc: "You made progress, but you can do even more. Keep moving.",
    grade: "low",
    retry: false,
  },
];

export const getScenario = (
  score: number,
  totalScore: number,
  retry: boolean,
  quizType: "mid" | "end"
) => {
  const percent = (score / totalScore) * 100;

  const grade =
    percent >= 100 ? "perfect" : percent >= 70 ? "above_average" : "low";

  const scenario =
    SCENARIOS.find(
      (s) => s.quizType === quizType && s.grade === grade && s.retry === retry
    ) || SCENARIOS.find((s) => s.quizType === quizType && s.grade === "low")!;

  return scenario;
};

export function checkDailyLoginStatus(lastLogin: string | null) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const storedDate = localStorage.getItem("daily_xp_claimed_date");

  // If user already claimed today
  if (storedDate === todayString) {
    return { canClaim: false, alreadyClaimed: true, isNewDay: false };
  }

  // Check if lastLogin is from a previous day
  const lastLoginDate = lastLogin ? new Date(lastLogin) : null;
  const lastLoginString = lastLoginDate
    ? lastLoginDate.toISOString().split("T")[0]
    : null;

  const isNewDay = !lastLoginString || lastLoginString < todayString;

  return {
    canClaim: isNewDay || storedDate !== todayString,
    alreadyClaimed: false,
    isNewDay,
  };
}

export function markDailyXpClaimed() {
  const todayString = new Date().toISOString().split("T")[0];
  localStorage.setItem("daily_xp_claimed_date", todayString);
}

export const saveToLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const retrieveFromLocalStorage = (key: string) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export const pageMap: any = {
  "1": 1,
  learn: 2,
  mid: 3,
  scenario: 4,
  journal: 5,
  "5": 6,
  end: 7,
  rewards: 8,
};
//we'll use localstorage for now, we'll implement with BE later
export const isPlayandLearnPageAccessible = (
  currentBookProgress: ReadingProgressProps,
  page: string,
  chapterId: string
) => {
  if (!chapterId || !currentBookProgress)
    return {
      currentPageIndex: 0,
      isAccessible: false,
      completedIndex: 0,
    };

  const targetChapter = currentBookProgress?.chapters?.find(
    (c) => c.chapterId === chapterId
  );

  if (!targetChapter)
    return {
      currentPageIndex: 0,
      isAccessible: false,
      completedIndex: 0,
    };
  const currentPageIndex = targetChapter.currentPLIndex;

  const targetIndex = pageMap?.[page];

  if (Number(currentPageIndex >= Number(targetIndex))) {
    return {
      currentPageIndex: targetIndex,
      isAccessible: true,
      completedIndex: Math.max(currentPageIndex - 1, 0),
    };
  }

  return {
    currentPageIndex: targetIndex,
    isAccessible: false,
    completedIndex: Math.max(currentPageIndex - 1, 0),
  };
};

export const isPageAccessible = (
  currentBookProgress: ReadingProgressProps,
  chapterId: string,
  index: number | string,
  chapterLength: number
) => {
  if (!chapterId || !currentBookProgress) return null;

  const targetChapter = currentBookProgress?.chapters?.find(
    (c) => c.chapterId === chapterId
  );

  if (!targetChapter) return null;

  const currentPageIndex = targetChapter.currentPageIndex;
  // console.log("currentPageIndex", currentPageIndex)
  // console.log("chapterLength", chapterLength)
  let isAccessible = false;

  // if (typeof index === "string") {
  //   if (index === "mid") {
  //     const halfwayPoint = Math.floor(chapterLength / 2);
  //     // Allow access if user reached at least halfway or completed the chapter
  //     isAccessible =
  //       currentPageIndex >= halfwayPoint || currentPageIndex === chapterLength;
  //   }

  //   if (index === "end") {
  //     // Allow access only if user reached the end of the chapter
  //     isAccessible = currentPageIndex + 2 === chapterLength;
  //   }
  // }

  if (typeof index === "number") {
    // Allow access if user reached this page or finished the chapter
    isAccessible =
      currentPageIndex >= index || currentPageIndex === chapterLength;
  }

  return {
    currentPageIndex,
    isAccessible,
  };
};



