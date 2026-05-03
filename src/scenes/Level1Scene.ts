import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { COLORS, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { LEVEL_1_DATA } from '../data/level1';
import type { CrabEnemy } from '../systems/CrabEnemy';
import { audioManager } from '../systems/AudioManager';
import type { GiantGooseBoss } from '../systems/GiantGooseBoss';
import { InputManager } from '../systems/InputManager';
import { LevelBuilder } from '../systems/LevelBuilder';
import type { ParallaxBackground } from '../systems/ParallaxBackground';
import { PlayerController } from '../systems/PlayerController';
import type { CharacterId, LevelStartData, PlayerEnvironment, PowerState } from '../types/game';

export class Level1Scene extends Phaser.Scene {
  private inputManager?: InputManager;
  private player?: PlayerController;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms?: Phaser.Physics.Arcade.Group;
  private crabs: CrabEnemy[] = [];
  private gooseBosses: GiantGooseBoss[] = [];
  private bossGateHint?: Phaser.GameObjects.Text;
  private starsCollected = 0;
  private shellsCollected = 0;
  private totalShells = 0;
  private characterName = 'Puchi';
  private characterId: CharacterId = 'puchi';
  private hearts = 3;
  private invulnerableUntil = 0;
  private isRespawning = false;
  private respawnPoint = { x: LEVEL_1_DATA.startPosition.x, y: LEVEL_1_DATA.startPosition.y };
  private power: PowerState = {
    readyAt: 0,
    activeUntil: 0,
  };
  private basketballs?: Phaser.Physics.Arcade.Group;
  private shallowWater?: Phaser.Physics.Arcade.StaticGroup;
  private deepWater?: Phaser.Physics.Arcade.StaticGroup;
  private currentEnvironment: PlayerEnvironment = 'normal';
  private environmentText?: Phaser.GameObjects.Text;
  private levelComplete = false;
  private isPaused = false;
  private pauseOverlay?: Phaser.GameObjects.Container;
  private parallaxBackground?: ParallaxBackground;

  constructor() {
    super(SCENE_KEYS.LEVEL_1);
  }

  create(data: LevelStartData): void {
    const characterId: CharacterId = data.characterId ?? 'puchi';
    const character = CHARACTERS[characterId];
    const spriteKey = character.id === 'puchi' ? TEXTURE_KEYS.PUCHI_SHEET : TEXTURE_KEYS.PAO_SHEET;
    this.characterId = characterId;
    this.characterName = character.name;
    this.totalShells = LEVEL_1_DATA.collectibles.filter((collectible) => collectible.kind === 'shell').length;
    this.starsCollected = 0;
    this.shellsCollected = 0;
    this.hearts = 3;
    this.invulnerableUntil = 0;
    this.isRespawning = false;
    this.respawnPoint = { ...LEVEL_1_DATA.startPosition };
    this.levelComplete = false;
    this.power = {
      readyAt: 0,
      activeUntil: 0,
    };

    this.inputManager = new InputManager(this);
    this.physics.world.setBounds(0, 0, LEVEL_1_DATA.width, LEVEL_1_DATA.height);
    this.physics.world.resume();

    const builder = new LevelBuilder(this);
    const levelObjects = builder.build(LEVEL_1_DATA);
    this.platforms = levelObjects.platforms;
    this.movingPlatforms = levelObjects.movingPlatforms;
    this.crabs = levelObjects.crabs;
    this.gooseBosses = levelObjects.gooseBosses;
    this.shallowWater = levelObjects.shallowWater;
    this.deepWater = levelObjects.deepWater;
    this.parallaxBackground = levelObjects.parallaxBackground;

    this.player = new PlayerController(
      this,
      character,
      LEVEL_1_DATA.startPosition.x,
      LEVEL_1_DATA.startPosition.y,
      spriteKey,
    );
    this.basketballs = this.physics.add.group({
      allowGravity: true,
      collideWorldBounds: false,
    });
    this.physics.add.collider(this.player.sprite, this.platforms);
    this.physics.add.collider(this.player.sprite, this.movingPlatforms);
    this.physics.add.collider(this.basketballs, this.platforms, (projectile) => {
      this.popBasketball(projectile as Phaser.Physics.Arcade.Sprite);
    });
    this.physics.add.collider(this.basketballs, this.movingPlatforms, (projectile) => {
      this.popBasketball(projectile as Phaser.Physics.Arcade.Sprite);
    });
    this.crabs.forEach((crab) => {
      this.physics.add.collider(crab.sprite, this.platforms!);
      this.physics.add.overlap(this.player!.sprite, crab.sprite, () => {
        this.damagePlayer(crab.sprite.x < this.player!.sprite.x ? 1 : -1);
        if (!crab.stunned) {
          crab.stun(650);
          audioManager.playEnemyStun();
        }
      });
      this.physics.add.overlap(this.basketballs!, crab.sprite, (projectile) => {
        this.hitCrabWithBasketball(projectile as Phaser.Physics.Arcade.Sprite, crab);
      });
    });
    this.gooseBosses.forEach((gooseBoss) => {
      this.physics.add.overlap(this.player!.sprite, gooseBoss.sprite, () => {
        if (!gooseBoss.isDefeated) {
          this.damagePlayer(gooseBoss.sprite.x < this.player!.sprite.x ? 1 : -1);
        }
      });
      this.physics.add.overlap(this.basketballs!, gooseBoss.sprite, (projectile) => {
        this.hitGooseBossWithProjectile(projectile as Phaser.Physics.Arcade.Sprite, gooseBoss);
      });
    });
    this.physics.add.overlap(this.player.sprite, levelObjects.stars, (_player, pickup) => {
      this.collectPickup(pickup as Phaser.GameObjects.GameObject, 'star');
    });
    this.physics.add.overlap(this.player.sprite, levelObjects.shells, (_player, pickup) => {
      this.collectPickup(pickup as Phaser.GameObjects.GameObject, 'shell');
    });
    this.physics.add.overlap(this.player.sprite, levelObjects.checkpoints, (_player, checkpoint) => {
      this.activateCheckpoint(checkpoint as Phaser.GameObjects.GameObject);
    });
    this.physics.add.overlap(this.player.sprite, levelObjects.goals, () => {
      this.completeLevel();
    });

    this.cameras.main.setBounds(0, 0, LEVEL_1_DATA.width, LEVEL_1_DATA.height);
    this.cameras.main.startFollow(this.player.sprite, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(160, 90);
    this.scene.launch(SCENE_KEYS.UI, {
      characterId,
      characterName: character.name,
      totalShells: this.totalShells,
    });
    this.emitHudUpdate();

    this.environmentText = this.add
      .text(24, 104, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#fff3b0',
        stroke: '#1f5e8f',
        strokeThickness: 3,
      })
      .setScrollFactor(0);

    this.createPauseOverlay();
  }

  update(time: number): void {
    if (!this.inputManager || !this.player || this.levelComplete) {
      return;
    }

    if (this.inputManager.wasEscapePressed()) {
      this.togglePause();
      return;
    }

    if (this.inputManager.wasMutePressed()) {
      audioManager.toggleMute();
    }

    if (this.isPaused) {
      if (this.inputManager.wasEnterPressed()) {
        this.scene.stop(SCENE_KEYS.UI);
        this.scene.start(SCENE_KEYS.CHARACTER_SELECT);
      }
      return;
    }

    if (this.inputManager.wasPowerPressed()) {
      this.usePower();
    }

    this.updatePlayerEnvironment();

    if (!this.isRespawning) {
      const playerResult = this.player.update(this.inputManager.getMovementState());
      if (playerResult.jumped) {
        audioManager.playJump();
      }
      if (playerResult.landed) {
        audioManager.playLand();
      }
    }

    if (this.player.sprite.y > LEVEL_1_DATA.height + 80) {
      this.damagePlayer(0, true);
    }

    this.updateInvulnerabilityFlash(time);
    this.updateBasketballs();
    this.parallaxBackground?.update(this.cameras.main.scrollX, time);
    this.crabs.forEach((crab) => crab.update(time));
    this.gooseBosses.forEach((gooseBoss) => gooseBoss.update(time, this.player?.sprite.x));
    this.emitHudUpdate();
  }

  private updatePlayerEnvironment(): void {
    if (!this.player || !this.shallowWater || !this.deepWater) {
      return;
    }

    let nextEnvironment: PlayerEnvironment = 'normal';

    if (this.physics.overlap(this.player.sprite, this.deepWater)) {
      nextEnvironment = 'underwater';
    } else if (this.physics.overlap(this.player.sprite, this.shallowWater)) {
      nextEnvironment = 'shallow';
    }

    this.currentEnvironment = nextEnvironment;
    this.player.setEnvironment(nextEnvironment);

    if (nextEnvironment === 'underwater') {
      this.environmentText?.setText('Underwater: slower swim movement');
    } else if (nextEnvironment === 'shallow') {
      this.environmentText?.setText('Shallow water: movement slowed');
    } else {
      this.environmentText?.setText('');
    }
  }

  private collectPickup(pickup: Phaser.GameObjects.GameObject, kind: 'star' | 'shell'): void {
    if (!pickup.active) {
      return;
    }

    if (kind === 'star') {
      this.starsCollected += 1;
      audioManager.playCollectStar();
    } else {
      this.shellsCollected += 1;
      audioManager.playCollectShell();
    }

    this.tweens.killTweensOf(pickup);
    const position = this.getGameObjectPosition(pickup);
    pickup.destroy();
    this.createPickupBurst(position.x, position.y, kind);
    this.emitHudUpdate();
  }

  private emitHudUpdate(): void {
    this.game.events.emit('hud:update', {
      hearts: this.hearts,
      stars: this.starsCollected,
      shells: this.shellsCollected,
      totalShells: this.totalShells,
      characterName: this.characterName,
      powerText: this.getPowerText(),
    });
  }

  private damagePlayer(knockbackDirection: number, forceRespawn = false): void {
    if (!this.player || this.isRespawning || this.time.now < this.invulnerableUntil) {
      return;
    }

    this.hearts = Math.max(0, this.hearts - 1);
    audioManager.playDamage();
    this.player.playHurtPose();
    this.emitHudUpdate();

    if (this.hearts <= 0) {
      this.endGame();
      return;
    }

    this.invulnerableUntil = this.time.now + 1250;
    this.player.sprite.setTint(0xfff3b0);

    if (forceRespawn) {
      this.respawnPlayer();
      return;
    }

    this.player.sprite.setVelocity(knockbackDirection * 210, -250);
  }

  private respawnPlayer(): void {
    if (!this.player) {
      return;
    }

    this.isRespawning = true;
    this.player.sprite.setVelocity(0, 0);
    this.player.sprite.setVisible(false);

    this.time.delayedCall(650, () => {
      if (!this.player) {
        return;
      }

      this.player.respawn(this.respawnPoint.x, this.respawnPoint.y);
      this.player.sprite.setVisible(true);
      this.player.sprite.setTint(0xfff3b0);
      this.isRespawning = false;
      this.invulnerableUntil = this.time.now + 900;
    });
  }

  private activateCheckpoint(checkpoint: Phaser.GameObjects.GameObject): void {
    if (!this.player) {
      return;
    }

    const sprite = checkpoint as Phaser.Physics.Arcade.Sprite;
    if (sprite.getData('activated')) {
      return;
    }

    sprite.setData('activated', true);
    if (sprite.getData('gafoCheckpoint')) {
      this.respawnPoint = { x: sprite.x + 60, y: sprite.y };
      audioManager.playCheckpoint();
      return;
    }

    sprite.setTint(0xffd84d);
    if (sprite.texture.key === TEXTURE_KEYS.CHECKPOINT_SHEET) {
      sprite.clearTint();
      sprite.play('checkpoint-wave', true);
    }
    this.respawnPoint = { x: sprite.x + 40, y: sprite.y - 80 };
    audioManager.playCheckpoint();

    if (sprite.getData('levelCompleteTrigger')) {
      this.finishLevelFromCheckpoint(sprite.x, sprite.y);
    }
  }

  private updateInvulnerabilityFlash(time: number): void {
    if (!this.player) {
      return;
    }

    if (time >= this.invulnerableUntil) {
      this.player.sprite.clearTint();
      this.player.sprite.setAlpha(1);
      return;
    }

    this.player.sprite.setAlpha(Math.floor(time / 100) % 2 === 0 ? 0.55 : 1);
  }

  private endGame(): void {
    this.scene.stop(SCENE_KEYS.UI);
    this.scene.start(SCENE_KEYS.GAME_OVER, {
      characterId: this.characterId,
      stars: this.starsCollected,
      shells: this.shellsCollected,
    });
  }

  private completeLevel(): void {
    if (this.levelComplete) {
      return;
    }

    if (this.gooseBosses.some((gooseBoss) => !gooseBoss.isDefeated)) {
      this.showBossGateHint();
      return;
    }

    this.levelComplete = true;
    this.physics.world.pause();
    this.player?.sprite.setVelocity(0, 0);
    this.player?.playWinPose();
    this.drawPowerCircle(4130, 412, 120, COLORS.magicGlow);
    audioManager.playGoalClear();
    this.scene.stop(SCENE_KEYS.UI);
    this.time.delayedCall(450, () => {
      this.scene.start(SCENE_KEYS.LEVEL_COMPLETE, {
        characterId: this.characterId,
        stars: this.starsCollected,
        shells: this.shellsCollected,
        totalShells: this.totalShells,
      });
    });
  }

  private finishLevelFromCheckpoint(x: number, y: number): void {
    if (this.levelComplete) {
      return;
    }

    this.levelComplete = true;
    this.physics.world.pause();
    this.player?.sprite.setVelocity(0, 0);
    this.player?.playWinPose();
    this.drawPowerCircle(x, y - 70, 120, COLORS.magicGlow);
    audioManager.playGoalClear();

    const clearText = this.add
      .text(x, y - 160, 'Level 1 Clear!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#fff3b0',
        stroke: '#1f5e8f',
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: clearText,
      y: clearText.y - 18,
      duration: 900,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
    });

    this.time.delayedCall(3000, () => {
      this.scene.stop(SCENE_KEYS.UI);
      this.scene.start(SCENE_KEYS.LEVEL_COMPLETE, {
        characterId: this.characterId,
        stars: this.starsCollected,
        shells: this.shellsCollected,
        totalShells: this.totalShells,
      });
    });
  }

  private showBossGateHint(): void {
    if (!this.player) {
      return;
    }

    this.bossGateHint?.destroy();
    this.bossGateHint = this.add
      .text(this.player.sprite.x, this.player.sprite.y - 120, 'Defeat the Giant Goose first!', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#fff3b0',
        stroke: '#1f5e8f',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.tweens.add({
      targets: this.bossGateHint,
      y: this.bossGateHint.y - 18,
      alpha: 0,
      duration: 950,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.bossGateHint?.destroy();
        this.bossGateHint = undefined;
      },
    });
  }

  private usePower(): void {
    if (!this.player || this.time.now < this.power.readyAt) {
      return;
    }

    if (this.characterId === 'puchi') {
      this.useSparkleBurst();
      this.power.readyAt = this.time.now + 2000;
    } else {
      this.throwBasketball();
      this.power.readyAt = this.time.now + 1100;
    }

    this.player.playPowerPose();
    this.emitHudUpdate();
    audioManager.playPowerUse();
  }

  private useSparkleBurst(): void {
    if (!this.player) {
      return;
    }

    const radius = 72;
    this.drawPowerCircle(this.player.sprite.x, this.player.sprite.y, radius, COLORS.puchiPink);
    this.throwPuchiDogStuffy();

    this.crabs.forEach((crab) => {
      const distance = Phaser.Math.Distance.Between(this.player!.sprite.x, this.player!.sprite.y, crab.sprite.x, crab.sprite.y);
      if (distance <= radius) {
        crab.defeat();
        this.createPickupBurst(crab.sprite.x, crab.sprite.y, 'star');
        audioManager.playEnemyStun();
      }
    });

    this.gooseBosses.forEach((gooseBoss) => {
      const distance = Phaser.Math.Distance.Between(this.player!.sprite.x, this.player!.sprite.y, gooseBoss.sprite.x, gooseBoss.sprite.y);
      if (distance <= radius + 60) {
        this.hitGooseBoss(gooseBoss, this.player!.sprite.x, this.player!.sprite.y);
      }
    });
  }

  private throwPuchiDogStuffy(): void {
    if (!this.player) {
      return;
    }

    const direction = this.player.sprite.flipX ? -1 : 1;
    const dogStuffy = this.basketballs?.create(
      this.player.sprite.x + direction * 28,
      this.player.sprite.y - 24,
      TEXTURE_KEYS.PROJECTILES_SHEET,
      16,
    ) as Phaser.Physics.Arcade.Sprite | undefined;

    if (!dogStuffy) {
      return;
    }

    dogStuffy.setDepth(10);
    dogStuffy.setScale(0.24);
    dogStuffy.setFlipX(direction < 0);
    dogStuffy.play('puchi-dog-stuffy-projectile');
    dogStuffy.setCircle(48, 32, 110);
    dogStuffy.setBounce(0.3);
    dogStuffy.setVelocity(direction * 360, -110);
    dogStuffy.setAngularVelocity(direction * 420);
    dogStuffy.setData('expiresAt', this.time.now + 1450);

    this.tweens.add({
      targets: dogStuffy,
      scale: 0.28,
      duration: 90,
      yoyo: true,
      repeat: 1,
    });
  }

  private throwBasketball(): void {
    if (!this.player) {
      return;
    }

    const direction = this.player.sprite.flipX ? -1 : 1;
    const basketball = this.basketballs?.create(
      this.player.sprite.x + direction * 28,
      this.player.sprite.y - 18,
      TEXTURE_KEYS.PROJECTILES_SHEET,
      0,
    ) as Phaser.Physics.Arcade.Sprite | undefined;

    if (!basketball) {
      return;
    }

    basketball.setDepth(10);
    basketball.setScale(0.22);
    basketball.play('pao-basketball-projectile');
    basketball.setCircle(52, 26, 100);
    basketball.setBounce(0.55);
    basketball.setVelocity(direction * 420, -145);
    basketball.setAngularVelocity(direction * 720);
    basketball.setData('expiresAt', this.time.now + 1600);

    this.tweens.add({
      targets: basketball,
      scale: 0.26,
      duration: 90,
      yoyo: true,
      repeat: 1,
    });
  }

  private drawPowerCircle(x: number, y: number, radius: number, color: number): void {
    const pulse = this.add.circle(x, y, 10, color, 0.2);
    pulse.setStrokeStyle(4, COLORS.magicGlow, 0.9);
    this.tweens.add({
      targets: pulse,
      radius,
      alpha: 0,
      duration: 260,
      ease: 'Sine.easeOut',
      onComplete: () => pulse.destroy(),
    });
  }

  private updateBasketballs(): void {
    if (!this.basketballs) {
      return;
    }

    this.basketballs.children.each((child) => {
      const basketball = child as Phaser.Physics.Arcade.Sprite;
      const expiresAt = basketball.getData('expiresAt') as number | undefined;
      if ((expiresAt !== undefined && this.time.now >= expiresAt) || basketball.y > LEVEL_1_DATA.height + 40) {
        this.popBasketball(basketball);
      }
      return true;
    });
  }

  private hitCrabWithBasketball(projectile: Phaser.Physics.Arcade.Sprite, crab: CrabEnemy): void {
    crab.defeat();
    this.createPickupBurst(projectile.x, projectile.y, 'shell');
    this.popBasketball(projectile);
    audioManager.playEnemyStun();
  }

  private hitGooseBossWithProjectile(projectile: Phaser.Physics.Arcade.Sprite, gooseBoss: GiantGooseBoss): void {
    if (projectile.getData('bossHitConsumed')) {
      return;
    }

    projectile.setData('bossHitConsumed', true);
    this.hitGooseBoss(gooseBoss, projectile.x, projectile.y);
    this.popBasketball(projectile);
  }

  private hitGooseBoss(gooseBoss: GiantGooseBoss, x: number, y: number): void {
    if (!gooseBoss.hit()) {
      return;
    }

    this.createPickupBurst(x, y, gooseBoss.isDefeated ? 'shell' : 'star');
    audioManager.playEnemyStun();
  }

  private popBasketball(projectile: Phaser.Physics.Arcade.Sprite): void {
    if (!projectile.active) {
      return;
    }

    this.showProjectileImpact(projectile.x, projectile.y, projectile.texture.key === TEXTURE_KEYS.PROJECTILES_SHEET);
    this.tweens.killTweensOf(projectile);
    projectile.destroy();
  }

  private showProjectileImpact(x: number, y: number, useSpriteSheet: boolean): void {
    if (!useSpriteSheet || !this.textures.exists(TEXTURE_KEYS.PROJECTILES_SHEET)) {
      return;
    }

    const impact = this.add.sprite(x, y, TEXTURE_KEYS.PROJECTILES_SHEET, 7);
    impact.setScale(0.22);
    impact.setDepth(12);
    impact.play('projectile-impact');
    impact.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => impact.destroy());
    this.time.delayedCall(350, () => {
      if (impact.active) {
        impact.destroy();
      }
    });
  }

  private getPowerText(): string {
    const remainingMs = Math.max(0, this.power.readyAt - this.time.now);
    if (remainingMs <= 0) {
      return 'Power: Ready';
    }

    return `Power: ${Math.ceil(remainingMs / 1000)}s`;
  }

  private createPauseOverlay(): void {
    const panel = this.add.rectangle(0, 0, 520, 220, COLORS.deepOcean, 0.88);
    panel.setStrokeStyle(4, COLORS.magicGlow, 0.9);

    const title = this.add
      .text(0, -62, 'Paused', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '42px',
        fontStyle: 'bold',
        color: '#fff3b0',
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(0, 34, 'Esc: resume\nEnter: choose character\nM: mute audio', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        align: 'center',
        color: '#ffffff',
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    this.pauseOverlay = this.add.container(480, 270, [panel, title, prompt]);
    this.pauseOverlay.setScrollFactor(0);
    this.pauseOverlay.setDepth(1000);
    this.pauseOverlay.setVisible(false);
  }

  private togglePause(): void {
    this.isPaused = !this.isPaused;
    this.pauseOverlay?.setVisible(this.isPaused);
    audioManager.playMenuSelect();

    if (this.isPaused) {
      this.physics.world.pause();
    } else {
      this.physics.world.resume();
    }
  }

  private getGameObjectPosition(gameObject: Phaser.GameObjects.GameObject): { x: number; y: number } {
    const sprite = gameObject as unknown as { x: number; y: number };
    return {
      x: sprite.x,
      y: sprite.y,
    };
  }

  private createPickupBurst(x: number, y: number, kind: 'star' | 'shell'): void {
    const color = kind === 'star' ? COLORS.starGold : COLORS.shellCream;

    for (let i = 0; i < 6; i += 1) {
      const angle = Phaser.Math.DegToRad(i * 60);
      const sparkle = this.add.circle(x, y, kind === 'star' ? 4 : 5, color, 0.9);
      this.tweens.add({
        targets: sparkle,
        x: x + Math.cos(angle) * 34,
        y: y + Math.sin(angle) * 26,
        alpha: 0,
        scale: 0.3,
        duration: 260,
        ease: 'Sine.easeOut',
        onComplete: () => sparkle.destroy(),
      });
    }
  }
}
