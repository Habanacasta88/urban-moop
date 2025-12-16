import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { VibeCheckModal } from '../components/VibeCheck/VibeCheckModal';

const VibeContext = createContext();

export const useVibe = () => useContext(VibeContext);

export const VibeProvider = ({ children }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [currentEntity, setCurrentEntity] = useState(null); // { type, id, name }

    // Cooldown helper
    const checkCooldown = (entityId) => {
        const lastCheck = localStorage.getItem(`vibe_check_${entityId}`);
        if (!lastCheck) return true;

        const diff = Date.now() - parseInt(lastCheck);
        // 2 hours = 7200000 ms
        return diff > 7200000;
    };

    const openVibeCheck = (type, id, name) => {
        if (!checkCooldown(id)) {
            console.log('Cooldown active for this entity');
            // Optional: Show toast "Ya has valorado esto hace poco"
            // For now, allow opening but maybe warn or just allow to update?
            // User requested strict rule: "Un mismo usuario no puede valorar... mas de 1 vez cada 2h"
            // So we block or just don't open.
            alert("¡Relaja! Ya has valorado esto hace menos de 2h. 🧘‍♂️");
            return;
        }

        setCurrentEntity({ type, id, name });
        setIsOpen(true);
    };

    const closeVibeCheck = () => {
        setIsOpen(false);
        setCurrentEntity(null);
    };

    const submitVibeCheck = async (data) => {
        if (!currentEntity) return;

        try {
            // 1. Save to Supabase
            const payload = {
                user_id: user?.id || null, // Allow anon
                entity_type: currentEntity.type,
                entity_id: currentEntity.id,
                emotion: data.emotion,
                sliders: data.sliders,
                tags: data.tags
            };

            const { error } = await supabase.from('vibe_checks').insert(payload);

            if (error) throw error;

            console.log("Vibe Check Submitted!", payload);

            // 2. Set Cooldown
            localStorage.setItem(`vibe_check_${currentEntity.id}`, Date.now().toString());

        } catch (error) {
            console.error("Error submitting vibe check:", error);
        }
    };

    return (
        <VibeContext.Provider value={{ openVibeCheck, closeVibeCheck }}>
            {children}
            <VibeCheckModal
                isOpen={isOpen}
                onClose={closeVibeCheck}
                entityName={currentEntity?.name}
                onSubmit={submitVibeCheck}
            />
        </VibeContext.Provider>
    );
};
