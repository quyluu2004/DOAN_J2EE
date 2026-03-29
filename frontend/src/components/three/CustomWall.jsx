import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Html, Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';

const CustomWall = ({ wall, wallHeight, yOffset, isActive, isGhost }) => {
  const { start, end } = wall;
  const opacityValue = isActive ? 1 : (isGhost ? 0.1 : 0.3);
  const selectedId = useStore((s) => s.selectedId);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const removeWall = useStore((s) => s.removeWall);
  const updateWall = useStore((s) => s.updateWall);
  const viewMode = useStore((s) => s.viewMode);
  const activeWalls = useStore((s) => s.floors.find(f => f.id === useStore.getState().activeFloorId)?.walls || []);

  const { camera, raycaster, gl } = useThree();
  const draggingHandle = useRef(null);
  const is2D = viewMode === '2D';

  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const centerX = (start[0] + end[0]) / 2;
  const centerZ = (start[1] + end[1]) / 2;
  const isSelected = selectedId === `wall-${wall.id}`;

  const handlePointerDown = (e, type) => {
    if (!is2D) return;
    e.stopPropagation();
    draggingHandle.current = type;
    gl.domElement.style.cursor = 'grabbing';
  };

  const findSnapPoint = (point, excludeWallId) => {
    for (const w of activeWalls) {
      if (w.id === excludeWallId) continue;
      const distStart = Math.sqrt(Math.pow(point[0] - w.start[0], 2) + Math.pow(point[1] - w.start[1], 2));
      const distEnd = Math.sqrt(Math.pow(point[0] - w.end[0], 2) + Math.pow(point[1] - w.end[1], 2));
      if (distStart < 0.3) return [...w.start];
      if (distEnd < 0.3) return [...w.end];
    }
    // Snap to grid (0.5m)
    return [Math.round(point[0] * 2) / 2, Math.round(point[1] * 2) / 2];
  };

  const onPointerMove = (e) => {
    if (!draggingHandle.current || !is2D) return;
    e.stopPropagation();

    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);

    if (point) {
      let newPt = [point.x, point.z];
      newPt = findSnapPoint(newPt, wall.id);

      if (draggingHandle.current === 'start') {
        updateWall(wall.id, { start: newPt });
      } else {
        updateWall(wall.id, { end: newPt });
      }
    }
  };

  const onPointerUp = () => {
    draggingHandle.current = null;
    gl.domElement.style.cursor = 'auto';
  };

  return (
    <group onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <mesh
        position={[centerX, yOffset + (is2D ? 0.05 : wallHeight / 2), centerZ]}
        rotation={[0, -angle, 0]}
        castShadow receiveShadow
        onClick={(e) => { 
          if (!isActive || isGhost) return;
          e.stopPropagation(); 
          setSelectedId(`wall-${wall.id}`); 
        }}
        onDoubleClick={(e) => { 
          if (!isActive || isGhost) return;
          e.stopPropagation(); 
          removeWall(wall.id); 
        }}
      >
        <boxGeometry args={[length, is2D ? 0.3 : wallHeight, wall.thickness || 0.15]} />
        <meshStandardMaterial
          color={isSelected ? '#775a19' : (is2D ? '#333' : '#F5F0E8')}
          roughness={0.9} transparent opacity={opacityValue}
        />
      </mesh>

      {/* Handles for dragging in 2D */}
      {is2D && isSelected && isActive && !isGhost && (
        <>
          <mesh
            position={[start[0], yOffset + 0.1, start[1]]}
            onPointerDown={(e) => handlePointerDown(e, 'start')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#775a19" />
          </mesh>
          <mesh
            position={[end[0], yOffset + 0.1, end[1]]}
            onPointerDown={(e) => handlePointerDown(e, 'end')}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#775a19" />
          </mesh>
        </>
      )}

      {/* Hiển thị chiều dài */}
      <Html position={[centerX, yOffset + (is2D ? 0.3 : wallHeight + 0.3), centerZ]} center>
        <div style={{
          background: is2D ? '#775a19' : 'rgba(0,0,0,0.7)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: is2D ? '12px' : '11px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          boxShadow: is2D ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
        }}>
          {length.toFixed(1)}m
        </div>
      </Html>
    </group>
  );
};

const WallPreview = ({ start, currentPoint, wallHeight, yOffset }) => {
  if (!start || !currentPoint) return null;

  const dx = currentPoint[0] - start[0];
  const dz = currentPoint[1] - start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const centerX = (start[0] + currentPoint[0]) / 2;
  const centerZ = (start[1] + currentPoint[1]) / 2;

  return (
    <group>
      <mesh position={[centerX, yOffset + wallHeight / 2, centerZ]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[length, wallHeight, 0.15]} />
        <meshStandardMaterial color="#775a19" transparent opacity={0.5} />
      </mesh>
      {/* Kích thước tường đang vẽ */}
      <Html position={[centerX, yOffset + wallHeight + 0.4, centerZ]} center>
        <div style={{
          background: '#775a19', color: '#fff', padding: '4px 12px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap',
          userSelect: 'none', pointerEvents: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          📏 {length.toFixed(2)}m
        </div>
      </Html>
    </group>
  );
};

export { CustomWall, WallPreview };
export default CustomWall;
