import { useState, useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Custom Marker Component
const CustomMarker = ({ type, emoji, isSelected, onClick, isFlash, isNew, attendees }) => {
    let baseSize = isSelected ? 40 : 32;
    let color = 'var(--color-primary)';
    let glow = '';
    let border = isSelected ? '3px solid white' : '2px solid rgba(255,255,255,0.9)';
    let className = 'custom-pin transition-transform duration-300'; // Added duration for smooth hover/select
    let zIndex = isSelected ? 100 : 10;
    let pulseClass = '';

    // Logic for Types
    if (type === 'massive') {
        baseSize = isSelected ? 55 : 45;
        color = '#FF0055'; // Pink
        pulseClass = 'pulse-ring';
    } else if (type === 'moop') {
        baseSize = isSelected ? 42 : 36;
        color = '#06b6d4'; // Cyan
        pulseClass = 'pulse-ring';
    } else if (type === 'promo') {
        baseSize = isSelected ? 44 : 36;
        color = '#F59E0B'; // Amber
        if (isFlash) {
            color = '#8B5CF6'; // Violet for Flash
            pulseClass = 'pulse-ring';
        }
    } else if (type === 'trending') {
        baseSize = isSelected ? 48 : 40;
        color = '#EF4444'; // Red
        pulseClass = 'pulse-ring';
    }

    // Selected State overrides
    if (isSelected) {
        className += ' marker-heartbeat'; // from Map.css
        glow = `0 0 20px ${color}, 0 0 0 4px rgba(255, 255, 255, 0.4)`;
        zIndex = 1000;
    } else {
        glow = `0 4px 6px rgba(0,0,0,0.3)`;
    }

    return (
        <div className="relative flex items-center justify-center">
            {/* Heatmap/Glow Effect for Trending/Massive */}
            {(type === 'trending' || type === 'massive') && (
                <div className="heatmap-glow" />
            )}

            <div
                className={`${className} ${!isSelected && pulseClass}`}
                onClick={onClick}
                style={{
                    background: color,
                    width: `${baseSize}px`,
                    height: `${baseSize}px`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: glow,
                    border: border,
                    fontSize: `${baseSize * 0.55}px`,
                    cursor: 'pointer',
                    zIndex: zIndex
                }}
            >
                {emoji}

                {/* Semantic Triangle for Selected */}
                {isSelected && (
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '6px solid transparent',
                            borderRight: '6px solid transparent',
                            borderTop: '8px solid white',
                        }}
                    />
                )}
            </div>

            {/* Badges - Absolute position relative to the wrapper */}
            {/* LIVE Badge (Moops) */}
            {type === 'moop' && (
                <div className="marker-badge -top-3 -right-3 bg-red-600 text-white">
                    LIVE
                </div>
            )}

            {/* FLASH Badge */}
            {isFlash && (
                <div className="marker-badge -top-3 -right-3 bg-yellow-400 text-gray-900 border border-yellow-200">
                    FLASH
                </div>
            )}

            {/* NEW Badge */}
            {isNew && !isFlash && type !== 'moop' && (
                <div className="marker-badge -top-3 -right-3 bg-blue-500 text-white">
                    NEW
                </div>
            )}
        </div>
    );
};

const EmotionalMap = ({ events, selectedId, onSelect }) => {
    // Sabadell Coords
    const initialViewState = {
        latitude: 41.543296,
        longitude: 2.109420,
        zoom: 14
    };

    const mapRef = useRef(null);

    useEffect(() => {
        if (selectedId && mapRef.current) {
            const evt = events.find(e => e.id === selectedId);
            if (evt) {
                mapRef.current.flyTo({
                    center: [evt.lng, evt.lat],
                    zoom: 16,
                    duration: 1200,
                    essential: true
                });
            }
        }
    }, [selectedId, events]);

    // Handle missing token gracefully
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
                            isFlash={evt.isFlash}
                            isNew={evt.tags?.includes('Nuevo')}
                            attendees={evt.attendees}
                            isSelected={selectedId === evt.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(evt);
                            }}
                        />
                    </Marker>
                ))}
            </Map>
        </div >
    );
};

export default EmotionalMap;
