import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Load from localStorage or default
    const [profile, setProfile] = useState(() => {
        const saved = localStorage.getItem('endo_user');
        return saved ? JSON.parse(saved) : {
            name: '',
            onboardingComplete: false,
            diagnosis: null,
            trackingPrefs: {
                pain: true,
                energy: true,
                sleep: true,
                stress: true,
                gi: false,
                bleeding: false,
                sexPain: false
            },
            communityAlias: null
        };
    });

    useEffect(() => {
        localStorage.setItem('endo_user', JSON.stringify(profile));
    }, [profile]);

    const updateProfile = (updates) => {
        setProfile(prev => ({ ...prev, ...updates }));
    };

    const completeOnboarding = () => {
        updateProfile({ onboardingComplete: true });
    };

    return (
        <UserContext.Provider value={{ profile, updateProfile, completeOnboarding }}>
            {children}
        </UserContext.Provider>
    );
};
