import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { audioManager } from '../systems/AudioManager';
import { InputManager } from '../systems/InputManager';

export class StoryScene extends Phaser.Scene {
  private inputManager?: InputManager;

  constructor() {
    super(SCENE_KEYS.STORY);
  }

  create(): void {
    this.inputManager = new InputManager(this);
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.STORY_SCREEN).setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
  }

  update(): void {
    if (this.inputManager?.wasMutePressed()) {
      audioManager.toggleMute();
    }

    if (this.inputManager?.wasEnterPressed()) {
      audioManager.playMenuSelect();
      this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
    }
  }
}
