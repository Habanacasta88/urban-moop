import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Puppy = ({ color = '#eecbad' }) => {
    const tailRef = useRef();

    useFrame((state) => {
        if (tailRef.current) {
            tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.5;
        }
    });

    return (
        <group position={[0, -0.5, 0]}>
            {/* Body */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.8, 0.6, 1.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Head */}
            <group position={[0, 1, 0.5]}>
                <mesh castShadow>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                    <meshStandardMaterial color={color} />
                </mesh>

                {/* Ears */}
                <mesh position={[0.35, 0, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.4, 0.2]} />
                    <meshStandardMaterial color="#8b5a2b" />
                </mesh>
                <mesh position={[-0.35, 0, 0]} castShadow>
                    <boxGeometry args={[0.2, 0.4, 0.2]} />
                    <meshStandardMaterial color="#8b5a2b" />
                </mesh>

                {/* Nose */}
                <mesh position={[0, 0, 0.35]}>
                    <boxGeometry args={[0.2, 0.2, 0.1]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>

            {/* Legs */}
            <mesh position={[0.3, 0.1, 0.5]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.3, 0.1, 0.5]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[0.3, 0.1, -0.5]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <mesh position={[-0.3, 0.1, -0.5]} castShadow>
                <boxGeometry args={[0.2, 0.4, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Tail */}
            <group position={[0, 0.7, -0.6]} ref={tailRef}>
                <mesh rotation={[0.5, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.05, 0.05, 0.4]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            </group>
        </group>
    );
};
