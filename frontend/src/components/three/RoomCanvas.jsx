import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  OrthographicCamera, 
  Environment, 
  ContactShadows, 
  Grid,
  Html,
  TransformControls
} from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import PolygonalRoom from './PolygonalRoom';
import FurnitureItem from './FurnitureItem';
import CustomWall, { WallPreview } from './CustomWall';
import FirstPersonWalk from './FirstPersonWalk';
import RulerTool from './RulerTool';
import Annotation from './Annotation';
import { checkCollision, resolvePosition } from '../../lib/collisionUtils';

// --- Click Handler for adding walls ---
const FloorClickHandler = ({ yOffset }) => {
  const toolMode = useStore((s) => s.toolMode);
  const wallStart = useStore((s) => s.wallStart);
  const setWallStart = useStore((s) => s.setWallStart);
  const addWall = useStore((s) => s.addWall);
  const setPreviewPoint = useStore((s) => s.setPreviewPoint);
  const activeWalls = useStore((s) => s.floors.find(f => f.id === useStore.getState().activeFloorId)?.walls || []);

  const findSnapPoint = (point) => {
    for (const w of activeWalls) {
      const distStart = Math.sqrt(Math.pow(point[0] - w.start[0], 2) + Math.pow(point[1] - w.start[1], 2));
      const distEnd = Math.sqrt(Math.pow(point[0] - w.end[0], 2) + Math.pow(point[1] - w.end[1], 2));
      if (distStart < 0.3) return [...w.start];
      if (distEnd < 0.3) return [...w.end];
    }
    // Snap to grid (0.5m)
    return [Math.round(point[0] * 2) / 2, Math.round(point[1] * 2) / 2];
  };

  const handleMove = (e) => {
    if (toolMode !== 'wall' || !wallStart) return;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
    const point = new THREE.Vector3();
    e.ray.intersectPlane(plane, point);
    if (point) {
      setPreviewPoint(findSnapPoint([point.x, point.z]));
    }
  };

  const handleClick = (e) => {
    if (toolMode !== 'wall') return;
    e.stopPropagation();
    
    // Raycast to find the point on the ground plane (y = yOffset)
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
    const point = new THREE.Vector3();
    e.ray.intersectPlane(plane, point);
    
    if (point) {
      const snappedPoint = findSnapPoint([point.x, point.z]);
      if (!wallStart) {
        setWallStart(snappedPoint);
      } else {
        addWall({
          start: wallStart,
          end: snappedPoint
        });
      }
    }
  };

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, yOffset - 0.01, 0]} 
      onClick={handleClick} 
      onPointerMove={handleMove}
      visible={false}
    >
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
};

// --- Render Helper for items ---
const RenderItem = ({ item, yOffset, is2D, isActive, isGhost }) => {
  const selectedId = useStore((s) => s.selectedId);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const updateItem = useStore((s) => s.updateItem);
  const toolMode = useStore((s) => s.toolMode);
  const groupRef = useRef();

  const transformModeFromStore = useStore((s) => s.transformMode);
  const isSelected = selectedId === item.id;
  const transformMode = toolMode === 'select' && isSelected ? transformModeFromStore : null;

  return (
    <group>
      <group 
        ref={groupRef} 
        position={[item.position[0], item.position[1] + yOffset, item.position[2]]} 
        rotation={item.rotation}
      >
        <FurnitureItem 
          item={item} 
          isSelected={isSelected} 
          isActive={isActive}
          isGhost={isGhost}
          onClick={(e) => { 
            if (!isActive || isGhost) return;
            e.stopPropagation(); 
            if (toolMode === 'select') setSelectedId(item.id); 
          }} 
        />
      </group>
      
      {isSelected && toolMode === 'select' && isActive && !isGhost && (
        <TransformControls 
          object={groupRef}
          mode={transformMode}
          showY={!is2D && (transformMode === 'translate' || transformMode === 'rotate')}
          onObjectChange={(e) => {
            if (!groupRef.current) return;
            const { position, rotation } = groupRef.current;
            
            // --- Smart Gravity & Floor Clipping Logic ---
            // If the user isn't dragging the 'Y' axis (green arrow), force the item 
            // to stay grounded (y = 0) unless it was already higher (e.g. on a table).
            // For now, simplicity: prevent sinking below 0.
            const targetY = Math.max(0, position.y - yOffset);
            
            // Perform collision check
            const roomPoints = useStore.getState().roomPoints;
            const activeFloorId = useStore.getState().activeFloorId;
            const allItems = useStore.getState().floors.find(f => f.id === activeFloorId)?.items || [];
            
            const updatedPosition = [position.x, is2D ? 0 : targetY, position.z];
            const updatedRotation = [is2D ? 0 : rotation.x, rotation.y, is2D ? 0 : rotation.z];
            
            const updatedItem = {
              ...item,
              position: updatedPosition,
              rotation: updatedRotation
            };
            
            const isColliding = checkCollision(updatedItem, allItems, roomPoints);
            
            updateItem(item.id, {
              position: updatedPosition,
              rotation: updatedRotation,
              isColliding
            });
            
            // Sync the Gizmo visual in real-time for floor-clipping
            if (!is2D) {
              groupRef.current.position.y = targetY + yOffset;
            }
          }}
          onMouseUp={() => {
            const state = useStore.getState();
            const currentItem = state.floors
              .find(f => f.id === state.activeFloorId)
              ?.items.find(i => i.id === item.id);
              
            if (!currentItem) return;

            // --- Snap-on-Drop Strategy ---
            // If the item is invalid (colliding/out of bounds), 
            // we resolve it to the nearest valid surface/wall instead of snapping back to last position.
            const roomPoints = state.roomPoints;
            const resolved = resolvePosition(currentItem, roomPoints);
            
            // Final check after resolution
            const allItems = state.floors.find(f => f.id === state.activeFloorId)?.items || [];
            const isCollidingAfterSnap = checkCollision({ ...currentItem, ...resolved }, allItems, roomPoints);
            
            updateItem(item.id, {
              ...resolved,
              isColliding: isCollidingAfterSnap
            });

            // Force Gizmo to the resolved position
            if (groupRef.current) {
              groupRef.current.position.set(resolved.position[0], resolved.position[1] + yOffset, resolved.position[2]);
              groupRef.current.rotation.set(...resolved.rotation);
            }
          }}
        />
      )}
    </group>
  );
};

