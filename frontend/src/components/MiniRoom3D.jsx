import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  OrthographicCamera, 
  ContactShadows, 
  Environment, 
  BakeShadows,
  Float
} from '@react-three/drei';
import * as THREE from 'three';

// --- Procedural Materials ---
const useMaterials = () => {
  return useMemo(() => ({
    wood: new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.6, metalness: 0.1 }),
    fabric: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.9, metalness: 0.05 }),
    mattress: new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.8 }),
    metal: new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 1, roughness: 0.1 }),
    marble: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0.1 }),
    wall: new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 }),
    lampShade: new THREE.MeshStandardMaterial({ color: '#fef3c7', emissive: '#fcd34d', emissiveIntensity: 0.5 }),
  }), []);
};

// --- Components ---

const KingBed = ({ materials }) => (
  <group position={[1.5, 0, -2]}>
    {/* Base */}
    <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
      <boxGeometry args={[2.2, 0.4, 2.4]} />
      <primitive object={materials.wood} attach="material" />
    </mesh>
    {/* Headboard */}
    <mesh position={[0, 0.8, -1.1]} castShadow>
      <boxGeometry args={[2.2, 1.2, 0.2]} />
      <primitive object={materials.wood} attach="material" />
    </mesh>
    {/* Mattress */}
    <mesh position={[0, 0.5, 0.1]} castShadow receiveShadow>
      <boxGeometry args={[2, 0.3, 2.2]} />
      <primitive object={materials.mattress} attach="material" />
    </mesh>
    {/* Pillows */}
    <mesh position={[-0.5, 0.7, -0.8]} castShadow>
      <boxGeometry args={[0.7, 0.15, 0.4]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
    </mesh>
    <mesh position={[0.5, 0.7, -0.8]} castShadow>
      <boxGeometry args={[0.7, 0.15, 0.4]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
    </mesh>
  </group>
);

const BedsideTable = ({ position, materials }) => (
  <group position={position}>
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.5, 0.6]} />
      <primitive object={materials.wood} attach="material" />
    </mesh>
    {/* Lamp */}
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.04, 0.3]} />
        <primitive object={materials.metal} attach="material" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.2, 16]} />
        <primitive object={materials.lampShade} attach="material" />
      </mesh>
      <pointLight position={[0, 0.4, 0]} intensity={2} color="#fcd34d" distance={3} />
    </group>
  </group>
);

const Sofa = ({ materials }) => (
  <group position={[-2.5, 0, 1.5]} rotation={[0, Math.PI / 2, 0]}>
    {/* Base */}
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.5, 1]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.75, -0.4]} castShadow>
      <boxGeometry args={[3, 0.6, 0.2]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    {/* Arms */}
    <mesh position={[-1.4, 0.5, 0]} castShadow>
      <boxGeometry args={[0.2, 0.6, 1]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    <mesh position={[1.4, 0.5, 0]} castShadow>
      <boxGeometry args={[0.2, 0.6, 1]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
  </group>
);

const CoffeeTable = ({ materials }) => (
  <group position={[-0.5, 0, 1.5]}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.05, 0.8]} />
      <primitive object={materials.marble} attach="material" />
    </mesh>
    {[[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].map((pos, i) => (
      <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4]} />
        <primitive object={materials.metal} attach="material" />
      </mesh>
    ))}
  </group>
);

const Room = ({ materials }) => (
  <group>
    {/* Floor */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.8} />
    </mesh>

    {/* Walls */}
    <mesh position={[-4, 2, 0]} receiveShadow>
      <boxGeometry args={[0.1, 4, 8]} />
      <primitive object={materials.wall} attach="material" />
    </mesh>
    <mesh position={[0, 2, -4]} receiveShadow>
      <boxGeometry args={[8, 4, 0.1]} />
      <primitive object={materials.wall} attach="material" />
    </mesh>

    {/* Wood Panels */}
    <group position={[0, 2, -3.9]} scale={[1, 1, 1]}>
      {[[-2, 0, 0], [0, 0, 0], [2, 0, 0]].map((pos, i) => (
        <mesh key={i} position={pos} receiveShadow>
          <boxGeometry args={[1.5, 3.8, 0.05]} />
          <primitive object={materials.wood} attach="material" />
        </mesh>
      ))}
    </group>
  </group>
);

const Scene = () => {
  const materials = useMaterials();
  
  return (
    <>
      <Room materials={materials} />
      <KingBed materials={materials} />
      <BedsideTable position={[3.2, 0, -3.1]} materials={materials} />
      <BedsideTable position={[-0.2, 0, -3.1]} materials={materials} />
      <Sofa materials={materials} />
      <CoffeeTable materials={materials} />
      
      {/* Ceiling Light (Yellow Point Light) */}
      <mesh position={[0, 3.9, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial emissive="#fcd34d" emissiveIntensity={2} />
        <pointLight intensity={20} color="#fcd34d" castShadow shadow-mapSize={[1024, 1024]} />
      </mesh>
    </>
  );
};

const MiniRoom3D = ({ onCtaClick }) => {
  return (
    <div className="relative w-full h-full min-h-[600px] md:min-h-[800px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <OrthographicCamera 
          makeDefault 
          position={[15, 15, 15]} 
          zoom={55} 
          near={0.1} 
          far={1000} 
        />
        
        <group position={[2, -4, 0]}>
          <Scene />
        </group>
        
        <OrbitControls 
          enableZoom={true} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2.1}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          target={[2, -2, 0]}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        <Environment preset="city" />
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={4.5} 
        />
        <BakeShadows />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-start p-12 md:p-20 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent">
        <div className="max-w-xl pointer-events-auto">
          <span className="text-amber-400 text-sm font-bold tracking-[0.3em] uppercase mb-4 block">
            Premium Interior Design
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            TRANSFORM YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">
              LIVING SPACE
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
            Experience luxury interiors with our real-time 3D studio. 
            Visualize every detail before it becomes reality.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onCtaClick}
              className="bg-white text-slate-950 px-8 py-4 rounded-full font-bold hover:bg-amber-400 hover:scale-105 transition-all duration-300 shadow-xl active:scale-95"
            >
              TRY 3D STUDIO NOW
            </button>
            <button className="border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-md active:scale-95">
              VIEW COLLECTIONS
            </button>
          </div>
        </div>
      </div>

      {/* Aesthetic corner accents */}
      <div className="absolute top-8 right-8 flex gap-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="w-2 h-2 rounded-full bg-white/40" />
        <div className="w-2 h-2 rounded-full bg-white/60" />
      </div>
    </div>
  );
};

export default MiniRoom3D;

