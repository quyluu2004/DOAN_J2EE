import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Float, 
  Environment, 
  useGLTF, 
  BakeShadows,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Fallback Loader
const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center text-white bg-black/50 p-4 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
      <p className="text-sm font-medium">Loading 3D Studio...</p>
    </div>
  </Html>
);

const HighQualityChair = () => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/SheenChair.glb');
  
  // Apply luxury materials to the model
  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={3.5} position={[0, -0.5, 0]} />;
};

const RealisticHand = () => {
  const handRef = useRef();
  const { scene } = useGLTF('https://models.readyplayer.me/6385d38104a896d8e2392723.glb?pose=A');
  
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    metalness: 1,
    roughness: 0.15
  }), []);

  useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = goldMaterial;
        child.castShadow = true;
      }
    });
  }, [scene, goldMaterial]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (handRef.current) {
      handRef.current.position.y = 4.5 + Math.sin(t * 2) * 0.3;
      handRef.current.rotation.y = Math.PI / 2 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <group ref={handRef} scale={12} rotation={[Math.PI / 2.2, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
};

const CinematicRoom = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor - Simple but elegant (replacing unstable Reflector) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.1} />
      </mesh>

      {/* Luxury Wood Walls */}
      <group>
        <mesh position={[-8, 4, 0]} receiveShadow>
          <boxGeometry args={[0.3, 8, 16]} />
          <meshStandardMaterial color="#2d1b0d" roughness={0.6} />
        </mesh>
        <mesh position={[0, 4, -8]} receiveShadow>
          <boxGeometry args={[16, 8, 0.3]} />
          <meshStandardMaterial color="#2d1b0d" roughness={0.6} />
        </mesh>
        
        {/* Wall Accents (Gold strips) */}
        <mesh position={[-7.8, 4, -4]} castShadow>
          <boxGeometry args={[0.1, 8, 0.15]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[4, 4, -7.8]} castShadow>
          <boxGeometry args={[0.15, 8, 0.1]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* Panoramic Window with Glow */}
      <mesh position={[0, 4.5, -8.1]}>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent opacity={0.3} />
      </mesh>

      {/* Furniture */}
      <group position={[-2, 0.5, -2]}>
        <Suspense fallback={null}>
          <HighQualityChair />
        </Suspense>
      </group>

      {/* Coffee Table */}
      <group position={[1.5, 0, -1]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1.5, 0.1, 1.5]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#d4af37" metalness={1} />
        </mesh>
      </group>

      <Suspense fallback={null}>
        <RealisticHand />
      </Suspense>
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[700px] cursor-grab active:cursor-grabbing bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      <Canvas shadows dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[18, 18, 18]} fov={30} />
        
        <Suspense fallback={<Loader />}>
          <CinematicRoom />
          <Environment preset="city" />
          <BakeShadows />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[15, 25, 15]} 
          angle={0.2} 
          penumbra={1} 
          intensity={1200} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.5} 
          scale={25} 
          blur={2.5} 
          far={15} 
        />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
