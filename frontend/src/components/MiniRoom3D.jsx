import React, { useRef, useMemo } from 'react';
import { useLocalization } from '../context/LocalizationContext';
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
      {/* ---- CHAIR: center-right, hero piece ---- */}
      {/* World coords: x=3, y=-0.5 → right-center of viewport */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={1}>
        <SelfRotate speed={0.1}>
          <group position={[3, -0.5, 0]} rotation={[0.08, -0.5, 0.03]} scale={1.8}>
            <FloatingChair />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- TABLE: lower-right area ---- */}
      {/* World coords: x=5.5, y=-3 → bottom-right */}
      <Float speed={1.6} rotationIntensity={0.06} floatIntensity={1.5}>
        <SelfRotate speed={-0.07}>
          <group position={[5.5, -3, -1]} rotation={[0, 0.5, 0]} scale={1.5}>
            <FloatingTable />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- LAMP: upper-right area ---- */}
      {/* World coords: x=5, y=3 → top-right */}
      <Float speed={1.4} rotationIntensity={0.06} floatIntensity={1.2}>
        <SelfRotate speed={0.08}>
          <group position={[5, 3, -1.5]} rotation={[0, -0.2, 0.03]} scale={1.3}>
            <FloatingLamp />
          </group>
        </SelfRotate>
      </Float>

      {/* ---- Decorative gold sphere ---- */}
      <Float speed={2.5} floatIntensity={2}>
        <mesh position={[1.5, 3.5, -3]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      {/* ---- Small silver accent ---- */}
      <Float speed={3} floatIntensity={1.2}>
        <mesh position={[7, -1, -2]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.15} />
        </mesh>
      </Float>

      {/* ---- Wireframe accent ---- */}
      <Float speed={2} floatIntensity={1}>
        <mesh position={[1, -3, -4]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} wireframe />
        </mesh>
      </Float>
    </>
  );
};

const MiniRoom3D = ({ onCtaClick }) => {
  const { t } = useLocalization();

  return (
    <div className="relative w-full h-[600px] md:h-[850px] bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 group">
      {/* 3D Canvas - absolute fill, NO user interaction */}
      <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
        <Canvas shadows dpr={[1, 2]} style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera 
          makeDefault 
          position={[0, 0, 10]} 
          fov={50} 
        />
        
        {/* NO group wrapper - items placed at exact world coords */}
        <Scene />
        
        {/* === SUNRISE LIGHTING === */}
        <ambientLight intensity={0.5} color="#fef3c7" />
        <directionalLight position={[15, 12, 8]} intensity={5} color="#fb923c" castShadow />
        <pointLight position={[20, 0, 5]} intensity={2500} color="#f59e0b" distance={50} />
        <pointLight position={[-15, 5, 10]} intensity={600} color="#7dd3fc" />
        <pointLight position={[5, -10, 3]} intensity={500} color="#fbbf24" />
        
        <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* UI Overlay - text on LEFT */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-start p-12 md:p-24 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent">
        <div className="max-w-xl pointer-events-auto">
          <span className="text-amber-400 text-sm font-bold tracking-[0.4em] uppercase mb-6 block">
            {t('home.mini_studio.sub')}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            {t('home.mini_studio.title_part1')} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white/30">
              {t('home.mini_studio.title_part2')}
            </span>
          </h1>
          <p className="text-slate-400 text-xl mb-12 max-w-md leading-relaxed">
            {t('home.mini_studio.desc')}
          </p>
          <div className="flex flex-wrap gap-6">
            <button 
              onClick={onCtaClick}
              className="bg-white text-slate-950 px-10 py-5 rounded-full font-bold hover:bg-amber-400 hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95"
            >
              {t('home.mini_studio.cta_start')}
            </button>
            <button className="border border-white/10 text-white px-10 py-5 rounded-full font-bold hover:bg-white/5 transition-all duration-300 backdrop-blur-xl active:scale-95">
              {t('home.mini_studio.cta_explore')}
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
