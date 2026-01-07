import { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Enhanced Custom Marker Component with Emojis & Vibrant Design
const CustomMarker = ({ type, emoji, isSelected, onClick, isFlash, isLive, attendees, category }) => {
    // Size based on importance
    let baseSize = isSelected ? 52 : 44;

    // Vibrant color palette based on type/category
    let color = '#8B5CF6'; // Default purple
    let pulseColor = 'rgba(139, 92, 246, 0.4)';

    if (type === 'moop' || isLive) {
        color = '#06B6D4'; // Cyan for Moops
        pulseColor = 'rgba(6, 182, 212, 0.5)';
    } else if (type === 'event') {
        color = '#8B5CF6'; // Purple for events
        pulseColor = 'rgba(139, 92, 246, 0.4)';
    } else if (type === 'massive' || type === 'trending') {
        color = '#F43F5E'; // Rose for trending
        pulseColor = 'rgba(244, 63, 94, 0.4)';
        baseSize = isSelected ? 58 : 50;
    } else if (isFlash) {
        color = '#FBBF24'; // Amber for Flash
        pulseColor = 'rgba(251, 191, 36, 0.5)';
    }

    // Default emoji based on category if not provided
    const displayEmoji = emoji || getCategoryEmoji(category, type);

    return (
        <div
            className="relative flex items-center justify-center cursor-pointer"
            onClick={onClick}
            style={{ zIndex: isSelected ? 1000 : 10 }}
        >
            {/* Outer Pulse Ring */}
            <div
                className="absolute rounded-full animate-ping"
                style={{
                    width: `${baseSize + 20}px`,
                    height: `${baseSize + 20}px`,
                    backgroundColor: pulseColor,
                    animationDuration: '2s',
                }}
            />

            {/* Inner Pulse Ring */}
            <div
                className="absolute rounded-full"
                style={{
                    width: `${baseSize + 12}px`,
                    height: `${baseSize + 12}px`,
                    backgroundColor: pulseColor,
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
            />

            {/* Main Marker Circle */}
            <div
                className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${isSelected ? 'scale-110 ring-4 ring-white/50' : 'hover:scale-105'
                    }`}
                style={{
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    backgroundColor: color,
                    boxShadow: isSelected
                        ? `0 0 25px ${color}, 0 4px 15px rgba(0,0,0,0.3)`
                        : `0 4px 12px rgba(0,0,0,0.25)`,
                    border: '3px solid rgba(255,255,255,0.9)',
                }}
            >
                {/* Emoji */}
                <span
                    className="text-center leading-none drop-shadow-sm"
                    style={{ fontSize: `${baseSize * 0.5}px` }}
                >
                    {displayEmoji}
                </span>

                {/* Selection Triangle */}
                {isSelected && (
                    <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0"
                        style={{
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: `10px solid ${color}`,
                        }}
                    />
                )}
            </div>

            {/* LIVE Badge */}
            {(type === 'moop' || isLive) && (
                <div className="absolute -top-2 -right-1 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse border border-white/50">
                    LIVE
                </div>
            )}

            {/* FLASH Badge */}
            {isFlash && (
                <div className="absolute -top-2 -right-1 bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg animate-bounce border border-yellow-200">
                    ⚡ FLASH
                </div>
            )}

            {/* Attendees Count Badge */}
            {attendees && attendees > 5 && !isFlash && (
                <div className="absolute -bottom-2 -right-1 bg-white text-gray-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-md border border-gray-200">
                    +{attendees}
                </div>
            )}
        </div>
    );
};

// Helper to get emoji based on category
const getCategoryEmoji = (category, type) => {
    if (type === 'moop') return '🎉';
    if (type === 'flash') return '⚡';

    const cat = category?.toLowerCase() || '';
    if (cat.includes('música') || cat.includes('music')) return '🎵';
    if (cat.includes('comida') || cat.includes('food') || cat.includes('gastronomía')) return '🍽️';
    if (cat.includes('fiesta') || cat.includes('party')) return '🎉';
    if (cat.includes('cultura') || cat.includes('culture')) return '🏛️';
    if (cat.includes('deporte') || cat.includes('sport')) return '⚽';
    if (cat.includes('arte') || cat.includes('art')) return '🎨';
    if (cat.includes('mercado') || cat.includes('market')) return '🎄';
    if (cat.includes('café') || cat.includes('coffee')) return '☕';
    if (cat.includes('beer') || cat.includes('cerveza')) return '🍺';
    if (cat.includes('yoga') || cat.includes('bienestar')) return '🧘';

    return '📍';
};

const EmotionalMap = ({ events, selectedId, onSelect }) => {
    const initialViewState = {
        latitude: 41.543296,
        longitude: 2.109420,
        zoom: 14.5
    };

    const mapRef = useRef(null);

    useEffect(() => {
        if (selectedId && mapRef.current) {
            const evt = events.find(e => e.id === selectedId);
            if (evt) {
                mapRef.current.flyTo({
                    center: [evt.lng, evt.lat],
                    zoom: 16,
                    duration: 800,
                    essential: true
                });
            }
        }
    }, [selectedId, events]);

    if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'pk.YOUR_TOKEN_HERE') {
        return (
            <div className="flex items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center">
                <div>
                    <h3 className="text-xl font-bold mb-2">Mapbox Token Missing</h3>
                    <p className="text-sm text-gray-400">
                        Please add your Mapbox public token to the .env file:<br />
                        <code className="bg-gray-800 p-1 rounded">VITE_MAPBOX_TOKEN=pk.YOUR_TOKEN</code>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Map
                ref={mapRef}
                initialViewState={initialViewState}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken={MAPBOX_TOKEN}
                attributionControl={false}
                mapLib={import('mapbox-gl')}
            >
                {events.map((evt) => (
                    <Marker
                        key={evt.id}
                        longitude={evt.lng}
                        latitude={evt.lat}
                        anchor="center"
                        style={{ zIndex: selectedId === evt.id ? 100 : 1 }}
                    >
                        <CustomMarker
                            type={evt.type}
                            emoji={evt.emoji}
                            category={evt.category}
                            isFlash={evt.isFlash}
                            isLive={evt.isLive}
                            attendees={evt.attendees}
                            isSelected={selectedId === evt.id}
                            onClick={(e) => {
                                e?.stopPropagation?.();
                                onSelect(evt);
                            }}
                        />
                    </Marker>
                ))}
            </Map>
        </div>
    );
};

export default EmotionalMap;
