import { motion, AnimatePresence } from 'framer-motion';
import { BUILDINGS, GODS } from '../constants/buildings';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-purple-700">📖 游戏规则</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-2">🎯 胜利条件</h3>
                <p className="text-gray-700">获得 10 颗星星即可胜利！</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-2">🔄 每回合</h3>
                <p className="text-gray-700">可以执行 2 个动作：探索、建造、收集、神力或结束回合</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-2">🗺️ 地图</h3>
                <p className="text-gray-700">六角格海岛，中心是 Town Hall。云朵地块需要探索后才能建造。</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-2">🏗️ 建筑</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.values(BUILDINGS)
                    .filter((b) => b.type !== 'town_hall')
                    .map((b) => (
                      <div key={b.type} className="bg-white/50 rounded-xl p-2 text-sm">
                        <span className="text-lg">{b.emoji}</span>
                        <span className="font-bold text-purple-700 ml-1">{b.name}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          {Object.keys(b.cost).length > 0 && (
                            <span>
                              花费:{' '}
                              {Object.entries(b.cost)
                                .map(([r, a]) => `${r === 'food' ? '🍎' : r === 'stone' ? '🪨' : '🪙'}${a}`)
                                .join(' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-purple-600 mb-2">⚡ 神明</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.values(GODS).map((g) => (
                    <div key={g.type} className="bg-white/50 rounded-xl p-2 text-center">
                      <div className="text-2xl">{g.emoji}</div>
                      <div className="font-bold text-purple-700 text-sm">{g.name}</div>
                      <div className="text-xs text-gray-500">{g.description}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">建造 Temple 后随机解锁一位神明</p>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
