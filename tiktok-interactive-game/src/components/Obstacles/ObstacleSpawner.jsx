import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { v4 as uuidv4 } from 'uuid';

export const OBSTACLE_TYPES = {
    ROSE: 'ROSE',       // Small, fast
    DOUGHNUT: 'DOUGHNUT', // Middle sized
    DRAGON: 'DRAGON',     // Huge, heavy
};

const OBSTACLE_CONFIG = {
    [OBSTACLE_TYPES.ROSE]: { type: 'donut', args: [0.4, 0.2, 16, 32], mass: 1, color: '#ff69b4', limit: 30 }, // Small Donut
    [OBSTACLE_TYPES.DOUGHNUT]: { type: 'donut', args: [0.7, 0.3, 16, 32], mass: 5, color: '#8b4513', limit: 10 }, // Chocolate Donut
    [OBSTACLE_TYPES.DRAGON]: { type: 'donut', args: [2, 0.8, 16, 32], mass: 50, color: '#ff0000', limit: 2 }, // Giant Red Donut
};

const ObstacleSpawner = forwardRef((props, ref) => {
    const [obstacles, setObstacles] = useState([]);

    useImperativeHandle(ref, () => ({
        spawn: (type, burstCount = 1) => {
            const config = OBSTACLE_CONFIG[type] || OBSTACLE_CONFIG[OBSTACLE_TYPES.ROSE];

            const newObstacles = Array.from({ length: burstCount }).map(() => ({
                id: uuidv4(),
                type,
                config,
                position: [(Math.random() - 0.5) * 10, 20 + Math.random() * 5, (Math.random() - 0.5) * 5],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
            }));

            setObstacles(prev => [...prev, ...newObstacles].slice(-50)); // Keep max 50 objects for performance
        },
        clear: () => setObstacles([]),
    }));

    // Auto clean falling objects (simple check)
    useFrame(() => {
        // In a real scenario, we might remove objects that fall too far below
    });

    return (
        <>
            {obstacles.map(obs => (
                <RigidBody
                    key={obs.id}
                    position={obs.position}
                    rotation={obs.rotation}
                    colliders="hull"
                    mass={obs.config.mass}
                    restitution={0.6}
                >
                    <mesh castShadow receiveShadow>
                        <torusGeometry args={obs.config.args} />
                        <meshStandardMaterial color={obs.config.color} roughness={0.2} metalness={0.1} />
                    </mesh>
                </RigidBody>
            ))}
        </>
    );
});

export default ObstacleSpawner;
