import { create } from 'zustand';

export const GAME_MODES = {
    AVALANCHE: 'AVALANCHE',
    BOX_TOWER: 'BOX_TOWER',
    BALANCE_BEAM: 'BALANCE_BEAM',
    TOWER_DROP: 'TOWER_DROP',
};

export const useGameStore = create((set) => ({
    // Status
    status: 'READY', // READY, PLAYING, GAME_OVER
    activeMode: GAME_MODES.AVALANCHE,

    // Stats
    score: 0,
    highScore: 0,

    // Actions
    startGame: () => set({ status: 'PLAYING', score: 0 }),
    endGame: () => set((state) => ({
        status: 'GAME_OVER',
        highScore: Math.max(state.score, state.highScore)
    })),
    resetGame: () => set({ status: 'READY', score: 0 }),

    setMode: (mode) => set({ activeMode: mode }),
    addScore: (points) => set((state) => ({ score: state.score + points })),
}));
