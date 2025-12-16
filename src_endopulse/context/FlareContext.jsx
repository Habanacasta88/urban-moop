import React, { createContext, useContext, useState, useEffect } from 'react';

const FlareContext = createContext();

export const useFlare = () => useContext(FlareContext);

export const FlareProvider = ({ children }) => {
    // State: 'none' | 'wizard_step_1' | 'wizard_step_2' | 'wizard_step_3' | 'in_progress' | 'resolved'
    const [flareState, setFlareState] = useState(() => {
        return localStorage.getItem('endo_flare_state') || 'none';
    });

    const [currentFlare, setCurrentFlare] = useState(() => {
        const saved = localStorage.getItem('endo_current_flare');
        return saved ? JSON.parse(saved) : null;
    });

    const [flareHistory, setFlareHistory] = useState([]);

    useEffect(() => {
        localStorage.setItem('endo_flare_state', flareState);
    }, [flareState]);

    useEffect(() => {
        localStorage.setItem('endo_current_flare', JSON.stringify(currentFlare));
    }, [currentFlare]);

    // Actions
    const startFlare = () => {
        setFlareState('wizard_step_1');
        setCurrentFlare({
            id: Date.now(),
            startTime: new Date().toISOString(),
            interventions: [],
            painMap: [],
            plan: [],
            status: 'wizard'
        });
    };

    const updateFlareData = (data) => {
        setCurrentFlare(prev => ({ ...prev, ...data }));
    };

    const advanceStage = (nextStage) => {
        setFlareState(nextStage);
        if (nextStage === 'in_progress' && currentFlare) {
            updateFlareData({ status: 'in_progress' });
        }
    };

    const resolveFlare = (summary) => {
        const closedFlare = { ...currentFlare, ...summary, status: 'resolved', endTime: new Date().toISOString() };
        setFlareHistory(prev => [closedFlare, ...prev]); // Simple in-memory history for now
        setCurrentFlare(null);
        setFlareState('none');
    };

    const cancelFlare = () => {
        setCurrentFlare(null);
        setFlareState('none');
    };

    return (
        <FlareContext.Provider value={{
            flareState,
            currentFlare,
            startFlare,
            updateFlareData,
            advanceStage,
            resolveFlare,
            cancelFlare
        }}>
            {children}
        </FlareContext.Provider>
    );
};
