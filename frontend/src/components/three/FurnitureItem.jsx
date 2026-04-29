import React from 'react';
import { useGLTF } from '@react-three/drei';
import { useStore } from '../../store/useStore';
import * as THREE from 'three';

// Component phụ để tải mô hình, giúp kiểm soát Hook useGLTF
const ModelLoader = ({ url, isGhost, scale }) => {
  // useGLTF sẽ throw error nếu url không hợp lệ hoặc 404
  const { scene } = useGLTF(url);
  const clonedScene = React.useMemo(() => scene ? scene.clone() : null, [scene]);

  return clonedScene ? (
    <primitive object={clonedScene}>
      {isGhost && (
        <mesh scale={[scale[0] * 1.5, scale[1] * 1.5, scale[2] * 1.5]}>
          <boxGeometry />
          <meshStandardMaterial transparent opacity={0.15} color="#fff" />
        </mesh>
      )}
    </primitive>
  ) : null;
};

// Error Boundary đơn giản để tránh sập toàn bộ Scene nếu 1 model bị lỗi
class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

const FurnitureItem = ({ item, isActive, isGhost }) => {
  const is2D = useStore((s) => s.viewMode === '2D');
  const setSelectedId = useStore((s) => s.setSelectedId);
  const selectedId = useStore((s) => s.selectedId);
  const isSelected = selectedId === item.id;
  const opacityValue = isActive ? 1 : (isGhost ? 0.15 : 0.4);

  const scale = item.scale || [1, 1, 1];
  const width = scale[0];
  const depth = scale[2];

  const cleanUrl = React.useMemo(() => {
    if (!item.glbUrl) return null;
    return item.glbUrl.replace(/^https?:\/\/[^/]+/, '');
  }, [item.glbUrl]);

  const handlePointerDown = (e) => {
    if (!isActive || isGhost) return;
    e.stopPropagation();
    setSelectedId(item.id);
  };

  if (is2D) {
    return (
      <group onPointerDown={handlePointerDown}>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[width, 0.1, depth]} />
          <meshStandardMaterial
            color={isColliding ? "#ff0000" : (isSelected ? "#775a19" : "#e0e0e0")}
            emissive={isColliding ? "#ff0000" : (isSelected ? "#775a19" : "#000000")}
            emissiveIntensity={(isColliding || isSelected) ? 0.5 : 0}
            transparent
            opacity={opacityValue}
          />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[width + 0.02, 0.02, depth + 0.02]} />
          <meshStandardMaterial color={isColliding ? "#ff0000" : "#333"} transparent opacity={opacityValue} />
        </mesh>
      </group>
    );
  }

  return (
    <group 
      onPointerDown={handlePointerDown}
      onPointerOver={() => { if (isActive && !isGhost) document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {item.isColliding && (
        <mesh position={[0, scale[1] / 2, 0]}>
          <boxGeometry args={[width + 0.05, scale[1] + 0.05, depth + 0.05]} />
          <meshStandardMaterial color="red" transparent opacity={0.2} wireframe />
        </mesh>
      )}
      {cleanUrl ? (
        <ModelErrorBoundary fallback={
          <mesh>
            <boxGeometry args={[width, 0.5, depth]} />
            <meshStandardMaterial color={item.isColliding ? "red" : "orange"} wireframe />
          </mesh>
        }>
          <ModelLoader url={cleanUrl} isGhost={isGhost} scale={scale} />
        </ModelErrorBoundary>
      ) : (
        /* Fallback nếu không có URL mô hình */
        <mesh>
          <boxGeometry args={[width, 0.1, depth]} />
          <meshStandardMaterial color={item.isColliding ? "red" : (isSelected ? "#775a19" : "#ccc")} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};

export default FurnitureItem;
