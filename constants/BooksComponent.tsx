// we'll use this to simulate db structure for now pending the time we start the main development

import Lesson3TE from '@/components/Games/MatchTheInventor';
import Lesson3C from '@/components/Games/RecycleHero';
import VideoPlayer from '@/components/kid/VideoPlayer';

export const BooksComponent = [
  {
    name: 'Think Sustainability',
    bookId: '6836c8af1607a7982ff81eb0',
    series: [
      {
        index: 1,
        id: '6836c8af1607a7982ff81eb2',
        title: 'Eco Explorers',
        chapters: [
          {
            index: 1,
            title: 'What is Eco Exploring?',
            id: '6836c8b01607a7982ff81eb4',
            lessons: [
              {
                index: 1,
                title: 'Welcome to Your Mission!',
                component: () => (
                  <VideoPlayer src="https://recycled-learning-test.s3.eu-north-1.amazonaws.com/67cc66426ebf092e6728f7d4/video/2ce7ab0e-e6d4-4f98-ab63-66d8374d8f91/RLK+ECO+EXPLORER.mp4" />
                ),
                lessonId: '687dddc057f4737df41487f5',
                nextlesson: '687ddde757f4737df41487f7',
                prevLesson: '',
              },
              {
                index: 2,
                title: 'What is a Green Guardian?',
                component: Lesson3C,
                lessonId: '687ddde757f4737df41487f7',
                nextlesson: '687dde0157f4737df41487f9',
                prevLesson: '687dddc057f4737df41487f5',
              },
              {
                index: 3,
                title: 'Mini-Game – Energy Saver',
                component: Lesson3C,
                lessonId: '687dde0157f4737df41487f9',
                nextlesson: '687dde3457f4737df41487fb',
                prevLesson: '687ddde757f4737df41487f7',
              },
              {
                index: 5,
                title: 'Mini-Game – Recycle Hero',
                component: Lesson3C,
                lessonId: '687dde3457f4737df41487fb',
                nextlesson: '687dde4757f4737df41487fd',
                prevLesson: '687dde0157f4737df41487f9',
              },
              {
                index: 6,
                title: 'Real-World Challenge Checklist',
                component: Lesson3C,
                lessonId: '687dde4757f4737df41487fd',
                nextlesson: '687dde6e57f4737df41487ff',
                prevLesson: '687dde3457f4737df41487fb',
              },
              {
                index: 8,
                title: 'Fun Fact Exploration',
                component: Lesson3C,
                lessonId: '687dde6e57f4737df41487ff',
                nextlesson: '687dde8c57f4737df4148801',
                prevLesson: '687dde4757f4737df41487fd',
              },
              {
                index: 9,
                title: 'Reward',
                component: Lesson3C,
                lessonId: '687dde8c57f4737df4148801',
                nextlesson: '',
                prevLesson: '687dde6e57f4737df41487ff',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Think Leadership',
    bookId: '6836c8b91607a7982ff81fe2',
    series: [
      {
        index: 1,
        id: '6836c8b91607a7982ff81fe4',
        title: 'Big Ideas, Big Dreams',
        chapters: [
          {
            index: 1,
            title: 'Dreaming Big',
            id: '6836c8b91607a7982ff81fe6',
            lessons: [
              {
                index: 1,
                title: 'Dream Launch Pad (Introduction)',
                component: () => (
                  <VideoPlayer src="https://recycled-learning-test.s3.eu-north-1.amazonaws.com/67cc66426ebf092e6728f7d4/video/2ce7ab0e-e6d4-4f98-ab63-66d8374d8f91/RLK+ECO+EXPLORER.mp4" />
                ),
                lessonId: '687de5569f0f4f92665bfdd8',
                nextlesson: '687de5709f0f4f92665bfddb',
                prevLesson: '',
              },
              {
                index: 2,
                title: 'What is a Dream? (Discovery Animation)',
                component: Lesson3TE,
                lessonId: '687de5709f0f4f92665bfddb',
                nextlesson: '687de5919f0f4f92665bfdde',
                prevLesson: '687de5569f0f4f92665bfdd8',
              },
              {
                index: 3,
                title: 'Finding Your WHY ',
                component: Lesson3TE,
                lessonId: '687de5919f0f4f92665bfdde',
                nextlesson: '687de5ad9f0f4f92665bfde1',
                prevLesson: '687de5709f0f4f92665bfddb',
              },
              {
                index: 4,
                title: 'Climbing the Dream Ladder',
                component: Lesson3TE,
                lessonId: '687de5ad9f0f4f92665bfde1',
                nextlesson: '',
                prevLesson: '687de5919f0f4f92665bfdde',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Think Entrepreneurship',
    bookId: '6836c8be1607a7982ff8205d',
    series: [
      {
        index: 1,
        id: '6836c8bf1607a7982ff8205f',
        title: 'Spark Your Ideas',
        chapters: [
          {
            index: 1,
            title: 'The Power of Ideas',
            id: '6836c8bf1607a7982ff82061',
            lessons: [
              {
                index: 1,
                title: 'Welcome to the World of Ideas',
                component: () => (
                  <VideoPlayer src="https://recycled-learning-test.s3.eu-north-1.amazonaws.com/67cc66426ebf092e6728f7d4/video/18413afa-e9c6-4960-9f29-f89404d2b3ae/FUTURE+ENTREPENEUR.mov" />
                ),
                lessonId: '687dfabaf7aab891a588ad0d',
                prevLesson: '',
                nextlesson: '687dfaebf7aab891a588ad14',
              },
              {
                index: 2,
                title: 'What is an Idea?',
                component: Lesson3TE,
                lessonId: '687dfaebf7aab891a588ad14',
                prevLesson: '687dfabaf7aab891a588ad0d',
                nextlesson: '687dfafdf7aab891a588ad17',
              },
              {
                index: 3,
                title: 'Brainstorm Carousel',
                component: Lesson3TE,
                lessonId: '687dfafdf7aab891a588ad17',
                prevLesson: '687dfaebf7aab891a588ad14',
                nextlesson: '687dfb11f7aab891a588ad1e',
              },
              {
                index: 4,
                title: 'Match the Inventor',
                component: Lesson3TE,
                lessonId: '687dfb11f7aab891a588ad1e',
                prevLesson: '687dfafdf7aab891a588ad17',
                nextlesson: '687dfb23f7aab891a588ad21',
              },

              {
                index: 5,
                title: 'Popsicle Invention Animation',
                component: Lesson3TE,
                lessonId: '687dfb23f7aab891a588ad21',
                prevLesson: '687dfb11f7aab891a588ad1e',
                nextlesson: '687dfb3bf7aab891a588ad24',
              },
              {
                index: 6,
                title: 'Sarah’s Super Sock (Case Story)',
                component: Lesson3TE,
                lessonId: '687dfb3bf7aab891a588ad24',
                prevLesson: '687dfb23f7aab891a588ad21',
                nextlesson: '687dfb4ff7aab891a588ad27',
              },
              {
                index: 7,
                title: 'My Idea Plan',
                component: Lesson3TE,
                lessonId: '687dfb4ff7aab891a588ad27',
                prevLesson: '687dfb3bf7aab891a588ad24',
                nextlesson: '687dfb72f7aab891a588ad2a',
              },
              {
                index: 8,
                title: 'Reward & Celebration',
                component: Lesson3TE,
                lessonId: '687dfb72f7aab891a588ad2a',
                prevLesson: '687dfb4ff7aab891a588ad27',
                nextlesson: '',
              },
            ],
          },
        ],
      },
    ],
  },
];
