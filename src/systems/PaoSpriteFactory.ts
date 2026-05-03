import Phaser from 'phaser';
import { COLORS } from '../data/constants';

type PaoPose = 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'fall' | 'hurt' | 'win' | 'power';

const FRAME_WIDTH = 124;
const FRAME_HEIGHT = 124;
const ART_SCALE = 1.3;

const PAO = {
  outline: 0x241713,
  skin: 0xc9855f,
  skinLight: 0xffc493,
  cheek: 0xe98f7d,
  hairDark: 0x2b1a12,
  hair: 0x5a321d,
  hairLight: 0xa5673c,
  shirtDark: 0x193829,
  shirt: 0x28573f,
  shirtLight: 0x3f7656,
  denimDark: 0x2f536f,
  denim: 0x557fa8,
  denimLight: 0x8aaaca,
  belt: 0x70482c,
  shoe: 0x143d33,
  sole: 0xf4ead0,
};

export function createPaoSpriteSet(scene: Phaser.Scene, baseKey: string): void {
  createPaoFrame(scene, baseKey, 'idle-1');
  createPaoFrame(scene, `${baseKey}-idle-2`, 'idle-2');
  createPaoFrame(scene, `${baseKey}-run-1`, 'run-1');
  createPaoFrame(scene, `${baseKey}-run-2`, 'run-2');
  createPaoFrame(scene, `${baseKey}-jump`, 'jump');
  createPaoFrame(scene, `${baseKey}-fall`, 'fall');
  createPaoFrame(scene, `${baseKey}-hurt`, 'hurt');
  createPaoFrame(scene, `${baseKey}-win`, 'win');
  createPaoFrame(scene, `${baseKey}-power`, 'power');
  createPaoAnimations(scene, baseKey);
}

function createPaoAnimations(scene: Phaser.Scene, baseKey: string): void {
  scene.anims.create({
    key: `${baseKey}-idle`,
    frames: [{ key: baseKey }, { key: `${baseKey}-idle-2` }],
    frameRate: 2,
    repeat: -1,
  });

  scene.anims.create({
    key: `${baseKey}-run`,
    frames: [{ key: `${baseKey}-run-1` }, { key: `${baseKey}-run-2` }],
    frameRate: 9,
    repeat: -1,
  });

  for (const pose of ['jump', 'fall', 'hurt', 'win', 'power'] as const) {
    scene.anims.create({
      key: `${baseKey}-${pose}`,
      frames: [{ key: `${baseKey}-${pose}` }],
      frameRate: 1,
      repeat: 0,
    });
  }
}

function createPaoFrame(scene: Phaser.Scene, key: string, pose: PaoPose): void {
  const g = scene.add.graphics();
  const run = pose === 'run-1' || pose === 'run-2';
  const air = pose === 'jump' || pose === 'fall' || pose === 'win';
  const bounce = pose === 'idle-2' ? -2 : 0;
  const lean = run || pose === 'power' ? 4 : pose === 'hurt' ? -4 : 0;
  const head = { x: 55 + lean, y: air ? 20 : 25 + bounce };
  const torso = { x: 47 + lean, y: air ? 47 : 51 + bounce };

  g.save();
  g.scaleCanvas(ART_SCALE, ART_SCALE);

  g.fillStyle(0x000000, 0.18);
  g.fillEllipse(48, 88, run ? 50 : 38, 7);

  drawBackBraid(g, head.x, head.y, pose);
  drawBody(g, torso.x, torso.y, pose);
  drawHead(g, head.x, head.y, pose);
  drawFrontBraid(g, head.x, head.y, pose);

  if (pose === 'win') {
    drawSparkle(g, head.x + 23, head.y - 18, 0.8);
  }

  g.restore();

  g.generateTexture(key, FRAME_WIDTH, FRAME_HEIGHT);
  g.destroy();
}

