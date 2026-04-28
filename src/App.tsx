import { TopBar } from './components/TopBar';
import { HexMap } from './components/HexMap/HexMap';
import { ActionPanel } from './components/ActionPanel';
import { BuildPanel } from './components/BuildPanel';
import { GodsPanel } from './components/GodsPanel';
import { RulesModal } from './components/RulesModal';
import { VictoryScreen } from './components/VictoryScreen';
import { AudioControl } from './components/AudioControl';
import { RulesPanel } from './components/RulesPanel';
import { useGameStore } from './store/gameStore';
import { audioManager } from './utils/audioManager';
import { useEffect } from 'react';

function App() {
  const tiles = useGameStore((s) => s.tiles);
  const selectedTileId = useGameStore((s) => s.selectedTileId);
  const selectTile = useGameStore((s) => s.selectTile);
  const exploreTile = useGameStore((s) => s.exploreTile);
  const stars = useGameStore((s) => s.stars);
  const turn = useGameStore((s) => s.turn);
  const resources = useGameStore((s) => s.resources);
  const actionsLeft = useGameStore((s) => s.actionsLeft);

  useEffect(() => {
    audioManager.enable();
    audioManager.playBgm('game');
  }, []);

  return (
    <div className="game-layout">
      <div className="top-bar">
        <TopBar stars={stars} turn={turn} resources={resources} />
      </div>

      <div className="side-panel side-panel--left">
        <RulesPanel />
      </div>

      <div className="map-container">
        <HexMap
          tiles={tiles}
          selectedTileId={selectedTileId}
          onSelectTile={selectTile}
          onExploreTile={exploreTile}
        />
      </div>

      <div className="side-panel side-panel--right">
        <BuildPanel />
      </div>

      <div className="bottom-panel">
        <ActionPanel actionsLeft={actionsLeft} />
        <GodsPanel />
      </div>

      <RulesModal isOpen={false} onClose={() => {}} />
      <VictoryScreen stars={stars} />
      <AudioControl />
    </div>
  );
}

export default App;