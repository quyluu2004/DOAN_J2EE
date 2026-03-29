import React from 'react';
import { useStore } from '../../store/useStore';

// Component Cửa ra vào 3D
const Door = ({ item }) => {
  const { selectedId, setSelectedId, updateItem } = useStore();
  const isSelected = selectedId === item.id;

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Khung cửa */}
      {/* Thanh trên */}
      <mesh position={[0, 2.1, 0]}>
        <boxGeometry args={[1, 0.08, 0.12]} />
        <meshStandardMaterial color={isSelected ? '#C49A3C' : '#8B6F47'} />
      </mesh>
      {/* Thanh trái */}
      <mesh position={[-0.46, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 0.12]} />
        <meshStandardMaterial color={isSelected ? '#C49A3C' : '#8B6F47'} />
      </mesh>
      {/* Thanh phải */}
      <mesh position={[0.46, 1.05, 0]}>
        <boxGeometry args={[0.08, 2.1, 0.12]} />
        <meshStandardMaterial color={isSelected ? '#C49A3C' : '#8B6F47'} />
      </mesh>
      {/* Cánh cửa */}
      <mesh position={[0, 1.05, 0.02]}>
        <boxGeometry args={[0.84, 2.02, 0.05]} />
        <meshStandardMaterial color={isSelected ? '#DEB887' : '#A0845C'} roughness={0.6} />
      </mesh>
      {/* Tay nắm */}
      <mesh position={[0.3, 1.05, 0.06]}>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Component Cửa sổ 3D
const Window = ({ item }) => {
  const { selectedId, setSelectedId } = useStore();
  const isSelected = selectedId === item.id;

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      {/* Khung cửa sổ */}
      {/* Thanh trên */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Thanh dưới */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[1.2, 0.06, 0.1]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Thanh trái */}
      <mesh position={[-0.57, 0, 0]}>
        <boxGeometry args={[0.06, 1.1, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Thanh phải */}
      <mesh position={[0.57, 0, 0]}>
        <boxGeometry args={[0.06, 1.1, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Thanh giữa dọc */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.04, 1.04, 0.06]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Thanh giữa ngang */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.08, 0.04, 0.06]} />
        <meshStandardMaterial color={isSelected ? '#E8E8E8' : '#D0D0D0'} />
      </mesh>
      {/* Kính */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.08, 1.04]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  );
};

export { Door, Window };
