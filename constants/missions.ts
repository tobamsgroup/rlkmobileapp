// Dummy mission content for chapters whose mission isn't on the backend yet
// (PUT /chapters/:id/mission). See constants/playLearn.ts for which chapter
// uses which, and types/mission.ts for the shape. Think AI Book 1 lives on the
// backend: RL4KIDS-BE scripts/play-learn/think-ai-book-1.json.

import {
  DreamLadderMission,
  MatchMission,
  PickDropMission,
  SpinWheelMission,
} from '@/types/mission';

/* Think Sustainability */

export const RECYCLE_HERO: PickDropMission = {
  id: 'recycle-hero',
  model: 'pick_drop',
  title: 'Recycle Hero',
  layout: 'scatter',
  counterLabel: 'Trash Collected',
  background: require('../assets/images/rlplant.jpg'),
  correctSound: 'trashDrop',
  reward: { title: 'Great Job!' },
  categories: [
    {
      id: 'bin',
      image: require('../assets/images/bin.png'),
      activeImage: require('../assets/images/bin_opened.png'),
    },
  ],
  items: [
    require('../assets/images/trash1.png'),
    require('../assets/images/trash2.webp'),
    require('../assets/images/trash3.png'),
    require('../assets/images/trash4.png'),
    require('../assets/images/trash5.png'),
    require('../assets/images/trash6.png'),
    require('../assets/images/trash7.png'),
    require('../assets/images/trash8.png'),
    require('../assets/images/trash9.png'),
    require('../assets/images/trash10.png'),
  ].map((image, i) => ({ id: `trash-${i + 1}`, image, categoryId: 'bin' })),
};

/* Think Entrepreneurship / Think Leadership */

export const MATCH_THE_INVENTOR: MatchMission = {
  id: 'match-the-inventor',
  model: 'match',
  title: 'Match the Inventor',
  pairs: [
    {
      id: 'musk',
      prompt: {
        label: 'Elon Musk',
        image: require('../assets/images/elonmusk.jpg'),
      },
      answer: {
        label: 'Cyber Truck',
        image: require('../assets/images/cybertruck.avif'),
      },
    },
    {
      id: 'edison',
      prompt: {
        label: 'Thomas Edison',
        image: require('../assets/images/Edison.jpg'),
      },
      answer: {
        label: 'Light Bulb',
        image: require('../assets/images/lightbulb.webp'),
      },
    },
    {
      id: 'zuckerberg',
      prompt: {
        label: 'Mark Zuckerberg',
        image: require('../assets/images/zuckerberg.jpg'),
      },
      answer: {
        label: 'Facebook',
        image: require('../assets/images/facebook.png'),
      },
    },
    {
      id: 'persson',
      prompt: {
        label: 'Markus Persson',
        image: require('../assets/images/Notch.webp'),
      },
      answer: {
        label: 'Minecraft',
        image: require('../assets/images/minecraft.png'),
      },
    },
    {
      id: 'wright',
      prompt: {
        label: 'Wright Brothers',
        image: require('../assets/images/Wright.jpeg'),
      },
      answer: {
        label: 'Airplane',
        image: require('../assets/images/airplane.jpg'),
      },
    },
  ],
};

/* Ported from the web app */

// Think Entrepreneurship: "Brainstorm Carousel"
const KID_PROBLEMS = [
  'Broken crayons',
  'Spilled drinks',
  'Loose shoelaces',
  'Tangled headphones',
  'Squished lunch',
  'Missing socks',
  'Sticky fingers',
  'Forgot homework',
  'Lost toy parts',
  'Book won’t stay open',
  'Dry markers',
  'Wet homework',
  'Glare from sun',
  'Heavy backpack',
  'Lost book spot',
  'Dull pencils',
  'Bad scissors',
  'Too-high shelves',
  'Stuck zippers',
  'Game won’t save',
  'Long wait turns',
  'Messy glue',
  'Crushed snacks',
  'Wet shoes',
  'Cold lunch',
  'Tight buttons',
  'Falling posters',
  'Splashy fountains',
  'Noisy alarm',
  'Pet chewed homework',
];

export const BRAINSTORM_WHEEL: SpinWheelMission = {
  id: 'brainstorm-wheel',
  model: 'spin_wheel',
  title: 'Brainstorm Carousel',
  introduction: 'Spin the problem wheel and let’s invent!',
  mascot: require('../assets/images/constructionRobot.png'),
  segmentCount: 10,
  spins: 1,
  colors: ['#3A6EA5', '#5E60CE', '#4C8C79', '#6C5DD3', '#2D6A4F', '#3F88C5', '#5A189A', '#386641', '#3F6C9C', '#4E598C'],
  reward: { title: 'Brilliant Inventor!', message: 'Every great invention starts with an idea like yours.' },
  challenges: KID_PROBLEMS.map((problem, i) => ({
    id: `problem-${i + 1}`,
    label: problem,
    scenario: `Problem: ${problem}`,
    question: 'What would you create to solve the problem?',
    feedback: { correct: 'What a creative idea! Inventors start exactly like this.' },
  })),
};

// Think Leadership: "Climbing the Dream Ladder"
export const DREAM_LADDER: DreamLadderMission = {
  id: 'dream-ladder',
  model: 'dream_ladder',
  title: 'Climbing the Dream Ladder',
  introduction: 'Choose the steps that turn a dream into an invention, in order.',
  mascot: require('../assets/images/constructionRobot.png'),
  goal: { id: 'goal', label: 'My Dream', image: require('../assets/images/rocket.png') },
  reward: { title: 'Dream Achieved!', message: 'Big dreams are reached one step at a time.' },
  steps: [
    { id: 'sketch', label: 'Sketch An Idea' },
    { id: 'build', label: 'Build A Model', hint: 'You need an idea before you can build it!' },
    { id: 'share', label: 'Share Invention', hint: 'Build your model before you share it.' },
  ],
  distractors: [
    { id: 'cake', label: 'Bake A Cake' },
    { id: 'poem', label: 'Write A Poem' },
    { id: 'jig', label: 'Dance A Jig' },
  ],
};
