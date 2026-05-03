export type CharacterId = 'puchi' | 'pao';

export interface CharacterStats {
  id: CharacterId;
  name: string;
  description: string;
  baseSpeed: number;
  runSpeed: number;
  jumpVelocity: number;
  powerName: string;
  powerSummary: string;
  colors: {
    primary: number;
    secondary: number;
    accent: number;
  };
}

export interface LevelStartData {
  characterId: CharacterId;
}

export interface GameOverData {
  characterId: CharacterId;
  stars: number;
  shells: number;
}

export interface LevelCompleteData {
  characterId: CharacterId;
  stars: number;
  shells: number;
  totalShells: number;
}

export interface LevelSummary {
  stars: number;
  shells: number;
}

export interface PlayerInputState {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
  run: boolean;
}

export type PlayerEnvironment = 'normal' | 'shallow' | 'underwater';

export interface PlayerUpdateResult {
  jumped: boolean;
  landed: boolean;
}

export interface PowerState {
  readyAt: number;
  activeUntil: number;
}

export type PlatformStyle = 'beach' | 'rock' | 'floating';

export interface LevelPlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  style: PlatformStyle;
}

export interface MovingPlatformData extends LevelPlatformData {
  startX: number;
  endX: number;
  durationMs: number;
}

export type DecorationKind = 'dog' | 'checkpoint' | 'clam' | 'palm' | 'sign' | 'mami' | 'restaurant';

export interface LevelDecorationData {
  kind: DecorationKind;
  x: number;
  y: number;
  label?: string;
  scale?: number;
  checkpoint?: boolean;
  goal?: boolean;
}

export type CollectibleKind = 'star' | 'shell';

export interface CollectibleData {
  kind: CollectibleKind;
  x: number;
  y: number;
  scale?: number;
}

export interface CrabEnemyData {
  x: number;
  y: number;
  patrolMinX: number;
  patrolMaxX: number;
  speed: number;
}

export interface BossCrabEnemyData {
  x: number;
  y: number;
  hitsToDefeat: number;
}

export interface GiantGooseBossData {
  x: number;
  y: number;
  maxHealth: number;
  patrolMinX?: number;
  patrolMaxX?: number;
}

export type WaterZoneKind = 'shallow' | 'deep';

export interface WaterZoneData {
  kind: WaterZoneKind;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LevelSectionMarkerData {
  name: string;
  x: number;
}

export interface LevelData {
  name: string;
  status: string;
  width: number;
  height: number;
  startPosition: {
    x: number;
    y: number;
  };
  platforms: LevelPlatformData[];
  movingPlatforms?: MovingPlatformData[];
  collectibles: CollectibleData[];
  crabs: CrabEnemyData[];
  bossCrabs?: BossCrabEnemyData[];
  gooseBosses?: GiantGooseBossData[];
  decorations: LevelDecorationData[];
  waterZones: WaterZoneData[];
  sectionMarkers: LevelSectionMarkerData[];
}

export interface HudSceneData {
  characterId: CharacterId;
  characterName: string;
  totalShells: number;
}

export interface HudState {
  hearts: number;
  stars: number;
  shells: number;
  totalShells: number;
  characterName: string;
  powerText: string;
}