function drawHead(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  const happy = pose === 'run-1' || pose === 'jump' || pose === 'win' || pose === 'power';

  // Compact three-quarter portrait read based on Pao's determined expression.
  g.fillStyle(PAO.outline, 1);
  g.fillEllipse(x - 8, y + 5, 34, 31);
  g.fillStyle(PAO.hairDark, 1);
  g.fillEllipse(x - 9, y - 2, 38, 19);
  g.fillEllipse(x - 22, y + 9, 11, 22);
  g.fillEllipse(x + 7, y + 8, 9, 20);
  g.fillStyle(PAO.hair, 1);
  g.fillEllipse(x - 9, y, 33, 15);
  g.fillEllipse(x - 22, y + 10, 7, 18);
  g.fillEllipse(x + 7, y + 9, 6, 16);
  g.fillTriangle(x - 13, y - 7, x - 1, y - 2, x - 18, y + 5);
  g.fillTriangle(x - 3, y - 7, x + 7, y + 3, x - 2, y + 4);
  g.fillStyle(PAO.hairLight, 1);
  g.fillRect(x - 15, y - 7, 10, 2);
  g.fillRect(x - 3, y - 6, 8, 2);

  g.fillStyle(PAO.skin, 1);
  g.fillRoundedRect(x - 18, y + 3, 27, 22, 7);
  g.fillTriangle(x + 6, y + 11, x + 14, y + 14, x + 6, y + 17);
  g.fillRoundedRect(x - 23, y + 11, 5, 8, 3);
  g.fillStyle(PAO.skinLight, 1);
  g.fillRect(x - 13, y + 5, 15, 5);

  // Determined brows and two simplified eyes, exaggerated for gameplay readability.
  g.fillStyle(PAO.hairDark, 1);
  g.fillRect(x - 14, y + 10, 9, 2);
  g.fillRect(x - 1, y + 9, 10, 2);
  g.fillStyle(0xf8f2e9, 1);
  g.fillRoundedRect(x - 13, y + 13, 7, 5, 2);
  g.fillRoundedRect(x, y + 13, 8, 5, 2);
  g.fillStyle(0x17120f, 1);
  g.fillRect(x - 10, y + 14, 3, 3);
  g.fillRect(x + 3, y + 14, 3, 3);
  g.fillStyle(0xffffff, 1);
  g.fillRect(x - 11, y + 14, 1, 1);
  g.fillRect(x + 2, y + 14, 1, 1);

  g.fillStyle(PAO.skinLight, 0.92);
  g.fillRect(x - 2, y + 18, 3, 2);
  g.fillStyle(PAO.cheek, 0.62);
  g.fillRect(x - 17, y + 20, 5, 2);
  g.fillRect(x + 5, y + 20, 5, 2);

  g.fillStyle(0x702528, 1);
  if (happy) {
    g.fillRoundedRect(x - 3, y + 23, 11, 3, 2);
    g.fillStyle(0xffffff, 1);
    g.fillRect(x - 1, y + 23, 6, 1);
  } else if (pose === 'hurt') {
    g.fillRect(x - 2, y + 23, 7, 2);
  } else {
    g.fillRect(x - 2, y + 23, 8, 2);
  }
}

function drawBackBraid(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  const points =
    pose === 'run-1'
      ? [
          { x: x - 19, y: y + 10, r: 6 },
          { x: x - 32, y: y + 8, r: 6 },
          { x: x - 45, y: y + 12, r: 6 },
          { x: x - 56, y: y + 20, r: 5 },
        ]
      : pose === 'run-2' || pose === 'jump' || pose === 'win'
        ? [
            { x: x - 19, y: y + 10, r: 6 },
            { x: x - 31, y: y + 4, r: 6 },
            { x: x - 44, y: y + 8, r: 6 },
            { x: x - 54, y: y + 16, r: 5 },
          ]
        : [
            { x: x - 19, y: y + 12, r: 6 },
            { x: x - 24, y: y + 24, r: 6 },
            { x: x - 24, y: y + 36, r: 6 },
            { x: x - 20, y: y + 48, r: 5 },
          ];

  g.fillStyle(PAO.hairDark, 1);
  points.forEach((point) => g.fillCircle(point.x, point.y, point.r));
  g.fillStyle(PAO.hair, 1);
  points.forEach((point) => g.fillCircle(point.x + 1, point.y - 1, point.r - 1));
  g.fillStyle(PAO.hairLight, 1);
  g.fillCircle(points[1].x, points[1].y - 2, 2);
  g.fillCircle(points[2].x, points[2].y - 1, 2);
  g.fillStyle(COLORS.tropicalAqua, 1);
  const tie = points[points.length - 1];
  g.fillRect(tie.x - 4, tie.y - 2, 8, 3);
}

