import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

// Configuration for mapping Gift IDs to Game Actions
// In a real app, this might come from a JSON config file or local storage
export const GIFT_MAPPING = {
    // Example IDs - user would replace these with actual TikTok Gift IDs
    '5655': 'ROSE',       // Rose -> Rose Obstacle
    '5269': 'DOUGHNUT',   // Doughnut -> Doughnut Obstacle
    '6666': 'DRAGON',     // Dragon -> Dragon Obstacle
    '9999': 'CHAOS',      // Custom Code -> Chaos Mode
};

export const useTikfinity = (onEvent) => {
    const { status } = useGameStore();

    const handleGift = useCallback((giftData) => {
        // giftData = { giftId, giftName, repeatCount, userId, ... }
        const actionType = GIFT_MAPPING[giftData.giftId] || 'ROSE'; // Default to Rose if unknown

        console.log(`[Tikfinity] Received Gift: ${giftData.giftName} (ID: ${giftData.giftId}) -> Action: ${actionType}`);

        // Pass to the game component's handler
        if (onEvent) {
            onEvent(actionType, giftData.repeatCount || 1);
        }
    }, [onEvent]);

    // Simulating a Webhook Receiver
    // In production, this would listen to a WebSocket or poll an endpoint
    useEffect(() => {
        // Expose a global function for testing/external scripts to call
        // e.g. window.sendFakeGift(5655)
        window.sendFakeGift = (id, count = 1) => {
            handleGift({ giftId: id, giftName: 'Debug Gift', repeatCount: count });
        };

        return () => {
            delete window.sendFakeGift;
        };
    }, [handleGift]);

    return {
        handleGift
    };
};
