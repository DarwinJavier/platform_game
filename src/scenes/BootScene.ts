import Phaser from 'phaser';
import { COLORS, SCENE_KEYS, TEXTURE_KEYS } from '../data/constants';
import { createPaoSpriteSet } from '../systems/PaoSpriteFactory';

const SPRITE_ASSETS = {
  puchi: new URL('../../assets/sprites/characters/puchi/puchi-spritesheet.png', import.meta.url).href,
  puchiHitDefeat: new URL('../../assets/sprites/characters/puchi/puchi-hit-defeat-spritesheet.png', import.meta.url).href,
  pao: new URL('../../assets/sprites/characters/pao/pao-spritesheet.png', import.meta.url).href,
  paoHitDefeat: new URL('../../assets/sprites/characters/pao/pao-hit-defeat-spritesheet.png', import.meta.url).href,
  crab: new URL('../../assets/sprites/enemies/crab-spritesheet.png', import.meta.url).href,
  projectiles: new URL('../../assets/sprites/projectiles/projectiles-ball-pompom.png', import.meta.url).href,
  items: new URL('../../assets/sprites/items/items-star-shell-pearl-spritesheet.png', import.meta.url).href,
  dog: new URL('../../assets/sprites/npcs/gafo-dog-spritesheet.png', import.meta.url).href,
  mami: new URL('../../assets/sprites/characters/mami/mami-spritesheet.png', import.meta.url).href,
  mamiCongratsPortrait: new URL('../../assets/sprites/characters/mami/mami-congrats-portrait.png', import.meta.url).href,
  gameOverScreen: new URL('../../assets/Gameover-screen.png', import.meta.url).href,
  levelCompleteBackground: new URL('../../assets/Background level complete.png', import.meta.url).href,
  startSign: new URL('../../assets/sprites/npcs/start-sign-spritesheet.png', import.meta.url).href,
  palmTree: new URL('../../assets/sprites/environment/palmtree-spritesheet.png', import.meta.url).href,
  restaurant: new URL('../../assets/sprites/environment/AngryRestaurant-sprite.png', import.meta.url).href,
  checkpoint: new URL('../../assets/sprites/checkpoints/course-flag-spritesheet.png', import.meta.url).href,
  giantGoose: new URL('../../assets/sprites/enemies/giant-goose/Goose-boss-clean-spritesheet.png', import.meta.url).href,
  platformSolid: new URL('../../assets/sprites/environment/platform-solid-crop.png', import.meta.url).href,
  platformSolidLeft: new URL('../../assets/sprites/environment/platform-solid-left-cap.png', import.meta.url).href,
  platformSolidCenter: new URL('../../assets/sprites/environment/platform-solid-center-tile.png', import.meta.url).href,
  platformSolidRight: new URL('../../assets/sprites/environment/platform-solid-right-cap.png', import.meta.url).href,
  platformFloating: new URL('../../assets/sprites/environment/platform-floating-crop.png', import.meta.url).href,
  platformFloatingClean: new URL('../../assets/sprites/environment/platform-floating-clean.png', import.meta.url).href,
  waterFill: new URL('../../assets/sprites/environment/water-fill-crop.png', import.meta.url).href,
  waterGap: new URL('../../assets/sprites/environment/water-gap-crop.png', import.meta.url).href,
  waterSheet: new URL('../../assets/sprites/environment/water-spritesheet.png', import.meta.url).href,
};

interface SpriteSheetMetadata {
  key: string;
  columns: number;
  rows: number;
  frameWidth: number;
  frameHeight: number;
}

const SPRITE_SHEETS: SpriteSheetMetadata[] = [
  { key: TEXTURE_KEYS.PUCHI_SHEET, columns: 8, rows: 4, frameWidth: 360, frameHeight: 380 },
  { key: TEXTURE_KEYS.PUCHI_HIT_DEFEAT_SHEET, columns: 4, rows: 2, frameWidth: 460, frameHeight: 700 },
  { key: TEXTURE_KEYS.PAO_SHEET, columns: 8, rows: 4, frameWidth: 360, frameHeight: 380 },
  { key: TEXTURE_KEYS.PAO_HIT_DEFEAT_SHEET, columns: 4, rows: 2, frameWidth: 460, frameHeight: 700 },
  { key: TEXTURE_KEYS.CRAB_SHEET, columns: 4, rows: 5, frameWidth: 420, frameHeight: 320 },
  { key: TEXTURE_KEYS.PROJECTILES_SHEET, columns: 8, rows: 4, frameWidth: 360, frameHeight: 380 },
  { key: TEXTURE_KEYS.ITEMS_SHEET, columns: 5, rows: 4, frameWidth: 360, frameHeight: 380 },
  { key: TEXTURE_KEYS.GAFO_DOG_SHEET, columns: 4, rows: 5, frameWidth: 520, frameHeight: 380 },
  { key: TEXTURE_KEYS.MAMI_SHEET, columns: 8, rows: 6, frameWidth: 260, frameHeight: 260 },
  { key: TEXTURE_KEYS.START_SIGN_SHEET, columns: 5, rows: 5, frameWidth: 360, frameHeight: 360 },
  { key: TEXTURE_KEYS.PALM_TREE_SHEET, columns: 4, rows: 3, frameWidth: 480, frameHeight: 520 },
  { key: TEXTURE_KEYS.RESTAURANT, columns: 1, rows: 1, frameWidth: 1254, frameHeight: 1254 },
  { key: TEXTURE_KEYS.CHECKPOINT_SHEET, columns: 5, rows: 4, frameWidth: 360, frameHeight: 380 },
  { key: TEXTURE_KEYS.WATER_SHEET, columns: 6, rows: 6, frameWidth: 209, frameHeight: 209 },
];

export class BootScene extends Phaser.Scene {
  private readonly cleanedSpriteSheetCanvases: HTMLCanvasElement[] = [];

  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  preload(): void {
    this.load.image(TEXTURE_KEYS.SUNLIT_SHORES_BACKDROP, 'assets/sunlit-shores-backdrop.png');
    this.load.image(TEXTURE_KEYS.SUNLIT_SHORES_FAR, 'assets/sunlit-shores-far-layer.png');
    this.load.image(TEXTURE_KEYS.SUNLIT_SHORES_MID, 'assets/sunlit-shores-mid-layer.png');
    this.load.image(TEXTURE_KEYS.SUNLIT_SHORES_NEAR, 'assets/sunlit-shores-near-layer.png');
    this.load.image(TEXTURE_KEYS.SUNLIT_SHORES_PLATFORM, 'assets/sunlit-shores-platform-tile.png');
    this.load.image(TEXTURE_KEYS.PORTRAIT_PUCHI, 'assets/portrait-puchi.png');
    this.load.image(TEXTURE_KEYS.PORTRAIT_PAO, 'assets/portrait-pao.png');
    this.load.image(TEXTURE_KEYS.INTRO_SCREEN, 'assets/intro screen.png');
    this.load.image(TEXTURE_KEYS.STORY_SCREEN, 'assets/story screen.png');
    this.loadOrganizedSpriteSheets();
  }

  create(): void {
    this.createPlaceholderTextures();
    this.cleanOrganizedSpriteSheetBackgrounds();
    this.createOrganizedSpriteAnimations();
    this.scene.start(SCENE_KEYS.TITLE);
  }

