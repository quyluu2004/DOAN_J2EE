import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float, Environment, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';

// Realistic Hand using a standard GLB model (pointing gesture)
const HandModel = () => {
  // Using a stable CDN model for a hand (procedural fallback if loading fails)
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/hand-right/model.gltf');
  const handRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    handRef.current.position.y = 4 + Math.sin(t * 3) * 0.4;
    handRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 1.5) * 0.2;
  });

  return (
    <group ref={handRef} scale={1.5} rotation={[Math.PI / 2, 0, 0]}>
      <primitive object={scene} />
      {/* Apply a golden material to match the luxury brand */}
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </group>
  );
};

const LuxurySofa = () => {
  return (
    <group position={[-2, 0.25, -2]}>
      {/* L-Shape Main */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[4, 0.7, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[1.2, 0.1, 1.5]} castShadow>
        <boxGeometry args={[1.6, 0.7, 1.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Backrests */}
      <mesh position={[0, 0.7, -0.6]} castShadow>
        <boxGeometry args={[4, 0.8, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[1.85, 0.7, 1.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Cushions */}
      {[[-1.2, 0.5, 0.1], [0.2, 0.5, 0.1], [1.2, 0.5, 1.2]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.8, 0.2, 0.8]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}
    </group>
  );
};

const Rug = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.01, -0.5]} receiveShadow>
    <planeGeometry args={[6, 6]} />
    <meshStandardMaterial color="#e2e8f0" roughness={1} opacity={0.8} transparent />
  </mesh>
);

const DiningSet = () => (
  <group position={[2.5, 0, 1.5]}>
    {/* Marble Table */}
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[2, 0.1, 1.2]} />
      <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.1} />
    </mesh>
    {[[-0.8, 0.3, 0.4], [0.8, 0.3, 0.4], [-0.8, 0.3, -0.4], [0.8, 0.3, -0.4]].map((pos, i) => (
      <mesh key={i} position={pos} castShadow>
        <boxGeometry args={[0.06, 0.6, 0.06]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    ))}
    {/* Chairs */}
    {[[-1.2, 0, 0], [1.2, 0, 0]].map((pos, i) => (
      <group key={i} position={pos} rotation={[0, i === 0 ? Math.PI/2 : -Math.PI/2, 0]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[0, 0.6, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    ))}
  </group>
);

const LuxuryRoom = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor - Marble feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.2} roughness={0.1} />
      </mesh>
      
      {/* Walls - Wooden Texture Feel */}
      <mesh position={[-7, 3.5, 0]} receiveShadow>
        <boxGeometry args={[0.2, 7, 14]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} /> {/* Walnut color */}
      </mesh>
      <mesh position={[0, 3.5, -7]} receiveShadow>
        <boxGeometry args={[14, 7, 0.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.4} />
      </mesh>

      {/* Skirting board */}
      <mesh position={[-6.85, 0.2, 0]} receiveShadow>
        <boxGeometry args={[0.1, 0.4, 14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0, 0.2, -6.85]} receiveShadow>
        <boxGeometry args={[14, 0.4, 0.1]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Modern Windows with Glowing light */}
      <group position={[0, 4, -6.95]}>
        <mesh position={[-3, 0, 0]}>
          <boxGeometry args={[5, 3, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.4} />
        </mesh>
        <mesh position={[3, 0, 0]}>
          <boxGeometry args={[5, 3, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.4} />
        </mesh>
      </group>

      <Rug />
      <LuxurySofa />
      <DiningSet />
      
      <Suspense fallback={null}>
        <HandModel />
      </Suspense>
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[650px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[14, 14, 14]} fov={35} />
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.1}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
        
        <ambientLight intensity={0.6} />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.5} 
          penumbra={1} 
          intensity={800} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[5, 5, 5]} intensity={100} color="#fcd34d" />
        <pointLight position={[-5, 8, -5]} intensity={50} color="#ffffff" />
        
        <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.1}>
          <LuxuryRoom />
        </Float>
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.4} 
          scale={25} 
          blur={2.5} 
          far={12} 
        />
        
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
