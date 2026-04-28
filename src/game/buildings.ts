import type { Terrain, BuildingType } from "./hexMap";

export type BuildingInfo = {
  type: BuildingType;
  name: string;
  emoji: string;
  cost: { food?: number; stone?: number; coin?: number; faith?: number };
  production: { food?: number; stone?: number; coin?: number; faith?: number };
  stars: number;
  requires?: Terrain[];
};

export const BUILDINGS: Record<BuildingType, BuildingInfo> = {
  townHall: {
    type: "townHall",
    name: "市政厅",
    emoji: "🏛️",
    cost: {},
    production: { food: 1, stone: 1 },
    stars: 0,
  },
  farm: {
    type: "farm",
    name: "农田",
    emoji: "🏡",
    cost: { stone: 1 },
    production: { food: 1 },
    stars: 1,
    requires: ["field"],
  },
  quarry: {
    type: "quarry",
    name: "采石场",
    emoji: "⛏️",
    cost: { food: 1 },
    production: { stone: 1 },
    stars: 1,
    requires: ["mountain"],
  },
  fishingGround: {
    type: "fishingGround",
    name: "渔场",
    emoji: "🎣",
    cost: { coin: 1 },
    production: { food: 1 },
    stars: 1,
    requires: ["lake", "sea"],
  },
  goldMine: {
    type: "goldMine",
    name: "金矿",
    emoji: "💰",
    cost: { stone: 1 },
    production: { coin: 1 },
    stars: 1,
    requires: ["gold"],
  },
  metalMine: {
    type: "metalMine",
    name: "矿场",
    emoji: "⚒️",
    cost: { food: 1 },
    production: { stone: 1 },
    stars: 1,
    requires: ["metal"],
  },
  forge: {
    type: "forge",
    name: "锻造厂",
    emoji: "🔥",
    cost: { stone: 1, coin: 1 },
    production: { coin: 2 },
    stars: 2,
    requires: ["metal"],
  },
  merchantGuard: {
    type: "merchantGuard",
    name: "商会守卫",
    emoji: "🛒",
    cost: { coin: 1 },
    production: { coin: 1 },
    stars: 1,
    requires: ["wasteland"],
  },
  temple: {
    type: "temple",
    name: "神庙",
    emoji: "🏛️",
    cost: { stone: 2, coin: 1 },
    production: { faith: 1 },
    stars: 3,
  },
  beachResort: {
    type: "beachResort",
    name: "海滩度假村",
    emoji: "🏖️",
    cost: { stone: 1, coin: 1 },
    production: { coin: 1 },
    stars: 2,
    requires: ["sea"],
  },
  road: {
    type: "road",
    name: "道路",
    emoji: "🛤️",
    cost: { stone: 1 },
    production: {},
    stars: 0,
  },
  boat: {
    type: "boat",
    name: "小船",
    emoji: "⛵",
    cost: { coin: 1 },
    production: {},
    stars: 0,
    requires: ["lake", "sea"],
  },
};

export function canBuildOn(terrain: Terrain, buildingType: BuildingType): boolean {
  const info = BUILDINGS[buildingType];
  if (!info.requires) return true;
  return info.requires.includes(terrain);
}

export function getAvailableBuildings(terrain: Terrain): BuildingType[] {
  return Object.values(BUILDINGS)
    .filter((b) => b.type !== "townHall" && canBuildOn(terrain, b.type))
    .map((b) => b.type);
}