  private loadOrganizedSpriteSheets(): void {
    this.load.image(TEXTURE_KEYS.PUCHI_SHEET, SPRITE_ASSETS.puchi);
    this.load.image(TEXTURE_KEYS.PUCHI_HIT_DEFEAT_SHEET, SPRITE_ASSETS.puchiHitDefeat);
    this.load.image(TEXTURE_KEYS.PAO_SHEET, SPRITE_ASSETS.pao);
    this.load.image(TEXTURE_KEYS.PAO_HIT_DEFEAT_SHEET, SPRITE_ASSETS.paoHitDefeat);
    this.load.image(TEXTURE_KEYS.CRAB_SHEET, SPRITE_ASSETS.crab);
    this.load.image(TEXTURE_KEYS.PROJECTILES_SHEET, SPRITE_ASSETS.projectiles);
    this.load.image(TEXTURE_KEYS.ITEMS_SHEET, SPRITE_ASSETS.items);
    this.load.image(TEXTURE_KEYS.GAFO_DOG_SHEET, SPRITE_ASSETS.dog);
    this.load.image(TEXTURE_KEYS.MAMI_SHEET, SPRITE_ASSETS.mami);
    this.load.image(TEXTURE_KEYS.MAMI_CONGRATS_PORTRAIT, SPRITE_ASSETS.mamiCongratsPortrait);
    this.load.image(TEXTURE_KEYS.GAME_OVER_SCREEN, SPRITE_ASSETS.gameOverScreen);
    this.load.image(TEXTURE_KEYS.LEVEL_COMPLETE_BACKGROUND, SPRITE_ASSETS.levelCompleteBackground);
    this.load.image(TEXTURE_KEYS.START_SIGN_SHEET, SPRITE_ASSETS.startSign);
    this.load.image(TEXTURE_KEYS.PALM_TREE_SHEET, SPRITE_ASSETS.palmTree);
    this.load.image(TEXTURE_KEYS.RESTAURANT, SPRITE_ASSETS.restaurant);
    this.load.image(TEXTURE_KEYS.CHECKPOINT_SHEET, SPRITE_ASSETS.checkpoint);
    this.load.spritesheet(TEXTURE_KEYS.GIANT_GOOSE_SHEET, SPRITE_ASSETS.giantGoose, {
      frameWidth: 360,
      frameHeight: 180,
    });
    this.load.image(TEXTURE_KEYS.PLATFORM_SOLID, SPRITE_ASSETS.platformSolid);
    this.load.image(TEXTURE_KEYS.PLATFORM_SOLID_LEFT, SPRITE_ASSETS.platformSolidLeft);
    this.load.image(TEXTURE_KEYS.PLATFORM_SOLID_CENTER, SPRITE_ASSETS.platformSolidCenter);
    this.load.image(TEXTURE_KEYS.PLATFORM_SOLID_RIGHT, SPRITE_ASSETS.platformSolidRight);
    this.load.image(TEXTURE_KEYS.PLATFORM_FLOATING, SPRITE_ASSETS.platformFloating);
    this.load.image(TEXTURE_KEYS.PLATFORM_FLOATING_CLEAN, SPRITE_ASSETS.platformFloatingClean);
    this.load.image(TEXTURE_KEYS.WATER_FILL, SPRITE_ASSETS.waterFill);
    this.load.image(TEXTURE_KEYS.WATER_GAP, SPRITE_ASSETS.waterGap);
    this.load.image(TEXTURE_KEYS.WATER_SHEET, SPRITE_ASSETS.waterSheet);
  }

  private createOrganizedSpriteAnimations(): void {
    this.createCharacterSheetAnimations('puchi', TEXTURE_KEYS.PUCHI_SHEET, TEXTURE_KEYS.PUCHI_HIT_DEFEAT_SHEET);
    this.createCharacterSheetAnimations('pao', TEXTURE_KEYS.PAO_SHEET, TEXTURE_KEYS.PAO_HIT_DEFEAT_SHEET);
    this.createSheetAnimation('crab-idle', TEXTURE_KEYS.CRAB_SHEET, [0, 1, 2], 3, -1);
    this.createSheetAnimation('crab-walk', TEXTURE_KEYS.CRAB_SHEET, [4, 5, 6, 7, 8, 9, 10, 11], 8, -1);
    this.createSheetAnimation('crab-stun', TEXTURE_KEYS.CRAB_SHEET, [14], 1, 0);
    this.createSheetAnimation('crab-defeat', TEXTURE_KEYS.CRAB_SHEET, [17, 18, 19], 5, 0);
    this.createSheetAnimation('pao-basketball-projectile', TEXTURE_KEYS.PROJECTILES_SHEET, [0, 1, 2, 3, 4], 10, -1);
    this.createSheetAnimation('puchi-dog-stuffy-projectile', TEXTURE_KEYS.PROJECTILES_SHEET, [16, 17, 18, 19, 20, 21], 12, -1);
    this.createSheetAnimation('projectile-impact', TEXTURE_KEYS.PROJECTILES_SHEET, [7, 24, 25], 9, 0);
    this.createSheetAnimation('star-collectible', TEXTURE_KEYS.ITEMS_SHEET, [0, 1, 2, 3, 4], 6, -1);
    this.createSheetAnimation('shell-collectible', TEXTURE_KEYS.ITEMS_SHEET, [5, 6, 7, 8, 9], 6, -1);
    this.createSheetAnimation('giant-pearl', TEXTURE_KEYS.ITEMS_SHEET, [10, 11, 12, 13, 14], 5, -1);
    this.createSheetAnimation('heart-pickup', TEXTURE_KEYS.ITEMS_SHEET, [15, 16, 17, 18, 19], 5, -1);
    this.createSheetAnimation('gafo-dog-idle', TEXTURE_KEYS.GAFO_DOG_SHEET, [0, 1, 2], 3, -1);
    this.createSheetAnimation('gafo-dog-wag', TEXTURE_KEYS.GAFO_DOG_SHEET, [4, 5, 6, 7], 5, -1);
    this.createSheetAnimation('gafo-dog-speech', TEXTURE_KEYS.GAFO_DOG_SHEET, [3], 1, 0);
    this.createSheetAnimation('mami-celebrate', TEXTURE_KEYS.MAMI_SHEET, [33, 34, 35, 36], 5, -1);
    this.createSheetAnimation('start-sign-idle', TEXTURE_KEYS.START_SIGN_SHEET, [0], 1, 0);
    this.createSheetAnimation('start-sign-wobble', TEXTURE_KEYS.START_SIGN_SHEET, [5, 6, 7, 8, 9], 6, -1);
    this.createSheetAnimation('palm-tree-idle', TEXTURE_KEYS.PALM_TREE_SHEET, [0], 1, 0);
    this.createSheetAnimation('palm-tree-sway', TEXTURE_KEYS.PALM_TREE_SHEET, [0, 1, 2, 3, 4, 5, 6, 7], 4, -1);
    this.createSheetAnimation('checkpoint-inactive', TEXTURE_KEYS.CHECKPOINT_SHEET, [0, 1, 2], 3, -1);
    this.createSheetAnimation('checkpoint-active', TEXTURE_KEYS.CHECKPOINT_SHEET, [10, 11, 12, 13, 14], 5, -1);
    this.createSheetAnimation('checkpoint-wave', TEXTURE_KEYS.CHECKPOINT_SHEET, [5, 6, 7, 8, 9], 7, -1);
    this.createSheetAnimation('giant-goose-idle', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [0, 1, 2, 3], 4, -1);
    this.createSheetAnimation('giant-goose-walk', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [4, 5, 6, 7], 6, -1);
    this.createSheetAnimation('giant-goose-charge', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [4, 5, 6, 7], 6, -1);
    this.createSheetAnimation('giant-goose-honk-blast', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [8, 9], 4, 0);
    this.createSheetAnimation('giant-goose-wing-slam', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [10, 11], 4, 0);
    this.createSheetAnimation('giant-goose-jump-land', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [0], 1, 0);
    this.createSheetAnimation('giant-goose-stunned', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [8], 1, -1);
    this.createSheetAnimation('giant-goose-hurt', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [8], 1, 0);
    this.createSheetAnimation('giant-goose-defeated', TEXTURE_KEYS.GIANT_GOOSE_SHEET, [12, 13, 14, 15], 5, 0);
  }

