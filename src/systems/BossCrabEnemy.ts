import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../data/constants';
import type { BossCrabEnemyData } from '../types/game';

export class BossCrabEnemy {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  private health: number;
  private nextHitAllowedAt = 0;
  private defeated = false;
  private stunnedUntil = 0;
  private direction = -1;
  private readonly patrolMinX: number;
  private readonly patrolMaxX: number;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly data: BossCrabEnemyData,
  ) {
    this.health = Math.max(1, data.hitsToDefeat);
    this.patrolMinX = data.x - 190;
    this.patrolMaxX = data.x + 190;
    this.sprite = scene.physics.add.sprite(data.x, data.y, TEXTURE_KEYS.BOSS_CRAB_SHEET, 1);
    this.sprite.setOrigin(0.5, 0.86);
    this.sprite.setScale(1.28);
    this.sprite.setDepth(7);
    this.sprite.play('boss-crab-idle');

    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setAllowGravity(false);
      body.setImmovable(true);
      body.setSize(370, 154);
      body.setOffset(96, 136);
    }
    this.sprite.setVelocityX(-42);
  }

  update(time: number): void {
    if (this.defeated || !this.sprite.active) {
      return;
    }

    if (time < this.stunnedUntil) {
      this.sprite.setVelocityX(0);
      return;
    }

    this.sprite.clearTint();
    this.sprite.play('boss-crab-idle', true);

    if (this.sprite.x <= this.patrolMinX) {
      this.direction = 1;
    } else if (this.sprite.x >= this.patrolMaxX) {
      this.direction = -1;
    }

    this.sprite.setVelocityX(42 * this.direction);
    this.sprite.setFlipX(this.direction > 0);
  }

  hit(): boolean {
    if (this.defeated || this.scene.time.now < this.nextHitAllowedAt) {
      return false;
    }

    this.health -= 1;
    this.nextHitAllowedAt = this.scene.time.now + 850;

    if (this.health <= 0) {
      this.collapse();
      return true;
    }

    this.stunnedUntil = this.scene.time.now + 700;
    this.sprite.setVelocityX(0);
    this.sprite.play('boss-crab-stunned', true);
    this.sprite.setTint(0xfff3b0);
    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 6,
      duration: 90,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        if (!this.defeated && this.scene.time.now >= this.stunnedUntil) {
          this.sprite.clearTint();
          this.sprite.play('boss-crab-idle', true);
        }
      },
    });

    return true;
  }

  private collapse(): void {
    this.defeated = true;
    this.stunnedUntil = Number.POSITIVE_INFINITY;
    this.sprite.setVelocityX(0);
    this.sprite.clearTint();
    this.sprite.play('boss-crab-collapse', true);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.enable = false;
    }

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y + 18,
      duration: 1250,
      delay: 1150,
      ease: 'Sine.easeInOut',
      onComplete: () => this.sprite.destroy(),
    });
  }

  get isDefeated(): boolean {
    return this.defeated;
  }
}