function drawFrontBraid(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  if (pose === 'hurt') {
    return;
  }

  const lift = pose === 'jump' || pose === 'win' ? -4 : 0;
  const bx = x + 6;
  const by = y + 25 + lift;
  g.fillStyle(PAO.hairDark, 1);
  g.fillCircle(bx, by, 5);
  g.fillCircle(bx + 1, by + 10, 5);
  g.fillCircle(bx, by + 20, 4);
  g.fillStyle(PAO.hair, 1);
  g.fillCircle(bx + 1, by - 1, 4);
  g.fillCircle(bx + 2, by + 9, 4);
  g.fillCircle(bx + 1, by + 19, 3);
  g.fillStyle(COLORS.tropicalAqua, 1);
  g.fillRect(bx - 3, by + 15, 7, 3);
}

function drawBody(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  drawArms(g, x, y, pose);
  drawTorso(g, x, y);
  drawLegs(g, x, y, pose);
}

function drawTorso(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.fillStyle(PAO.outline, 1);
  g.fillRoundedRect(x - 12, y - 4, 25, 25, 4);
  g.fillStyle(PAO.shirt, 1);
  g.fillRoundedRect(x - 10, y - 3, 21, 22, 3);
  g.fillStyle(PAO.shirtLight, 1);
  g.fillRect(x - 7, y, 14, 4);
  g.fillStyle(PAO.skinLight, 1);
  g.fillRect(x - 6, y - 6, 14, 3);
  g.fillStyle(COLORS.shellCream, 1);
  g.fillCircle(x + 2, y + 9, 4);
  g.fillRect(x + 1, y + 12, 3, 4);
  g.fillStyle(PAO.belt, 1);
  g.fillRect(x - 12, y + 18, 25, 3);
  g.fillStyle(COLORS.sunsetGold, 1);
  g.fillRect(x, y + 18, 4, 3);
}

function drawArms(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  const left =
    pose === 'run-1'
      ? { x: x - 27, y: y + 14 }
      : pose === 'run-2'
        ? { x: x - 16, y: y + 4 }
        : pose === 'jump' || pose === 'win'
          ? { x: x - 22, y: y - 18 }
          : pose === 'power'
            ? { x: x - 12, y: y + 11 }
            : pose === 'hurt'
              ? { x: x - 22, y: y + 4 }
              : { x: x - 15, y: y + 19 };
  const right =
    pose === 'run-1'
      ? { x: x + 22, y: y + 2 }
      : pose === 'run-2'
        ? { x: x + 18, y: y + 15 }
        : pose === 'jump' || pose === 'win'
          ? { x: x + 23, y: y - 18 }
          : pose === 'power'
            ? { x: x + 30, y: y - 6 }
            : pose === 'hurt'
              ? { x: x + 18, y: y + 7 }
              : { x: x + 12, y: y + 17 };

  g.lineStyle(7, PAO.outline, 1);
  g.beginPath();
  g.moveTo(x - 8, y + 2);
  g.lineTo(left.x, left.y);
  g.strokePath();
  g.beginPath();
  g.moveTo(x + 8, y + 2);
  g.lineTo(right.x, right.y);
  g.strokePath();

  g.lineStyle(5, PAO.skin, 1);
  g.beginPath();
  g.moveTo(x - 8, y + 2);
  g.lineTo(left.x, left.y);
  g.strokePath();
  g.beginPath();
  g.moveTo(x + 8, y + 2);
  g.lineTo(right.x, right.y);
  g.strokePath();

  g.lineStyle(6, PAO.shirt, 1);
  g.beginPath();
  g.moveTo(x - 8, y + 2);
  g.lineTo(x - 14, y + 7);
  g.strokePath();
  g.beginPath();
  g.moveTo(x + 8, y + 2);
  g.lineTo(x + 13, y + 7);
  g.strokePath();

  g.fillStyle(PAO.skin, 1);
  g.fillCircle(left.x, left.y, 4);
  g.fillCircle(right.x, right.y, 4);
  g.fillStyle(COLORS.tropicalAqua, 1);
  g.fillCircle(left.x + 1, left.y - 2, 2);
}

