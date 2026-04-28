export type Terrain =
  | "townHall"
  | "field"
  | "mountain"
  | "lake"
  | "sea"
  | "gold"
  | "metal"
  | "wasteland";

export type BuildingType =
  | "townHall"
  | "farm"
  | "quarry"
  | "fishingGround"
  | "goldMine"
  | "metalMine"
  | "forge"
  | "merchantGuard"
  | "temple"
  | "beachResort"
  | "road"
  | "boat";

export type HexTile = {
  id: string;
  q: number;
  r: number;
  terrain: Terrain;
  revealed: boolean;
  building?: BuildingType;
};

export const HEX_DIRECTIONS = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
] as const;

const PLAYABLE_TERRAINS: Terrain[] = [
  "field",
  "mountain",
  "lake",
  "sea",
  "gold",
  "metal",
  "wasteland",
];

export function tileId(q: number, r: number): string {
  return `${q},${r}`;
}

export function axialToPixel(q: number, r: number, size: number) {
  return {
    x: size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r),
    y: size * (1.5 * r),
  };
}

export function getNeighbors(q: number, r: number) {
  return HEX_DIRECTIONS.map((d) => ({
    q: q + d.q,
    r: r + d.r,
  }));
}

function randomTerrain(): Terrain {
  return PLAYABLE_TERRAINS[
    Math.floor(Math.random() * PLAYABLE_TERRAINS.length)
  ];
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

// Hex distance from center (0,0)
function hexDistance(q: number, r: number): number {
  const s = -q - r;
  return (Math.abs(q) + Math.abs(r) + Math.abs(s)) / 2;
}

// Generate all hex coordinates within radius
function getHexesInRadius(radius: number): Array<{ q: number; r: number }> {
  const hexes: Array<{ q: number; r: number }> = [];
  for (let q = -radius; q <= radius; q++) {
    for (let r = -radius; r <= radius; r++) {
      const s = -q - r;
      if (Math.abs(s) <= radius) {
        hexes.push({ q, r });
      }
    }
  }
  return hexes;
}

export function createHexRadiusMap(radius: number = 2): HexTile[] {
  const hexes = getHexesInRadius(radius);
  const tiles: HexTile[] = [];

  // Shuffle terrains for first ring variety
  const shuffledTerrains = shuffle< Terrain>([...PLAYABLE_TERRAINS]);

  for (const { q, r } of hexes) {
    const dist = hexDistance(q, r);

    if (q === 0 && r === 0) {
      // Center - Town Hall
      tiles.push({
        id: tileId(q, r),
        q,
        r,
        terrain: "townHall",
        revealed: true,
        building: "townHall",
      });
    } else if (dist === 1) {
      // First ring - revealed with shuffled terrain
      tiles.push({
        id: tileId(q, r),
        q,
        r,
        terrain: shuffledTerrains[tiles.length % shuffledTerrains.length],
        revealed: true,
      });
    } else {
      // Outer rings - cloud (not revealed)
      tiles.push({
        id: tileId(q, r),
        q,
        r,
        terrain: randomTerrain(),
        revealed: false,
      });
    }
  }

  return tiles;
}

// Keep old function for compatibility
export function createInitialTilesWithClouds(): HexTile[] {
  return createHexRadiusMap(2);
}

// Reveal a tile and expand frontier
export function revealTile(tiles: HexTile[], id: string): HexTile[] {
  const existingIds = new Set(tiles.map((t) => t.id));
  const newTiles: HexTile[] = [];

  // Reveal the tile
  for (const tile of tiles) {
    if (tile.id === id) {
      newTiles.push({ ...tile, revealed: true });
    } else {
      newTiles.push(tile);
    }
  }

  // Add frontier tiles around revealed tiles
  for (const tile of newTiles) {
    if (!tile.revealed) continue;

    for (const n of getNeighbors(tile.q, tile.r)) {
      const nid = tileId(n.q, n.r);
      if (!existingIds.has(nid) && !newTiles.some((t) => t.id === nid)) {
        // Check if any revealed tile already has this neighbor
        const hasRevealedNeighbor = newTiles.some(
          (t) => t.revealed && Math.abs(t.q - n.q) <= 1 && Math.abs(t.r - n.r) <= 1
        );
        if (hasRevealedNeighbor) {
          newTiles.push({
            id: nid,
            q: n.q,
            r: n.r,
            terrain: randomTerrain(),
            revealed: false,
          });
        }
      }
    }
  }

  return newTiles;
}

// Legacy function for backward compatibility
export function addHiddenFrontierTiles(tiles: HexTile[]): HexTile[] {
  return revealTile(tiles, tiles.find((t) => t.revealed)?.id || "");
}

export function createInitialTiles(): HexTile[] {
  return createHexRadiusMap(1);
}