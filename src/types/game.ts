export type TerrainType =
  | 'town_hall'
  | 'field'
  | 'mountain'
  | 'lake'
  | 'sea'
  | 'gold'
  | 'metal'
  | 'wasteland'
  | 'cloud';

export type BuildingType =
  | 'town_hall'
  | 'farm'
  | 'quarry'
  | 'gold_mine'
  | 'metal_mine'
  | 'forge'
  | 'fishing_ground'
  | 'beach_resort'
  | 'merchant_guard'
  | 'temple'
  | 'road'
  | 'boat'
  | 'sea_road';

export type GodType =
  | 'zeus'
  | 'hera'
  | 'poseidon'
  | 'hades'
  | 'dionysus'
  | 'demeter'
  | 'apollo'
  | 'artemis';

export type ResourceType = 'food' | 'stone' | 'coin' | 'faith';

export interface HexCoord {
  q: number;
  r: number;
}

export interface Tile {
  id: string;
  coord: HexCoord;
  terrain: TerrainType;
  building: BuildingType | null;
  isExplored: boolean;
  isProtected: boolean;
}

export interface BuildingInfo {
  type: BuildingType;
  name: string;
  emoji: string;
  cost: Partial<Resources>;
  production: Partial<Resources>;
  stars: number;
  requires?: TerrainType[];
  requiresBuilding?: BuildingType[];
}

export interface GodInfo {
  type: GodType;
  name: string;
  emoji: string;
  description: string;
}

export interface Resources {
  food: number;
  stone: number;
  coin: number;
  faith: number;
}

export interface GameState {
  tiles: Tile[];
  resources: Resources;
  stars: number;
  turn: number;
  actionsRemaining: number;
  selectedTile: HexCoord | null;
  unlockedGods: GodType[];
  protectedBuildings: number;
  hasWon: boolean;
  hasLost: boolean;
}

export type GameAction =
  | { type: 'EXPLORE_TILE'; coord: HexCoord }
  | { type: 'SELECT_TILE'; coord: HexCoord | null }
  | { type: 'BUILD'; coord: HexCoord; building: BuildingType }
  | { type: 'COLLECT' }
  | { type: 'USE_GOD'; god: GodType }
  | { type: 'END_TURN' }
  | { type: 'RESET_GAME' };