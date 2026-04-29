import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';

// Helper to create floor texture (Grid/Wood/Tile)
const createFloorTexture = (type, width, depth, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'wood') {
    ctx.fillStyle = color || '#C4A882';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, 512);
      ctx.stroke();
    }
  } else if (type === 'tile') {
    ctx.fillStyle = color || '#E0E0E0';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#BDBDBD';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);
    ctx.strokeRect(256, 256, 256, 256);
  } else {
    ctx.fillStyle = color || '#F5F5F5';
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(width, depth);
  return texture;
};

const createWallTexture = (repeatX, color) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color || '#F5F0E8';
  ctx.fillRect(0, 0, 256, 256);
  // Add subtle stucco texture
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  for (let i = 0; i < 500; i++) {
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, 1);
  return texture;
};

// --- Corner Handle Component (Throttled để giảm giật) ---
const CornerHandle = ({ index, position, yOffset }) => {
  const updateRoomPoint = useStore((s) => s.updateRoomPoint);
  const [hovered, setHovered] = useState(false);
  const pendingUpdate = useRef(null);
  const isDragging = useRef(false);

  // Dùng useFrame để throttle updates theo render frame (~60fps)
  useFrame(() => {
    if (pendingUpdate.current) {
      const { x, z } = pendingUpdate.current;
      updateRoomPoint(index, x, z);
      pendingUpdate.current = null;
    }
  });

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
    const point = new THREE.Vector3();
    e.ray.intersectPlane(plane, point);
    if (point) {
      // Snap to 0.2m grid thay vì 0.1m → ít updates hơn
      const nx = Math.round(point.x * 5) / 5;
      const nz = Math.round(point.z * 5) / 5;
      pendingUpdate.current = { x: nx, z: nz };
    }
  }, [yOffset, index]);

  return (
    <group position={[position[0], 0.2, position[1]]}>
      <mesh 
        onPointerDown={(e) => { e.stopPropagation(); e.target.setPointerCapture(e.pointerId); isDragging.current = true; }}
        onPointerUp={(e) => { e.stopPropagation(); e.target.releasePointerCapture(e.pointerId); isDragging.current = false; }}
        onPointerMove={onPointerMove}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'move'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#ffd700" : "#775a19"} emissive={hovered ? "#ffd700" : "#775a19"} emissiveIntensity={hovered ? 1 : 0.5} />
      </mesh>
    </group>
  );
};

