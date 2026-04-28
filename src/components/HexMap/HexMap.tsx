import { motion, AnimatePresence } from "framer-motion";
import { axialToPixel } from "../../game/hexMap";
import type { HexTile, Terrain } from "../../game/hexMap";
import { BUILDINGS } from "../../game/buildings";

const HEX_SIZE = 52;

type HexMapProps = {
  tiles: HexTile[];
  selectedTileId?: string;
  onSelectTile: (tileId: string) => void;
  onExploreTile: (tileId: string) => void;
};

export function HexMap({
  tiles,
  selectedTileId,
  onSelectTile,
  onExploreTile,
}: HexMapProps) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        background: "radial-gradient(circle at 30% 70%, #BAE6FD 0%, #7DD3FC 40%, #E0F7FF 100%)",
      }}
    >
      {/* 海洋装饰 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl opacity-30 animate-bounce">〰️</div>
        <div className="absolute top-32 right-20 text-3xl opacity-20 animate-pulse">☁️</div>
        <div className="absolute bottom-20 left-1/4 text-2xl opacity-25 animate-ping">✨</div>
        <div className="absolute bottom-40 right-1/3 text-3xl opacity-20">〰️</div>
      </div>

      <svg
        viewBox="-420 -320 840 640"
        className="h-full w-full touch-none select-none"
      >
        <defs>
          {/* 岛屿阴影 */}
          <filter id="islandShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.25" />
          </filter>
          {/* 发光效果 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          {tiles.map((tile) => {
            const { x, y } = axialToPixel(tile.q, tile.r, HEX_SIZE);

            return (
              <motion.g
                key={tile.id}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ x, y, scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                onClick={() => {
                  if (tile.revealed) {
                    onSelectTile(tile.id);
                  } else {
                    onExploreTile(tile.id);
                  }
                }}
                className="cursor-pointer"
              >
                {/* 选中发光效果 */}
                {tile.id === selectedTileId && (
                  <motion.polygon
                    points={getHexPoints(HEX_SIZE + 4)}
                    fill="none"
                    stroke="#A855F7"
                    strokeWidth="4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    filter="url(#glow)"
                  />
                )}

                <HexPolygon
                  revealed={tile.revealed}
                  terrain={tile.terrain}
                  selected={tile.id === selectedTileId}
                />

                <AnimatePresence mode="wait">
                  <motion.text
                    key={tile.building || tile.terrain}
                    initial={{ scale: 0, opacity: 0, y: 5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="30"
                    y="-3"
                    className="pointer-events-none select-none"
                    style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}
                  >
                    {getTileEmoji(tile)}
                  </motion.text>
                </AnimatePresence>

                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="700"
                  y="28"
                  className="pointer-events-none select-none"
                  fill={tile.revealed ? "#5B4B7A" : "#93C5FD"}
                  style={{ filter: "drop-shadow(0 1px 2px rgba(255,255,255,0.8))" }}
                >
                  {tile.revealed ? getTerrainName(tile.terrain) : "☁️"}
                </text>
              </motion.g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function HexPolygon({
  revealed,
  terrain,
  selected,
}: {
  revealed: boolean;
  terrain: Terrain;
  selected: boolean;
}) {
  return (
    <polygon
      points={getHexPoints(HEX_SIZE)}
      fill={revealed ? getTerrainColor(terrain) : "#BAE6FD"}
      stroke={selected ? "#A855F7" : revealed ? "#94A3B8" : "#7DD3FC"}
      strokeWidth={selected ? 3.5 : 2.5}
      opacity={revealed ? 1 : 0.85}
      filter="url(#islandShadow)"
      style={{
        strokeDasharray: revealed ? "none" : "4,2",
      }}
    />
  );
}

function getHexPoints(size: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${size * Math.cos(angle)},${size * Math.sin(angle)}`;
    })
    .join(" ");
}

function getTileEmoji(tile: HexTile): string {
  if (!tile.revealed) return "☁️";
  if (tile.building) return BUILDINGS[tile.building].emoji;

  const map: Record<Terrain, string> = {
    townHall: "🏛️",
    field: "🌾",
    mountain: "⛰️",
    lake: "💧",
    sea: "🌊",
    gold: "🪙",
    metal: "⚙️",
    wasteland: "🏜️",
  };

  return map[tile.terrain];
}

function getTerrainName(terrain: Terrain): string {
  const map: Record<Terrain, string> = {
    townHall: "城邦",
    field: "田野",
    mountain: "山地",
    lake: "湖泊",
    sea: "海洋",
    gold: "金矿",
    metal: "矿脉",
    wasteland: "荒地",
  };

  return map[terrain];
}

function getTerrainColor(terrain: Terrain): string {
  const map: Record<Terrain, string> = {
    townHall: "#FEF3C7", // 奶油金
    field: "#86EFAC", // 草地绿
    mountain: "#CBD5E1", // 石灰灰
    lake: "#67E8F9", // 湖蓝
    sea: "#38BDF8", // 海蓝
    gold: "#FDE047", // 金黄
    metal: "#94A3B8", // 银灰蓝
    wasteland: "#FDBA74", // 沙橙
  };

  return map[terrain];
}