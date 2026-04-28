import type { HexTile } from '../game/hexMap';

interface TileDetailProps {
  tileId?: string;
  tiles: HexTile[];
  onClose: () => void;
}

export function TileDetail({ tileId, tiles, onClose }: TileDetailProps) {
  const tile = tileId ? tiles.find((t) => t.id === tileId) : null;

  if (!tile) return null;

  return (
    <div className="bg-gradient-to-b from-amber-100 to-orange-100 rounded-2xl p-4 shadow-xl w-72">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-700">
          {getTileEmoji(tile)} {getTerrainName(tile.terrain)}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>
      </div>

      {!tile.revealed ? (
        <div className="text-center py-8">
          <p className="text-gray-500">☁️ 云朵遮住了这片土地</p>
          <p className="text-sm text-gray-400 mt-2">点击地块开始探索</p>
        </div>
      ) : tile.building ? (
        <div className="bg-white/50 rounded-xl p-3">
          <p className="text-lg font-bold text-purple-600">
            {getBuildingEmoji(tile.building)} {getBuildingName(tile.building)}
          </p>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">点击下方按钮建造建筑</p>
        </div>
      )}
    </div>
  );
}

function getTileEmoji(tile: HexTile): string {
  if (!tile.revealed) return "☁️";
  if (tile.building === "townHall") return "🏛️";

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

  return map[tile.terrain] || "🟨";
}

function getTerrainName(terrain: string): string {
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
}

function getBuildingEmoji(building: string): string {
  const map: Record<string, string> = {
    townHall: "🏛️",
    farm: "🌾",
    quarry: "⛏️",
    fishingGround: "🎣",
    goldMine: "💰",
    metalMine: "🔩",
    forge: "🔥",
    merchantGuard: "🛡️",
    temple: "🏛️",
    beachResort: "🏖️",
    road: "🛤️",
    boat: "⛵",
  };
  return map[building] || "🏗️";
}

function getBuildingName(building: string): string {
  const map: Record<string, string> = {
    townHall: "市政厅",
    farm: "农田",
    quarry: "采石场",
    fishingGround: "渔场",
    goldMine: "金矿",
    metalMine: "矿场",
    forge: "锻造厂",
    merchantGuard: "商会守卫",
    temple: "神庙",
    beachResort: "海滩度假村",
    road: "道路",
    boat: "小船",
  };
  return map[building] || building;
}