import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { audioManager } from '../utils/audioManager';

export function AudioControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(audioManager.isEnabled());
  const [bgmVolume, setBgmVolume] = useState(audioManager.getBgmVolume());
  const [sfxVolume, setSfxVolume] = useState(audioManager.getSfxVolume());

  const handleToggle = () => {
    if (!enabled) {
      audioManager.enable();
      audioManager.resumeBgm();
    } else {
      audioManager.disable();
    }
    setEnabled(audioManager.isEnabled());
  };

  const handleBgmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    audioManager.setBgmVolume(vol);
    setBgmVolume(vol);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    audioManager.setSfxVolume(vol);
    setSfxVolume(vol);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          audioManager.playClick();
          setIsOpen(!isOpen);
        }}
        className="fixed top-20 right-4 z-40 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg"
      >
        {enabled ? '🔊' : '🔇'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className="fixed top-32 right-4 z-40 bg-gradient-to-b from-purple-100 to-pink-100 rounded-2xl p-4 shadow-xl w-56"
          >
            <h3 className="text-lg font-bold text-purple-700 mb-3">🎵 音乐设置</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">背景音乐</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    audioManager.playClick();
                    handleToggle();
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                    enabled
                      ? 'bg-green-400 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {enabled ? '开启' : '关闭'}
                </motion.button>
              </div>

              {enabled && (
                <>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      🎧 BGM 音量 ({Math.round(bgmVolume * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={bgmVolume}
                      onChange={handleBgmChange}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">
                      🔊 音效音量 ({Math.round(sfxVolume * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={sfxVolume}
                      onChange={handleSfxChange}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full bg-purple-400 hover:bg-purple-500 text-white rounded-xl py-2 font-bold"
            >
              完成
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}