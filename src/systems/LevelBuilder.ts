import Phaser from 'phaser';
import { COLORS, TEXTURE_KEYS } from '../data/constants';
import { CrabEnemy } from './CrabEnemy';
import { GiantGooseBoss } from './GiantGooseBoss';
import { ParallaxBackground } from './ParallaxBackground';
import type {
  CollectibleData,
  LevelData,
  LevelDecorationData,
  LevelPlatformData,
  MovingPlatformData,
  WaterZoneData,
} from '../types/game';

export interface LevelBuildResult {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  movingPlatforms: Phaser.Physics.Arcade.Group;
  stars: Phaser.Physics.Arcade.StaticGroup;
  shells: Phaser.Physics.Arcade.StaticGroup;
  checkpoints: Phaser.Physics.Arcade.StaticGroup;
  goals: Phaser.Physics.Arcade.StaticGroup;
  shallowWater: Phaser.Physics.Arcade.StaticGroup;
  deepWater: Phaser.Physics.Arcade.StaticGroup;
  crabs: CrabEnemy[];
  gooseBosses: GiantGooseBoss[];
  parallaxBackground: ParallaxBackground;
}

export class LevelBuilder {
  constructor(private readonly scene: Phaser.Scene) {}

  build(level: LevelData): LevelBuildResult {
    const parallaxBackground = new ParallaxBackground(this.scene);
    this.drawCoordinateGuides(level);
    this.drawWaterZones(level.waterZones);

    const platforms = this.scene.physics.add.staticGroup();
    const movingPlatforms = this.scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const stars = this.scene.physics.add.staticGroup();
    const shells = this.scene.physics.add.staticGroup();
    const checkpoints = this.scene.physics.add.staticGroup();
    const goals = this.scene.physics.add.staticGroup();
    const shallowWater = this.scene.physics.add.staticGroup();
    const deepWater = this.scene.physics.add.staticGroup();

    level.waterZones.forEach((zone) => this.addWaterBody(zone, shallowWater, deepWater));
    level.platforms.forEach((platform) => this.addPlatform(platforms, platform));
    level.movingPlatforms?.forEach((platform) => this.addMovingPlatform(movingPlatforms, platform));
    level.collectibles.forEach((collectible) => this.addCollectible(collectible, stars, shells));
    const crabs = level.crabs.map((crab) => new CrabEnemy(this.scene, crab));
    const gooseBosses = level.gooseBosses?.map((gooseBoss) => new GiantGooseBoss(this.scene, gooseBoss)) ?? [];
    level.decorations.forEach((decoration) => this.addDecoration(decoration, checkpoints, goals));

    return {
      platforms,
      movingPlatforms,
      stars,
      shells,
      checkpoints,
      goals,
      shallowWater,
      deepWater,
      crabs,
      gooseBosses,
      parallaxBackground,
    };
  }

