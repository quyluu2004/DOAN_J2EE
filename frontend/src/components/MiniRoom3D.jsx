import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

// --- Slow self-rotation wrapper ---
const SelfRotate = ({ children, speed = 0.15 }) => {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });
  return <group ref={ref}>{children}</group>;
};

// --- Floating Furniture Components (large scale built-in) ---

const FloatingChair = () => (
  <group>
    {/* Seat */}
    <mesh castShadow>
      <boxGeometry args={[3.5, 0.6, 3]} />
      <meshStandardMaterial color="#334155" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 1.2, -1.3]} castShadow>
      <boxGeometry args={[3.5, 2, 0.35]} />
      <meshStandardMaterial color="#2d3a4a" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Left arm */}
    <mesh position={[-1.6, 0.5, 0]} castShadow>
      <boxGeometry args={[0.3, 1, 3]} />
      <meshStandardMaterial color="#334155" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Right arm */}
    <mesh position={[1.6, 0.5, 0]} castShadow>
      <boxGeometry args={[0.3, 1, 3]} />
      <meshStandardMaterial color="#334155" roughness={0.85} metalness={0.05} />
    </mesh>
    {/* Legs */}
    {[[-1.3, -1.2], [1.3, -1.2], [-1.3, 1.2], [1.3, 1.2]].map((pos, i) => (
      <mesh key={i} position={[pos[0], -0.7, pos[1]]} castShadow>
        <cylinderGeometry args={[0.08, 0.05, 0.8]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} />
      </mesh>
    ))}
    {/* Cushion */}
    <mesh position={[0, 0.45, 0.1]} castShadow>
      <boxGeometry args={[2.8, 0.25, 2.4]} />
      <meshStandardMaterial color="#475569" roughness={0.9} />
    </mesh>
  </group>
);

const FloatingTable = () => (
  <group>
    {/* Table top - marble */}
    <mesh castShadow>
      <cylinderGeometry args={[2.2, 2.2, 0.15, 48]} />
      <meshStandardMaterial color="#f1f5f9" roughness={0.05} metalness={0.15} />
    </mesh>
    {/* Stem */}
    <mesh position={[0, -1.2, 0]} castShadow>
      <cylinderGeometry args={[0.15, 0.15, 2.2, 16]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
    {/* Base */}
    <mesh position={[0, -2.3, 0]} castShadow>
      <cylinderGeometry args={[1.2, 1.4, 0.15, 48]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
    {/* Decorative item on table */}
    <mesh position={[0.6, 0.4, 0]} castShadow>
      <sphereGeometry args={[0.35, 32, 32]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
  </group>
);

const FloatingLamp = () => (
  <group>
    {/* Shade */}
    <mesh position={[0, 2.8, 0]} castShadow>
      <cylinderGeometry args={[0.8, 1.3, 1.2, 32]} />
      <meshStandardMaterial color="#fef3c7" emissive="#fcd34d" emissiveIntensity={0.8} />
    </mesh>
    {/* Pole */}
    <mesh position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.08, 5.5, 16]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
    {/* Base */}
    <mesh position={[0, -2.8, 0]} castShadow>
      <cylinderGeometry args={[1, 1.2, 0.2, 48]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
    </mesh>
    {/* Light glow */}
    <pointLight position={[0, 2.8, 0]} intensity={30} color="#fcd34d" distance={12} />
  </group>
);

const Scene = () => {
  return (
    <>
      {/* ---- CHAIR: center-right, biggest item ---- */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={1.5}>
        <SelfRotate speed={0.12}>
          <group position={[3.5, -1, 0]} rotation={[0.1, -0.4, 0.05]}>
            <FloatingChair />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- TABLE: lower-left of cluster ---- */}
      <Float speed={1.6} rotationIntensity={0.1} floatIntensity={2}>
        <SelfRotate speed={-0.08}>
          <group position={[-1, -3.5, -2]} rotation={[0, 0.6, 0]}>
            <FloatingTable />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- LAMP: upper-right of cluster ---- */}
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={1.8}>
        <SelfRotate speed={0.1}>
          <group position={[7, 3, -3]} rotation={[0, -0.3, 0.05]}>
            <FloatingLamp />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- Decorative accents ---- */}
      <Float speed={2.5} floatIntensity={2.5}>
        <mesh position={[0, 4, -5]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={3} floatIntensity={1.5}>
        <mesh position={[8, -5, -4]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={2} floatIntensity={1}>
        <mesh position={[-3, 1, -6]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.15} wireframe />
        </mesh>
      </Float>
    </>
  );
};

const MiniRoom3D = ({ onCtaClick }) => {
  return (
    <div className="relative w-full h-full min-h-[600px] md:min-h-[850px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
      {/* 3D Canvas - NO user interaction */}
      <Canvas shadows dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 18]} 
          fov={40} 
        />
        
        {/* Shift entire scene to the RIGHT side of the viewport */}
        <group position={[4, -1, 0]}>
          <Scene />
        </group>
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <spotLight position={[15, 15, 15]} angle={0.2} penumbra={1} intensity={3000} castShadow />
        <pointLight position={[-10, 5, 10]} intensity={800} color="#3b82f6" />
        <pointLight position={[10, -5, 5]} intensity={400} color="#d4af37" />
        
        <Environment preset="city" />
      </Canvas>

      {/* UI Overlay - text on LEFT */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-start p-12 md:p-24 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent">
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

      {/* Decorative "3D" watermark */}
      <div className="absolute bottom-12 right-12 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity duration-1000">
        <div className="text-white/20 text-[10rem] font-bold leading-none select-none">3D</div>
      </div>
    </div>
  );
};

export default MiniRoom3D;