function drawLegs(g: Phaser.GameObjects.Graphics, x: number, y: number, pose: PaoPose): void {
  const hipY = y + 20;
  const leftKnee =
    pose === 'run-1'
      ? { x: x - 16, y: hipY + 12 }
      : pose === 'run-2'
        ? { x: x, y: hipY + 15 }
        : pose === 'jump' || pose === 'win'
          ? { x: x - 8, y: hipY + 8 }
          : { x: x - 7, y: hipY + 15 };
  const leftFoot =
    pose === 'run-1'
      ? { x: x - 31, y: 84 }
      : pose === 'run-2'
        ? { x: x - 5, y: 86 }
        : pose === 'jump' || pose === 'win'
          ? { x: x - 20, y: 78 }
          : { x: x - 9, y: 86 };
  const rightKnee =
    pose === 'run-1'
      ? { x: x + 14, y: hipY + 4 }
      : pose === 'run-2'
        ? { x: x + 21, y: hipY + 15 }
        : pose === 'jump' || pose === 'win'
          ? { x: x + 19, y: hipY + 2 }
          : { x: x + 8, y: hipY + 15 };
  const rightFoot =
    pose === 'run-1'
      ? { x: x + 26, y: 84 }
      : pose === 'run-2'
        ? { x: x + 35, y: 85 }
        : pose === 'jump' || pose === 'win'
          ? { x: x + 14, y: 72 }
          : { x: x + 9, y: 86 };

  g.fillStyle(PAO.outline, 1);
  g.fillRoundedRect(x - 13, hipY - 3, 28, 10, 3);
  g.fillStyle(PAO.denimDark, 1);
  g.fillRoundedRect(x - 11, hipY - 2, 24, 8, 2);

  drawPantLeg(g, x - 7, hipY + 2, leftKnee, leftFoot);
  drawPantLeg(g, x + 7, hipY + 2, rightKnee, rightFoot);
  drawShoe(g, leftFoot.x, leftFoot.y);
  drawShoe(g, rightFoot.x, rightFoot.y);
}

function drawPantLeg(
  g: Phaser.GameObjects.Graphics,
  hipX: number,
  hipY: number,
  knee: { x: number; y: number },
  foot: { x: number; y: number },
): void {
  g.lineStyle(14, PAO.outline, 1);
  g.beginPath();
  g.moveTo(hipX, hipY);
  g.lineTo(knee.x, knee.y);
  g.lineTo(foot.x, foot.y - 5);
  g.strokePath();

  g.lineStyle(11, PAO.denim, 1);
  g.beginPath();
  g.moveTo(hipX, hipY);
  g.lineTo(knee.x, knee.y);
  g.lineTo(foot.x, foot.y - 5);
  g.strokePath();

  g.lineStyle(3, PAO.denimLight, 0.75);
  g.beginPath();
  g.moveTo(hipX + 1, hipY + 3);
  g.lineTo(knee.x + 1, knee.y - 2);
  g.strokePath();

  g.fillStyle(PAO.denimDark, 1);
  g.fillRoundedRect(knee.x - 5, knee.y - 2, 12, 8, 2);
  g.fillStyle(PAO.denimLight, 1);
  g.fillRoundedRect(foot.x - 7, foot.y - 10, 14, 6, 2);
}

function drawShoe(g: Phaser.GameObjects.Graphics, x: number, y: number): void {
  g.fillStyle(PAO.outline, 1);
  g.fillRoundedRect(x - 12, y - 2, 24, 8, 3);
  g.fillStyle(PAO.shoe, 1);
  g.fillRoundedRect(x - 10, y - 4, 20, 8, 3);
  g.fillStyle(PAO.sole, 1);
  g.fillRect(x - 11, y + 2, 22, 3);
  g.fillStyle(COLORS.starGold, 1);
  g.fillRect(x - 4, y - 2, 3, 3);
  g.fillStyle(PAO.sole, 0.95);
  g.fillRect(x + 2, y - 2, 5, 2);
}

function drawSparkle(g: Phaser.GameObjects.Graphics, x: number, y: number, scale: number): void {
  g.fillStyle(COLORS.magicGlow, 1);
  g.fillRect(x - 2 * scale, y - 9 * scale, 4 * scale, 18 * scale);
  g.fillRect(x - 9 * scale, y - 2 * scale, 18 * scale, 4 * scale);
}
