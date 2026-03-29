import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   3D Italian Side Table with Decorative Vase
   Built entirely from Three.js geometry
   ═══════════════════════════════════════════ */

function RoundedLeg({ position, height = 1.6, radius = 0.04 }) {
  return (
    <mesh position={position} castShadow>
      <cylinderGeometry args={[radius, radius * 1.3, height, 12]} />
      <meshStandardMaterial color="#3d2b1f" roughness={0.25} metalness={0.3} />
    </mesh>
  );
}

function TableTop({ y = 0.8 }) {
  return (
    <group position={[0, y, 0]}>
      {/* Main tabletop */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.05, 32]} />
        <meshStandardMaterial color="#5a3825" roughness={0.35} metalness={0.1} />
      </mesh>
      {/* Gold rim */}
      <mesh position={[0, 0.025, 0]}>
        <torusGeometry args={[0.7, 0.012, 8, 48]} />
        <meshStandardMaterial color="#c8a35a" roughness={0.2} metalness={0.7} />
      </mesh>
    </group>
  );
}

function Vase({ position = [0, 1.05, 0] }) {
  const points = useMemo(() => {
    const pts = [];
    // Vase profile curve
    pts.push(new THREE.Vector2(0.001, 0));
    pts.push(new THREE.Vector2(0.15, 0.02));
    pts.push(new THREE.Vector2(0.18, 0.1));
    pts.push(new THREE.Vector2(0.16, 0.25));
    pts.push(new THREE.Vector2(0.08, 0.35));
    pts.push(new THREE.Vector2(0.06, 0.45));
    pts.push(new THREE.Vector2(0.09, 0.55));
    pts.push(new THREE.Vector2(0.12, 0.6));
    pts.push(new THREE.Vector2(0.11, 0.62));
    pts.push(new THREE.Vector2(0.10, 0.62));
    return pts;
  }, []);

  return (
    <group position={position}>
      <mesh castShadow>
        <latheGeometry args={[points, 24]} />
        <meshStandardMaterial 
          color="#703225" 
          roughness={0.3} 
          metalness={0.15}
        />
      </mesh>
      {/* Gold band on vase */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.07, 0.008, 8, 24]} />
        <meshStandardMaterial color="#c8a35a" roughness={0.2} metalness={0.7} />
      </mesh>
    </group>
  );
}

function Book({ position, rotation, color = '#37455e' }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.035, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Pages */}
      <mesh position={[0.005, 0, 0]}>
        <boxGeometry args={[0.2, 0.028, 0.15]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Candle({ position = [0.25, 0.85, 0.2] }) {
  const flameRef = useRef();

  useFrame((state) => {
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.15;
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 6 + 1) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Holder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 12]} />
        <meshStandardMaterial color="#c8a35a" roughness={0.2} metalness={0.7} />
      </mesh>
      {/* Candle body */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.8} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial color="#ff9d3a" />
      </mesh>
      {/* Flame glow light */}
      <pointLight 
        position={[0, 0.16, 0]} 
        color="#ff9d3a" 
        intensity={0.3} 
        distance={1} 
      />
    </group>
  );
}

function SideTable() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Table top */}
      <TableTop />

      {/* Legs — 3 elegant legs */}
      {[0, 1, 2].map((i) => {
        const angle = (i * Math.PI * 2) / 3;
        const r = 0.45;
        return (
          <RoundedLeg 
            key={i}
            position={[
              Math.cos(angle) * r,
              0.0,
              Math.sin(angle) * r,
            ]}
          />
        );
      })}

      {/* Lower shelf ring */}
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[0.42, 0.015, 8, 32]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Items on table */}
      <Vase position={[-0.15, 1.03, 0.05]} />
      <Candle position={[0.3, 0.83, 0.15]} />
      
      {/* Stacked books */}
      <Book position={[0.15, 0.845, -0.15]} rotation={[0, 0.3, 0]} color="#703225" />
      <Book position={[0.15, 0.88, -0.15]} rotation={[0, -0.2, 0]} color="#37455e" />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.82, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#f5eede" roughness={0.9} />
    </mesh>
  );
}

export default function ThreeJSFurniture({ className = "" }) {
  return (
    <div className={`w-full h-[500px] md:h-[600px] rounded-sm overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [2, 1.8, 2.5], fov: 35 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Warm ambient fill */}
        <ambientLight intensity={0.4} color="#fcecd5" />
        
        {/* Key light */}
        <directionalLight
          position={[4, 6, 3]}
          intensity={1.2}
          color="#fff8f3"
          castShadow
          shadow-mapSize={[512, 512]}
          shadow-camera-near={0.1}
          shadow-camera-far={20}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
        />
        
        {/* Fill light */}
        <directionalLight position={[-2, 3, -1]} intensity={0.3} color="#fcecd5" />
        
        {/* Rim light for depth */}
        <pointLight position={[-1.5, 2, -2]} intensity={0.4} color="#703225" />

        {/* Scene */}
        <SideTable />
        <Ground />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.3}
          autoRotate
          autoRotateSpeed={0.6}
          dampingFactor={0.06}
          enableDamping
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