const RoomCanvas = () => {
  const floors = useStore((s) => s.floors);
  const activeFloorId = useStore((s) => s.activeFloorId);
  const wallHeight = useStore((s) => s.wallHeight);
  const roomWidth = useStore((s) => s.roomWidth);
  const roomDepth = useStore((s) => s.roomDepth);
  const roomArea = useStore((s) => s.roomArea || roomWidth * roomDepth);
  const setSelectedId = useStore((s) => s.setSelectedId);
  const toolMode = useStore((s) => s.toolMode);
  const viewMode = useStore((s) => s.viewMode);

  const isWalkMode = toolMode === 'walk';
  const activeFloorIndex = Math.max(0, floors.findIndex(f => f.id === activeFloorId));
  const activeFloor = floors[activeFloorIndex] || floors[0];
  const yOffsetActive = activeFloorIndex * wallHeight;

  // Calculate geometric center of the room
  const roomPoints = useStore((s) => s.roomPoints || []);
  // Safety check for roomPoints
  if (!roomPoints || roomPoints.length < 3) {
    console.warn("RoomCanvas: roomPoints.length < 3, returning null for roomCenter", roomPoints);
    // Return a default center if not enough points to calculate a meaningful one
    // This will prevent errors in camera/controls target
    // The component will still render, but the room geometry might be missing or incorrect.
  }

  const roomCenter = React.useMemo(() => {
    if (!roomPoints || roomPoints.length === 0) return new THREE.Vector3(0, 0, 0);
    const xs = roomPoints.map(p => p[0]);
    const zs = roomPoints.map(p => p[1]);
    const avgX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const avgZ = (Math.min(...zs) + Math.max(...zs)) / 2;
    return new THREE.Vector3(
      Number.isFinite(avgX) ? avgX : 0,
      0,
      Number.isFinite(avgZ) ? avgZ : 0
    );
  }, [roomPoints]);

  const is2D = viewMode === '2D';

  const orbitRef = useRef();

  // Reset target only when floor or view mode changes to preserve manual panning
  React.useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.target.set(roomCenter.x, yOffsetActive + (is2D ? 0 : 0.5), roomCenter.z);
      orbitRef.current.update();
    }
  }, [activeFloorId, is2D, roomCenter.x, roomCenter.z, yOffsetActive]);

  // Memoize camera position to prevent jumping
  const cameraPosition = React.useMemo(() => [roomCenter.x + 8, yOffsetActive + 6, roomCenter.z + 8], [roomCenter.x, yOffsetActive, roomCenter.z]);

  return (
    <Canvas
      shadows
      onPointerMissed={() => { if (toolMode === 'select') setSelectedId(null); }}
      onCreated={({ gl }) => {
        // Safety check to ensure we have a valid DOM element before R3F connects events
        if (!gl.domElement) {
            console.warn("RoomCanvas: gl.domElement is null onCreated");
            return;
        }
        // Additional gl setup if needed
        gl.setClearColor(is2D ? '#f0f0f0' : '#e8e3db', 1);
      }}
      style={{ background: is2D ? '#f0f0f0' : '#e8e3db', cursor: toolMode === 'wall' ? 'crosshair' : 'auto' }}
    >
      {is2D ? (
        <OrthographicCamera makeDefault position={[roomCenter.x, 50, roomCenter.z]} zoom={40} near={0.1} far={1000} />
      ) : (
        <PerspectiveCamera makeDefault position={cameraPosition} fov={55} />
      )}
      <ambientLight intensity={is2D ? 1 : 0.5} />
      <directionalLight position={[5, 8 + yOffsetActive, 5]} intensity={is2D ? 0.5 : 1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      {!is2D && <pointLight position={[0, yOffsetActive + wallHeight - 0.3, 0]} intensity={0.4} color="#FFF5E6" />}

      {/* Render all floors and their contents */}
      {floors.map((floor, idx) => {
        const floorYOffset = idx * wallHeight;
        const isActive = floor.id === activeFloorId;
        const isGhost = idx > activeFloorIndex;
        
        return (
          <group key={floor.id}>
            <PolygonalRoom 
              floor={floor} 
              floorIndex={idx} 
              isActive={isActive} 
              isGhost={isGhost}
              wallHeight={wallHeight} 
            />
            {/* Render items and walls for this floor */}
            <group>
              {(floor.walls || []).map((w) => (
                <CustomWall 
                  key={w.id} 
                  wall={w} 
                  wallHeight={wallHeight} 
                  yOffset={floorYOffset} 
                  isActive={isActive} 
                  isGhost={isGhost}
                />
              ))}
              <Suspense fallback={null}>
                {(floor.items || []).map((item) => (
                  <RenderItem 
                    key={item.id} 
                    item={item} 
                    yOffset={floorYOffset} 
                    is2D={is2D} 
                    isActive={isActive}
                    isGhost={isGhost}
                  />
                ))}
              </Suspense>
            </group>
          </group>
        );
      })}

      <FloorClickHandler yOffset={yOffsetActive} />

      {toolMode === 'wall' && useStore.getState().wallStart && useStore.getState().previewPoint && (
        <WallPreview 
          start={useStore.getState().wallStart} 
          currentPoint={useStore.getState().previewPoint} 
          wallHeight={wallHeight} 
          yOffset={yOffsetActive} 
        />
      )}

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows position={[0, yOffsetActive + 0.01, 0]} opacity={0.5} scale={20} blur={2} far={4} />

      {/* Nền vô tận + Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yOffsetActive - 0.02, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color={is2D ? '#e8e5e0' : '#d5d0c8'} roughness={1} />
      </mesh>
      <Grid
        position={[0, yOffsetActive - 0.01, 0]}
        args={[500, 500]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={is2D ? '#c0bdb8' : '#bfb9ad'}
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor={is2D ? '#a8a49e' : '#a69e90'}
        fadeDistance={is2D ? 80 : 50}
        fadeStrength={1.5}
        infiniteGrid={true}
      />

      {/* Chế độ đi bộ (First-Person Walk) */}
      <FirstPersonWalk enabled={isWalkMode} yOffset={yOffsetActive} roomWidth={roomWidth} roomDepth={roomDepth} />

      {/* Architectural Tools */}
      {is2D && (
        <group>
          <RulerTool yOffset={yOffsetActive} />
          {(activeFloor.annotations || []).map(a => (
            <Annotation key={a.id} annotation={a} yOffset={yOffsetActive} />
          ))}
          {/* Room Area Label */}
          <Html position={[-(roomWidth / 2) + 1, yOffsetActive + 0.1, (roomDepth / 2) - 0.5]} center>
            <div className="bg-white/90 px-3 py-1.5 rounded-lg border-2 border-[#775a19] shadow-sm flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-gray-400">Diện tích thực</span>
              <span className="text-sm font-black text-[#775a19]">{roomArea.toFixed(1)} m²</span>
            </div>
          </Html>
        </group>
      )}

      {/* Chế độ xem tổng quan (Orbit) - tắt khi đang đi bộ */}
      {!isWalkMode && (
        <OrbitControls
          ref={orbitRef}
          makeDefault
          enabled={true}
          enableRotate={!is2D}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={1.5}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI / 2}
          minDistance={3}
          maxDistance={30}
        />
      )}
    </Canvas>
  );
};

export default RoomCanvas;
