
export enum Role {
  TEACHER = "Teacher",
  PARENT = "Parent",
  KID = "Kid",
}

export type GuardianLoginSession = {
  _id: string;
  password: string;
  role: Role;
  kidIds: string[];
  email: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  firstName?: string;
  lastName?: string;
};

export type GuardianProfileProps = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  picture: string;
  isVerified: true;
  totalKids: number;
  activeTrackCount: number;
  createdAt: string;
};

export type KidLoginSession = {
  _id: string;
  password: string;
  role: Role;
  kidIds: string[];
  name: string;
  username: string;
  picture: string;
  age: number;
  preferredLearningTopics: string;
  createdAt: string;
  updatedAt: string;
  guardianId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};


export type  IAvatar = {
  id: string;
  url: string;
}

export type Iconprops = {
  color?: string;
  className?: string;
  onClick?: () => void;
  stroke?: string;
  strokeWidth?: string;
  width?: number;
  height?: number;
  feColorMatrix?: string;
  fillOpacity?: string;
  gradientStart?: string;
  gradientStop?: string;
};

export interface IGuardianKids {
  age: number;
  createdAt: string;
  guardianId: string;
  name: string;
  picture: string;
  preferredLearningTopics: string[];
  role: string;
  updatedAt: string;
  username: string;
  _id: string;
}

export type BookMeta = {
  _id: string;
  title: string;
  image: string;
  volumes: string[];
  __v: number;
};

export type Chapters = {
  _id: string;
  title: string;
  description: string;
  volumeId: string;
  index: number;
};

export type VolumeStat = {
  _id: string;
  seriesId: BookMeta | string;
  title: string;
  description: string;
  image: string;
  overview: {
    catchPhrase?: string;
    description?: string;
  };
  index: number;
  assignedCount: number;
  book?: BookMeta;
  bookId?: BookMeta;
  chapters: Chapters[];
};

export type VolumeAssignmentStatsResponse = {
  totalVolumes: number;
  assignedVolumes: number;
  volumeStats: VolumeStat[];
};

export type AssignedCoursesProp = {
  seriesId: string;
  title: string;
  index: number;
  book: string;
  progress: number;
  assignmentStatus: {
    completed: number;
    total: number;
  };
};

export type ActvityService = {
  activities: {
    activity: string;
    createdAt: string;
    timestamp: string;
    title: string;
    type: string;
    updatedAt: string;
    userId: string;
    _id: string;
  }[];
  total: number;
};

export type LearningOverviewResponse = {
  kid: {
    username: string;
    name: string;
    age: number;
    picture: string;
    id: string;
  };
  thisWeek: {
    lastLogin: string | null;
    lessonsCompleted: number;
    assignmentsPassed: string;
    totalTimeSpent: string;
  };
  assignedCourses: AssignedCoursesProp[];
  activityService: ActvityService;
};

export type NotificationType =
  | "feedback_received"
  | "new_message"
  | "assignment_due"
  | "course_completed";

export type NotificationMetadata = {
  achievementId?: string;
  points?: number;
  [key: string]: any;
};

export type NotificationProp = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: NotificationType;
  metadata: NotificationMetadata;
  createdAt: string;
  updatedAt: string;
};

export type ActivityProps = {
  _id?: string;
  userId: string;
  type: string;
  title: string;
  activity?: string;
  category: string;
  timestamp: string;
};

// export interface IKidModuleAssignment {
//   status: string;
//   chapterAssign: string;
//   progress: number;
// };

// export interface IKidTrack {
//   kid: IGuardianKids;
//   assignType: string;
//   moduleAssignments: IKidModuleAssignment[];
// };

// export interface ISeries {
//   _id: string;
//   bookTitle: string;
//   bookCover: string;
//   seriesNo: number;
//   courseId: {
//     _id: string;
//     courseTitle: string;
//     category: string;
//     cover: string;
//   };
// };

// export interface IKidsTrackSummary {
//   // series: ISeries;
//   kids: IKidTrack[];
//   seriesId: string;
// };

