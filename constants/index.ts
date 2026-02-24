// import { BooksComponent } from "@/components/books";
import { ChapterPage, PageParagraph } from "@/types";
import { BooksComponent } from "./BooksComponent";

export type Item = {
  id: string;
  title: string;
  type: "lesson" | "activity";
  mode?: "game" | "quiz" | "story";
};

export type Module = {
  id: string;
  title: string;
  items: Item[];
};

export type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

export type Activity = {
  id: string;
  title: string;
  questions: Question[];
};

export const seriesModules: Module[] = [
  {
    id: "module-1",
    title: "Module 1: Eco Explorers",
    items: [
      {
        id: "lesson-1",
        title: "Lesson 1: Becoming a Hero",
        type: "lesson",
        mode: "story",
      },
      {
        id: "activity-1",
        title: "Activity 1: Save the Planet",
        type: "activity",
        mode: "quiz",
      },
      {
        id: "lesson-2",
        title: "Lesson 2: Video Lesson",
        type: "lesson",
        mode: "story",
      },
      {
        id: "activity-2",
        title: "Activity 2: Find the Missing Items",
        type: "activity",
        mode: "game",
      },
      {
        id: "lesson-3",
        title: "Lesson 3: Our Eco Guardian",
        type: "lesson",
        mode: "story",
      },
      {
        id: "activity-3",
        title: "Activity: Test your Knowledge",
        type: "activity",
        mode: "quiz",
      },
    ],
  },
  {
    id: "module-2",
    title: "Module 2: Eco Bus",
    items: [
      { id: "lesson-1", title: "Lesson 1: Bus Safety", type: "lesson" },
      {
        id: "activity-1",
        title: "Activity 1: Eco Route Planning",
        type: "activity",
        mode: "quiz",
      },
    ],
  },
  {
    id: "module-3",
    title: "Module 3: Eco Family",
    items: [
      { id: "lesson-1", title: "Lesson 1: Family Eco Habits", type: "lesson" },
      {
        id: "activity-1",
        title: "Activity 1: Home Audit",
        type: "activity",
        mode: "quiz",
      },
    ],
  },
  {
    id: "module-4",
    title: "Module 4: Eco Kids",
    items: [
      { id: "lesson-1", title: "Lesson 1: Kids Can Help", type: "lesson" },
      {
        id: "activity-1",
        title: "Activity 1: Game Time",
        type: "activity",
        mode: "quiz",
      },
    ],
  },
];

export const activities: Activity[] = [
  {
    id: "activity-1",
    title: "Save the Planet",
    questions: [
      {
        id: "q1",
        question:
          "You have 10 coins. You want to buy a toy that costs 7 coins. How many coins will you have left?",
        options: ["1 coin", "2 coins", "3 coins", "4 coins"],
        correctAnswer: 2,
      },
      {
        id: "q2",
        question:
          "You have 2 balls. You want to buy 2 extra balls for your friend. How many balls will you have altogether?",
        options: ["4 balls", "6 balls", "1 ball", "2 balls"],
        correctAnswer: 0,
      },
      {
        id: "q3",
        question:
          "You see 3 birds on a tree. 2 more birds join them. How many birds are there now?",
        options: ["4 birds", "5 birds", "6 birds", "3 birds"],
        correctAnswer: 1,
      },
      {
        id: "q4",
        question:
          "You have 5 apples. You eat 2 of them. How many apples do you have left?",
        options: ["2 apples", "3 apples", "4 apples", "1 apple"],
        correctAnswer: 1,
      },
      {
        id: "q5",
        question:
          "There are 6 cars in a parking lot. 3 drive away. How many cars are left?",
        options: ["2 cars", "4 cars", "3 cars", "5 cars"],
        correctAnswer: 2,
      },
    ],
  },
];

export function getActiveLesson({
  bookId,
  seriesId,
  chapterId,
  lessonId,
}: {
  bookId: string;
  seriesId: string;
  chapterId: string;
  lessonId: string;
}) {
  const book = BooksComponent.find((b) => b.bookId === bookId);
  if (!book) return null;

  const series = book.series.find((s) => s.id === seriesId);
  if (!series) return null;

  const chapter = series.chapters.find((c) => c.id === chapterId);
  if (!chapter) return null;

  const lesson = chapter.lessons.find((l) => l.lessonId === lessonId);
  if (lesson) {
    return { ...lesson, total: chapter.lessons.length };
  }

  return null;
}

export function getPageName(data: ChapterPage) {
  let pageName = "Page " + data.index;
  if (data?.paragraphs?.length > 0) {
    for (let i = 0; i < data?.paragraphs?.length; i++) {
      const activeParagraph = data.paragraphs?.[i];
      if (data?.title) {
        pageName = data?.title;
        break;
      }
      if (activeParagraph?.header) {
        pageName = activeParagraph.header;
        break;
      }
      if (activeParagraph?.subHeader) {
        pageName = activeParagraph.header;
        break;
      }
      if (activeParagraph?.subColumnHeader) {
        pageName = activeParagraph.subColumnHeader;
        break;
      }
    }
  }
  return pageName;
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


export const PLAY_LEARN_PROGRESS_KEY = 'PLAY_LEARN_KID_PROGRESS'