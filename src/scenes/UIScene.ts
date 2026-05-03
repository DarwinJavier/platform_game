import Phaser from 'phaser';
import { COLORS, GAME_WIDTH, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import type { CharacterId, HudSceneData, HudState } from '../types/game';

export class UIScene extends Phaser.Scene {
  private characterId: CharacterId = 'puchi';
  private characterText?: Phaser.GameObjects.Text;
  private starsText?: Phaser.GameObjects.Text;
  private shellsText?: Phaser.GameObjects.Text;
  private powerText?: Phaser.GameObjects.Text;
  private heartIcons: Phaser.GameObjects.Graphics[] = [];
  private hudState: HudState = {
    hearts: 3,
    stars: 0,
    shells: 0,
    totalShells: 0,
    characterName: 'Puchi',
    powerText: 'Power: Ready',
  };

  constructor() {
    super(SCENE_KEYS.UI);
  }

  create(data: HudSceneData): void {
    this.characterId = data.characterId;
    this.hudState.characterName = data.characterName;
    this.hudState.totalShells = data.totalShells;

    this.createHudFrame();

    this.characterText = this.createHudText(92, 25, 20);
    this.createHeartIcons(272, 36);
    this.starsText = this.createHudText(418, 34, 21).setOrigin(0.5);
    this.shellsText = this.createHudText(568, 34, 21).setOrigin(0.5);
    this.powerText = this.createHudText(738, 34, 20).setOrigin(0.5);

    this.game.events.on('hud:update', this.handleHudUpdate, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.game.events.off('hud:update', this.handleHudUpdate, this);
    });

    this.refreshHud();
  }

  private createHudFrame(): void {
    this.add.rectangle(GAME_WIDTH / 2, 34, GAME_WIDTH, 68, COLORS.deepOcean, 0.94);
    this.add.rectangle(GAME_WIDTH / 2, 68, GAME_WIDTH, 4, COLORS.magicGlow, 0.9);
    this.add.rectangle(35, 34, 58, 58, COLORS.shellCream, 0.95).setStrokeStyle(3, COLORS.magicGlow, 1);
    this.add.rectangle(35, 34, 48, 48, this.characterId === 'puchi' ? COLORS.puchiPurple : COLORS.paoGreen, 0.95);

    const portraitKey = this.characterId === 'puchi' ? TEXTURE_KEYS.PORTRAIT_PUCHI : TEXTURE_KEYS.PORTRAIT_PAO;
    if (this.textures.exists(portraitKey)) {
      this.add.image(35, 34, portraitKey).setDisplaySize(48, 48);
    }

    this.add
      .text(92, 6, 'SUNLIT SHORES', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#fff3b0',
      })
      .setAlpha(0.92);

    this.addStatPanel(238, 34, 116, 'HEARTS');
    this.addStatPanel(372, 34, 92, 'STARS');
    this.addStatPanel(504, 34, 128, 'SHELLS');
    this.addStatPanel(652, 34, 172, 'POWER');
  }

  private addStatPanel(x: number, y: number, width: number, label: string): void {
    this.add.rectangle(x + width / 2, y, width, 42, COLORS.midOcean, 0.36).setStrokeStyle(2, COLORS.seafoam, 0.48);
    this.add
      .text(x + width / 2, y - 14, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '10px',
        fontStyle: 'bold',
        color: '#c8f1f4',
      })
      .setOrigin(0.5)
      .setAlpha(0.92);
  }

  private createHeartIcons(x: number, y: number): void {
    this.heartIcons = [];
    for (let index = 0; index < 3; index += 1) {
      const heart = this.add.graphics();
      this.drawHeart(heart, x + index * 26, y, true);
      this.heartIcons.push(heart);
    }
  }

  private drawHeart(graphics: Phaser.GameObjects.Graphics, x: number, y: number, active: boolean): void {
    graphics.clear();
    const fill = active ? COLORS.coralPink : COLORS.deepOcean;
    const stroke = active ? COLORS.shellCream : COLORS.midOcean;
    const alpha = active ? 1 : 0.55;

    graphics.fillStyle(stroke, 0.95);
    graphics.fillCircle(x - 4, y - 3, 6);
    graphics.fillCircle(x + 4, y - 3, 6);
    graphics.fillTriangle(x - 11, y, x + 11, y, x, y + 13);
    graphics.fillStyle(fill, alpha);
    graphics.fillCircle(x - 4, y - 3, 4);
    graphics.fillCircle(x + 4, y - 3, 4);
    graphics.fillTriangle(x - 8, y, x + 8, y, x, y + 9);
    if (active) {
      graphics.fillStyle(0xffffff, 0.65);
      graphics.fillCircle(x - 4, y - 5, 2);
    }
  }

  private createHudText(x: number, y: number, fontSize: number): Phaser.GameObjects.Text {
    return this.add.text(x, y, '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${fontSize}px`,
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#1f5e8f',
      strokeThickness: 3,
    });
  }

  private handleHudUpdate(nextState: HudState): void {
    this.hudState = nextState;
    this.refreshHud();
  }

  private refreshHud(): void {
    this.characterText?.setText(this.hudState.characterName);
    this.heartIcons.forEach((heart, index) => {
      const active = index < this.hudState.hearts;
      this.drawHeart(heart, 272 + index * 26, 36, active);
    });
    this.starsText?.setText(`${this.hudState.stars}`);
    this.shellsText?.setText(`${this.hudState.shells}/${this.hudState.totalShells}`);
    this.powerText?.setText(this.hudState.powerText.replace('Power: ', ''));
  }
}
