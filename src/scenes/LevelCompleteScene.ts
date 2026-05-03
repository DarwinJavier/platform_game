import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { audioManager } from '../systems/AudioManager';
import { InputManager } from '../systems/InputManager';
import type { CharacterId, LevelCompleteData } from '../types/game';

export class LevelCompleteScene extends Phaser.Scene {
  private inputManager?: InputManager;
  private characterId: CharacterId = 'puchi';

  constructor() {
    super(SCENE_KEYS.LEVEL_COMPLETE);
  }

  create(data: LevelCompleteData): void {
    this.inputManager = new InputManager(this);
    this.characterId = data.characterId ?? 'puchi';

    this.cameras.main.setBackgroundColor(0x245f83);
    if (this.textures.exists(TEXTURE_KEYS.LEVEL_COMPLETE_BACKGROUND)) {
      const source = this.textures.get(TEXTURE_KEYS.LEVEL_COMPLETE_BACKGROUND).getSourceImage() as HTMLImageElement;
      const coverScale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
      this.add
        .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.LEVEL_COMPLETE_BACKGROUND)
        .setOrigin(0.5)
        .setScale(coverScale)
        .setDepth(-10);
    } else {
      this.add.rectangle(GAME_WIDTH / 2, GAME_WIDTH / 8, GAME_WIDTH, 135, 0x2f7fa2, 0.48);
      this.add.rectangle(GAME_WIDTH / 2, 332, GAME_WIDTH, 416, 0x1f5e8f, 0.54);
    }

    const portraitFrame = this.add.graphics();
    portraitFrame.fillStyle(0xffe7ba, 1);
    portraitFrame.fillRoundedRect(48, 46, 286, 346, 18);
    portraitFrame.lineStyle(6, COLORS.magicGlow, 1);
    portraitFrame.strokeRoundedRect(48, 46, 286, 346, 18);
    portraitFrame.lineStyle(3, 0x9a6840, 0.85);
    portraitFrame.strokeRoundedRect(64, 62, 254, 300, 12);
    portraitFrame.fillStyle(0xf4c477, 1);
    portraitFrame.fillRoundedRect(72, 326, 238, 42, 12);
    portraitFrame.lineStyle(3, 0x9a6840, 0.8);
    portraitFrame.strokeRoundedRect(72, 326, 238, 42, 12);

    this.add
      .text(191, 347, 'Mami', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
        color: '#5b2f22',
      })
      .setOrigin(0.5);

    if (this.textures.exists(TEXTURE_KEYS.MAMI_CONGRATS_PORTRAIT)) {
      this.add
        .image(191, 195, TEXTURE_KEYS.MAMI_CONGRATS_PORTRAIT)
        .setOrigin(0.5, 0.52)
        .setScale(0.76)
        .setDepth(2);
    }

    this.add
      .text(635, 86, 'Congratulations!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '46px',
        fontStyle: 'bold',
        align: 'center',
        color: '#fff3b0',
        stroke: '#2f8f7f',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.add
      .text(635, 148, 'You cleared Level 1: Sunlit Shores', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '25px',
        fontStyle: 'bold',
        align: 'center',
        color: '#ffffff',
        stroke: '#1f5e8f',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const messagePanel = this.add.graphics();
    messagePanel.fillStyle(0xf4e4c8, 0.94);
    messagePanel.fillRoundedRect(382, 204, 506, 148, 14);
    messagePanel.lineStyle(4, COLORS.sunsetGold, 0.9);
    messagePanel.strokeRoundedRect(382, 204, 506, 148, 14);

    this.add
      .text(
        635,
        262,
        'Mami says:\n"Felicidades, mi amor,\nNow clean your room!"',
        {
          fontFamily: 'Arial, sans-serif',
          fontSize: '26px',
          fontStyle: 'bold',
          align: 'center',
          color: '#5b2f22',
          lineSpacing: 7,
          wordWrap: { width: 460 },
        },
      )
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 392, `Stars: ${data.stars ?? 0}     Shells: ${data.shells ?? 0}/${data.totalShells ?? 0}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
        align: 'center',
        color: '#ffffff',
        stroke: '#1f5e8f',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 474, 'Press Enter to replay\nPress Esc for title', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        align: 'center',
        color: '#c8f1f4',
        lineSpacing: 8,
      })
      .setOrigin(0.5);
  }

  update(): void {
    if (this.inputManager?.wasMutePressed()) {
      audioManager.toggleMute();
    }

    if (this.inputManager?.wasEnterPressed()) {
      audioManager.playMenuSelect();
      this.scene.start(SCENE_KEYS.LEVEL_1, { characterId: this.characterId });
    }

    if (this.inputManager?.wasEscapePressed()) {
      audioManager.playMenuSelect();
      this.scene.start(SCENE_KEYS.TITLE);
    }
  }
}