// --- Edge Handle (for adding points and translating edges) ---
const EdgeHandle = ({ index, p1, p2, yOffset }) => {
  const addRoomPoint = useStore((s) => s.addRoomPoint);
  const translateRoomEdge = useStore((s) => s.translateRoomEdge);
  const [hovered, setHovered] = useState(false);
  const midX = (p1[0] + p2[0]) / 2;
  const midZ = (p1[1] + p2[1]) / 2;

  const dragging = React.useRef(false);
  const lastPoint = React.useRef(new THREE.Vector3());
  const pendingEdgeUpdate = useRef(null);

  // Throttle edge translation to render frame
  useFrame(() => {
    if (pendingEdgeUpdate.current) {
      const { dx, dz } = pendingEdgeUpdate.current;
      translateRoomEdge(index, dx, dz);
      pendingEdgeUpdate.current = null;
    }
  });

  const onPointerMove = useCallback((e) => {
    if (!dragging.current) return;
    e.stopPropagation();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
    const point = new THREE.Vector3();
    e.ray.intersectPlane(plane, point);
    if (point) {
      const dx = point.x - lastPoint.current.x;
      const dz = point.z - lastPoint.current.z;
      if (Math.abs(dx) >= 0.2 || Math.abs(dz) >= 0.2) {
        const snapX = Math.round(dx * 5) / 5;
        const snapZ = Math.round(dz * 5) / 5;
        if (snapX !== 0 || snapZ !== 0) {
          pendingEdgeUpdate.current = { dx: snapX, dz: snapZ };
          lastPoint.current.x += snapX;
          lastPoint.current.z += snapZ;
        }
      }
    }
  }, [yOffset, index]);

  return (
    <group position={[midX, 0.15, midZ]}>
      {/* Plus button to add point */}
      <mesh 
        onClick={(e) => { e.stopPropagation(); addRoomPoint(index + 1, midX, midZ); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'copy'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={hovered ? "#fff" : "#775a19"} emissive={hovered ? "#fff" : "#775a19"} emissiveIntensity={hovered ? 1 : 0.2} transparent opacity={hovered ? 1 : 0.4} />
      </mesh>
      
      {/* Invisible drag handle for edge translation */}
      <mesh 
        onPointerDown={(e) => { 
          e.stopPropagation(); 
          e.target.setPointerCapture(e.pointerId); 
          dragging.current = true;
          const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
          const point = new THREE.Vector3();
          e.ray.intersectPlane(plane, point);
          lastPoint.current = point;
        }}
        onPointerUp={(e) => { e.stopPropagation(); e.target.releasePointerCapture(e.pointerId); dragging.current = false; }}
        onPointerMove={onPointerMove}
        onPointerOver={() => { document.body.style.cursor = 'grab'; }}
        onPointerOut={() => { if (!dragging.current) document.body.style.cursor = 'auto'; }}
      >
        <boxGeometry args={[1, 0.3, 0.3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

// --- Floor Level Component ---
const PolygonalRoom = ({ floorIndex, isActive, isGhost, wallHeight }) => {
  const groupRef = React.useRef();
  const yOffset = floorIndex * wallHeight;
  const opacity = isActive ? 1 : (isGhost ? 0.15 : 0.4);
  const wt = 0.12;

  const wallColor = useStore((s) => s.wallColor);
  const floorType = useStore((s) => s.floorType);
  const floorColor = useStore((s) => s.floorColor);
  const roomPoints = useStore((s) => s.roomPoints || []);
  const viewMode = useStore((s) => s.viewMode);
  
  // Safety check for roomPoints
  const xs = roomPoints.map(p => p[0]);
  const zs = roomPoints.map(p => p[1]);
  if (xs.length < 3) {
    if (isActive) console.warn("PolygonalRoom: roomPoints.length < 3 on active floor", { floorIndex, roomPoints });
    return null; 
  }

  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  
  if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return null;

  const roomWidth = maxX - minX;
  const roomDepth = maxZ - minZ;
  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;

  const floorTex = useMemo(() => createFloorTexture(floorType, Math.max(roomWidth, 5) / 3, Math.max(roomDepth, 5) / 3, floorColor), [floorType, roomWidth, roomDepth, floorColor]);
  const wallTexBase = useMemo(() => createWallTexture(2, wallColor), [wallColor]);

  const floorShape = useMemo(() => {
    const s = new THREE.Shape();
    if (roomPoints.length > 0) {
      s.moveTo(roomPoints[0][0], -roomPoints[0][1]);
      for (let i = 1; i < roomPoints.length; i++) {
        s.lineTo(roomPoints[i][0], -roomPoints[i][1]);
      }
      s.closePath();
    }
    return s;
  }, [roomPoints]);

  useEffect(() => {
    const group = groupRef.current;
    return () => {
      if (group) {
        group.traverse((o) => {
          if (o.isMesh) {
            o.geometry.dispose();
            if (o.material.map) o.material.map.dispose();
            o.material.dispose();
          }
        });
      }
    };
  }, []);

  return (
    <group ref={groupRef} position={[0, yOffset, 0]} name={`FloorGroup-${floorIndex}`}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <shapeGeometry key={JSON.stringify(roomPoints)} args={[floorShape]} />
        <meshStandardMaterial map={floorTex} roughness={floorType === 'marble' ? 0.3 : 0.8} transparent opacity={opacity} />
      </mesh>

      {roomPoints.map((p1, i) => {
        const p2 = roomPoints[(i + 1) % roomPoints.length];
        const dx = p2[0] - p1[0];
        const dz = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dz * dz);
        const ang = Math.atan2(dz, dx);
        const mX = (p1[0] + p2[0]) / 2;
        const mZ = (p1[1] + p2[1]) / 2;

        return (
          <group key={`${i}-${roomPoints.length}-${p1[0]}-${p1[1]}`} position={[mX, wallHeight / 2, mZ]} rotation={[0, -ang, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[len + wt, wallHeight, wt]} />
              <meshStandardMaterial map={wallTexBase} roughness={0.9} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, -wallHeight / 2 + 0.05, wt / 2 + 0.01]}>
              <boxGeometry args={[len, 0.1, 0.06]} />
              <meshStandardMaterial color="#8B7355" roughness={0.7} transparent opacity={opacity} />
            </mesh>
          </group>
        );
      })}

      {isActive && viewMode === '2D' && !isGhost && (
        <group>
          {roomPoints.map((p, i) => (
            <React.Fragment key={`handles-${i}`}>
              <CornerHandle index={i} position={p} yOffset={yOffset} />
              <EdgeHandle index={i} p1={p} p2={roomPoints[(i + 1) % roomPoints.length]} yOffset={yOffset} />
            </React.Fragment>
          ))}
          <Html position={[centerX, 1.5, minZ - 0.5]} center style={{ pointerEvents: 'none' }}>
            <div className="bg-[#131313]/80 text-white px-3 py-1 rounded-full text-[13px] font-bold border-2 border-white shadow-lg whitespace-nowrap">
              {roomWidth.toFixed(1)}m (Rộng)
            </div>
          </Html>
          <Html position={[maxX + 0.5, 1.5, centerZ]} center style={{ pointerEvents: 'none' }}>
            <div className="bg-[#131313]/80 text-white px-3 py-1 rounded-full text-[13px] font-bold border-2 border-white shadow-lg whitespace-nowrap" style={{ transform: 'rotate(90deg)' }}>
              {roomDepth.toFixed(1)}m (Dài)
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

export default PolygonalRoom;
