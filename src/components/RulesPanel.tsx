import { BUILDINGS } from "../game/buildings";
import { motion } from "framer-motion";

export function RulesPanel() {
  return (
    <div className="rules-panel">
      <h3>📖 游戏图鉴</h3>

      <div className="rules-section">
        <div className="rules-section__title">🎯 胜利目标</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">🏆</span>
          <span>收集 <span className="text-yellow-600 font-bold">⭐×10</span> 即可胜利</span>
        </div>
      </div>

      <div className="rules-section">
        <div className="rules-section__title">🔄 每回合</div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-2xl">⚡</span>
          <span>你有 <span className="text-purple-600 font-bold">2 个动作</span></span>
        </div>
      </div>

      <div className="rules-section">
        <div className="rules-section__title">🏗️ 可建建筑</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(BUILDINGS)
            .filter((b) => b.type !== "townHall")
            .map((b) => (
              <motion.div
                key={b.type}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-white/60 rounded-xl p-2"
              >
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-purple-700">{b.name}</div>
                  <div className="text-xs text-yellow-600">⭐{b.stars}</div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <div className="rules-section">
        <div className="rules-section__title">🗺️ 操作提示</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>☁️ 点击云朵 → 探索岛屿</div>
          <div>🏝️ 点击地块 → 查看详情</div>
          <div>🔍 双指缩放 → 调整地图</div>
        </div>
      </div>
    </div>
  );
}