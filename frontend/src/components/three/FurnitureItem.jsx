import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

const FurnitureItem = ({ item, isActive, isGhost }) => {
  const is2D = useStore((s) => s.viewMode === '2D');
  const setSelectedId = useStore((s) => s.setSelectedId);
  const selectedId = useStore((s) => s.selectedId);
  const isSelected = selectedId === item.id;
  const opacityValue = isActive ? 1 : (isGhost ? 0.15 : 0.4);

  // We use a simple box for the 2D symbol based on item scale
  // Items usually have a 'scale' [x, y, z] or we can assume 1x1x1
  const scale = item.scale || [1, 1, 1];
  const width = scale[0];
  const depth = scale[2];

  // Chuyển URL tuyệt đối (http://localhost:8080) thành đường dẫn tương đối (/uploads)
  // để tránh lỗi Mixed Content (HTTPS -> HTTP) và tận dụng Vite Proxy.
  const cleanUrl = React.useMemo(() => {
    if (!item.glbUrl) return '';
    return item.glbUrl.replace(/^http:\/\/localhost:8080/, '');
  }, [item.glbUrl]);

  // Hook useGLTF phải được gọi ở top-level, không được bọc trong try-catch.
  const { scene } = useGLTF(cleanUrl || '');
  
  // Clone scene để có thể hiển thị nhiều instance của cùng một model
  const clonedScene = React.useMemo(() => scene ? scene.clone() : null, [scene]);

  const handlePointerDown = (e) => {
    if (!isActive || isGhost) return;
    e.stopPropagation();
    setSelectedId(item.id);
  };

  if (is2D) {
    return (
      <group onPointerDown={handlePointerDown}>
        {/* Simplified 2D Symbol */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[width, 0.1, depth]} />
          <meshStandardMaterial
            color={isSelected ? "#775a19" : "#e0e0e0"}
            emissive={isSelected ? "#775a19" : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
            transparent
            opacity={opacityValue}
          />
        </mesh>
        {/* Stroke / Outline */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[width + 0.02, 0.02, depth + 0.02]} />
          <meshBasicMaterial color="#333" transparent opacity={opacityValue} />
        </mesh>
      </group>
    );
  }

  return clonedScene ? (
    <primitive
      object={clonedScene}
      onPointerDown={handlePointerDown}
      onPointerOver={() => { if (isActive && !isGhost) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {isGhost && (
        <mesh scale={[scale[0] * 1.5, scale[1] * 1.5, scale[2] * 1.5]}>
          <boxGeometry />
          <meshStandardMaterial transparent opacity={0.15} color="#fff" />
        </mesh>
      )}
    </primitive>
  ) : null;
};

export default FurnitureItem;
