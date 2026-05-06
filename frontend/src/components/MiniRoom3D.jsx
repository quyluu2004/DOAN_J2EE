import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Sofa = () => {
  return (
    <group position={[0, 0.25, 0]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.5, 1]} />
        <meshStandardMaterial color="#703225" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.5, -0.35]} castShadow>
        <boxGeometry args={[2, 0.6, 0.3]} />
        <meshStandardMaterial color="#703225" />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.85, 0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 1]} />
        <meshStandardMaterial color="#703225" />
      </mesh>
      {/* Right Arm */}
      <mesh position={[0.85, 0.4, 0]} castShadow>
        <boxGeometry args={[0.3, 0.4, 1]} />
        <meshStandardMaterial color="#703225" />
      </mesh>
    </group>
  );
};

const PointingHand = () => {
  const handRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    handRef.current.position.y = 2.5 + Math.sin(t * 4) * 0.2;
  });

  return (
    <group ref={handRef} rotation={[0, -Math.PI / 4, 0]}>
      {/* Wrist */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.3]} />
        <meshStandardMaterial color="#fcecd5" />
      </mesh>
      {/* Palm */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.45, 0.4, 0.3]} />
        <meshStandardMaterial color="#fcecd5" />
      </mesh>
      {/* Index Finger (Pointing Down) */}
      <mesh position={[0.05, -0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.6, 0.12]} />
        <meshStandardMaterial color="#fcecd5" />
      </mesh>
      {/* Folded fingers */}
      <mesh position={[-0.1, -0.4, 0]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="#fcecd5" />
      </mesh>
    </group>
  );
};

const Room = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Wall Left */}
      <mesh position={[-5, 2.5, 0]} receiveShadow>
        <boxGeometry args={[0.1, 5, 10]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {/* Wall Back */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[10, 5, 0.1]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      
      <Sofa />
      <PointingHand />
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={35} />
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.5}
          enablePan={false}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={200} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -10]} intensity={10} color="#703225" />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <Room />
        </Float>
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2.4} 
          far={4.5} 
        />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
