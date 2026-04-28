import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { audioManager } from '../utils/audioManager';

type VictoryScreenProps = {
  stars: number;
};

export function VictoryScreen({ stars }: VictoryScreenProps) {
  if (stars < 10) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="bg-gradient-to-b from-yellow-300 via-amber-200 to-orange-300 rounded-3xl p-8 text-center shadow-2xl max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.2, 1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>

          <h1 className="text-4xl font-bold text-purple-800 mb-4">🎉 胜利！</h1>
          <p className="text-2xl text-purple-700 mb-2">你建成了小小城邦！</p>
          <p className="text-lg text-gray-600 mb-6">
            获得 {stars} 星星
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              audioManager.playClick();
              audioManager.playBgm('game');
              useGameStore.getState().startNewGame();
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-8 py-4 text-xl font-bold shadow-lg transition-colors"
          >
            再玩一次
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}