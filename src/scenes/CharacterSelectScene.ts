import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { COLORS, GAME_WIDTH, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { audioManager } from '../systems/AudioManager';
import { InputManager } from '../systems/InputManager';
import { drawSunlitShoresBackdrop } from '../systems/SceneVisuals';
import type { CharacterId, CharacterStats } from '../types/game';

const CHARACTER_ORDER: CharacterId[] = ['puchi', 'pao'];

interface CharacterCardView {
  container: Phaser.GameObjects.Container;
  panel: Phaser.GameObjects.Rectangle;
  portrait: Phaser.GameObjects.Image;
  expressionOverlay: Phaser.GameObjects.Container;
  happySparkles: Phaser.GameObjects.Container;
  nameText: Phaser.GameObjects.Text;
  descriptionText: Phaser.GameObjects.Text;
}

export class CharacterSelectScene extends Phaser.Scene {
  private inputManager?: InputManager;
  private selectedIndex = 0;
  private cards: CharacterCardView[] = [];

  constructor() {
    super(SCENE_KEYS.CHARACTER_SELECT);
  }

  create(): void {
    this.inputManager = new InputManager(this);
    drawSunlitShoresBackdrop(this);

    this.add
      .text(GAME_WIDTH / 2, 70, 'Choose Your Adventurer', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '38px',
        fontStyle: 'bold',
        color: '#fff3b0',
      })
      .setOrigin(0.5);

    this.cards = [];
    this.createCharacterCard(300, 270, CHARACTERS.puchi);
    this.createCharacterCard(660, 270, CHARACTERS.pao);

    this.add
      .text(GAME_WIDTH / 2, 486, 'Left/Right to choose    Enter to confirm', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '22px',
        color: '#c8f1f4',
      })
      .setOrigin(0.5);

    this.refreshSelection();
  }

  update(): void {
    if (!this.inputManager) {
      return;
    }

    if (this.inputManager.wasMutePressed()) {
      audioManager.toggleMute();
    }

    if (this.inputManager.wasLeftPressed()) {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      audioManager.playMenuSelect();
      this.refreshSelection();
    }

    if (this.inputManager.wasRightPressed()) {
      this.selectedIndex = Math.min(CHARACTER_ORDER.length - 1, this.selectedIndex + 1);
      audioManager.playMenuSelect();
      this.refreshSelection();
    }

    if (this.inputManager.wasEnterPressed()) {
      const characterId = CHARACTER_ORDER[this.selectedIndex];
      audioManager.playMenuSelect();
      this.scene.start(SCENE_KEYS.LEVEL_1, { characterId });
    }
  }

  private createCharacterCard(x: number, y: number, character: CharacterStats): void {
    const container = this.add.container(x, y);
    const panel = this.add.rectangle(0, 0, 300, 326, 0xfff0d4, 0.88);
    panel.setStrokeStyle(4, character.colors.accent, 0.9);

    const colorWash = this.add.rectangle(0, 0, 292, 318, character.colors.primary, 0.18);
    const portraitFrame = this.add.rectangle(0, -62, 214, 204, 0xfff7de, 0.96);
    portraitFrame.setStrokeStyle(3, character.colors.secondary, 0.68);

    const portraitKey = character.id === 'puchi' ? TEXTURE_KEYS.PORTRAIT_PUCHI : TEXTURE_KEYS.PORTRAIT_PAO;
    const portrait = this.add.image(0, -62, portraitKey).setDisplaySize(192, 192);

    const name = this.add
      .text(0, 72, character.name, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '36px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#1f315e',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const description = this.add
      .text(0, 126, character.description, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        align: 'center',
        color: '#fff3b0',
        stroke: '#1f5e8f',
        strokeThickness: 3,
        wordWrap: { width: 220 },
      })
      .setOrigin(0.5);

    const expressionOverlay = this.add.container(0, -60);
    const happySparkles = this.createHappySparkles(character.colors.secondary);

    container.add([
      panel,
      colorWash,
      portraitFrame,
      portrait,
      expressionOverlay,
      happySparkles,
      name,
      description,
    ]);

    this.cards.push({
      container,
      panel,
      portrait,
      expressionOverlay,
      happySparkles,
      nameText: name,
      descriptionText: description,
    });

  }

  private refreshSelection(): void {
    this.cards.forEach((card, index) => {
      const selected = index === this.selectedIndex;

      card.container.setScale(selected ? 1.06 : 0.96);
      card.container.setAlpha(selected ? 1 : 0.82);
      card.panel.setAlpha(selected ? 0.96 : 0.82);
      card.panel.setStrokeStyle(selected ? 6 : 3, selected ? COLORS.magicGlow : COLORS.shellCream, selected ? 1 : 0.7);
      card.portrait.clearTint();
      card.portrait.setAlpha(selected ? 1 : 0.82);
      card.portrait.setTint(selected ? 0xffffff : 0xd9d2e8);
      card.expressionOverlay.setVisible(!selected);
      card.happySparkles.setVisible(selected);
      card.nameText.setY(selected ? 74 : 72);
      card.descriptionText.setY(selected ? 128 : 126);

      this.tweens.killTweensOf(card.container);
      if (selected) {
        this.tweens.add({
          targets: card.container,
          y: card.container.y - 4,
          duration: 650,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      } else {
        card.container.setY(270);
      }
    });
  }

  private createHappySparkles(color: number): Phaser.GameObjects.Container {
    const sparkles = this.add.container(0, -60);
    const positions = [
      { x: -78, y: -72, scale: 0.75 },
      { x: 78, y: -52, scale: 0.95 },
      { x: -68, y: 64, scale: 0.58 },
    ];

    positions.forEach((position) => {
      const sparkle = this.add.graphics();
      sparkle.fillStyle(COLORS.magicGlow, 1);
      sparkle.fillRect(position.x - 2 * position.scale, position.y - 9 * position.scale, 4 * position.scale, 18 * position.scale);
      sparkle.fillRect(position.x - 9 * position.scale, position.y - 2 * position.scale, 18 * position.scale, 4 * position.scale);
      sparkle.fillStyle(color, 0.85);
      sparkle.fillRect(position.x - 1 * position.scale, position.y - 5 * position.scale, 2 * position.scale, 10 * position.scale);
      sparkle.fillRect(position.x - 5 * position.scale, position.y - 1 * position.scale, 10 * position.scale, 2 * position.scale);
      sparkles.add(sparkle);
    });

    return sparkles;
  }
}
