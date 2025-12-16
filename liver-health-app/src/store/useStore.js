import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
    persist(
        (set, get) => ({
            // User Profile
            user: null,
            onboardingCompleted: false,
            programStartDate: null,
            track: 'A', // A, B, C

            setUser: (data) => set((state) => ({ user: { ...state.user, ...data } })),
            completeOnboarding: (track) => set({ onboardingCompleted: true, track, programStartDate: new Date().toISOString() }),

            // Daily State
            dailyChecks: {
                alcohol: false,
                sugar: false,
                movement: false
            },
            history: {}, // { 'YYYY-MM-DD': { alcohol: true, ... } }
            streak: 0,

            toggleCheck: (check) => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                const newChecks = {
                    ...state.dailyChecks,
                    [check]: !state.dailyChecks[check]
                };

                // Update history
                const newHistory = { ...state.history, [today]: newChecks };

                // Simple streak calc (mocked for now, just increments if all 3 done today logic would be here)
                // Real streak logic requires checking yesterday, etc. We'll keep it simple.

                return {
                    dailyChecks: newChecks,
                    history: newHistory
                };
            }),

            resetDaily: () => set({ dailyChecks: { alcohol: false, sugar: false, movement: false } }),

            // Global Settings
            minimalMode: false,
            setMinimalMode: (active) => set({ minimalMode: active }),
        }),
        {
            name: 'liver-app-storage',
        }
    )
)

export default useStore
