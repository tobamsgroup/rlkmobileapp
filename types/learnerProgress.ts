// Guardian learner-progress API (RL4KIDS-BE src/learner-progress).
// In this UI a "book" is a Series (e.g. "Book 1: Our Amazing Planet") and its
// "category" is the Book (e.g. "Think AI").

export type BookStatus = 'not_started' | 'in_progress' | 'completed';

export type ChapterStatus =
  | 'completed'
  | 'in_progress'
  | 'not_started'
  | 'not_assigned'
  // Not assigned, and the learner's plan doesn't allow assigning more
  | 'upgrade_required';

export type ExerciseStatus = ChapterStatus | 'locked';

export type ActivityEventType =
  | 'chapter_completed'
  | 'book_completed'
  | 'quiz'
  | 'workbook_exercise'
  | 'game'
  | 'video_lesson'
  | 'lesson_activity'
  | 'reading'
  | 'login'
  // Learning time controls — tap to expand details
  | 'session_started'
  | 'daily_limit_reached'
  | 'break_reminder';

export interface BookCategory {
  categoryId: string;
  title: string;
}

export interface LearnerBookCard {
  seriesId: string;
  title: string;
  seriesIndex: number;
  image: string | null;
  category: BookCategory;
  accessType: 'full' | 'chapter';
  status: BookStatus;
  progressPercentage: number;
  currentChapter: { chapterId: string; position: number; title: string } | null;
  totalChapters: number;
  assignedChapters: number;
  chaptersCompleted: number;
  timeSpentSeconds: number;
  activities: { completed: number; total: number };
  lastReadAt: string | null;
  completedAt: string | null;
}

// A series the learner has not been assigned yet
export interface SuggestedBook {
  seriesId: string;
  title: string;
  seriesIndex: number;
  image: string | null;
  category: BookCategory;
  totalChapters: number;
  matchesInterest?: boolean;
}

export type RecommendedBook =
  | (LearnerBookCard & { isAssigned: true })
  | (SuggestedBook & { isAssigned: false });

export interface ActivityEvent {
  type: ActivityEventType;
  title: string;
  description: string;
  category: string;
  seriesId: string | null;
  seriesTitle: string;
  chapterId: string | null;
  occurredAt: string;
  meta?: Record<string, unknown>;
}

export interface LearnerSubscription {
  plan: string;
  planName: string;
  status: string | null;
  currentPeriodEnd: string | null;
  freeTrialExpiresAt: string | null;
  learningPaused: boolean;
}

export interface ReadingOverview {
  learner: {
    _id: string;
    name: string;
    username: string;
    age: number | null;
    gender: string | null;
    picture: string;
    learningInterests: string[];
    totalXp: number;
  };
  subscription: LearnerSubscription;
  stats: {
    booksAssigned: number;
    badgesEarned: number;
    // Consecutive days with reading time
    streakDays: number;
    // Consecutive days with any learning activity (reading, quizzes, logins…)
    learningStreakDays: number;
    booksRead: number;
    booksInProgress: number;
    readingTimeSeconds: number;
  };
  currentlyReading: LearnerBookCard | null;
  recommendedNextRead: RecommendedBook | null;
  assignedBooks: { total: number; items: LearnerBookCard[] };
  exploreMore: SuggestedBook[];
  recentActivity: ActivityEvent[];
}

export interface AssignedBooksQuery {
  search?: string;
  status?: BookStatus;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface AssignedBooksResponse {
  counts: {
    all: number;
    notStarted: number;
    inProgress: number;
    completed: number;
  };
  categories: BookCategory[];
  items: LearnerBookCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChapterProgress {
  chapterId: string;
  position: number;
  title: string;
  status: ChapterStatus;
  isAssigned: boolean;
  currentPage: number;
  totalPages: number;
  progressPercentage: number;
  timeSpentSeconds: number;
  completedAt: string | null;
}

export interface WorkbookExercise {
  chapterId: string;
  position: number;
  title: string;
  pageStart: number;
  pageEnd: number;
  status: ExerciseStatus;
  isUnlocked: boolean;
}

export interface BookProgressResponse {
  book: LearnerBookCard;
  subscription: LearnerSubscription;
  stats: {
    chaptersCompleted: number;
    totalChapters: number;
    timeSpentSeconds: number;
    workbookExercises: { completed: number; total: number };
    activities: { completed: number; total: number };
  };
  chapters: ChapterProgress[];
  exercises: {
    available: boolean;
    workbookId: string | null;
    workbookName: string | null;
    total: number;
    unlocked: number;
    completed: number;
    items: WorkbookExercise[];
  };
  activityHistory: ActivityEvent[];
}
