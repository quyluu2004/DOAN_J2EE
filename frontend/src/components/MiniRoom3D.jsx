import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  ContactShadows, 
  Float, 
  Environment, 
  useGLTF, 
  MeshReflectorMaterial, 
  BakeShadows,
  Stage
} from '@react-three/drei';
import * as THREE from 'three';

// Stable high-quality model from Three.js examples
const HighQualityChair = () => {
  const { scene } = useGLTF('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/SheenChair.glb');
  return <primitive object={scene} scale={3.5} position={[0, -0.5, 0]} />;
};

const RealisticHand = () => {
  const handRef = useRef();
  // Using a stable hand model from a reliable source
  const { scene } = useGLTF('https://models.readyplayer.me/6385d38104a896d8e2392723.glb?pose=A');
  
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
      {/* Apply a premium gold material to all meshes in the scene */}
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
    </group>
  );
};

const CinematicRoom = () => {
  return (
    <group rotation={[0, -Math.PI / 4, 0]}>
      {/* Floor with Realistic Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#101010"
          metalness={0.5}
        />
      </mesh>

      {/* Luxury Wood Walls */}
      <group>
        <mesh position={[-8, 4, 0]} receiveShadow>
          <boxGeometry args={[0.3, 8, 16]} />
          <meshStandardMaterial color="#2d1b0d" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 4, -8]} receiveShadow>
          <boxGeometry args={[16, 8, 0.3]} />
          <meshStandardMaterial color="#2d1b0d" roughness={0.6} metalness={0.2} />
        </mesh>
        
        {/* Wall Accents (Gold strips) */}
        <mesh position={[-7.8, 4, -4]} castShadow>
          <boxGeometry args={[0.1, 8, 0.2]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
        <mesh position={[4, 4, -7.8]} castShadow>
          <boxGeometry args={[0.2, 8, 0.1]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
        </mesh>
      </group>

      {/* Panoramic Window with Glow */}
      <mesh position={[0, 4.5, -8.1]}>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} transparent opacity={0.3} />
      </mesh>

      {/* Furniture Composition */}
      <group position={[-2, 0, -2]}>
        <Suspense fallback={null}>
          <HighQualityChair />
        </Suspense>
      </group>

      {/* Coffee Table */}
      <mesh position={[1.5, 0.3, -1]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[1.5, 0.15, -1]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={1} />
      </mesh>

      {/* Decorative Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={1} opacity={0.5} transparent />
      </mesh>

      <Suspense fallback={null}>
        <RealisticHand />
      </Suspense>
    </group>
  );
};

const MiniRoom3D = () => {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[700px] cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[16, 16, 16]} fov={30} />
        
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} contactShadow={false} shadows="contact" adjustCamera={false}>
            <CinematicRoom />
          </Stage>
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2.2}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
        
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[20, 30, 20]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1000} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        <ContactShadows 
          position={[0, -0.01, 0]} 
          opacity={0.6} 
          scale={30} 
          blur={3} 
          far={15} 
        />
        
        <Environment preset="apartment" />
        <BakeShadows />
      </Canvas>
    </div>
  );
};

export default MiniRoom3D;
