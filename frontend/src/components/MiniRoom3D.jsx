import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const DetailedSofa = () => {
  return (
    <group position={[-1.5, 0.25, -1.5]}>
      {/* Long part */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[3, 0.6, 1.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Short part (L-shape) */}
      <mesh position={[1, 0, 1]} castShadow>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.45]} castShadow>
        <boxGeometry args={[3, 0.8, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[1.35, 0.6, 0.5]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1, 0.8, 0.3]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
};

const DiningSet = () => {
  return (
    <group position={[1.5, 0, 1]}>
      {/* Table */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6, 0.25, 0.4]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-0.6, 0.25, 0.4]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.6, 0.25, -0.4]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[-0.6, 0.25, -0.4]} castShadow>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      
      {/* Chairs */}
      {[[-0.8, 0, 0], [0.8, 0, 0], [0, 0, 0.6], [0, 0, -0.6]].map((pos, i) => (
        <group key={i} position={pos} rotation={[0, i < 2 ? (i === 0 ? Math.PI/2 : -Math.PI/2) : (i === 2 ? 0 : Math.PI), 0]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.4, 0.05, 0.4]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <mesh position={[0, 0.5, -0.18]} castShadow>
            <boxGeometry args={[0.4, 0.4, 0.05]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const RealisticHand = () => {
  const handRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    handRef.current.position.y = 3.5 + Math.sin(t * 3) * 0.3;
    handRef.current.rotation.z = Math.sin(t * 2) * 0.05;
  });

  return (
    <group ref={handRef} rotation={[0, -Math.PI / 4, 0]} scale={0.8}>
      {/* Wrist & Palm */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.2]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Thumb (Folded) */}
      <mesh position={[-0.35, 0.3, 0.05]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.15]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>

      {/* Index Finger (The Pointer) */}
      <group position={[0.2, 0.1, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.08, 0.6, 4, 8]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      </group>

      {/* Other Fingers (Folded) */}
      {[0, -0.15, -0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.25, 0.15]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
      ))}
    </group>
  );
};

const DetailedRoom = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor with tiles pattern feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </mesh>
      
      {/* Wall Left */}
      <mesh position={[-6, 3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 6, 12]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      
      {/* Wall Right */}
      <mesh position={[0, 3, -6]} receiveShadow>
        <boxGeometry args={[12, 6, 0.2]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Windows */}
      <mesh position={[-5.85, 3.5, -2]}>
        <boxGeometry args={[0.1, 2, 4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      <mesh position={[2, 3.5, -5.85]}>
        <boxGeometry args={[5, 2, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      <DetailedSofa />
      <DiningSet />
      
      {/* Small side table */}
      <mesh position={[-4, 0.2, 4]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#703225" />
      </mesh>

      <RealisticHand />
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[400px] md:min-h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[12, 12, 12]} fov={35} />
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.7} />
        <spotLight 
          position={[15, 20, 15]} 
          angle={0.4} 
          penumbra={1} 
          intensity={500} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, 5, -10]} intensity={50} color="#fcd34d" />
        
        <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
          <DetailedRoom />
        </Float>
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.3} 
          scale={25} 
          blur={2} 
          far={10} 
        />
        
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
