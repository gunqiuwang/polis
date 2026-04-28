// Hexagonal Grid Utilities
// Used by gameStore for neighbor calculations

import type { HexCoord } from '../types/game';

// 方向向量 (axial coordinates)
export const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

// 计算距离
export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

// 六个邻居
export function hexNeighbors(coord: HexCoord): HexCoord[] {
  return HEX_DIRECTIONS.map((d) => ({
    q: coord.q + d.q,
    r: coord.r + d.r,
  }));
}

// Axial 坐标转屏幕像素
export function axialToPixel(q: number, r: number, size: number = 50): { x: number; y: number } {
  const x = size * (3 / 2) * q;
  const y = size * Math.sqrt(3) * (r + q / 2);
  return { x, y };
}