  private cleanOrganizedSpriteSheetBackgrounds(): void {
    SPRITE_SHEETS.forEach((metadata) => this.cleanSpriteSheetBackground(metadata));
  }

  private cleanSpriteSheetBackground(metadata: SpriteSheetMetadata): void {
    const { key, columns, rows, frameWidth, frameHeight } = metadata;
    const texture = this.textures.get(key);
    const source = texture?.getSourceImage() as CanvasImageSource | undefined;
    if (!source || !('width' in source) || !('height' in source)) {
      return;
    }

    const sourceWidth = Number(source.width);
    const sourceHeight = Number(source.height);
    const cleanedSourceCanvas = document.createElement('canvas');
    cleanedSourceCanvas.width = sourceWidth;
    cleanedSourceCanvas.height = sourceHeight;

    const sourceContext = cleanedSourceCanvas.getContext('2d', { willReadFrequently: true });
    if (!sourceContext) {
      return;
    }

    sourceContext.drawImage(source, 0, 0);
    const imageData = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight);
    const { data } = imageData;
    const visited = new Uint8Array(sourceWidth * sourceHeight);
    const queue: number[] = [];

    const enqueue = (x: number, y: number): void => {
      if (x < 0 || y < 0 || x >= sourceWidth || y >= sourceHeight) {
        return;
      }

      const index = y * sourceWidth + x;
      if (visited[index]) {
        return;
      }

      const offset = index * 4;
      if (!this.isCheckerboardBackgroundPixel(data[offset], data[offset + 1], data[offset + 2], data[offset + 3])) {
        return;
      }

      visited[index] = 1;
      queue.push(index);
    };

    for (let x = 0; x < sourceWidth; x += 1) {
      enqueue(x, 0);
      enqueue(x, sourceHeight - 1);
    }
    for (let y = 0; y < sourceHeight; y += 1) {
      enqueue(0, y);
      enqueue(sourceWidth - 1, y);
    }

    for (let pointer = 0; pointer < queue.length; pointer += 1) {
      const index = queue[pointer];
      const x = index % sourceWidth;
      const y = Math.floor(index / sourceWidth);
      data[index * 4 + 3] = 0;
      enqueue(x + 1, y);
      enqueue(x - 1, y);
      enqueue(x, y + 1);
      enqueue(x, y - 1);
    }

    sourceContext.putImageData(imageData, 0, 0);

    const normalizedCanvas = document.createElement('canvas');
    normalizedCanvas.width = frameWidth * columns;
    normalizedCanvas.height = frameHeight * rows;

    const normalizedContext = normalizedCanvas.getContext('2d');
    if (!normalizedContext) {
      return;
    }

    normalizedContext.imageSmoothingEnabled = false;
    const slotComponents = this.getSlotVisibleComponents(imageData, columns, rows);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const slotIndex = row * columns + column;
        const components = slotComponents[slotIndex];
        if (components.length === 0) {
          continue;
        }

