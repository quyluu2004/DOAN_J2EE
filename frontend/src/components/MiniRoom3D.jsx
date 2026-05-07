import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  Environment, 
  ContactShadows,
  MeshDistortMaterial,
  MeshWobbleMaterial
} from '@react-three/drei';
import * as THREE from 'three';

// --- Procedural Materials ---
const useMaterials = () => {
  return useMemo(() => ({
    wood: new THREE.MeshStandardMaterial({ color: '#451a03', roughness: 0.6, metalness: 0.1 }),
    fabric: new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.9, metalness: 0.05 }),
    metal: new THREE.MeshStandardMaterial({ color: '#d4af37', metalness: 1, roughness: 0.1 }),
    marble: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.05, metalness: 0.1 }),
    lampShade: new THREE.MeshStandardMaterial({ color: '#fef3c7', emissive: '#fcd34d', emissiveIntensity: 1 }),
  }), []);
};

// --- Floating Furniture Components ---

const FloatingChair = ({ materials }) => (
  <group scale={1.2}>
    {/* Base/Seat */}
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.4, 1.4]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.6, -0.6]} castShadow>
      <boxGeometry args={[1.5, 1.2, 0.2]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    {/* Arms */}
    <mesh position={[-0.7, 0.3, 0]} castShadow>
      <boxGeometry args={[0.15, 0.6, 1.4]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    <mesh position={[0.7, 0.3, 0]} castShadow>
      <boxGeometry args={[0.15, 0.6, 1.4]} />
      <primitive object={materials.fabric} attach="material" />
    </mesh>
    {/* Legs (Floating) */}
    {[[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].map((pos, i) => (
      <mesh key={i} position={[pos[0], -0.4, pos[1]]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.4]} />
        <primitive object={materials.wood} attach="material" />
      </mesh>
    ))}
  </group>
);

const FloatingTable = ({ materials }) => (
  <group scale={0.8}>
    <mesh castShadow receiveShadow position={[0, 0.1, 0]}>
      <cylinderGeometry args={[1, 1, 0.1, 32]} />
      <primitive object={materials.marble} attach="material" />
    </mesh>
    <mesh position={[0, -0.5, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
      <primitive object={materials.metal} attach="material" />
    </mesh>
    <mesh position={[0, -1.1, 0]} castShadow>
      <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
      <primitive object={materials.metal} attach="material" />
    </mesh>
  </group>
);

const FloatingLamp = ({ materials }) => (
  <group scale={0.9}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.4, 0.6, 0.6, 32]} />
      <primitive object={materials.lampShade} attach="material" />
    </mesh>
    <mesh position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 3, 16]} />
      <primitive object={materials.metal} attach="material" />
    </mesh>
    <mesh position={[0, -1.5, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.6, 0.1, 32]} />
      <primitive object={materials.metal} attach="material" />
    </mesh>
    <pointLight position={[0, 1.5, 0]} intensity={10} color="#fcd34d" distance={5} />
  </group>
);

const Scene = () => {
  const materials = useMaterials();
  
  return (
    <group position={[3, 0, 0]}>
      {/* Dynamic Floating Elements */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <group position={[0, 0, 0]}>
          <FloatingChair materials={materials} />
        </group>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <group position={[-2.5, -2, 2]} rotation={[0, Math.PI / 4, 0]}>
          <FloatingTable materials={materials} />
        </group>
      </Float>

      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1.5}>
        <group position={[2.5, 2, -2]} rotation={[0, -Math.PI / 6, 0]}>
          <FloatingLamp materials={materials} />
        </group>
      </Float>

      {/* Abstract Background Shapes */}
      <Float speed={3} floatIntensity={1}>
        <mesh position={[-5, 4, -5]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </Float>
      
      <mesh position={[0, -5, -10]} scale={20}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial color="#1e293b" speed={2} distort={0.2} radius={1} />
      </mesh>
    </group>
  );
};

const MiniRoom3D = ({ onCtaClick }) => {
  return (
    <div className="relative w-full h-full min-h-[600px] md:min-h-[850px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 12]} 
          fov={35} 
        />
        
        <Scene />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2000} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={500} color="#3b82f6" />
        
        <Environment preset="city" />
        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={0.3} 
          scale={40} 
          blur={2} 
          far={10} 
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-start p-12 md:p-24 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent">
        <div className="max-w-xl pointer-events-auto">
          <span className="text-amber-400 text-sm font-bold tracking-[0.4em] uppercase mb-6 block">
            ÉLITAN 3D STUDIO
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            CRAFT YOUR <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white/30">
              DREAM SPACE
            </span>
          </h1>
          <p className="text-slate-400 text-xl mb-12 max-w-md leading-relaxed">
            Floating concepts, grounded in reality. Experience our curated 3D furniture collection in motion.
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onCtaClick}
              className="bg-white text-slate-950 px-10 py-5 rounded-full font-bold hover:bg-amber-400 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              START DESIGNING
            </button>
            <button className="border border-white/10 text-white px-10 py-5 rounded-full font-bold hover:bg-white/5 transition-all duration-300 backdrop-blur-xl active:scale-95">
              EXPLORE MODELS
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute bottom-12 right-12 flex flex-col items-end gap-2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="text-white/20 text-[10rem] font-bold leading-none select-none">3D</div>
      </div>
    </div>
  );
};

export default MiniRoom3D;

