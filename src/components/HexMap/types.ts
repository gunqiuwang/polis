export interface MapViewState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface MapSaveData extends MapViewState {
  saved: boolean;
}

export const MAP_CONFIG = {
  minScale: 0.6,
  maxScale: 2.2,
  defaultScale: 1,
  resetPosition: { x: 0, y: 0 },
  scaleStep: 0.2,
};