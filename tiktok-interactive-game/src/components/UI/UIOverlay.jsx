import React from 'react';
import { useGameStore } from '../../store/gameStore';

const UIOverlay = () => {
    const { score, status, startGame, resetGame } = useGameStore();

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px',
            color: 'white',
            fontFamily: 'sans-serif',
        }}>
            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Score: {score}</h2>
                <h2>Status: {status}</h2>
            </div>

            {/* Controls */}
            <div style={{ pointerEvents: 'auto', textAlign: 'center', marginBottom: '50px' }}>
                {status === 'READY' && (
                    <button
                        onClick={startGame}
                        style={{ padding: '15px 40px', fontSize: '24px', cursor: 'pointer', background: '#ff0050', color: 'white', border: 'none', borderRadius: '8px' }}
                    >
                        START GAME
                    </button>
                )}

                {status === 'GAME_OVER' && (
                    <button
                        onClick={resetGame}
                        style={{ padding: '15px 40px', fontSize: '24px', cursor: 'pointer', background: '#00f2ea', color: 'black', border: 'none', borderRadius: '8px' }}
                    >
                        RESET
                    </button>
                )}
            </div>
        </div>
    );
};

export default UIOverlay;
