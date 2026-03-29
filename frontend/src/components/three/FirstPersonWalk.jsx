import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const EYE_HEIGHT = 1.6; // Chiều cao mắt người (m)
const WALK_SPEED = 4;   // Tốc độ đi bộ (m/s)

const FirstPersonWalk = ({ enabled, yOffset, roomWidth, roomDepth }) => {
  const { camera } = useThree();
  const controlsRef = useRef();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  // Đặt camera ở vị trí mắt người khi bật chế độ
  useEffect(() => {
    if (enabled) {
      camera.position.set(0, yOffset + EYE_HEIGHT, roomDepth / 4);
      camera.lookAt(0, yOffset + EYE_HEIGHT, -roomDepth / 4);
    }
  }, [enabled, yOffset]);

  // Xử lý bàn phím
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break;
      }
    };
    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break;
        case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break;
        case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break;
        case 'KeyD': case 'ArrowRight': moveState.current.right = false; break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      // Reset khi tắt
      moveState.current = { forward: false, backward: false, left: false, right: false };
    };
  }, [enabled]);

  // Di chuyển mỗi frame
  useFrame((_, delta) => {
    if (!enabled || !controlsRef.current?.isLocked) return;

    const { forward, backward, left, right } = moveState.current;
    const speed = WALK_SPEED * delta;

    // Lấy hướng camera (chỉ trên mặt phẳng XZ)
    direction.current.set(0, 0, 0);
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const sideDirection = new THREE.Vector3();
    sideDirection.crossVectors(camera.up, cameraDirection).normalize();

    if (forward) direction.current.add(cameraDirection);
    if (backward) direction.current.sub(cameraDirection);
    if (left) direction.current.add(sideDirection);
    if (right) direction.current.sub(sideDirection);

    direction.current.normalize().multiplyScalar(speed);

    // Tính vị trí mới
    const newX = camera.position.x + direction.current.x;
    const newZ = camera.position.z + direction.current.z;

    // Giới hạn trong phòng (có padding)
    const halfW = roomWidth / 2 - 0.3;
    const halfD = roomDepth / 2 - 0.3;

    camera.position.x = Math.max(-halfW, Math.min(halfW, newX));
    camera.position.z = Math.max(-halfD, Math.min(halfD, newZ));
    camera.position.y = yOffset + EYE_HEIGHT; // Luôn ở độ cao mắt
  });

  if (!enabled) return null;

  return (
    <PointerLockControls ref={controlsRef} />
  );
};

export default FirstPersonWalk;
