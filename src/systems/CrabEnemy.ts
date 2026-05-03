import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../data/constants';
import type { CrabEnemyData } from '../types/game';

export class CrabEnemy {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private direction = 1;
  private isStunned = false;
  private isDefeated = false;
  private stunEndsAt = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly data: CrabEnemyData,
  ) {
    const textureKey = scene.textures.exists(TEXTURE_KEYS.CRAB_SHEET) ? TEXTURE_KEYS.CRAB_SHEET : TEXTURE_KEYS.CRAB;
    this.sprite = scene.physics.add.sprite(data.x, data.y, textureKey);
    if (textureKey === TEXTURE_KEYS.CRAB_SHEET) {
      this.sprite.setScale(0.24);
      this.sprite.play('crab-walk');
    }
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setBounce(0);
    if (textureKey === TEXTURE_KEYS.CRAB_SHEET) {
      this.sprite.setSize(190, 96);
      this.sprite.setOffset(62, 128);
    } else {
      this.sprite.setSize(44, 26);
      this.sprite.setOffset(8, 20);
    }
    this.sprite.setVelocityX(data.speed);
  }

  update(time: number): void {
    if (!this.sprite.active) {
      return;
    }

    if (this.isDefeated) {
      this.sprite.setVelocityX(0);
      return;
    }

    if (this.isStunned) {
      if (time >= this.stunEndsAt) {
        this.isStunned = false;
        this.sprite.setTint(0xffffff);
        if (this.sprite.texture.key === TEXTURE_KEYS.CRAB_SHEET) {
          this.sprite.play('crab-walk', true);
        }
      } else {
        this.sprite.setVelocityX(0);
        return;
      }
    }

    if (this.sprite.x <= this.data.patrolMinX) {
      this.direction = 1;
    } else if (this.sprite.x >= this.data.patrolMaxX) {
      this.direction = -1;
    }

    this.sprite.setVelocityX(this.data.speed * this.direction);
    this.sprite.setFlipX(this.direction < 0);
  }

  stun(durationMs: number): void {
    if (this.isDefeated) {
      return;
    }

    this.isStunned = true;
    this.stunEndsAt = this.scene.time.now + durationMs;
    this.sprite.setVelocityX(0);
    this.sprite.setTint(0xc8f1f4);
    if (this.sprite.texture.key === TEXTURE_KEYS.CRAB_SHEET) {
      this.sprite.play('crab-stun', true);
    }
  }

  get stunned(): boolean {
    return this.isStunned;
  }

  defeat(): void {
    if (this.isDefeated) {
      return;
    }

    this.isDefeated = true;
    this.isStunned = true;
    this.sprite.body?.stop();
    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.enable = false;
    }
    this.sprite.setVelocity(0, 0);
    this.sprite.setTint(0xfff3b0);
    if (this.sprite.texture.key === TEXTURE_KEYS.CRAB_SHEET) {
      this.sprite.play('crab-defeat', true);
    }

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 0.25,
      scaleY: 0.25,
      y: this.sprite.y - 22,
      angle: 40,
      duration: 850,
      ease: 'Sine.easeInOut',
      onComplete: () => this.sprite.destroy(),
    });
  }
}
