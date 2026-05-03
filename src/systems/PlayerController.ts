import Phaser from 'phaser';
import type { CharacterStats, PlayerEnvironment, PlayerInputState, PlayerUpdateResult } from '../types/game';

export class PlayerController {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private environment: PlayerEnvironment = 'normal';
  private wasOnGround = false;
  private animationLockedUntil = 0;
  private airJumpsRemaining = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    readonly character: CharacterStats,
    x: number,
    y: number,
    textureKey: string,
  ) {
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    const usingOrganizedSheet = textureKey.includes('spritesheet');
    const visualScale = character.id === 'pao' ? 0.33 : 0.31;
    const organizedOriginY = character.id === 'pao' ? 0.816 : 0.79;
    this.sprite.setScale(usingOrganizedSheet ? visualScale : 1);
    this.sprite.setOrigin(0.5, usingOrganizedSheet ? organizedOriginY : 0.82);
    this.sprite.setDepth(20);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setDragX(1200);
    this.sprite.setMaxVelocity(character.runSpeed, Math.abs(character.jumpVelocity) * 1.25);
    if (usingOrganizedSheet && character.id === 'pao') {
      this.sprite.setSize(70, 198);
      this.sprite.setOffset(145, 112);
    } else if (usingOrganizedSheet) {
      this.sprite.setSize(66, 192);
      this.sprite.setOffset(147, 108);
    } else if (textureKey.includes('pao')) {
      this.sprite.setSize(34, 70);
      this.sprite.setOffset(45, 42);
    } else {
      this.sprite.setSize(26, 56);
      this.sprite.setOffset(19, 20);
    }
    this.sprite.play(`${character.id}-idle`);
  }

  update(input: PlayerInputState): PlayerUpdateResult {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const startedOnGround = this.isOnGround(body);
    const speed = (input.run ? this.character.runSpeed : this.character.baseSpeed) * this.getSpeedMultiplier();
    let jumped = false;

    if (startedOnGround) {
      this.airJumpsRemaining = this.getMaxAirJumps();
    }

    if (input.left && !input.right) {
      this.sprite.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (input.right && !input.left) {
      this.sprite.setVelocityX(speed);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
    }

    if (input.jumpPressed && this.canJump(body)) {
      this.sprite.setVelocityY(this.getJumpVelocity());
      if (!startedOnGround && this.environment !== 'underwater') {
        this.airJumpsRemaining = Math.max(0, this.airJumpsRemaining - 1);
      }
      jumped = true;
    }

    this.updateAnimation(startedOnGround);

    const landed = !this.wasOnGround && startedOnGround;
    this.wasOnGround = this.isOnGround(body);

    return { jumped, landed };
  }

  private isOnGround(body: Phaser.Physics.Arcade.Body): boolean {
    return body.blocked.down || body.touching.down;
  }

  respawn(x: number, y: number): void {
    this.sprite.setPosition(x, y);
    this.sprite.setVelocity(0, 0);
    this.wasOnGround = false;
    this.airJumpsRemaining = 0;
  }

  playPowerPose(durationMs = 350): void {
    this.animationLockedUntil = this.scene.time.now + durationMs;
    this.sprite.play(`${this.character.id}-power`, true);
  }

  playHurtPose(durationMs = 420): void {
    this.animationLockedUntil = this.scene.time.now + durationMs;
    this.sprite.play(`${this.character.id}-hit`, true);
  }

  playWinPose(): void {
    this.animationLockedUntil = Number.POSITIVE_INFINITY;
    this.sprite.play(`${this.character.id}-win`, true);
  }

  setEnvironment(environment: PlayerEnvironment): void {
    if (this.environment === environment) {
      return;
    }

    this.environment = environment;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    if (environment === 'underwater') {
      body.setGravityY(-560);
      this.sprite.setDragY(180);
      this.sprite.setMaxVelocity(this.character.runSpeed * 0.75, 260);
    } else {
      body.setGravityY(0);
      this.sprite.setDragY(0);
      this.sprite.setMaxVelocity(this.character.runSpeed, Math.abs(this.character.jumpVelocity) * 1.25);
    }
  }

  private getSpeedMultiplier(): number {
    if (this.environment === 'shallow') {
      return 0.65;
    }

    if (this.environment === 'underwater') {
      return 0.75;
    }

    return 1;
  }

  private getJumpVelocity(): number {
    if (this.environment === 'shallow') {
      return this.character.jumpVelocity * 0.9;
    }

    if (this.environment === 'underwater') {
      return -250;
    }

    return this.character.jumpVelocity;
  }

  private canJump(body: Phaser.Physics.Arcade.Body): boolean {
    if (this.environment === 'underwater' || this.isOnGround(body)) {
      return true;
    }

    return this.airJumpsRemaining > 0;
  }

  private getMaxAirJumps(): number {
    return this.character.id === 'puchi' ? 1 : 0;
  }

  private updateAnimation(onGround: boolean): void {
    if (this.scene.time.now < this.animationLockedUntil) {
      return;
    }

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const animationBaseKey = this.character.id;

    if (!onGround && this.environment !== 'underwater') {
      this.sprite.play(body.velocity.y > 20 ? `${animationBaseKey}-fall` : `${animationBaseKey}-jump`, true);
      return;
    }

    if (Math.abs(body.velocity.x) > 8) {
      this.sprite.play(`${animationBaseKey}-run`, true);
      return;
    }

    this.sprite.play(`${animationBaseKey}-idle`, true);
  }
}
