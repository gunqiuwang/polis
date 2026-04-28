import { motion } from "framer-motion";

interface TopBarProps {
  stars: number;
  turn: number;
  resources: { food: number; stone: number; coin: number; faith: number };
}

export function TopBar({ stars, turn, resources }: TopBarProps) {
  return (
    <div className="panel-card h-full flex items-center justify-between px-6">
      {/* 左侧标题 */}
      <motion.h1
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500"
        whileHover={{ scale: 1.05 }}
      >
        🏛️ Polis 小小城邦
      </motion.h1>

      {/* 中间状态 */}
      <div className="flex items-center gap-4">
        <motion.div
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-200 to-amber-200 px-4 py-2 rounded-full shadow"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-extrabold text-amber-700">
            {stars} / 10
          </span>
        </motion.div>

        <motion.div
          className="flex items-center gap-2 bg-gradient-to-r from-blue-200 to-cyan-200 px-4 py-2 rounded-full shadow"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-xl">🔄</span>
          <span className="text-lg font-bold text-blue-700">第 {turn} 回合</span>
        </motion.div>
      </div>

      {/* 右侧资源 */}
      <div className="flex items-center gap-3">
        <div className="resource-item">
          <span className="resource-item__icon">🍎</span>
          <span className="resource-item__value">{resources.food}</span>
        </div>
        <div className="resource-item">
          <span className="resource-item__icon">🪨</span>
          <span className="resource-item__value">{resources.stone}</span>
        </div>
        <div className="resource-item">
          <span className="resource-item__icon">🪙</span>
          <span className="resource-item__value">{resources.coin}</span>
        </div>
        <div className="resource-item">
          <span className="resource-item__icon">✨</span>
          <span className="resource-item__value">{resources.faith}</span>
        </div>
      </div>
    </div>
  );
}