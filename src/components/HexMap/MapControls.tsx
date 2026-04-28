import { motion } from 'framer-motion';
import type { MapViewState } from './types';

interface MapControlsProps {
  viewState: MapViewState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onCenterTownHall: () => void;
}

export function MapControls({
  viewState,
  onZoomIn,
  onZoomOut,
  onReset,
  onCenterTownHall,
}: MapControlsProps) {
  const scalePercent = Math.round(viewState.scale * 100);

  return (
    <div className="fixed bottom-24 right-4 z-30 flex flex-col gap-2">
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg overflow-hidden">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onZoomIn}
          className="w-11 h-11 flex items-center justify-center text-xl font-bold text-purple-600 hover:bg-purple-50 border-b border-gray-200"
          title="放大"
        >
          +
        </motion.button>

        <div className="h-8 flex items-center justify-center text-xs font-medium text-gray-600 bg-gray-50 border-b border-gray-200">
          {scalePercent}%
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onZoomOut}
          className="w-11 h-11 flex items-center justify-center text-xl font-bold text-purple-600 hover:bg-purple-50 border-b border-gray-200"
          title="缩小"
        >
          −
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onReset}
        className="w-11 h-11 bg-white/90 backdrop-blur rounded-xl shadow-lg flex items-center justify-center text-lg"
        title="重置视角"
      >
        🏠
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onCenterTownHall}
        className="w-11 h-11 bg-white/90 backdrop-blur rounded-xl shadow-lg flex items-center justify-center text-lg"
        title="居中城邦中心"
      >
        🎯
      </motion.button>
    </div>
  );
}
