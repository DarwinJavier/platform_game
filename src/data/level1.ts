import type { LevelData } from '../types/game';

export const LEVEL_1_META = {
  name: 'Level 1: Sunlit Shores',
  status: 'Playable beach-strip redesign with safe start, jump lesson, optional route, moving platforms, Gafo checkpoint, crate climb, and shell goal.',
};

const WORLD = {
  width: 7000,
  height: 768,
  groundY: 690,
  groundHeight: 56,
  groundTop: 662,
};

const SECTIONS = {
  start: 120,
  jumpLesson: 620,
  optionalRoute: 1040,
  movingPlatform: 1640,
  gafoCheckpoint: 2320,
  crateClimb: 2780,
  finalChallenge: 3400,
  checkpointFlag: 6700,
  shellGoal: 6900,
};

export const LEVEL_1_DATA: LevelData = {
  ...LEVEL_1_META,
  width: WORLD.width,
  height: WORLD.height,
  startPosition: {
    x: 120,
    y: WORLD.groundTop,
  },
  sectionMarkers: [
    { name: 'Safe Start', x: SECTIONS.start },
    { name: 'First Jump Lesson', x: SECTIONS.jumpLesson },
    { name: 'Optional Coral Route', x: SECTIONS.optionalRoute },
    { name: 'Driftwood Timing', x: SECTIONS.movingPlatform },
    { name: 'Gafo Checkpoint', x: SECTIONS.gafoCheckpoint },
    { name: 'Crate Climb', x: SECTIONS.crateClimb },
    { name: 'Final Gap', x: SECTIONS.finalChallenge },
    { name: 'Checkpoint Flag', x: SECTIONS.checkpointFlag },
    { name: 'Shell Goal', x: SECTIONS.shellGoal },
  ],
  platforms: [
    { x: 280, y: WORLD.groundY, width: 560, height: WORLD.groundHeight, style: 'beach' },

    { x: 740, y: 610, width: 220, height: 34, style: 'floating' },

    { x: 1355, y: WORLD.groundY, width: 710, height: WORLD.groundHeight, style: 'beach' },
    { x: 1910, y: 637, width: 220, height: 34, style: 'floating' },
    { x: 2200, y: 557, width: 220, height: 34, style: 'floating' },

    { x: 2740, y: 690, width: 480, height: WORLD.groundHeight, style: 'beach' },
    { x: 4700, y: 690, width: 300, height: WORLD.groundHeight, style: 'beach' },
    { x: 6250, y: 690, width: 400, height: WORLD.groundHeight, style: 'beach' },
    { x: 6600, y: 690, width: 800, height: WORLD.groundHeight, style: 'beach' },

    { x: 2874, y: 654, width: 128, height: 38, style: 'rock' },
    { x: 3004, y: 626, width: 128, height: 38, style: 'rock' },
    { x: 3134, y: 598, width: 128, height: 38, style: 'rock' },
    { x: 5514, y: 619, width: 128, height: 38, style: 'rock' },

    { x: 3460, y: 577, width: 220, height: 34, style: 'floating' },
    { x: 3830, y: 562, width: 220, height: 34, style: 'floating' },
    { x: 4210, y: 575, width: 220, height: 34, style: 'floating' },
    { x: 4520, y: 517, width: 220, height: 34, style: 'floating' },
    { x: 4880, y: 562, width: 220, height: 34, style: 'floating' },
    { x: 5260, y: 575, width: 220, height: 34, style: 'floating' },
    { x: 5830, y: 562, width: 220, height: 34, style: 'floating' },
  ],
  movingPlatforms: [],
  waterZones: [],
  collectibles: [
    { kind: 'star', x: 740, y: 554 },
    { kind: 'star', x: 2680, y: 582 },
    { kind: 'star', x: 3460, y: 505 },
    { kind: 'star', x: 3830, y: 490 },
    { kind: 'star', x: 4880, y: 490 },
    { kind: 'star', x: 5260, y: 503 },
    { kind: 'star', x: 5830, y: 490 },
    { kind: 'shell', x: 4210, y: 490, scale: 1.15 },
  ],
  crabs: [
    { x: 1500, y: 620, patrolMinX: 1370, patrolMaxX: 1650, speed: 62 },
    { x: 2160, y: 400, patrolMinX: 2100, patrolMaxX: 2300, speed: 54 },
    { x: 3460, y: 518, patrolMinX: 3390, patrolMaxX: 3570, speed: 54 },
    { x: 4210, y: 516, patrolMinX: 4140, patrolMaxX: 4320, speed: 54 },
    { x: 4700, y: 620, patrolMinX: 4580, patrolMaxX: 4820, speed: 62 },
  ],
  gooseBosses: [
    { x: 6500, y: WORLD.groundTop + 10, maxHealth: 1, patrolMinX: 6260, patrolMaxX: 6740 },
  ],
  decorations: [
    { kind: 'sign', x: 145, y: 600, label: 'START' },
    { kind: 'restaurant', x: 1500, y: 729, scale: 0.26 },
    { kind: 'palm', x: 330, y: 704, scale: 0.96 },
    { kind: 'palm', x: 1200, y: 700, scale: 0.86 },
    { kind: 'dog', x: 2600, y: WORLD.groundTop, label: 'I am gafo', scale: 1, checkpoint: true },
    { kind: 'mami', x: 6800, y: 748, scale: 1 },
    { kind: 'checkpoint', x: 6700, y: 680, scale: 1, goal: true },
  ],
};