        this.drawPaddedComponentFrame(
          cleanedSourceCanvas,
          normalizedContext,
          components,
          column * frameWidth,
          row * frameHeight,
          frameWidth,
          frameHeight,
        );
      }
    }

    this.textures.remove(key);
    this.textures.addSpriteSheet(key, normalizedCanvas as unknown as HTMLImageElement, { frameWidth, frameHeight });
    this.cleanedSpriteSheetCanvases.push(cleanedSourceCanvas, normalizedCanvas);
  }

  private getSlotVisibleComponents(
    imageData: ImageData,
    columns: number,
    rows: number,
  ): Array<Array<{ left: number; right: number; top: number; bottom: number }>> {
    const { width, height, data } = imageData;
    const componentsBySlot = Array.from(
      { length: columns * rows },
      (): Array<{ left: number; right: number; top: number; bottom: number }> => [],
    );
    const visited = new Uint8Array(width * height);
    const queue: number[] = [];

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const startIndex = y * width + x;
        if (visited[startIndex] || data[startIndex * 4 + 3] === 0) {
          continue;
        }

        let left = x;
        let right = x;
        let top = y;
        let bottom = y;
        let sumX = 0;
        let sumY = 0;
        let count = 0;

        visited[startIndex] = 1;
        queue.length = 0;
        queue.push(startIndex);

        for (let pointer = 0; pointer < queue.length; pointer += 1) {
          const index = queue[pointer];
          const px = index % width;
          const py = Math.floor(index / width);

          left = Math.min(left, px);
          right = Math.max(right, px);
          top = Math.min(top, py);
          bottom = Math.max(bottom, py);
          sumX += px;
          sumY += py;
          count += 1;

          this.enqueueVisibleNeighbor(px + 1, py, width, height, data, visited, queue);
          this.enqueueVisibleNeighbor(px - 1, py, width, height, data, visited, queue);
          this.enqueueVisibleNeighbor(px, py + 1, width, height, data, visited, queue);
          this.enqueueVisibleNeighbor(px, py - 1, width, height, data, visited, queue);
        }

        const centerX = sumX / count;
        const centerY = sumY / count;
        const column = Phaser.Math.Clamp(Math.floor((centerX / width) * columns), 0, columns - 1);
        const row = Phaser.Math.Clamp(Math.floor((centerY / height) * rows), 0, rows - 1);
        componentsBySlot[row * columns + column].push({ left, right, top, bottom });
      }
    }

    return componentsBySlot;
  }

  private enqueueVisibleNeighbor(
    x: number,
    y: number,
    width: number,
    height: number,
    data: Uint8ClampedArray,
    visited: Uint8Array,
    queue: number[],
  ): void {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }

    const index = y * width + x;
    if (visited[index] || data[index * 4 + 3] === 0) {
      return;
    }

    visited[index] = 1;
    queue.push(index);
  }

  private drawPaddedComponentFrame(
    source: HTMLCanvasElement,
    targetContext: CanvasRenderingContext2D,
    components: Array<{ left: number; right: number; top: number; bottom: number }>,
    targetX: number,
    targetY: number,
    frameWidth: number,
    frameHeight: number,
  ): void {
    const frameBounds = components.reduce(
      (combined, component) => ({
        left: Math.min(combined.left, component.left),
        right: Math.max(combined.right, component.right),
        top: Math.min(combined.top, component.top),
        bottom: Math.max(combined.bottom, component.bottom),
      }),
      { left: Number.POSITIVE_INFINITY, right: Number.NEGATIVE_INFINITY, top: Number.POSITIVE_INFINITY, bottom: Number.NEGATIVE_INFINITY },
    );
    const contentWidth = frameBounds.right - frameBounds.left + 1;
    const contentHeight = frameBounds.bottom - frameBounds.top + 1;
    const drawOriginX = targetX + Math.floor((frameWidth - contentWidth) / 2) - frameBounds.left;
    const drawOriginY = targetY + Math.floor((frameHeight - contentHeight) / 2) - frameBounds.top;

    components.forEach((component) => {
      const sourceWidth = component.right - component.left + 1;
      const sourceHeight = component.bottom - component.top + 1;
      targetContext.drawImage(
        source,
        component.left,
        component.top,
        sourceWidth,
        sourceHeight,
        drawOriginX + component.left,
        drawOriginY + component.top,
        sourceWidth,
        sourceHeight,
      );
    });
  }

  private isCheckerboardBackgroundPixel(red: number, green: number, blue: number, alpha: number): boolean {
    if (alpha === 0) {
      return true;
    }

    const maxChannel = Math.max(red, green, blue);
    const minChannel = Math.min(red, green, blue);
    return minChannel >= 220 && maxChannel - minChannel <= 18;
  }

  private createCharacterSheetAnimations(
    characterId: 'puchi' | 'pao',
    mainSheetKey: string,
    hitDefeatSheetKey: string,
  ): void {
    this.createSheetAnimation(`${characterId}-idle`, mainSheetKey, [0, 1, 2, 3, 4, 5, 6, 7], 5, -1);
    this.createSheetAnimation(`${characterId}-run`, mainSheetKey, [8, 9, 10, 11, 12, 13, 14, 15], 10, -1);
    this.createSheetAnimation(`${characterId}-jump`, mainSheetKey, [17, 18, 19], 7, 0);
    this.createSheetAnimation(`${characterId}-fall`, mainSheetKey, [20, 21], 4, -1);
    this.createSheetAnimation(`${characterId}-power`, mainSheetKey, [24, 25, 26, 27, 28, 29, 30, 31], 10, 0);
    this.createSheetAnimation(`${characterId}-win`, mainSheetKey, [18, 22, 23], 5, -1);
    this.createSheetAnimation(`${characterId}-hit`, hitDefeatSheetKey, [0, 1, 2, 3], 7, 0);
    this.createSheetAnimation(`${characterId}-defeat`, hitDefeatSheetKey, [4, 5, 6, 7], 5, 0);
  }

  private createSheetAnimation(key: string, sheetKey: string, frames: number[], frameRate: number, repeat: number): void {
    if (this.anims.exists(key) || !this.textures.exists(sheetKey)) {
      return;
    }

    this.anims.create({
      key,
      frames: frames.map((frame) => ({ key: sheetKey, frame })),
      frameRate,
      repeat,
    });
  }

  private createPlaceholderTextures(): void {
    this.createPlaceholderPixel();
    this.createPlayerTextureSet(TEXTURE_KEYS.PUCHI, COLORS.puchiPurple, COLORS.puchiPink, COLORS.puchiLavender, 'puchi');
    createPaoSpriteSet(this, TEXTURE_KEYS.PAO);
    this.createPlayerAnimations(TEXTURE_KEYS.PUCHI);
    this.createStarTexture();
    this.createShellTexture();
    this.createBasketballTexture();
    this.createCrabTexture();
    this.createDogTexture();
    this.createCheckpointTexture();
    this.createClamTexture();
    this.createTerrainTextures();
  }

  private createPlaceholderPixel(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.magicGlow, 1);
    graphics.fillRect(0, 0, 2, 2);
    graphics.generateTexture('placeholder-pixel', 2, 2);
    graphics.destroy();
  }

  private createPlayerTextureSet(
    baseKey: string,
    jacketColor: number,
    pantsColor: number,
    accentColor: number,
    character: 'puchi' | 'pao',
  ): void {
    this.createPlayerTexture(baseKey, jacketColor, pantsColor, accentColor, character, 'idle-1');
    this.createPlayerTexture(`${baseKey}-idle-2`, jacketColor, pantsColor, accentColor, character, 'idle-2');
    this.createPlayerTexture(`${baseKey}-run-1`, jacketColor, pantsColor, accentColor, character, 'run-1');
    this.createPlayerTexture(`${baseKey}-run-2`, jacketColor, pantsColor, accentColor, character, 'run-2');
    this.createPlayerTexture(`${baseKey}-jump`, jacketColor, pantsColor, accentColor, character, 'jump');
    this.createPlayerTexture(`${baseKey}-power`, jacketColor, pantsColor, accentColor, character, 'power');
  }

  private createPlayerTexture(
    key: string,
    jacketColor: number,
    pantsColor: number,
    accentColor: number,
    character: 'puchi' | 'pao',
    pose: 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'power',
  ): void {
    const graphics = this.add.graphics();

    if (character === 'pao') {
      this.drawPaoGameplayTexture(graphics, key, pose);
      graphics.destroy();
      return;
    }

    const bounce = pose === 'idle-2' ? -2 : 0;
    const headX = pose === 'power' ? 2 : pose === 'run-1' ? 2 : pose === 'run-2' ? -1 : 0;
    const torsoX = pose === 'run-1' ? 1 : pose === 'run-2' ? -1 : 0;
    const outline = 0x241313;
    const skin = 0xd99161;
    const skinLight = 0xffc192;
    const cheek = COLORS.puchiPink;
    const hairColor = 0x7e3d24;
    const hairMid = 0xa45732;
    const hairLight = 0xc16c3b;
    const shoeColor = 0x9e4cc4;
    const soleColor = 0xf7f1dd;
    const torsoTop = 37;

    const leftLegX = pose === 'run-1' ? 18 : pose === 'run-2' ? 27 : pose === 'jump' ? 20 : 23;
    const rightLegX = pose === 'run-1' ? 42 : pose === 'run-2' ? 34 : pose === 'jump' ? 42 : 35;
    const leftLegY = pose === 'jump' ? 57 : 61;
    const rightLegY = pose === 'jump' ? 53 : 61;
    const leftFootX = pose === 'run-1' ? 12 : pose === 'run-2' ? 25 : pose === 'jump' ? 16 : 18;
    const rightFootX = pose === 'run-1' ? 40 : pose === 'run-2' ? 43 : pose === 'jump' ? 42 : 35;
    const leftFootY = pose === 'jump' ? 70 : 76;
    const rightFootY = pose === 'jump' ? 66 : 76;

    graphics.fillStyle(0x000000, 0.18);
    graphics.fillEllipse(32, 78, 37, 6);

    const ponyLift = pose === 'jump' || pose === 'run-1' ? -8 : 0;
    graphics.fillStyle(hairColor, 1);
    graphics.fillCircle(15 + headX, 18 + bounce, 5);
    graphics.fillCircle(11 + headX, 26 + bounce, 6);
    graphics.fillCircle(13 + headX, 36 + bounce, 6);
    graphics.fillCircle(10 + headX, 46 + bounce, 5);
    graphics.fillCircle(47 + headX, 11 + bounce, 5);
    graphics.fillCircle(52 + headX, 15 + bounce, 4);
    graphics.fillCircle(11 + headX, 24 + bounce + ponyLift, 5);
    graphics.fillCircle(7 + headX, 30 + bounce + ponyLift, 6);
    graphics.fillCircle(4 + headX, 38 + bounce + ponyLift, 5);
    graphics.fillStyle(hairMid, 1);
    graphics.fillCircle(12 + headX, 31 + bounce + ponyLift, 3);
    graphics.fillCircle(8 + headX, 39 + bounce + ponyLift, 3);
    graphics.fillStyle(COLORS.puchiPink, 1);
    graphics.fillCircle(51 + headX, 19 + bounce, 3);

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(20 + headX, 9 + bounce, 26, 28, 9);
    graphics.fillRoundedRect(18 + headX, 17 + bounce, 30, 17, 7);
    graphics.fillStyle(hairColor, 1);
    graphics.fillRoundedRect(19 + headX, 7 + bounce, 28, 13, 7);
    graphics.fillRoundedRect(18 + headX, 14 + bounce, 8, 22, 4);
    graphics.fillRoundedRect(41 + headX, 15 + bounce, 7, 20, 4);
    graphics.fillStyle(hairMid, 1);
    graphics.fillRect(21 + headX, 14 + bounce, 6, 5);
    graphics.fillRect(40 + headX, 16 + bounce, 5, 8);
    graphics.fillStyle(hairLight, 1);
    graphics.fillRect(28 + headX, 10 + bounce, 12, 3);

    graphics.fillStyle(skin, 1);
    graphics.fillRoundedRect(24 + headX, 18 + bounce, 17, 16, 5);
    graphics.fillStyle(skinLight, 1);
    graphics.fillRect(26 + headX, 19 + bounce, 11, 5);
    graphics.fillStyle(0x191919, 1);
    graphics.fillRect(27 + headX, 25 + bounce, 2, 3);
    graphics.fillRect(36 + headX, 25 + bounce, 2, 3);
    graphics.fillStyle(cheek, 0.7);
    graphics.fillRect(24 + headX, 29 + bounce, 3, 2);
    graphics.fillRect(39 + headX, 29 + bounce, 3, 2);
    graphics.fillStyle(0x7a2c28, 1);
    graphics.fillRect(30 + headX, 31 + bounce, 7, 2);
    graphics.lineStyle(2, COLORS.puchiPink, 1);
    graphics.strokeCircle(22 + headX, 29 + bounce, 4);
    graphics.strokeCircle(43 + headX, 29 + bounce, 3);

    const leftArmX = pose === 'run-1' ? 18 : pose === 'run-2' ? 13 : pose === 'power' ? 13 : 17;
    const rightArmX = pose === 'run-1' ? 43 : pose === 'run-2' ? 49 : pose === 'power' ? 49 : 43;
    const leftArmY = pose === 'jump' ? 43 : pose === 'power' ? 39 : pose === 'run-1' ? 47 : pose === 'run-2' ? 41 : 44;
    const rightArmY = pose === 'jump' ? 38 : pose === 'power' ? 35 : pose === 'run-1' ? 41 : pose === 'run-2' ? 47 : 44;

    graphics.lineStyle(7, outline, 1);
    graphics.beginPath();
    graphics.moveTo(24 + torsoX, torsoTop + 4 + bounce);
    graphics.lineTo(leftArmX, leftArmY + bounce);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(41 + torsoX, torsoTop + 4 + bounce);
    graphics.lineTo(rightArmX, rightArmY + bounce);
    graphics.strokePath();
    graphics.lineStyle(5, jacketColor, 1);
    graphics.beginPath();
    graphics.moveTo(25 + torsoX, torsoTop + 5 + bounce);
    graphics.lineTo(leftArmX, leftArmY + bounce);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(40 + torsoX, torsoTop + 5 + bounce);
    graphics.lineTo(rightArmX, rightArmY + bounce);
    graphics.strokePath();
    graphics.fillStyle(skin, 1);
    graphics.fillCircle(leftArmX, leftArmY + 4 + bounce, 3);
    graphics.fillCircle(rightArmX, rightArmY + 4 + bounce, 3);

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(21 + torsoX, torsoTop + bounce, 24, 25, 4);
    graphics.fillStyle(jacketColor, 1);
    graphics.fillRoundedRect(23 + torsoX, torsoTop + bounce, 20, 23, 3);

    graphics.fillStyle(0x4f2a84, 1);
    graphics.fillRect(25 + torsoX, torsoTop + 4 + bounce, 16, 5);
    graphics.fillStyle(COLORS.magicGlow, 1);
    graphics.fillRect(27 + torsoX, torsoTop + 8 + bounce, 3, 3);
    graphics.fillRect(38 + torsoX, torsoTop + 11 + bounce, 2, 2);
    graphics.fillRect(32 + torsoX, torsoTop + 16 + bounce, 3, 3);
    graphics.fillStyle(COLORS.coralPink, 1);
    graphics.fillRect(25 + torsoX, torsoTop + 13 + bounce, 3, 3);
    graphics.fillRect(40 + torsoX, torsoTop + 17 + bounce, 3, 3);
    graphics.fillStyle(COLORS.puchiPink, 1);
    graphics.fillRoundedRect(20 + torsoX, torsoTop + 22 + bounce, 28, 8, 2);

    if (pose === 'power') {
      graphics.fillStyle(accentColor, 1);
      graphics.fillCircle(11, 35, 4);
      graphics.fillCircle(53, 33, 4);
      graphics.fillRect(32, 7, 4, 4);
      graphics.fillStyle(COLORS.magicGlow, 1);
      graphics.fillRect(10, 29, 2, 12);
      graphics.fillRect(52, 27, 2, 12);
      graphics.fillRect(54, 31, 7, 2);
    }

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(leftLegX - 2, leftLegY + bounce, 9, 17, 3);
    graphics.fillRoundedRect(rightLegX - 2, rightLegY + bounce, 9, 17, 3);
    graphics.fillStyle(pantsColor, 1);
    graphics.fillRoundedRect(leftLegX, leftLegY + bounce, 7, 15, 3);
    graphics.fillRoundedRect(rightLegX, rightLegY + bounce, 7, 15, 3);
    graphics.fillStyle(COLORS.starGold, 1);
    graphics.fillRect(leftLegX + 2, leftLegY + 6 + bounce, 3, 3);
    graphics.fillRect(rightLegX + 2, rightLegY + 8 + bounce, 2, 2);
    graphics.fillStyle(shoeColor, 1);
    graphics.fillRoundedRect(leftFootX, leftFootY + bounce, 15, 6, 3);
    graphics.fillRoundedRect(rightFootX, rightFootY + bounce, 15, 6, 3);
    graphics.fillStyle(soleColor, 0.95);
    graphics.fillRect(leftFootX + 1, leftFootY + 4 + bounce, 12, 2);
    graphics.fillRect(rightFootX + 1, rightFootY + 4 + bounce, 12, 2);
    graphics.fillStyle(COLORS.puchiPink, 1);
    graphics.fillRect(leftFootX + 5, leftFootY + 1 + bounce, 4, 2);
    graphics.fillRect(rightFootX + 5, rightFootY + 1 + bounce, 4, 2);

    graphics.generateTexture(key, 64, 82);
    graphics.destroy();
  }

  private drawPaoGameplayTexture(
    graphics: Phaser.GameObjects.Graphics,
    key: string,
    pose: 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'power',
  ): void {
    const bounce = pose === 'idle-2' ? -2 : 0;
    const running = pose === 'run-1' || pose === 'run-2';
    const jumping = pose === 'jump';
    const power = pose === 'power';
    const outline = 0x241313;
    const skin = 0xc9855f;
    const skinLight = 0xffc89a;
    const cheek = 0xec8e7d;
    const hairDark = 0x2e1b12;
    const hair = 0x4a2a19;
    const hairLight = 0x8a5635;
    const shirt = 0x244f3a;
    const shirtLight = 0x356f53;
    const denim = 0x4e78a2;
    const denimDark = 0x335978;
    const denimLight = 0x7fa0c0;
    const shoe = 0x163f34;
    const sole = 0xf4ead0;

    const headX = running ? 36 : jumping ? 34 : 33;
    const headY = jumping ? 18 : 20 + bounce;
    const torsoX = running ? 31 : jumping ? 33 : 32;
    const torsoY = jumping ? 39 : 41 + bounce;

    graphics.fillStyle(0x000000, 0.18);
    graphics.fillEllipse(33, 78, running ? 45 : 35, 6);

    this.drawPaoBraids(graphics, headX, headY, pose, hairDark, hair, hairLight);

    graphics.fillStyle(outline, 1);
    graphics.fillEllipse(headX - 1, headY + 5, 29, 30);
    graphics.fillStyle(hairDark, 1);
    graphics.fillEllipse(headX - 5, headY - 2, 32, 18);
    graphics.fillEllipse(headX - 14, headY + 8, 12, 21);
    graphics.fillStyle(hair, 1);
    graphics.fillEllipse(headX - 5, headY, 27, 15);
    graphics.fillEllipse(headX - 13, headY + 9, 8, 17);
    graphics.fillStyle(hairLight, 1);
    graphics.fillRect(headX - 11, headY - 6, 14, 3);

    graphics.fillStyle(skin, 1);
    graphics.fillRoundedRect(headX - 10, headY + 2, 21, 19, 6);
    graphics.fillTriangle(headX + 7, headY + 9, headX + 16, headY + 12, headX + 7, headY + 15);
    graphics.fillRoundedRect(headX - 14, headY + 10, 5, 8, 3);
    graphics.fillStyle(skinLight, 1);
    graphics.fillRect(headX - 6, headY + 4, 12, 5);
    graphics.fillStyle(hairDark, 1);
    graphics.fillRect(headX - 1, headY + 9, 10, 2);
    graphics.fillRect(headX - 7, headY + 10, 5, 2);
    graphics.fillStyle(0x141414, 1);
    graphics.fillRoundedRect(headX + 2, headY + 12, 6, 6, 2);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(headX + 3, headY + 13, 2, 2);
    graphics.fillStyle(0x3a2117, 1);
    graphics.fillRect(headX + 5, headY + 15, 2, 2);
    graphics.fillStyle(0x4a2a19, 1);
    graphics.fillRect(headX - 5, headY + 14, 3, 3);
    graphics.fillStyle(skinLight, 0.9);
    graphics.fillRect(headX + 10, headY + 15, 3, 2);
    graphics.fillStyle(cheek, 0.66);
    graphics.fillRect(headX + 7, headY + 18, 5, 2);
    graphics.fillStyle(0x762729, 1);
    if (running || power || jumping) {
      graphics.fillRoundedRect(headX + 2, headY + 20, 10, 3, 2);
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(headX + 4, headY + 20, 6, 1);
    } else {
      graphics.fillRect(headX + 3, headY + 20, 7, 2);
    }

    this.drawPaoArms(graphics, torsoX, torsoY, pose, outline, skin, shirt);

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(torsoX - 11, torsoY - 4, 24, 24, 4);
    graphics.fillStyle(shirt, 1);
    graphics.fillRoundedRect(torsoX - 9, torsoY - 3, 20, 21, 3);
    graphics.fillStyle(shirtLight, 1);
    graphics.fillRect(torsoX - 6, torsoY, 13, 4);
    graphics.fillStyle(skinLight, 1);
    graphics.fillRect(torsoX - 6, torsoY - 5, 13, 3);
    graphics.fillStyle(COLORS.shellCream, 1);
    graphics.fillCircle(torsoX + 1, torsoY + 8, 4);
    graphics.fillRect(torsoX, torsoY + 11, 3, 4);
    graphics.fillStyle(COLORS.sunsetGold, 1);
    graphics.fillRect(torsoX - 11, torsoY + 17, 24, 3);

    this.drawPaoLegs(graphics, pose, torsoX, torsoY, outline, denim, denimDark, denimLight, shoe, sole);

    if (power) {
      graphics.lineStyle(3, COLORS.tropicalAqua, 0.82);
      graphics.beginPath();
      graphics.arc(45, 36, 19, Phaser.Math.DegToRad(-120), Phaser.Math.DegToRad(78), false);
      graphics.strokePath();
      graphics.fillStyle(COLORS.shellCream, 1);
      graphics.fillCircle(51, 28, 5);
      graphics.fillStyle(COLORS.tropicalAqua, 0.9);
      graphics.fillRect(50, 25, 2, 9);
    }

    graphics.generateTexture(key, 64, 82);
  }

  private drawPaoBraids(
    graphics: Phaser.GameObjects.Graphics,
    headX: number,
    headY: number,
    pose: 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'power',
    hairDark: number,
    hair: number,
    hairLight: number,
  ): void {
    const braidPoints =
      pose === 'run-1'
        ? [
            { x: headX - 18, y: headY + 9 },
            { x: headX - 29, y: headY + 8 },
            { x: headX - 39, y: headY + 11 },
            { x: headX - 48, y: headY + 17 },
          ]
        : pose === 'run-2'
          ? [
              { x: headX - 17, y: headY + 9 },
              { x: headX - 28, y: headY + 11 },
              { x: headX - 36, y: headY + 18 },
              { x: headX - 41, y: headY + 27 },
            ]
          : pose === 'jump' || pose === 'power'
            ? [
                { x: headX - 17, y: headY + 9 },
                { x: headX - 29, y: headY + 5 },
                { x: headX - 40, y: headY + 10 },
                { x: headX - 48, y: headY + 18 },
              ]
            : [
                { x: headX - 17, y: headY + 10 },
                { x: headX - 22, y: headY + 20 },
                { x: headX - 23, y: headY + 31 },
                { x: headX - 20, y: headY + 42 },
              ];

    graphics.fillStyle(hairDark, 1);
    braidPoints.forEach((point, index) => {
      graphics.fillCircle(point.x, point.y, index === braidPoints.length - 1 ? 5 : 6);
    });
    graphics.fillStyle(hair, 1);
    braidPoints.forEach((point, index) => {
      graphics.fillCircle(point.x + 1, point.y - 1, index === braidPoints.length - 1 ? 4 : 5);
    });
    graphics.fillStyle(hairLight, 1);
    graphics.fillCircle(braidPoints[1].x, braidPoints[1].y - 2, 2);
    graphics.fillCircle(braidPoints[2].x, braidPoints[2].y - 1, 2);

    const frontBraidX = headX + 9;
    const frontBraidY = headY + 22;
    graphics.fillStyle(hairDark, 1);
    graphics.fillCircle(frontBraidX, frontBraidY, 5);
    graphics.fillCircle(frontBraidX + 1, frontBraidY + 9, 5);
    graphics.fillCircle(frontBraidX, frontBraidY + 18, 4);
    graphics.fillStyle(hair, 1);
    graphics.fillCircle(frontBraidX + 1, frontBraidY - 1, 4);
    graphics.fillCircle(frontBraidX + 2, frontBraidY + 8, 4);
    graphics.fillCircle(frontBraidX + 1, frontBraidY + 17, 3);
    graphics.fillStyle(COLORS.tropicalAqua, 1);
    graphics.fillRect(frontBraidX - 3, frontBraidY + 13, 7, 3);
  }

  private drawPaoArms(
    graphics: Phaser.GameObjects.Graphics,
    torsoX: number,
    torsoY: number,
    pose: 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'power',
    outline: number,
    skin: number,
    shirt: number,
  ): void {
    const leftHand =
      pose === 'run-1'
        ? { x: torsoX - 27, y: torsoY + 14 }
        : pose === 'run-2'
          ? { x: torsoX - 17, y: torsoY + 3 }
          : pose === 'jump' || pose === 'power'
            ? { x: torsoX - 22, y: torsoY - 19 }
            : { x: torsoX - 15, y: torsoY + 20 };
    const rightHand =
      pose === 'run-1'
        ? { x: torsoX + 22, y: torsoY + 1 }
        : pose === 'run-2'
          ? { x: torsoX + 18, y: torsoY + 15 }
          : pose === 'jump' || pose === 'power'
            ? { x: torsoX + 23, y: torsoY - 18 }
            : { x: torsoX + 12, y: torsoY + 18 };

    graphics.lineStyle(7, outline, 1);
    graphics.beginPath();
    graphics.moveTo(torsoX - 8, torsoY + 2);
    graphics.lineTo(leftHand.x, leftHand.y);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(torsoX + 8, torsoY + 2);
    graphics.lineTo(rightHand.x, rightHand.y);
    graphics.strokePath();

    graphics.lineStyle(5, skin, 1);
    graphics.beginPath();
    graphics.moveTo(torsoX - 8, torsoY + 2);
    graphics.lineTo(leftHand.x, leftHand.y);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(torsoX + 8, torsoY + 2);
    graphics.lineTo(rightHand.x, rightHand.y);
    graphics.strokePath();

    graphics.lineStyle(6, shirt, 1);
    graphics.beginPath();
    graphics.moveTo(torsoX - 8, torsoY + 2);
    graphics.lineTo(torsoX - 15, torsoY + 7);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(torsoX + 8, torsoY + 2);
    graphics.lineTo(torsoX + 13, torsoY + 7);
    graphics.strokePath();

    graphics.fillStyle(skin, 1);
    graphics.fillCircle(leftHand.x, leftHand.y, 4);
    graphics.fillCircle(rightHand.x, rightHand.y, 4);
    graphics.fillStyle(COLORS.tropicalAqua, 1);
    graphics.fillCircle(leftHand.x + 1, leftHand.y - 2, 2);
  }

  private drawPaoLegs(
    graphics: Phaser.GameObjects.Graphics,
    pose: 'idle-1' | 'idle-2' | 'run-1' | 'run-2' | 'jump' | 'power',
    torsoX: number,
    torsoY: number,
    outline: number,
    denim: number,
    denimDark: number,
    denimLight: number,
    shoe: number,
    sole: number,
  ): void {
    const hipY = torsoY + 20;
    const leftKnee =
      pose === 'run-1'
        ? { x: torsoX - 15, y: hipY + 11 }
        : pose === 'run-2'
          ? { x: torsoX + 1, y: hipY + 14 }
          : pose === 'jump'
            ? { x: torsoX - 8, y: hipY + 8 }
            : { x: torsoX - 7, y: hipY + 15 };
    const leftFoot =
      pose === 'run-1'
        ? { x: torsoX - 30, y: 74 }
        : pose === 'run-2'
          ? { x: torsoX - 5, y: 76 }
          : pose === 'jump'
            ? { x: torsoX - 18, y: 69 }
            : { x: torsoX - 9, y: 76 };
    const rightKnee =
      pose === 'run-1'
        ? { x: torsoX + 13, y: hipY + 4 }
        : pose === 'run-2'
          ? { x: torsoX + 20, y: hipY + 14 }
          : pose === 'jump'
            ? { x: torsoX + 18, y: hipY + 1 }
            : { x: torsoX + 8, y: hipY + 15 };
    const rightFoot =
      pose === 'run-1'
        ? { x: torsoX + 25, y: 74 }
        : pose === 'run-2'
          ? { x: torsoX + 34, y: 75 }
          : pose === 'jump'
            ? { x: torsoX + 13, y: 62 }
            : { x: torsoX + 9, y: 76 };

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(torsoX - 13, hipY - 3, 28, 10, 3);
    graphics.fillStyle(denimDark, 1);
    graphics.fillRoundedRect(torsoX - 11, hipY - 2, 24, 8, 2);

    this.drawPaoPantLeg(graphics, torsoX - 7, hipY + 2, leftKnee, leftFoot, outline, denim, denimDark, denimLight);
    this.drawPaoPantLeg(graphics, torsoX + 7, hipY + 2, rightKnee, rightFoot, outline, denim, denimDark, denimLight);

    this.drawPaoShoe(graphics, leftFoot.x, leftFoot.y, pose === 'run-1' || pose === 'jump' ? -0.2 : 0, shoe, sole, outline);
    this.drawPaoShoe(graphics, rightFoot.x, rightFoot.y, pose === 'run-2' ? 0.15 : 0, shoe, sole, outline);
  }

  private drawPaoPantLeg(
    graphics: Phaser.GameObjects.Graphics,
    hipX: number,
    hipY: number,
    knee: { x: number; y: number },
    foot: { x: number; y: number },
    outline: number,
    denim: number,
    denimDark: number,
    denimLight: number,
  ): void {
    graphics.lineStyle(13, outline, 1);
    graphics.beginPath();
    graphics.moveTo(hipX, hipY);
    graphics.lineTo(knee.x, knee.y);
    graphics.lineTo(foot.x, foot.y - 5);
    graphics.strokePath();

    graphics.lineStyle(10, denim, 1);
    graphics.beginPath();
    graphics.moveTo(hipX, hipY);
    graphics.lineTo(knee.x, knee.y);
    graphics.lineTo(foot.x, foot.y - 5);
    graphics.strokePath();

    graphics.lineStyle(3, denimLight, 0.75);
    graphics.beginPath();
    graphics.moveTo(hipX + 1, hipY + 3);
    graphics.lineTo(knee.x + 1, knee.y - 2);
    graphics.strokePath();

    graphics.fillStyle(denimDark, 1);
    graphics.fillRoundedRect(knee.x - 5, knee.y - 2, 12, 8, 2);
    graphics.fillStyle(denimLight, 1);
    graphics.fillRoundedRect(foot.x - 7, foot.y - 10, 14, 6, 2);
  }

  private drawPaoShoe(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    rotation: number,
    shoe: number,
    sole: number,
    outline: number,
  ): void {
    const lift = Math.round(rotation * 8);

    graphics.fillStyle(outline, 1);
    graphics.fillRoundedRect(x - 11, y - 2 + lift, 22, 8, 3);
    graphics.fillStyle(shoe, 1);
    graphics.fillRoundedRect(x - 9, y - 4 + lift, 18, 8, 3);
    graphics.fillStyle(sole, 1);
    graphics.fillRect(x - 10, y + 2 + lift, 20, 3);
    graphics.fillStyle(COLORS.starGold, 1);
    graphics.fillRect(x - 3, y - 2 + lift, 3, 3);
    graphics.fillStyle(sole, 0.95);
    graphics.fillRect(x + 2, y - 2 + lift, 5, 2);
  }

  private createPlayerAnimations(baseKey: string): void {
    this.anims.create({
      key: `${baseKey}-idle`,
      frames: [{ key: baseKey }, { key: `${baseKey}-idle-2` }],
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: `${baseKey}-run`,
      frames: [{ key: `${baseKey}-run-1` }, { key: baseKey }, { key: `${baseKey}-run-2` }, { key: baseKey }],
      frameRate: 9,
      repeat: -1,
    });

    this.anims.create({
      key: `${baseKey}-jump`,
      frames: [{ key: `${baseKey}-jump` }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: `${baseKey}-fall`,
      frames: [{ key: `${baseKey}-jump` }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: `${baseKey}-hurt`,
      frames: [{ key: `${baseKey}-power` }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: `${baseKey}-win`,
      frames: [{ key: `${baseKey}-idle-2` }],
      frameRate: 1,
      repeat: 0,
    });

    this.anims.create({
      key: `${baseKey}-power`,
      frames: [{ key: `${baseKey}-power` }, { key: `${baseKey}-idle-2` }],
      frameRate: 8,
      repeat: 0,
    });
  }

  private createStarTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.starGold, 1);
    graphics.fillRect(21, 4, 6, 12);
    graphics.fillRect(21, 32, 6, 12);
    graphics.fillRect(4, 21, 12, 6);
    graphics.fillRect(32, 21, 12, 6);
    graphics.fillRect(16, 16, 16, 16);
    graphics.fillStyle(COLORS.magicGlow, 1);
    graphics.fillRect(20, 10, 8, 28);
    graphics.fillRect(10, 20, 28, 8);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(22, 18, 4, 4);
    graphics.generateTexture(TEXTURE_KEYS.STAR, 48, 48);
    graphics.destroy();
  }

  private createShellTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.puchiPink, 1);
    graphics.fillRect(12, 24, 24, 14);
    graphics.fillRect(16, 16, 16, 8);
    graphics.fillRect(20, 10, 8, 6);
    graphics.fillStyle(COLORS.shellCream, 1);
    graphics.fillRect(15, 26, 18, 8);
    graphics.fillRect(19, 18, 10, 6);
    graphics.fillStyle(COLORS.coralPink, 1);
    graphics.fillRect(18, 15, 3, 19);
    graphics.fillRect(24, 12, 3, 22);
    graphics.fillRect(30, 16, 3, 18);
    graphics.generateTexture(TEXTURE_KEYS.SHELL, 48, 48);
    graphics.destroy();
  }

  private createBasketballTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x6b2f12, 1);
    graphics.fillCircle(16, 16, 15);
    graphics.fillStyle(0xd8792d, 1);
    graphics.fillCircle(16, 16, 13);
    graphics.lineStyle(2, 0x4b2110, 1);
    graphics.beginPath();
    graphics.moveTo(16, 3);
    graphics.lineTo(16, 29);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(3, 16);
    graphics.lineTo(29, 16);
    graphics.strokePath();
    graphics.beginPath();
    graphics.arc(8, 16, 8, Phaser.Math.DegToRad(-70), Phaser.Math.DegToRad(70), false);
    graphics.strokePath();
    graphics.beginPath();
    graphics.arc(24, 16, 8, Phaser.Math.DegToRad(110), Phaser.Math.DegToRad(250), false);
    graphics.strokePath();
    graphics.fillStyle(0xffb15d, 0.75);
    graphics.fillCircle(11, 9, 3);
    graphics.generateTexture(TEXTURE_KEYS.BASKETBALL, 32, 32);
    graphics.destroy();
  }

  private createCrabTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x7b2719, 1);
    graphics.fillEllipse(31, 33, 34, 22);
    graphics.fillStyle(COLORS.crabOrange, 1);
    graphics.fillEllipse(31, 30, 31, 21);
    graphics.fillStyle(0xf18a49, 1);
    graphics.fillEllipse(31, 27, 22, 11);
    graphics.lineStyle(3, 0x7b2719, 1);
    graphics.beginPath();
    graphics.moveTo(16, 29);
    graphics.lineTo(7, 22);
    graphics.lineTo(12, 18);
    graphics.strokePath();
    graphics.beginPath();
    graphics.moveTo(46, 29);
    graphics.lineTo(55, 22);
    graphics.lineTo(50, 18);
    graphics.strokePath();
    graphics.fillStyle(COLORS.crabOrange, 1);
    graphics.fillCircle(7, 19, 5);
    graphics.fillCircle(55, 19, 5);
    graphics.fillRect(4, 16, 4, 7);
    graphics.fillRect(54, 16, 4, 7);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(22, 14, 6, 6);
    graphics.fillRect(34, 14, 6, 6);
    graphics.fillStyle(0x1d1d1d, 1);
    graphics.fillRect(24, 16, 2, 2);
    graphics.fillRect(36, 16, 2, 2);
    graphics.lineStyle(3, 0x7b2719, 1);
    for (const legX of [15, 24, 38, 47]) {
      graphics.beginPath();
      graphics.moveTo(legX, 38);
      graphics.lineTo(legX - 4, 45);
      graphics.lineTo(legX + 3, 45);
      graphics.strokePath();
    }
    graphics.generateTexture(TEXTURE_KEYS.CRAB, 60, 52);
    graphics.destroy();
  }

  private createDogTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x7e5638, 1);
    graphics.fillRoundedRect(13, 28, 42, 20, 8);
    graphics.fillStyle(COLORS.dogTan, 1);
    graphics.fillRoundedRect(15, 25, 38, 20, 8);
    graphics.fillRoundedRect(12, 14, 22, 22, 7);
    graphics.fillStyle(0x7e5638, 1);
    graphics.fillTriangle(12, 16, 7, 8, 18, 14);
    graphics.fillTriangle(29, 14, 38, 8, 35, 21);
    graphics.fillRoundedRect(18, 44, 7, 13, 3);
    graphics.fillRoundedRect(42, 44, 7, 13, 3);
    graphics.lineStyle(4, 0x7e5638, 1);
    graphics.beginPath();
    graphics.moveTo(52, 28);
    graphics.lineTo(59, 22);
    graphics.lineTo(62, 15);
    graphics.strokePath();
    graphics.fillStyle(0xf2c58d, 1);
    graphics.fillRoundedRect(13, 24, 10, 8, 4);
    graphics.fillStyle(0x1d1d1d, 1);
    graphics.fillRect(18, 20, 3, 3);
    graphics.fillRect(12, 27, 4, 3);
    graphics.fillStyle(0xe87584, 1);
    graphics.fillRect(22, 29, 5, 2);
    graphics.generateTexture(TEXTURE_KEYS.DOG, 64, 64);
    graphics.destroy();
  }

  private createCheckpointTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(COLORS.shellCream, 1);
    graphics.fillRect(8, 6, 5, 64);
    graphics.fillStyle(0x5a3d2a, 1);
    graphics.fillRect(6, 68, 10, 6);
    graphics.fillStyle(COLORS.paoTeal, 1);
    graphics.fillRect(13, 8, 34, 22);
    graphics.fillStyle(COLORS.tropicalAqua, 1);
    graphics.fillRect(17, 12, 22, 6);
    graphics.fillStyle(COLORS.starGold, 1);
    graphics.fillRect(24, 18, 6, 6);
    graphics.generateTexture(TEXTURE_KEYS.CHECKPOINT, 64, 76);
    graphics.destroy();
  }

  private createClamTexture(): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0x8f4e6b, 1);
    graphics.fillRect(18, 46, 82, 28);
    graphics.fillStyle(COLORS.coralPink, 1);
    graphics.fillRect(20, 38, 78, 30);
    graphics.fillRect(28, 28, 62, 14);
    graphics.fillRect(42, 18, 34, 12);
    graphics.fillStyle(COLORS.shellCream, 1);
    graphics.fillRect(28, 58, 62, 16);
    graphics.fillStyle(COLORS.magicGlow, 1);
    graphics.fillRect(50, 30, 18, 18);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(55, 34, 6, 6);
    graphics.fillStyle(COLORS.puchiPink, 1);
    graphics.fillRect(34, 34, 4, 32);
    graphics.fillRect(48, 24, 4, 42);
    graphics.fillRect(64, 24, 4, 42);
    graphics.fillRect(80, 34, 4, 32);
    graphics.generateTexture(TEXTURE_KEYS.CLAM, 116, 86);
    graphics.destroy();
  }

  private createTerrainTextures(): void {
    const sand = this.add.graphics();
    sand.fillStyle(COLORS.sandyBeige, 1);
    sand.fillRect(0, 0, 64, 24);
    sand.fillStyle(COLORS.sunsetGold, 1);
    sand.fillRect(0, 0, 64, 6);
    sand.fillStyle(0xc69a62, 1);
    sand.fillRect(6, 12, 10, 3);
    sand.fillRect(28, 16, 8, 3);
    sand.fillRect(48, 10, 12, 3);
    sand.generateTexture(TEXTURE_KEYS.SAND_TILE, 64, 24);
    sand.destroy();

    const rock = this.add.graphics();
    rock.fillStyle(COLORS.rockBrown, 1);
    rock.fillRect(0, 0, 64, 48);
    rock.fillStyle(0x6b4f35, 1);
    rock.fillRect(4, 6, 18, 10);
    rock.fillRect(30, 4, 26, 12);
    rock.fillRect(12, 24, 22, 10);
    rock.fillRect(42, 30, 18, 12);
    rock.fillStyle(0xa77a50, 1);
    rock.fillRect(8, 7, 10, 3);
    rock.fillRect(34, 5, 14, 3);
    rock.fillRect(16, 25, 10, 3);
    rock.generateTexture(TEXTURE_KEYS.ROCK_TILE, 64, 48);
    rock.destroy();
  }
}
