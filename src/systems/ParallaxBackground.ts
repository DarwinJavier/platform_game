import Phaser from 'phaser';
import { COLORS, GAME_HEIGHT, GAME_WIDTH, TEXTURE_KEYS } from '../data/constants';

interface ParallaxLayer {
  sprite: Phaser.GameObjects.TileSprite;
  factor: number;
  drift: number;
  tileOffsetY: number;
}

export class ParallaxBackground {
  private readonly layers: ParallaxLayer[] = [];

  constructor(private readonly scene: Phaser.Scene) {
    this.scene.cameras.main.setBackgroundColor(COLORS.deepOcean);
    this.createLayers();
  }

  update(cameraScrollX: number, time: number): void {
    this.layers.forEach((layer) => {
      layer.sprite.tilePositionX = cameraScrollX * layer.factor + time * layer.drift;
      layer.sprite.tilePositionY = layer.tileOffsetY;
    });
  }

  private createLayers(): void {
    if (!this.hasGeneratedLayers()) {
      this.createFallbackLayers();
      return;
    }

    this.addLayer(TEXTURE_KEYS.SUNLIT_SHORES_FAR, 0, 0, GAME_WIDTH, GAME_HEIGHT, -120, 0, 0, 0, 1);
    this.addLayer(TEXTURE_KEYS.SUNLIT_SHORES_MID, 0, 0, GAME_WIDTH, 400, -115, 0.12, 0.002, 0, 0.42);
    this.addLayer(TEXTURE_KEYS.SUNLIT_SHORES_NEAR, 0, 620, GAME_WIDTH, GAME_HEIGHT - 620, -110, 0.32, 0.006, 86, 0.36);

    const wash = this.scene.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLORS.magicGlow, 0.04);
    wash.setScrollFactor(0);
    wash.setDepth(-105);
  }

  private hasGeneratedLayers(): boolean {
    return (
      this.scene.textures.exists(TEXTURE_KEYS.SUNLIT_SHORES_FAR) &&
      this.scene.textures.exists(TEXTURE_KEYS.SUNLIT_SHORES_MID) &&
      this.scene.textures.exists(TEXTURE_KEYS.SUNLIT_SHORES_NEAR)
    );
  }

  private addLayer(
    textureKey: string,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    factor: number,
    drift: number,
    tileOffsetY: number,
    alpha: number,
  ): void {
    const layer = this.scene.add.tileSprite(x, y, width, height, textureKey);
    layer.setOrigin(0, 0);
    layer.setScrollFactor(0);
    layer.setDepth(depth);
    layer.setAlpha(alpha);
    layer.setTileScale(1, 1);
    layer.tilePositionY = tileOffsetY;
    this.layers.push({ sprite: layer, factor, drift, tileOffsetY });
  }

  private createFallbackLayers(): void {
    const sky = this.scene.add.graphics();
    sky.setScrollFactor(0);
    sky.setDepth(-120);
    sky.fillGradientStyle(COLORS.deepOcean, COLORS.deepOcean, COLORS.peachSky, COLORS.peachSky, 1);
    sky.fillRect(0, 0, GAME_WIDTH, 280);
    sky.fillStyle(COLORS.warmSun, 0.95);
    sky.fillCircle(GAME_WIDTH / 2, 224, 48);
    sky.fillStyle(COLORS.magicGlow, 0.32);
    sky.fillCircle(GAME_WIDTH / 2, 224, 76);

    const ocean = this.scene.add.graphics();
    ocean.setScrollFactor(0);
    ocean.setDepth(-119);
    ocean.fillStyle(COLORS.midOcean, 1);
    ocean.fillRect(0, 260, GAME_WIDTH, 170);
    ocean.fillStyle(COLORS.tropicalAqua, 0.65);
    ocean.fillRect(0, 318, GAME_WIDTH, 52);
    ocean.fillStyle(COLORS.sandyBeige, 1);
    ocean.fillRect(0, 420, GAME_WIDTH, GAME_HEIGHT - 420);
  }
}
