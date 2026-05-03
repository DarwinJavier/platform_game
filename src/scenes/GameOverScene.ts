import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { audioManager } from '../systems/AudioManager';
import { InputManager } from '../systems/InputManager';
import type { CharacterId, GameOverData } from '../types/game';

export class GameOverScene extends Phaser.Scene {
  private inputManager?: InputManager;
  private characterId: CharacterId = 'puchi';

  constructor() {
    super(SCENE_KEYS.GAME_OVER);
  }

  create(data: GameOverData): void {
    this.inputManager = new InputManager(this);
    this.characterId = data.characterId ?? 'puchi';

    this.cameras.main.setBackgroundColor(COLORS.deepOcean);
    const hasDesignedScreen = this.textures.exists(TEXTURE_KEYS.GAME_OVER_SCREEN);
    if (hasDesignedScreen) {
      this.addDesignedBackdrop();
    } else {
      this.addFallbackTitle();
    }

    const defeatSheet = this.characterId === 'pao' ? TEXTURE_KEYS.PAO_HIT_DEFEAT_SHEET : TEXTURE_KEYS.PUCHI_HIT_DEFEAT_SHEET;
    if (this.textures.exists(defeatSheet)) {
      const defeatedCharacter = this.add.sprite(GAME_WIDTH / 2, hasDesignedScreen ? 272 : 245, defeatSheet, 4);
      defeatedCharacter.setScale(hasDesignedScreen ? (this.characterId === 'pao' ? 0.28 : 0.26) : this.characterId === 'pao' ? 0.36 : 0.34);
      defeatedCharacter.setOrigin(0.5, 0.62);
      defeatedCharacter.setDepth(4);
      defeatedCharacter.play(`${this.characterId}-defeat`, true);
    }

    this.add
      .text(GAME_WIDTH / 2, hasDesignedScreen ? 382 : 348, `Stars: ${data.stars ?? 0}\nShells: ${data.shells ?? 0}`, {
        fontFamily: 'Arial, sans-serif',
        fontSize: hasDesignedScreen ? '25px' : '28px',
        fontStyle: hasDesignedScreen ? 'bold' : '',
        align: 'center',
        color: hasDesignedScreen ? '#fff7d6' : '#ffffff',
        stroke: hasDesignedScreen ? '#241446' : undefined,
        strokeThickness: hasDesignedScreen ? 4 : 0,
        lineSpacing: hasDesignedScreen ? 6 : 8,
      })
      .setOrigin(0.5)
      .setDepth(5);

    this.add
      .text(GAME_WIDTH / 2, hasDesignedScreen ? 470 : 454, 'Press Enter to retry\nPress Esc for title', {
        fontFamily: 'Arial, sans-serif',
        fontSize: hasDesignedScreen ? '24px' : '24px',
        fontStyle: hasDesignedScreen ? 'bold' : '',
        align: 'center',
        color: hasDesignedScreen ? '#ffe7b4' : '#c8f1f4',
        stroke: hasDesignedScreen ? '#241446' : undefined,
        strokeThickness: hasDesignedScreen ? 4 : 0,
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setDepth(5);
  }

  private addDesignedBackdrop(): void {
    const source = this.textures.get(TEXTURE_KEYS.GAME_OVER_SCREEN).getSourceImage() as HTMLImageElement;
    const coverScale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const cardScale = Math.min(GAME_WIDTH / source.width, GAME_HEIGHT / source.height) * 0.98;

    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.GAME_OVER_SCREEN)
      .setOrigin(0.5)
      .setScale(coverScale)
      .setTint(0x243168)
      .setAlpha(0.42)
      .setDepth(-20);

    this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.GAME_OVER_SCREEN)
      .setOrigin(0.5)
      .setScale(cardScale)
      .setDepth(-10);

    const overlay = this.add.graphics().setDepth(2);
    overlay.fillStyle(0xf4e4c8, 0.96);
    overlay.fillEllipse(GAME_WIDTH / 2, 250, 212, 142);
    overlay.lineStyle(5, 0x5b2f7f, 0.78);
    overlay.strokeEllipse(GAME_WIDTH / 2, 250, 220, 150);
    overlay.lineStyle(3, 0xf7c875, 0.96);
    overlay.strokeEllipse(GAME_WIDTH / 2, 250, 214, 144);
    overlay.lineStyle(1, 0xfff3d0, 0.92);
    overlay.strokeEllipse(GAME_WIDTH / 2, 250, 204, 134);
    overlay.fillStyle(0x201842, 0.92);
    overlay.fillRoundedRect(GAME_WIDTH / 2 - 134, 348, 268, 72, 10);
    overlay.lineStyle(2, 0xf7c875, 0.72);
    overlay.strokeRoundedRect(GAME_WIDTH / 2 - 134, 348, 268, 72, 10);
    overlay.fillStyle(0x201842, 0.9);
    overlay.fillRoundedRect(GAME_WIDTH / 2 - 178, 436, 356, 78, 12);
    overlay.lineStyle(2, 0xf7c875, 0.72);
    overlay.strokeRoundedRect(GAME_WIDTH / 2 - 178, 436, 356, 78, 12);
  }

  private addFallbackTitle(): void {
    this.add
      .text(GAME_WIDTH / 2, 74, 'Game Over', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '54px',
        fontStyle: 'bold',
        align: 'center',
        color: '#fff3b0',
        stroke: '#7a4bc2',
        strokeThickness: 6,
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
