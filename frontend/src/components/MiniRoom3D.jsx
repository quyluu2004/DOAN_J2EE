import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Float, 
  Environment, 
  BakeShadows,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// --- Procedural Luxury Furniture ---

const ModernSofa = () => {
  const fabricMaterial = new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.9, metalness: 0.05 });
  
  return (
    <group position={[-2.5, 0, -2.5]}>
      {/* Base */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.5, 0.7, 1.8]} />
        <primitive object={fabricMaterial} attach="material" />
      </mesh>
      {/* L-Extension */}
      <mesh position={[1.4, 0.35, 1.4]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.7, 1.8]} />
        <primitive object={fabricMaterial} attach="material" />
      </mesh>
      {/* Backrests */}
      <mesh position={[0, 1.0, -0.65]} castShadow>
        <boxGeometry args={[4.5, 0.9, 0.4]} />
        <primitive object={fabricMaterial} attach="material" />
      </mesh>
      <mesh position={[2.0, 1.0, 1.4]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.9, 0.4]} />
        <primitive object={fabricMaterial} attach="material" />
      </mesh>
      {/* Luxury Cushions */}
      {[[-1.2, 0.8, 0], [0.2, 0.8, 0], [1.4, 0.8, 1.2]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.9, 0.3, 0.9]} />
          <meshStandardMaterial color="#475569" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

const MarbleTable = () => (
  <group position={[2, 0, 1]}>
    {/* Marble Top */}
    <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
      <boxGeometry args={[2, 0.1, 1.5]} />
      <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.1} />
    </mesh>
    {/* Gold Base */}
    <mesh position={[0, 0.3, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.15, 0.6, 32]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
    <mesh position={[0, 0.05, 0]} receiveShadow>
      <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
  </group>
);

const ArtisticHand = () => {
  const handRef = useRef();
  const goldMaterial = new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 1, roughness: 0.15 });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (handRef.current) {
      handRef.current.position.y = 4.5 + Math.sin(t * 2.5) * 0.4;
      handRef.current.rotation.y = Math.PI / 4 + Math.sin(t * 0.8) * 0.15;
    }
  });

  return (
    <group ref={handRef} scale={0.9}>
      {/* Stylized Palm */}
      <mesh castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      {/* Pointing Finger */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <capsuleGeometry args={[0.08, 0.8, 8, 16]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      {/* Other Fingers (Stylized/Folded) */}
      {[[-0.2, -0.2], [-0.1, -0.25], [0.1, -0.25]].map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0.2]} castShadow>
          <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
          <primitive object={goldMaterial} attach="material" />
        </mesh>
      ))}
    </group>
  );
};

const LuxuryDiorama = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Walnut Wood Walls */}
      <group>
        <mesh position={[-8, 4, 0]} receiveShadow>
          <boxGeometry args={[0.3, 8, 16]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        <mesh position={[0, 4, -8]} receiveShadow>
          <boxGeometry args={[16, 8, 0.3]} />
          <meshStandardMaterial color="#451a03" roughness={0.5} />
        </mesh>
        
        {/* Decorative Gold Inlays */}
        {[[-4, -7.8], [0, -7.8], [4, -7.8]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 4, pos[1]]}>
            <boxGeometry args={[0.1, 8, 0.15]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Floating Art/Window effect */}
      <mesh position={[0, 4.5, -8.1]}>
        <boxGeometry args={[12, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} transparent opacity={0.2} />
      </mesh>

      <ModernSofa />
      <MarbleTable />
      <ArtisticHand />
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[750px] cursor-grab active:cursor-grabbing bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[18, 18, 18]} fov={28} />
        
        <LuxuryDiorama />
        
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[15, 25, 15]} 
          angle={0.25} 
          penumbra={1} 
          intensity={1500} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 5, 5]} intensity={100} color="#fcd34d" />
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.6} 
          scale={30} 
          blur={2.5} 
          far={15} 
        />
        
        <Environment preset="city" />
        <BakeShadows />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
