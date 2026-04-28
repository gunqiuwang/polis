import { useGameStore } from "../store/gameStore";
import { BUILDINGS, getAvailableBuildings } from "../game/buildings";
import type { BuildingType } from "../game/hexMap";
import { motion } from "framer-motion";
import { audioManager } from "../utils/audioManager";

export function BuildPanel() {
  const selectedTileId = useGameStore((s) => s.selectedTileId);
  const tiles = useGameStore((s) => s.tiles);
  const resources = useGameStore((s) => s.resources);
  const actionsLeft = useGameStore((s) => s.actionsLeft);
  const buildOnTile = useGameStore((s) => s.buildOnTile);

  const selectedTile = selectedTileId
    ? tiles.find((t) => t.id === selectedTileId)
    : null;

  const getTerrainEmoji = (terrain: string): string => {
    const map: Record<string, string> = {
      townHall: "🏛️",
      field: "🌾",
      mountain: "⛰️",
      lake: "💧",
      sea: "🌊",
      gold: "🪙",
      metal: "⚙️",
      wasteland: "🏜️",
    };
    return map[terrain] || "🟨";
  };

  const getTerrainName = (terrain: string): string => {
    const map: Record<string, string> = {
      townHall: "市政厅",
      field: "田野",
      mountain: "山地",
      lake: "湖泊",
      sea: "海洋",
      gold: "金矿",
      metal: "矿脉",
      wasteland: "荒地",
    };
    return map[terrain] || terrain;
  };

  if (!selectedTile) {
    return (
      <div className="panel-card">
        <div className="text-center py-8">
          <span className="text-5xl">🗺️</span>
          <p className="text-lg font-bold text-purple-600 mt-2">选择一个地块</p>
          <p className="text-sm text-gray-500 mt-1">点击地图上的地块</p>
        </div>
      </div>
    );
  }

  if (!selectedTile.revealed) {
    return (
      <div className="panel-card">
        <div className="text-center py-8">
          <motion.span
            className="text-5xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ☁️
          </motion.span>
          <p className="text-lg font-bold text-purple-600 mt-2">神秘云朵</p>
          <p className="text-sm text-gray-500 mt-1">点击云朵探索岛屿</p>
        </div>
      </div>
    );
  }

  if (selectedTile.building) {
    const info = BUILDINGS[selectedTile.building];
    return (
      <div className="panel-card">
        <div className="text-center py-6">
          <motion.span
            className="text-6xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {info.emoji}
          </motion.span>
          <p className="text-2xl font-extrabold text-purple-700 mt-2">
            {info.name}
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
              ⭐ +{info.stars}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const availableBuildings = getAvailableBuildings(selectedTile.terrain);

  const canAfford = (building: BuildingType) => {
    const info = BUILDINGS[building];
    const cost = info.cost;
    return (
      (!cost.food || resources.food >= cost.food) &&
      (!cost.stone || resources.stone >= cost.stone) &&
      (!cost.coin || resources.coin >= cost.coin) &&
      (!cost.faith || resources.faith >= cost.faith)
    );
  };

  const handleBuild = (building: BuildingType) => {
    if (!selectedTileId || !canAfford(building) || actionsLeft <= 0) {
      audioManager.playError();
      return;
    }
    audioManager.playClick();
    buildOnTile(selectedTileId, building);
    audioManager.playBuild();
    audioManager.playStar();
  };

  return (
    <div className="panel-card">
      {/* 地块信息 */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-purple-100">
        <span className="text-4xl">{getTerrainEmoji(selectedTile.terrain)}</span>
        <div>
          <p className="text-lg font-bold text-purple-700">
            {getTerrainName(selectedTile.terrain)}
          </p>
          <p className="text-xs text-gray-500">点击下方建造</p>
        </div>
      </div>

      {availableBuildings.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-4xl">🏝️</span>
          <p className="text-gray-500 mt-2">此地无法建造</p>
        </div>
      ) : (
        <div className="space-y-3">
          {availableBuildings.map((buildingType) => {
            const info = BUILDINGS[buildingType];
            const affordable = canAfford(buildingType);
            const disabled = !affordable || actionsLeft <= 0;

            return (
              <motion.button
                key={buildingType}
                whileHover={disabled ? {} : { scale: 1.02 }}
                whileTap={disabled ? {} : { scale: 0.96 }}
                onClick={() => handleBuild(buildingType)}
                disabled={disabled}
                className={`build-item w-full ${
                  disabled ? "build-item--disabled" : "build-item--affordable"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{info.emoji}</span>
                    <span className="font-bold text-purple-700">{info.name}</span>
                  </div>
                  <span className="text-yellow-500 font-bold">⭐+{info.stars}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-gray-500">花费:</span>
                  {Object.entries(info.cost).map(([res, amt]) => (
                    <span
                      key={res}
                      className={`${
                        canAfford(buildingType) ? "text-gray-700" : "text-red-400"
                      }`}
                    >
                      {getResEmoji(res)}{amt}
                    </span>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-3 border-t-2 border-purple-100 text-center">
        <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-bold">
          🎯 剩余动作: {actionsLeft}
        </span>
      </div>
    </div>
  );
}

function getResEmoji(res: string): string {
  const map: Record<string, string> = {
    food: "🍎",
    stone: "🪨",
    coin: "🪙",
    faith: "✨",
  };
  return map[res] || res;
}