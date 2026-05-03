import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../data/constants';
import type { GiantGooseBossData } from '../types/game';

type GooseBossState = 'idle' | 'walk' | 'defeated';

const GOOSE_BOSS_CONFIG = {
  scale: 1.18,
  patrolSpeed: 30,
  hitInvulnerabilityMs: 1000,
  body: {
    width: 154,
    height: 86,
    offsetX: 103,
    offsetY: 94,
  },
} as const;

export class GiantGooseBoss {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  readonly maxHealth: number;
  health: number;

  private state: GooseBossState = 'idle';
  private nextHitAllowedAt = 0;
  private defeated = false;
  private direction = -1;
  private readonly patrolMinX: number;
  private readonly patrolMaxX: number;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly data: GiantGooseBossData,
  ) {
    this.maxHealth = Math.max(1, data.maxHealth);
    this.health = this.maxHealth;
    this.patrolMinX = data.patrolMinX ?? data.x - 240;
    this.patrolMaxX = data.patrolMaxX ?? data.x + 240;

    this.sprite = scene.physics.add.sprite(data.x, data.y, TEXTURE_KEYS.GIANT_GOOSE_SHEET, 0);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setScale(GOOSE_BOSS_CONFIG.scale);
    this.sprite.setDepth(8);
    this.sprite.play('giant-goose-idle');

    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.setAllowGravity(false);
      body.setImmovable(true);
      body.setSize(GOOSE_BOSS_CONFIG.body.width, GOOSE_BOSS_CONFIG.body.height);
      body.setOffset(GOOSE_BOSS_CONFIG.body.offsetX, GOOSE_BOSS_CONFIG.body.offsetY);
    }
  }

  update(time: number, _playerX?: number): void {
    if (this.defeated || !this.sprite.active) {
      return;
    }

    this.sprite.y = this.data.y;

    this.updatePatrol();
  }

  hit(): boolean {
    if (this.defeated || this.scene.time.now < this.nextHitAllowedAt) {
      return false;
    }

    this.health = Math.max(0, this.health - 1);
    this.nextHitAllowedAt = this.scene.time.now + GOOSE_BOSS_CONFIG.hitInvulnerabilityMs;
    this.sprite.y = this.data.y;

    if (this.health <= 0) {
      this.defeat();
      return true;
    }

    this.state = 'walk';
    this.updatePatrol();

    return true;
  }

  get isDefeated(): boolean {
    return this.defeated;
  }

  private updatePatrol(): void {
    if (this.sprite.x <= this.patrolMinX) {
      this.direction = 1;
    } else if (this.sprite.x >= this.patrolMaxX) {
      this.direction = -1;
    }

    this.state = 'walk';
    this.sprite.setVelocityX(GOOSE_BOSS_CONFIG.patrolSpeed * this.direction);
    this.sprite.setFlipX(this.direction > 0);
    this.sprite.play('giant-goose-walk', true);
  }

  private defeat(): void {
    this.defeated = true;
    this.state = 'defeated';
    this.sprite.setVelocityX(0);
    this.sprite.y = this.data.y;
    this.sprite.setScale(GOOSE_BOSS_CONFIG.scale);
    this.sprite.play('giant-goose-defeated', true);

    const body = this.sprite.body as Phaser.Physics.Arcade.Body | null;
    if (body) {
      body.enable = false;
    }

    this.scene.tweens.killTweensOf(this.sprite);
  }
}
