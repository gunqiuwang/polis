import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HexTile, BuildingType } from "../game/hexMap";
import { createInitialTilesWithClouds, revealTile } from "../game/hexMap";
import { BUILDINGS, canBuildOn } from "../game/buildings";

type Resources = {
  food: number;
  stone: number;
  coin: number;
  faith: number;
};

type GameStore = {
  tiles: HexTile[];
  selectedTileId?: string;
  resources: Resources;
  stars: number;
  turn: number;
  actionsLeft: number;

  startNewGame: () => void;
  selectTile: (tileId: string | null) => void;
  exploreTile: (tileId: string) => void;
  buildOnTile: (tileId: string, building: BuildingType) => void;
  collectResources: () => void;
  endTurn: () => void;
};

const initialResources: Resources = {
  food: 2,
  stone: 2,
  coin: 0,
  faith: 0,
};

function createInitialState() {
  return {
    tiles: createInitialTilesWithClouds(),
    selectedTileId: "0,0",
    resources: initialResources,
    stars: 0,
    turn: 1,
    actionsLeft: 2,
  };
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      startNewGame: () => {
        set(createInitialState());
      },

      selectTile: (tileId) => {
        set({ selectedTileId: tileId || undefined });
      },

      exploreTile: (tileId) => {
        set((state) => {
          const tile = state.tiles.find((item) => item.id === tileId);

          if (!tile || tile.revealed || state.actionsLeft <= 0) {
            return { selectedTileId: tileId };
          }

          return {
            tiles: revealTile(state.tiles, tileId),
            selectedTileId: tileId,
            actionsLeft: state.actionsLeft - 1,
          };
        });
      },

      buildOnTile: (tileId, building) => {
        set((state) => {
          const tile = state.tiles.find((t) => t.id === tileId);

          if (!tile || !tile.revealed || tile.building) {
            return {};
          }

          // Check terrain requirement
          if (!canBuildOn(tile.terrain, building)) {
            return {};
          }

          // Check cost
          const info = BUILDINGS[building];
          const cost = info.cost;
          const canAfford =
            (!cost.food || state.resources.food >= cost.food) &&
            (!cost.stone || state.resources.stone >= cost.stone) &&
            (!cost.coin || state.resources.coin >= cost.coin) &&
            (!cost.faith || state.resources.faith >= cost.faith);

          if (!canAfford) {
            return {};
          }

          // Check actions
          if (state.actionsLeft <= 0) {
            return {};
          }

          // Deduct resources
          const newResources = { ...state.resources };
          if (cost.food) newResources.food -= cost.food;
          if (cost.stone) newResources.stone -= cost.stone;
          if (cost.coin) newResources.coin -= cost.coin;
          if (cost.faith) newResources.faith -= cost.faith;

          // Build
          const newTiles = state.tiles.map((t) =>
            t.id === tileId ? { ...t, building } : t
          );

          return {
            tiles: newTiles,
            resources: newResources,
            stars: state.stars + info.stars,
            actionsLeft: state.actionsLeft - 1,
          };
        });
      },

      collectResources: () => {
        set((state) => {
          if (state.actionsLeft <= 0) return {};

          let foodProd = 0, stoneProd = 0, coinProd = 0, faithProd = 0;

          state.tiles.forEach((tile) => {
            if (!tile.building || tile.building === "townHall") return;
            const info = BUILDINGS[tile.building];
            if (!info) return;

            const prod = info.production;
            if (prod.food) foodProd += prod.food;
            if (prod.stone) stoneProd += prod.stone;
            if (prod.coin) coinProd += prod.coin;
            if (prod.faith) faithProd += prod.faith;
          });

          return {
            resources: {
              food: state.resources.food + foodProd,
              stone: state.resources.stone + stoneProd,
              coin: state.resources.coin + coinProd,
              faith: state.resources.faith + faithProd,
            },
            actionsLeft: state.actionsLeft - 1,
          };
        });
      },

      endTurn: () => {
        set((state) => ({
          turn: state.turn + 1,
          actionsLeft: 2,
        }));
      },
    }),
    { name: "polis-game" }
  )
);