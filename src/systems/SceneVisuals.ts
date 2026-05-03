import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH } from '../data/constants';

export function drawSunlitShoresBackdrop(scene: Phaser.Scene): void {
  if (scene.textures.exists('sunlit-shores-backdrop')) {
    scene.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'sunlit-shores-backdrop').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.deepOcean, 0.18);
    return;
  }

  scene.cameras.main.setBackgroundColor(COLORS.deepOcean);

  const sky = scene.add.graphics();
  sky.fillGradientStyle(COLORS.deepOcean, COLORS.deepOcean, COLORS.peachSky, COLORS.peachSky, 1);
  sky.fillRect(0, 0, GAME_WIDTH, 260);
  sky.fillStyle(COLORS.warmSun, 0.95);
  sky.fillCircle(GAME_WIDTH / 2, 224, 48);
  sky.fillStyle(COLORS.magicGlow, 0.32);
  sky.fillCircle(GAME_WIDTH / 2, 224, 76);

  drawCloud(scene, 120, 92, 0.8);
  drawCloud(scene, 790, 88, 1);
  drawCloud(scene, 520, 126, 0.6);

  const ocean = scene.add.graphics();
  ocean.fillStyle(COLORS.midOcean, 1);
  ocean.fillRect(0, 250, GAME_WIDTH, 174);
  ocean.fillStyle(COLORS.tropicalAqua, 0.65);
  ocean.fillRect(0, 302, GAME_WIDTH, 44);
  ocean.fillStyle(COLORS.warmSun, 0.4);
  ocean.fillTriangle(GAME_WIDTH / 2 - 34, 252, GAME_WIDTH / 2 + 34, 252, GAME_WIDTH / 2 + 150, 420);
  ocean.lineStyle(3, COLORS.seafoam, 0.5);
  for (let y = 282; y <= 390; y += 28) {
    ocean.beginPath();
    for (let x = -20; x <= GAME_WIDTH + 20; x += 80) {
      ocean.moveTo(x, y);
      ocean.lineTo(x + 42, y + 5);
      ocean.lineTo(x + 80, y);
    }
    ocean.strokePath();
  }

  const shore = scene.add.graphics();
  shore.fillStyle(COLORS.sandyBeige, 1);
  shore.fillRect(0, 418, GAME_WIDTH, GAME_HEIGHT - 418);
  shore.fillStyle(COLORS.rockBrown, 1);
  shore.fillRect(0, 485, GAME_WIDTH, 55);
  shore.fillStyle(COLORS.sunsetGold, 0.85);
  shore.fillRect(0, 418, GAME_WIDTH, 8);

  drawPalm(scene, 72, 408, 1.1);
  drawPalm(scene, 878, 415, 0.9);
}

function drawCloud(scene: Phaser.Scene, x: number, y: number, scale: number): void {
  const cloud = scene.add.graphics();
  cloud.fillStyle(0xffffff, 0.55);
  cloud.fillCircle(x, y, 26 * scale);
  cloud.fillCircle(x + 28 * scale, y - 10 * scale, 34 * scale);
  cloud.fillCircle(x + 62 * scale, y, 24 * scale);
  cloud.fillRoundedRect(x - 28 * scale, y - 4 * scale, 112 * scale, 26 * scale, 14 * scale);
}

function drawPalm(scene: Phaser.Scene, x: number, y: number, scale: number): void {
  const palm = scene.add.graphics();
  palm.lineStyle(10 * scale, COLORS.rockBrown, 1);
  palm.beginPath();
  palm.moveTo(x, y);
  palm.lineTo(x + 15 * scale, y - 96 * scale);
  palm.strokePath();

  palm.lineStyle(9 * scale, COLORS.palmGreen, 1);
  for (const angle of [-140, -105, -72, -36, 0]) {
    const radians = Phaser.Math.DegToRad(angle);
    const topX = x + 15 * scale;
    const topY = y - 96 * scale;
    palm.beginPath();
    palm.moveTo(topX, topY);
    palm.lineTo(topX + Math.cos(radians) * 72 * scale, topY + Math.sin(radians) * 38 * scale);
    palm.strokePath();
  }
}
