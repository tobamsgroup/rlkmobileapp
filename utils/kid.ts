import {
  AssignedChapter,
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

export function calculateChapterProgress({
  currentPLIndex,
  currentPageIndex,
  totalPages,
}: {
  currentPLIndex: number;
  currentPageIndex: number;
  totalPages: number;
}) {
  const cpI = currentPageIndex === 1 ? 0 : currentPLIndex;
  const pageProgress =
    currentPageIndex >= totalPages ? 50 : ((cpI || 0) / totalPages) * 50;

  const plProgress =
    ((currentPLIndex === 1 ? 0 : currentPLIndex || 0) / 8) * 50;

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
  const avgProgress =
    chapterProgresses.reduce((sum, p) => sum + p, 0) /
    chapterProgresses?.length;

  return Number(avgProgress.toFixed(0)) || 0;
};

type XpInfo = {
  currentLevel: number;
  xpToNextLevel: number;
  nextLevelXp: number;
  currentXp: number;
  progressPercent: number;
};

export const calculateXpLevel = (totalXp: number, xpPerLevel = 300): XpInfo => {
  const currentLevel = Math.floor(totalXp / xpPerLevel) + 1;
  const previousLevelXp = (currentLevel - 1) * xpPerLevel;
  const nextLevelXp = currentLevel * xpPerLevel;
  const xpToNextLevel = nextLevelXp - totalXp;

  const progressPercent = ((totalXp - previousLevelXp) / xpPerLevel) * 100;

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

export function buildSegments(page: ChapterPage | null): Segment[] {
  if (!page?.paragraphs?.length) return [];

  const segments: Segment[] = [];

  page.paragraphs.forEach((p, pid) => {
    if (p.header) {
      segments.push({ pid, kind: "header", text: p.header });
    }

    const subCol = p.subColumnHeader ?? p.subHeader;
    if (subCol) {
      segments.push({ pid, kind: "subColumnHeader", text: subCol });
    }

    if (p.content) {
      segments.push({ pid, kind: "content", text: p.content });
    }

    if (p.subContent) {
      segments.push({ pid, kind: "subContent", text: p.subContent });
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
            text: item.content,
          });
        }
      });
    }
  });

  return segments;
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



