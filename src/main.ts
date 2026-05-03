import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { GameOverScene } from './scenes/GameOverScene';
import { Level1Scene } from './scenes/Level1Scene';
import { LevelCompleteScene } from './scenes/LevelCompleteScene';
import { StoryScene } from './scenes/StoryScene';
import { TitleScene } from './scenes/TitleScene';
import { UIScene } from './scenes/UIScene';
import { GAME_HEIGHT, GAME_WIDTH } from './data/constants';

import './style.css';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#1f5e8f',
  pixelArt: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900, x: 0 },
      debug: false,
    },
  },
  scene: [
    BootScene,
    TitleScene,
    StoryScene,
    CharacterSelectScene,
    Level1Scene,
    UIScene,
    GameOverScene,
    LevelCompleteScene,
  ],
};

new Phaser.Game(config);
