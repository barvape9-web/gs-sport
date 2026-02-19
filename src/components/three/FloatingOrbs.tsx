'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function Orb({
  position,
  scale,
  color,
  speed,
  distort,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0}
          metalness={0.8}
          opacity={0.4}
          transparent
        />
      </Sphere>
    </Float>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 500;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#f97316" transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

export default function FloatingOrbs() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f97316" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />

        <ParticleField />

        <Orb position={[-4, 2, -3]} scale={1.5} color="#f97316" speed={0.5} distort={0.4} />
        <Orb position={[4, -2, -4]} scale={2} color="#7c3aed" speed={0.3} distort={0.3} />
        <Orb position={[0, 3, -5]} scale={1.2} color="#f97316" speed={0.7} distort={0.5} />
        <Orb position={[-3, -3, -2]} scale={0.8} color="#fb923c" speed={0.9} distort={0.6} />
        <Orb position={[3, 2, -2]} scale={1.0} color="#f97316" speed={0.4} distort={0.35} />
      </Suspense>
    </Canvas>
  );
}
