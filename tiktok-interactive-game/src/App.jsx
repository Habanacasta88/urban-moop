import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { useGameStore, GAME_MODES } from './store/gameStore';

// Components
import UIOverlay from './components/UI/UIOverlay';
// Placeholder for Game Modes
import PropsAvalanche from './components/GameModes/Avalanche';

function GameScene() {
  const { gravity } = useControls('Physics', {
    gravity: [0, -9.81, 0],
  });

  const activeMode = useGameStore((state) => state.activeMode);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={50} />
      <OrbitControls makeDefault />
      <Environment preset="studio" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Physics gravity={gravity} debug>
        {activeMode === GAME_MODES.AVALANCHE && <PropsAvalanche />}
        {/* Other modes will be added here */}

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </Physics>
    </>
  );
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Leva collapsed={false} />
      <UIOverlay />

      <Canvas shadows>
        <Suspense fallback={null}>
          <GameScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