  private drawCoordinateGuides(level: LevelData): void {
    const guide = this.scene.add.graphics();
    guide.setDepth(900);
    const xLabels: Phaser.GameObjects.Text[] = [];
    const yLabels: Phaser.GameObjects.Text[] = [];

    for (let x = 0; x <= level.width; x += 100) {
      const isMajor = x % 500 === 0;
      guide.lineStyle(isMajor ? 2 : 1, isMajor ? COLORS.magicGlow : COLORS.seafoam, isMajor ? 0.72 : 0.28);
      guide.beginPath();
      guide.moveTo(x, 0);
      guide.lineTo(x, level.height);
      guide.strokePath();

      if (isMajor) {
        const label = this.scene.add
          .text(x + 4, 42, `x:${x}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#fff3b0',
            stroke: '#1f5e8f',
            strokeThickness: 3,
          })
          .setDepth(901);
        xLabels.push(label);
      }
    }

    for (let y = 0; y <= level.height; y += 100) {
      const isMajor = y % 200 === 0;
      guide.lineStyle(isMajor ? 2 : 1, isMajor ? COLORS.coralPink : COLORS.seafoam, isMajor ? 0.55 : 0.22);
      guide.beginPath();
      guide.moveTo(0, y);
      guide.lineTo(level.width, y);
      guide.strokePath();

      if (isMajor) {
        const label = this.scene.add
          .text(8, y + 4, `y:${y}`, {
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            color: '#ffd7df',
            stroke: '#1f5e8f',
            strokeThickness: 3,
          })
          .setDepth(901);
        yLabels.push(label);
      }
    }

    const updateGuideLabels = () => {
      const camera = this.scene.cameras.main;
      const visibleTopLabelY = camera.scrollY + 128;
      const visibleLeftLabelX = camera.scrollX + 10;

      xLabels.forEach((label) => {
        label.setY(visibleTopLabelY);
      });

      yLabels.forEach((label) => {
        label.setX(visibleLeftLabelX);
      });
    };

    updateGuideLabels();
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, updateGuideLabels);
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, updateGuideLabels);
    });
  }

  private drawWaterZones(waterZones: WaterZoneData[]): void {
    waterZones.forEach((zone) => {
      if (this.scene.textures.exists(TEXTURE_KEYS.WATER_SHEET)) {
        const frame = zone.kind === 'shallow' ? 25 : 26;
        const water = this.scene.add.tileSprite(zone.x, zone.y, zone.width, zone.height, TEXTURE_KEYS.WATER_SHEET, frame);
        water.setOrigin(0.5);
        water.setDepth(-4);
        water.setAlpha(zone.kind === 'shallow' ? 0.92 : 0.86);
        water.setTileScale(0.72);
      } else if (this.scene.textures.exists(TEXTURE_KEYS.WATER_FILL)) {
        const textureKey = zone.kind === 'shallow' && this.scene.textures.exists(TEXTURE_KEYS.WATER_GAP)
          ? TEXTURE_KEYS.WATER_GAP
          : TEXTURE_KEYS.WATER_FILL;
        const water = this.scene.add.tileSprite(zone.x, zone.y, zone.width, zone.height, textureKey);
        water.setOrigin(0.5);
        water.setDepth(-4);
        water.setAlpha(zone.kind === 'shallow' ? 0.9 : 0.82);
        water.setTileScale(zone.kind === 'shallow' ? 0.72 : 0.9);
      } else {
        const color = zone.kind === 'shallow' ? COLORS.shallowWater : COLORS.deepOcean;
        const alpha = zone.kind === 'shallow' ? 0.58 : 0.72;
        const water = this.scene.add.rectangle(zone.x, zone.y, zone.width, zone.height, color, alpha);
        water.setOrigin(0.5);
        water.setDepth(-4);
      }

      const wave = this.scene.add.graphics();
      wave.setDepth(-3);
      wave.lineStyle(2, COLORS.seafoam, 0.8);
      for (let x = zone.x - zone.width / 2; x < zone.x + zone.width / 2; x += 42) {
        wave.strokeRect(x, zone.y - zone.height / 2 + 8, 22, 2);
        wave.strokeRect(x + 24, zone.y - zone.height / 2 + 12, 18, 2);
      }
    });
  }

  private addWaterBody(
    zone: WaterZoneData,
    shallowWater: Phaser.Physics.Arcade.StaticGroup,
    deepWater: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    const group = zone.kind === 'shallow' ? shallowWater : deepWater;
    const body = group.create(zone.x, zone.y, 'placeholder-pixel');
    body.setDisplaySize(zone.width, zone.height);
    body.setVisible(false);
    body.refreshBody();
  }

  private addPlatform(group: Phaser.Physics.Arcade.StaticGroup, platform: LevelPlatformData): void {
    const topY = platform.y - platform.height / 2;

    const hasSolidSlices =
      this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_SOLID_LEFT) &&
      this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_SOLID_CENTER) &&
      this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_SOLID_RIGHT);
    const floatingTexture = this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_FLOATING_CLEAN)
      ? TEXTURE_KEYS.PLATFORM_FLOATING_CLEAN
      : TEXTURE_KEYS.PLATFORM_FLOATING;
    const platformTexture = platform.style !== 'beach' && this.scene.textures.exists(floatingTexture)
      ? floatingTexture
      : hasSolidSlices || this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_SOLID)
        ? TEXTURE_KEYS.PLATFORM_SOLID
        : undefined;

    if (platformTexture === TEXTURE_KEYS.PLATFORM_SOLID && hasSolidSlices) {
      this.addSolidPlatformVisual(platform.x, topY, platform.width);
    } else if (platformTexture) {
      if (platformTexture === floatingTexture) {
        this.addFloatingPlatformVisual(platform.x, topY);
      } else {
        const visualHeight = 148;
      const transparentTopPadding = platformTexture === TEXTURE_KEYS.PLATFORM_SOLID ? 15 : 0;
      const platformVisual = this.scene.add.tileSprite(
        platform.x,
        topY - transparentTopPadding,
        platform.width,
        visualHeight,
        platformTexture,
      );
      platformVisual.setOrigin(0.5, 0);
      platformVisual.setDepth(-3);
      }
    } else if (this.scene.textures.exists(TEXTURE_KEYS.SUNLIT_SHORES_PLATFORM)) {
      const visualHeight = platform.style === 'floating' ? 150 : 190;
      const platformVisual = this.scene.add.image(
        platform.x,
        topY + visualHeight / 2,
        TEXTURE_KEYS.SUNLIT_SHORES_PLATFORM,
      );
      platformVisual.setDisplaySize(platform.width, visualHeight);
      platformVisual.setDepth(-3);
      this.addPlatformEndCaps(platform.x, topY, platform.width, visualHeight, platform.style);
    } else {
      const rockRows = Math.max(1, Math.ceil(platform.height / 48));
      const tileColumns = Math.max(1, Math.ceil(platform.width / 64));
      for (let row = 0; row < rockRows; row += 1) {
        for (let column = 0; column < tileColumns; column += 1) {
          this.scene.add.image(
            platform.x - platform.width / 2 + 32 + column * 64,
            platform.y - platform.height / 2 + 36 + row * 48,
            TEXTURE_KEYS.ROCK_TILE,
          );
        }
      }

      for (let column = 0; column < tileColumns; column += 1) {
        this.scene.add.image(
          platform.x - platform.width / 2 + 32 + column * 64,
          platform.y - platform.height / 2 + 12,
          TEXTURE_KEYS.SAND_TILE,
        );
      }
    }

    const body = group.create(platform.x, platform.y, 'placeholder-pixel');
    body.setDisplaySize(platform.width, platform.height);
    body.setVisible(false);
    body.refreshBody();

    if (!platformTexture) {
      this.addPlatformSurface(platform.x, topY, platform.width, platform.style);
    }
  }

  private addSolidPlatformVisual(x: number, topY: number, width: number): void {
    const capWidth = 70;
    const visualHeight = 148;
    const transparentTopPadding = 15;
    const leftEdge = x - width / 2;
    const rightEdge = x + width / 2;
    const visualY = topY - transparentTopPadding;
    const centerWidth = Math.max(1, width - capWidth * 2);

    this.scene.add
      .image(leftEdge + capWidth / 2, visualY, TEXTURE_KEYS.PLATFORM_SOLID_RIGHT)
      .setOrigin(0.5, 0)
      .setFlipX(true)
      .setDepth(-3);
    this.scene.add
      .tileSprite(leftEdge + capWidth + centerWidth / 2, visualY, centerWidth, visualHeight, TEXTURE_KEYS.PLATFORM_SOLID_CENTER)
      .setOrigin(0.5, 0)
      .setDepth(-3);
    this.scene.add
      .image(rightEdge - capWidth / 2, visualY, TEXTURE_KEYS.PLATFORM_SOLID_RIGHT)
      .setOrigin(0.5, 0)
      .setDepth(-3);
  }

  private addFloatingPlatformVisual(x: number, topY: number): void {
    const textureKey = this.scene.textures.exists(TEXTURE_KEYS.PLATFORM_FLOATING_CLEAN)
      ? TEXTURE_KEYS.PLATFORM_FLOATING_CLEAN
      : TEXTURE_KEYS.PLATFORM_FLOATING;
    this.scene.add
      .image(x, topY, textureKey)
      .setOrigin(0.5, 0)
      .setDepth(-3);
  }

  private addMovingPlatform(group: Phaser.Physics.Arcade.Group, platform: MovingPlatformData): void {
    const body = group.create(platform.startX, platform.y, 'placeholder-pixel') as Phaser.Physics.Arcade.Sprite;
    body.setDisplaySize(platform.width, platform.height);
    body.setVisible(false);
    body.setImmovable(true);
    const arcadeBody = body.body as Phaser.Physics.Arcade.Body | null;
    arcadeBody?.setAllowGravity(false);
    arcadeBody?.setSize(platform.width, platform.height);

    const visual = this.scene.add.graphics();
    visual.setDepth(2);
    this.drawDriftwoodPlatform(visual, platform.width, platform.height);
    visual.setPosition(platform.startX, platform.y);

    this.scene.tweens.add({
      targets: [body, visual],
      x: platform.endX,
      duration: platform.durationMs,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private drawDriftwoodPlatform(graphics: Phaser.GameObjects.Graphics, width: number, height: number): void {
    const left = -width / 2;
    const top = -height / 2;
    graphics.fillStyle(0x7c5a36, 1);
    graphics.fillRoundedRect(left, top + 3, width, height - 2, 10);
    graphics.fillStyle(0xb98653, 1);
    graphics.fillRoundedRect(left + 7, top, width - 14, height - 8, 9);
    graphics.fillStyle(0xe0b979, 0.8);
    graphics.fillRect(left + 18, top + 7, width - 36, 3);
    graphics.fillRect(left + 26, top + 18, width - 52, 3);
    graphics.lineStyle(3, 0x5b3d25, 0.85);
    graphics.strokeRoundedRect(left + 5, top + 1, width - 10, height - 7, 9);
    graphics.fillStyle(COLORS.shellCream, 0.9);
    graphics.fillCircle(left + 20, top + 12, 3);
    graphics.fillCircle(-left - 24, top + 14, 3);
  }

  private addPlatformSurface(x: number, y: number, width: number, style: LevelPlatformData['style']): void {
    const surface = this.scene.add.graphics();
    surface.setDepth(1);
    surface.fillStyle(COLORS.sandyBeige, 1);
    surface.fillRect(x - width / 2, y - 7, width, 9);
    surface.fillStyle(COLORS.warmSun, 0.92);
    surface.fillRect(x - width / 2, y - 7, width, 3);
    surface.fillStyle(0xb87b4a, 0.62);
    surface.fillRect(x - width / 2, y + 1, width, 3);
    surface.fillStyle(COLORS.shellCream, 0.88);
    for (let px = x - width / 2 + 12; px < x + width / 2; px += 48) {
      surface.fillRect(px, y - 12, 18, 3);
    }

    if (style === 'floating') {
      surface.fillStyle(COLORS.coralPink, 0.9);
      for (let px = x - width / 2 + 34; px < x + width / 2 - 16; px += 92) {
        surface.fillRect(px, y - 15, 5, 5);
        surface.fillRect(px + 6, y - 18, 4, 4);
      }
    }
  }

  private addPlatformEndCaps(
    x: number,
    topY: number,
    width: number,
    visualHeight: number,
    style: LevelPlatformData['style'],
  ): void {
    const cap = this.scene.add.graphics();
    cap.setDepth(-2);
    const left = x - width / 2;
    const right = x + width / 2;
    const bottom = topY + visualHeight;
    const inset = style === 'floating' ? 14 : 22;

    cap.fillStyle(COLORS.sandyBeige, 1);
    cap.fillRoundedRect(left - 8, topY - 8, 26, 20, 8);
    cap.fillRoundedRect(right - 18, topY - 8, 26, 20, 8);

    cap.fillStyle(COLORS.rockBrown, 0.95);
    cap.fillTriangle(left, topY + 12, left + inset, bottom - 10, left + 28, topY + 24);
    cap.fillTriangle(right, topY + 12, right - inset, bottom - 10, right - 28, topY + 24);

    cap.fillStyle(0x6b4f35, 0.95);
    cap.fillCircle(left + 13, topY + 52, 15);
    cap.fillCircle(right - 13, topY + 54, 15);
    cap.fillCircle(left + 22, topY + 96, 12);
    cap.fillCircle(right - 22, topY + 98, 12);

    cap.lineStyle(3, COLORS.sunsetGold, 0.75);
    cap.beginPath();
    cap.moveTo(left - 3, topY + 10);
    cap.lineTo(left + 20, topY + 20);
    cap.lineTo(left + 12, topY + 34);
    cap.strokePath();
    cap.beginPath();
    cap.moveTo(right + 3, topY + 10);
    cap.lineTo(right - 20, topY + 20);
    cap.lineTo(right - 12, topY + 34);
    cap.strokePath();
  }

  private addDecoration(
    decoration: LevelDecorationData,
    checkpoints: Phaser.Physics.Arcade.StaticGroup,
    goals: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    switch (decoration.kind) {
      case 'dog':
        this.addDog(decoration, checkpoints);
        break;
      case 'checkpoint':
        this.addCheckpoint(decoration, checkpoints, goals);
        break;
      case 'clam':
        this.addClamGoal(decoration, goals);
        break;
      case 'palm':
        this.addPalm(decoration.x, decoration.y, decoration.scale ?? 1);
        break;
      case 'sign':
        this.addSign(decoration.x, decoration.y, decoration.label ?? '');
        break;
      case 'mami':
        this.addMami(decoration.x, decoration.y, decoration.scale ?? 1);
        break;
      case 'restaurant':
        this.addRestaurant(decoration.x, decoration.y, decoration.scale ?? 1);
        break;
    }
  }

  private addMami(x: number, y: number, scale: number): void {
    if (!this.scene.textures.exists(TEXTURE_KEYS.MAMI_SHEET)) {
      return;
    }

    this.scene.add
      .sprite(x, y, TEXTURE_KEYS.MAMI_SHEET, 34)
      .setOrigin(0.5, 1)
      .setScale(scale * 0.85)
      .setDepth(6);
  }

  private addRestaurant(x: number, y: number, scale: number): void {
    if (!this.scene.textures.exists(TEXTURE_KEYS.RESTAURANT)) {
      return;
    }

    this.scene.add
      .sprite(x, y, TEXTURE_KEYS.RESTAURANT, 0)
      .setOrigin(0.5, 1)
      .setScale(scale)
      .setDepth(-1);
  }

  private addCheckpoint(
    decoration: LevelDecorationData,
    checkpoints: Phaser.Physics.Arcade.StaticGroup,
    goals: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    const textureKey = this.scene.textures.exists(TEXTURE_KEYS.CHECKPOINT_SHEET)
      ? TEXTURE_KEYS.CHECKPOINT_SHEET
      : TEXTURE_KEYS.CHECKPOINT;
    const checkpoint = checkpoints.create(decoration.x, decoration.y, textureKey, 0) as Phaser.Physics.Arcade.Sprite;
    if (textureKey === TEXTURE_KEYS.CHECKPOINT_SHEET) {
      checkpoint.setOrigin(0.5, 1);
      checkpoint.setScale((decoration.scale ?? 1) * 0.32);
      checkpoint.play('checkpoint-inactive');
    } else {
      checkpoint.setOrigin(0.5, 1);
      checkpoint.setScale(decoration.scale ?? 1);
    }
    checkpoint.refreshBody();

    if (decoration.goal) {
      checkpoint.setData('levelCompleteTrigger', true);
    }
  }

  private addClamGoal(decoration: LevelDecorationData, goals: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.scene.textures.exists(TEXTURE_KEYS.ITEMS_SHEET)) {
      this.scene.add
        .sprite(decoration.x, decoration.y, TEXTURE_KEYS.ITEMS_SHEET, 10)
        .setScale((decoration.scale ?? 1) * 0.5)
        .play('giant-pearl');
    } else {
      this.scene.add.image(decoration.x, decoration.y, TEXTURE_KEYS.CLAM).setScale(decoration.scale ?? 1);
    }
    const goal = goals.create(decoration.x, decoration.y, 'placeholder-pixel');
    goal.setDisplaySize(120, 110);
    goal.setVisible(false);
    goal.refreshBody();
  }

  private addCollectible(
    collectible: CollectibleData,
    stars: Phaser.Physics.Arcade.StaticGroup,
    shells: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    const hasItemSheet = this.scene.textures.exists(TEXTURE_KEYS.ITEMS_SHEET);
    const textureKey = hasItemSheet
      ? TEXTURE_KEYS.ITEMS_SHEET
      : collectible.kind === 'star'
        ? TEXTURE_KEYS.STAR
        : TEXTURE_KEYS.SHELL;
    const frame = hasItemSheet ? (collectible.kind === 'star' ? 0 : 5) : undefined;
    const group = collectible.kind === 'star' ? stars : shells;
    const pickup = group.create(collectible.x, collectible.y, textureKey, frame) as Phaser.Physics.Arcade.Sprite;
    if (hasItemSheet) {
      pickup.setScale((collectible.scale ?? 1) * 0.19);
      pickup.play(collectible.kind === 'star' ? 'star-collectible' : 'shell-collectible');
    } else {
      pickup.setScale(collectible.scale ?? 1);
    }
    pickup.refreshBody();

    this.scene.tweens.add({
      targets: pickup,
      y: collectible.y - 8,
      duration: collectible.kind === 'star' ? 700 : 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private addDog(decoration: LevelDecorationData, checkpoints: Phaser.Physics.Arcade.StaticGroup): void {
    if (this.scene.textures.exists(TEXTURE_KEYS.GAFO_DOG_SHEET)) {
      this.scene.add
        .sprite(decoration.x, decoration.y, TEXTURE_KEYS.GAFO_DOG_SHEET, 3)
        .setOrigin(0.5, 0.805)
        .setScale((decoration.scale ?? 1) * 0.24)
        .setDepth(6)
        .play('gafo-dog-speech');
      if (decoration.checkpoint) {
        this.addInvisibleCheckpoint(decoration, checkpoints);
      }
      return;
    }

    this.scene.add.image(decoration.x, decoration.y, TEXTURE_KEYS.DOG).setOrigin(0.5, 1).setScale(decoration.scale ?? 1).setDepth(6);

    const bubble = this.scene.add.graphics();
    bubble.setDepth(7);
    bubble.fillStyle(0xffffff, 0.96);
    bubble.lineStyle(3, COLORS.deepOcean, 1);
    bubble.fillRoundedRect(decoration.x - 61, decoration.y - 92, 122, 38, 7);
    bubble.strokeRoundedRect(decoration.x - 61, decoration.y - 92, 122, 38, 7);
    bubble.fillTriangle(decoration.x - 10, decoration.y - 55, decoration.x + 2, decoration.y - 55, decoration.x - 4, decoration.y - 47);
    bubble.lineStyle(2, COLORS.deepOcean, 1);
    bubble.beginPath();
    bubble.moveTo(decoration.x - 10, decoration.y - 55);
    bubble.lineTo(decoration.x - 4, decoration.y - 47);
    bubble.lineTo(decoration.x + 2, decoration.y - 55);
    bubble.strokePath();

    this.scene.add
      .text(decoration.x, decoration.y - 73, decoration.label ?? 'I am gafo', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#1f5e8f',
        padding: { x: 10, y: 5 },
      })
      .setOrigin(0.5)
      .setDepth(8);

    if (decoration.checkpoint) {
      this.addInvisibleCheckpoint(decoration, checkpoints);
    }
  }

  private addInvisibleCheckpoint(
    decoration: LevelDecorationData,
    checkpoints: Phaser.Physics.Arcade.StaticGroup,
  ): void {
    const checkpoint = checkpoints.create(decoration.x, decoration.y, 'placeholder-pixel') as Phaser.Physics.Arcade.Sprite;
    checkpoint.setDisplaySize(112, 160);
    checkpoint.setVisible(false);
    checkpoint.setData('gafoCheckpoint', true);
    checkpoint.refreshBody();
  }

  private addSign(x: number, y: number, label: string): void {
    if (this.scene.textures.exists(TEXTURE_KEYS.START_SIGN_SHEET)) {
      this.scene.add.sprite(x, y + 28, TEXTURE_KEYS.START_SIGN_SHEET, 0).setScale(0.42).setDepth(4).play('start-sign-wobble');
      return;
    }

    const sign = this.scene.add.graphics();
    sign.setDepth(3);

    sign.lineStyle(7, 0x6b4227, 1);
    sign.beginPath();
    sign.moveTo(x - 22, y + 18);
    sign.lineTo(x - 24, y + 96);
    sign.strokePath();
    sign.lineStyle(5, 0xb98653, 1);
    sign.beginPath();
    sign.moveTo(x - 20, y + 18);
    sign.lineTo(x - 22, y + 94);
    sign.strokePath();

    sign.lineStyle(7, 0x6b4227, 1);
    sign.beginPath();
    sign.moveTo(x + 24, y + 18);
    sign.lineTo(x + 22, y + 96);
    sign.strokePath();
    sign.lineStyle(5, 0xb98653, 1);
    sign.beginPath();
    sign.moveTo(x + 22, y + 18);
    sign.lineTo(x + 20, y + 94);
    sign.strokePath();

    sign.fillStyle(0x6b4227, 1);
    sign.fillRoundedRect(x - 54, y - 24, 108, 50, 8);
    sign.fillStyle(0xa96f3d, 1);
    sign.fillRoundedRect(x - 48, y - 19, 96, 40, 7);
    sign.fillStyle(0xd99a5f, 0.9);
    sign.fillRoundedRect(x - 42, y - 14, 84, 30, 5);
    sign.fillStyle(0xffd98a, 0.35);
    sign.fillRect(x - 34, y - 10, 56, 4);
    sign.fillRect(x - 28, y + 7, 62, 3);
    sign.fillStyle(COLORS.shellCream, 0.9);
    sign.fillCircle(x - 37, y + 1, 3);
    sign.fillCircle(x + 37, y + 1, 3);
    this.scene.add
      .text(x, y, label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
        color: '#fff6c8',
        stroke: '#6f4b2e',
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(4);
  }

  private addPalm(x: number, y: number, scale: number): void {
    if (this.scene.textures.exists(TEXTURE_KEYS.PALM_TREE_SHEET)) {
      this.scene.add
        .sprite(x + 12 * scale, y + 8 * scale, TEXTURE_KEYS.PALM_TREE_SHEET, 0)
        .setOrigin(0.5, 1)
        .setScale(scale * 0.36)
        .setDepth(2)
        .play('palm-tree-sway');
      return;
    }

    const palm = this.scene.add.graphics();
    palm.setDepth(2);

    palm.lineStyle(15 * scale, 0x5d3b26, 1);
    palm.beginPath();
    palm.moveTo(x, y);
    palm.lineTo(x + 4 * scale, y - 28 * scale);
    palm.lineTo(x + 12 * scale, y - 62 * scale);
    palm.lineTo(x + 22 * scale, y - 108 * scale);
    palm.strokePath();
    palm.lineStyle(10 * scale, 0x9a6840, 1);
    palm.beginPath();
    palm.moveTo(x + 1 * scale, y - 8 * scale);
    palm.lineTo(x + 7 * scale, y - 34 * scale);
    palm.lineTo(x + 14 * scale, y - 66 * scale);
    palm.lineTo(x + 23 * scale, y - 104 * scale);
    palm.strokePath();

    for (let stripe = 0; stripe < 7; stripe += 1) {
      palm.lineStyle(2 * scale, 0x5a3925, 0.65);
      palm.beginPath();
      const stripeY = y - stripe * 16 * scale - 12 * scale;
      palm.moveTo(x + 2 * scale + stripe * 2, stripeY);
      palm.lineTo(x + 14 * scale + stripe * 2, stripeY - 6 * scale);
      palm.strokePath();
    }

    const topX = x + 23 * scale;
    const topY = y - 109 * scale;
    for (const angle of [-170, -142, -113, -84, -54, -24, 5]) {
      const radians = Phaser.Math.DegToRad(angle);
      const length = angle === -113 || angle === -84 ? 96 * scale : 80 * scale;
      const leafEndX = topX + Math.cos(radians) * length;
      const leafEndY = topY + Math.sin(radians) * 47 * scale;

      palm.fillStyle(COLORS.deepFoliage, 1);
      palm.fillTriangle(
        topX,
        topY,
        leafEndX,
        leafEndY,
        topX + Math.cos(radians + 0.23) * 30 * scale,
        topY + Math.sin(radians + 0.23) * 28 * scale,
      );
      palm.fillStyle(COLORS.palmGreen, 1);
      palm.fillTriangle(
        topX,
        topY,
        leafEndX + 4 * scale,
        leafEndY - 2 * scale,
        topX + Math.cos(radians - 0.2) * 27 * scale,
        topY + Math.sin(radians - 0.2) * 25 * scale,
      );
      palm.lineStyle(2 * scale, 0x1d4d31, 0.75);
      palm.beginPath();
      palm.moveTo(topX, topY);
      palm.lineTo(leafEndX + 2 * scale, leafEndY - 1 * scale);
      palm.strokePath();
    }

    palm.fillStyle(0x6b4227, 1);
    palm.fillCircle(topX - 8 * scale, topY + 10 * scale, 6 * scale);
    palm.fillCircle(topX + 3 * scale, topY + 12 * scale, 6 * scale);
    palm.fillStyle(COLORS.sunsetGold, 1);
    palm.fillCircle(topX - 8 * scale, topY + 8 * scale, 4 * scale);
    palm.fillCircle(topX + 3 * scale, topY + 10 * scale, 4 * scale);
  }
}
