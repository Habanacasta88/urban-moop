import React, { useRef, useEffect } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { useControls, button } from 'leva';
import ObstacleSpawner, { OBSTACLE_TYPES } from '../Obstacles/ObstacleSpawner';
import { useGameStore } from '../../store/gameStore';
import { useTikfinity } from '../../hooks/useTikfinity';
import { Puppy } from '../Characters/Puppy';

const PropsAvalanche = () => {
    const spawnerRef = useRef();
    const playerRef = useRef();
    const { status, endGame, addScore } = useGameStore();

    // Event Handler for Tikfinity/Webhooks
    const handleGameEvent = (type, count) => {
        // Map generic types (ROSE, DRAGON) to Spawner types
        // or triggers special physics events
        if (OBSTACLE_TYPES[type]) {
            spawnerRef.current?.spawn(type, count);
        }
    };

    // Connect the hook
    useTikfinity(handleGameEvent);

    // Debug controls to simulate gifts
    useControls('TikTok Gifts (Debug)', {
        'Send Rose (Small)': button(() => handleGameEvent(OBSTACLE_TYPES.ROSE, 1)),
        'Send Doughnut (Med)': button(() => handleGameEvent(OBSTACLE_TYPES.DOUGHNUT, 3)),
        'Send Dragon (Huge)': button(() => handleGameEvent(OBSTACLE_TYPES.DRAGON, 1)),
    });

    useFrame((state, delta) => {
        if (status !== 'PLAYING') return;

        // Player LOGIC: Move Upwards slowly
        if (playerRef.current) {
            const curPos = playerRef.current.translation();

            // Auto-move up if stable
            playerRef.current.applyImpulse({ x: 0, y: 0.1, z: 0 }, true);

            // Check for Game Over (if knocked off platform)
            if (curPos.y < -5) {
                endGame();
            }

            // Score based on height
            if (curPos.y > 0) {
                addScore(0.01);
            }
        }
    });

    // Reset logic
    useEffect(() => {
        if (status === 'READY') {
            spawnerRef.current?.clear();
            if (playerRef.current) {
                playerRef.current.setTranslation({ x: 0, y: 2, z: 0 }, true);
                playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
                playerRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
            }
        }
    }, [status]);

    return (
        <group>
            {/* The Spawner */}
            <ObstacleSpawner ref={spawnerRef} />

            {/* The Player - Puppy */}
            <RigidBody
                ref={playerRef}
                position={[0, 2, 0]}
                colliders="cuboid"
                enabledRotations={[true, true, true]}
                damping={1}
            >
                <Puppy />
            </RigidBody>

            {/* The Level: A Grassy Ramp */}
            <RigidBody type="fixed" rotation={[-0.3, 0, 0]} position={[0, -2, -10]} friction={1}>
                <mesh receiveShadow>
                    <boxGeometry args={[10, 1, 40]} />
                    <meshStandardMaterial color="#90EE90" /> {/* Light Green Grass */}
                </mesh>
            </RigidBody>

            {/* Goal: Food Bowl */}
            <group position={[0, 5, -28]} rotation={[-0.3, 0, 0]}>
                {/* Bowl */}
                <mesh castShadow receiveShadow>
                    <cylinderGeometry args={[1.5, 1, 1, 32]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                {/* Food */}
                <mesh position={[0, 0.3, 0]}>
                    <cylinderGeometry args={[1.2, 1, 0.8, 32]} />
                    <meshStandardMaterial color="#5C4033" /> {/* Dark Brown Food */}
                </mesh>
                {/* Floating Text or Particles could go here */}
            </group>

            {/* Side walls to keep it fair */}
            <RigidBody type="fixed" position={[5.5, 0, -10]} rotation={[0, 0, 0]}>
                <mesh>
                    <boxGeometry args={[1, 5, 40]} />
                    <meshStandardMaterial color="#444" transparent opacity={0.3} />
                </mesh>
            </RigidBody>
            <RigidBody type="fixed" position={[-5.5, 0, -10]} rotation={[0, 0, 0]}>
                <mesh>
                    <boxGeometry args={[1, 5, 40]} />
                    <meshStandardMaterial color="#444" transparent opacity={0.3} />
                </mesh>
            </RigidBody>
        </group>
    );
};

export default PropsAvalanche;
