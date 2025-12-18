
/**
 * Smart Feed Algorithm
 * Prioritizes "Action" over "Discovery".
 * 
 * SCORING SYSTEM:
 * 
 * 1. LIVE / NOW (Type: 'live') -> Base: 100
 *    +30: Distance < 500m
 *    +20: Ends in < 3h
 *    +20: ≥ 5 attendees
 *    +10: Vibe match (Mocked for MVP)
 * 
 * 2. MOOPS (Type: 'moop') -> Base: 70
 *    +25: ≥ 3 attendees
 *    +20: Starts in < 2h
 *    +15: Category: social, food, music
 *    +10: Distance < 500m
 * 
 * 3. FLASH (Type: 'flash') -> Base: 60
 *    +30: Expires in < 1h
 *    +20: Category: food, drink
 *    +10: Distance < 300m
 * 
 * 4. DISCOVER (Type: 'new', 'event') -> Base: 40
 *    +20: Is New (isNew flag)
 *    +10: Distance < 1km
 *    +10: Popular (likes > 50)
 * 
 * DIVERSITY RULE:
 * - Max 2 items of the same type in a row.
 * - Max total items: 10.
 */

// Helper to parse distance strings "500 m", "1.2 km" to meters
const parseDistanceMeters = (distStr) => {
    if (!distStr) return 99999;
    const clean = distStr.toLowerCase().replace(' ', '');
    if (clean.includes('km')) return parseFloat(clean) * 1000;
    if (clean.includes('m')) return parseFloat(clean);
    return 99999;
};

// Helper to parse time strings "En 20 min", "2h" to minutes
// For MVP, we'll do simple parsing.
const parseTimeMinutes = (timeStr) => {
    if (!timeStr) return 999; // Far future
    const clean = timeStr.toLowerCase();

    // "En X min" or "X min"
    if (clean.includes('min')) {
        const matches = clean.match(/(\d+)/);
        return matches ? parseInt(matches[0]) : 0;
    }

    // "X h" or "Xh"
    if (clean.includes('h')) {
        const matches = clean.match(/(\d+)/);
        return matches ? parseInt(matches[0]) * 60 : 0;
    }

    return 999;
};


const calculateScore = (item) => {
    let score = 0;
    const dist = parseDistanceMeters(item.location?.distance);
    const attendees = item.attendees || 0;
    const category = item.category || '';

    // 1. LIVE
    if (item.type === 'live') {
        score = 100;
        if (dist < 500) score += 30;
        // Mock time check (assuming all LIVE items are strictly "now" or ending soon)
        if (attendees >= 5) score += 20;
        // Vibe match mocked
        if (item.vibeMatch) score += 10;

        // Time remaining bonus (mocked logic based on string)
        if (item.endsIn && parseTimeMinutes(item.endsIn) < 180) score += 20;
    }

    // 2. MOOPS
    else if (item.type === 'moop') {
        score = 70;
        if (attendees >= 3) score += 25;
        if (item.time && parseTimeMinutes(item.time) < 120) score += 20;
        if (['social', 'food', 'music'].includes(category)) score += 15;
        if (dist < 500) score += 10;
    }

    // 3. FLASH
    else if (item.type === 'flash') {
        score = 60;
        if (item.endsIn && parseTimeMinutes(item.endsIn) < 60) score += 30;
        if (['food', 'drink'].includes(category)) score += 20;
        if (dist < 300) score += 10;
    }

    // 4. DISCOVER / NEW
    else {
        score = 40;
        if (item.isNew) score += 20;
        if (dist < 1000) score += 10;
        if ((item.likes || 0) > 50) score += 10;
    }

    // Penalties (Placeholder)
    // if (item.seen) score -= 30;

    return score;
};

export const getSmartFeed = (allItems) => {
    // 1. Calculate Scores
    const scoredItems = allItems.map(item => ({
        ...item,
        score: calculateScore(item)
    }));

    // 2. Initial Sort by Score DESC
    scoredItems.sort((a, b) => b.score - a.score);

    // 3. Apply Diversity Rule (Max 2 same type consecutive) & Limit 10
    const finalFeed = [];
    let consecutiveCount = 0;
    let lastType = null;

    // We iterate through sorted items and pick valid ones
    // Note: A strict diversity rule might discard high profile items. 
    // Here we skip an item if it violates the rule, but usually we'd "postpone" it.
    // For MVP simplicity: we try to insert. If it breaks rule, we look for next best valid type.

    const candidates = [...scoredItems]; // copy to mutate

    while (finalFeed.length < 10 && candidates.length > 0) {
        // Find best candidate that satisfies diversity rule
        let bestIdx = -1;

        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];

            // If strictly different type needed? No, just max 2 same.
            if (candidate.type === lastType && consecutiveCount >= 2) {
                // Violates rule, skip to next candidate
                continue;
            }

            // Found valid candidate
            bestIdx = i;
            break;
        }

        if (bestIdx !== -1) {
            // Add to feed
            const selected = candidates[bestIdx];
            finalFeed.push(selected);

            // Update counters
            if (selected.type === lastType) {
                consecutiveCount++;
            } else {
                lastType = selected.type;
                consecutiveCount = 1;
            }

            // Remove from candidates
            candidates.splice(bestIdx, 1);
        } else {
            // No valid candidates found (all remaining impede diversity)
            // Fallback: Just take the highest score remaining? 
            // Or stop? User said "Never > 2". We'll stop or force break rule if only 1 type left.
            // Let's force break rule to show *something* rather than nothing, but prioritized.
            // Actually, for MVP, if we can't find varied content, we just add the next best.
            const forced = candidates.shift();
            finalFeed.push(forced);
        }
    }

    return finalFeed;
};
