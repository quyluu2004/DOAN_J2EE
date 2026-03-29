import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useStore } from '../../store/useStore';

const RulerTool = ({ yOffset }) => {
  const toolMode = useStore((s) => s.toolMode);
  const rulerPoints = useStore((s) => s.rulerPoints);
  const setRulerPoints = useStore((s) => s.setRulerPoints);
  const clearRuler = useStore((s) => s.clearRuler);
  const { camera, raycaster, gl } = useThree();
  const [tempPoint, setTempPoint] = useState(null);

  useEffect(() => {
    if (toolMode !== 'ruler') {
      if (rulerPoints.length > 0) clearRuler();
      if (tempPoint !== null) setTempPoint(null);
      return;
    }

    const handlePointerDown = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
      const point = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, point);

      if (point) {
        if (rulerPoints.length === 0) {
          setRulerPoints([[point.x, point.z]]);
        } else if (rulerPoints.length === 1) {
          setRulerPoints([rulerPoints[0], [point.x, point.z]]);
        } else {
          setRulerPoints([[point.x, point.z]]);
          setTempPoint(null);
        }
      }
    };

    const handlePointerMove = (e) => {
      if (rulerPoints.length !== 1) return;
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yOffset);
      const point = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, point);
      if (point) setTempPoint([point.x, point.z]);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [toolMode, rulerPoints, yOffset, camera, gl, raycaster, setRulerPoints, clearRuler]);

  if (rulerPoints.length === 0) return null;

  const start = rulerPoints[0];
  const end = rulerPoints[1] || tempPoint;
  if (!end) return null;

  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const distance = Math.sqrt(dx * dx + dz * dz);
  const center = [(start[0] + end[0]) / 2, yOffset + 0.5, (start[1] + end[1]) / 2];

  return (
    <group>
      <Line
        points={[[start[0], yOffset + 0.2, start[1]], [end[0], yOffset + 0.2, end[1]]]}
        color="#775a19"
        lineWidth={3}
      />
      <Html position={center} center>
        <div style={{
          background: '#775a19', color: '#fff', padding: '4px 10px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 'bold',
          border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none'
        }}>
          📏 {distance.toFixed(2)}m
        </div>
      </Html>
    </group>
  );
};

export default RulerTool;