export interface KidLearningOverview {
  _id: string;
  kidId: string;
  guardianId: string;
  bookId: Book;
  assignedSeries: AssignedSeries[];
  assignedChapters: AssignedChapter[];
  assignmentsCompleted: number;
  totalLearningHours: number;
  progressPercentage: number;
  status: "not started" | "in progress" | "completed"; // add more if needed
  completedAt: string | null;
  completedAssignments: any[]; // update type if you have assignment details
  badgesUnlocked: any[]; // update type if you have badge details
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  _id: string;
  title: string;
  image: string;
  series: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignedSeries {
  progress: number;
  status: "not started" | "in progress" | "completed"; // adjust if needed
  completedAt: string | null;
  seriesId: Series;
  assignedAt: string;
}

export interface Series {
  _id: string;
  title: string;
  description: string;
  image: string;
  index: number;
  bookId: string;
  chapters: Chapter[];
  createdAt: string;
  updatedAt: string;
  overview: {
    catchPhrase: string;
    description: string;
  };
}

export interface AssignedChapter {
  progress: number;
  status: "not started" | "in progress" | "completed";
  completedAt: string | null;
  chapterId: Chapter;
  completedLessons: string[];
  assignedAt: string;
  currentPageIndex: number;
  currentPLIndex: number;
 
}

export interface Chapter {
  _id: string;
  title: string;
  index: number;
  seriesId: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
   pages: ChapterPage[]
}
export interface Lesson {
  chapterId: string;
  createdAt: string;
  durationMinutes: number;
  index: number;
  title: string;
  _id: string;
}

export interface ChapterPageData {
  _id: string;
  pages: ChapterPage[];
}

export interface ChapterPage {
  index: number;
  title: string;
  paragraphs: PageParagraph[];
}

export interface PageParagraph {
  index: number;
  header: string;
  subHeader?: string;
  subContent?: string;
  content: string;
  image: string;
  template: string;
  headerFont: "Big" | "Small";
  listPointStyle?: string;
  list: {
    title: string;
    content: string;
  }[];
  subColumnHeader?: string;
}

export type ReadingProgressProps = {
  book: string;
  index: number;
  seriesId: string;
  title: string;
  chapters: {
    chapterId: string;
    currentPageIndex: number;
    currentPLIndex: number;
    index: number;
    title: string;
    totalPages: number;
    quiz: QuizResult[];
  }[];
};

export type KidBadges = {
  badgeId: string;
  earnedAt: string;
  bookId?: string | null;
  kidCourseId?: string | null;
  meta?: Record<string, any>;
};

export type KidPRofile = {
  _id: string;
  username: string;
  password: string;
  name: string;
  age?: number;
  preferredLearningTopics?: string[];
  mood?: string;
  lastLogin: Date;
  guardianId: string;
  picture?: string;
  earnedBadges: KidBadges[];
  totalXp?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type UpdateKidProfile = {
  _id?: string;
  username?: string;
  password?: string;
  name?: string;
  age?: number;
  preferredLearningTopics?: string[];
  mood?: string;
  lastLogin?: Date;
  guardianId?: string;
  picture?: string;
  earnedBadges?: KidBadges[];
  totalXp?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type QuizResult = {
  quizType: "mid" | "end";
  score: number;
  totalScore: number;
  attempts: number;
  passed: boolean;
  xpEarned?: number;
};

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "fill-in-the-blank";

export interface QuizVariation {
  difficulty: Difficulty;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  baseQuestion: string;
  variations: QuizVariation[];
}

export interface ChapterCompletionRate {
  completionRate: number;
  unit: string;
}
export interface ScenarioQuizQuestion {
  multipleChoice: {
    title: string;
    scenario: string;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
    };
    answer: keyof ScenarioQuizQuestion["multipleChoice"][number]["options"];
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];
  trueOrFalse: {
    statement: string;
    answer: boolean;
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];
  matchingScenario: {
    word: string;
    answer: string;
    options: string[];
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];
  unscramble: {
    word: string;
    answer: string;
    feedback: {
      correct: string;
      incorrect: string;
    };
  }[];
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  subcategory:string;
  imageUrl: string;
}
