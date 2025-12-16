import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [dailyEntries, setDailyEntries] = useState(() => {
        const saved = localStorage.getItem('endo_entries');
        return saved ? JSON.parse(saved) : {}; // { "YYYY-MM-DD": { ... } }
    });

    const [painMap, setPainMap] = useState([]);

    useEffect(() => {
        localStorage.setItem('endo_entries', JSON.stringify(dailyEntries));
    }, [dailyEntries]);

    // entry: { pain: 0-10, energy: 'low'|'med'|'high', flare: bool, date: 'YYYY-MM-DD', ... }
    const saveDailyCheckIn = (entry) => {
        const dateKey = entry.date || new Date().toISOString().split('T')[0];
        setDailyEntries(prev => ({
            ...prev,
            [dateKey]: { ...prev[dateKey], ...entry }
        }));
    };

    const getEntry = (date) => {
        return dailyEntries[date] || null;
    };

    return (
        <DataContext.Provider value={{ dailyEntries, saveDailyCheckIn, getEntry, painMap, setPainMap }}>
            {children}
        </DataContext.Provider>
    );
};
