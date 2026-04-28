import { motion } from "framer-motion";
import { useGameStore } from "../store/gameStore";
import { audioManager } from "../utils/audioManager";

type ActionPanelProps = {
  actionsLeft: number;
};

export function ActionPanel({ actionsLeft }: ActionPanelProps) {
  const endTurn = useGameStore((s) => s.endTurn);
  const collectResources = useGameStore((s) => s.collectResources);

  return (
    <div className="panel-card">
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            audioManager.playClick();
            useGameStore.getState().startNewGame();
          }}
          className="action-btn action-btn--danger"
        >
          🔄 重开
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            audioManager.playClick();
            collectResources();
            audioManager.playCollect();
          }}
          disabled={actionsLeft <= 0}
          className={`action-btn action-btn--secondary ${actionsLeft <= 0 ? "opacity-50" : ""}`}
        >
          🎁 收集
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            audioManager.playClick();
            endTurn();
          }}
          className="action-btn action-btn--primary"
        >
          ⏭️ 结束回合
        </motion.button>
      </div>

      <div className="text-center mt-3">
        <motion.span
          className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1 rounded-full text-sm font-bold text-purple-700"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎯 剩余动作: <span className="text-xl">{actionsLeft}</span>
        </motion.span>
      </div>
    </div>
  );
}