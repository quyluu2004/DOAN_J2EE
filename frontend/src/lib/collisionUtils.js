import * as THREE from 'three';

/**
 * Checks if a 2D point [x, z] is inside a polygon defined by points [[x1, z1], [x2, z2], ...].
 */
export const isPointInPolygon = (point, polygon) => {
  const x = point[0], z = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], zi = polygon[i][1];
    const xj = polygon[j][0], zj = polygon[j][1];
    const intersect = ((zi > z) !== (zj > z)) && (x < (xj - xi) * (z - zi) / (zj - zi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

/**
 * Finds the nearest point on a line segment [a, b] to point p.
 */
const getNearestPointOnSegment = (p, a, b) => {
  const pax = p[0] - a[0], paz = p[1] - a[1];
  const bax = b[0] - a[0], baz = b[1] - a[1];
  const h = Math.min(1, Math.max(0, (pax * bax + paz * baz) / (bax * bax + baz * baz)));
  return [a[0] + h * bax, a[1] + h * baz];
};

/**
 * Computes an AABB for a furniture item.
 */
export const getItemBoundingBox = (item) => {
  const [px, py, pz] = item.position;
  const [sx, sy, sz] = item.scale || [1, 1, 1];
  const corners = [
    new THREE.Vector3(-sx/2, 0, -sz/2), new THREE.Vector3(sx/2, 0, -sz/2),
    new THREE.Vector3(sx/2, 0, sz/2), new THREE.Vector3(-sx/2, 0, sz/2),
    new THREE.Vector3(-sx/2, sy, -sz/2), new THREE.Vector3(sx/2, sy, -sz/2),
    new THREE.Vector3(sx/2, sy, sz/2), new THREE.Vector3(-sx/2, sy, sz/2),
  ];
  const euler = new THREE.Euler(...(item.rotation || [0, 0, 0]));
  const matrix = new THREE.Matrix4().makeRotationFromEuler(euler).setPosition(px, py, pz);
  const box = new THREE.Box3();
  corners.forEach(c => box.expandByPoint(c.applyMatrix4(matrix)));
  return box;
};

export const checkCollision = (activeItem, allItems, roomPoints) => {
  const activeBox = getItemBoundingBox(activeItem);
  for (const other of allItems) {
    if (other.id === activeItem.id) continue;
    if (activeBox.intersectsBox(getItemBoundingBox(other))) return true;
  }
  const [px, py, pz] = activeItem.position;
  const [sx, sy, sz] = activeItem.scale || [1, 1, 1];
  const euler = new THREE.Euler(...(activeItem.rotation || [0, 0, 0]));
  const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
  const bottomCorners = [
    new THREE.Vector3(-sx/2, 0, -sz/2), new THREE.Vector3(sx/2, 0, -sz/2),
    new THREE.Vector3(sx/2, 0, sz/2), new THREE.Vector3(-sx/2, 0, sz/2),
  ];
  for (const c of bottomCorners) {
    c.applyMatrix4(matrix);
    if (!isPointInPolygon([px + c.x, pz + c.z], roomPoints)) return true;
  }
  return false;
};

/**
 * Resolves the position of an item to keep it inside room boundaries and on the floor.
 */
export const resolvePosition = (item, roomPoints) => {
  const [px, py, pz] = item.position;
  const [sx, sy, sz] = item.scale || [1, 1, 1];
  
  // 1. Floor Snap
  let resolvedY = Math.max(0, py);
  // Auto-drop if not purposely high
  if (resolvedY < 0.2) resolvedY = 0;

  // 2. Room Boundary Snap
  // Check center point first
  let resolvedPos = [px, pz];
  if (!isPointInPolygon(resolvedPos, roomPoints)) {
    // If center is out, find nearest point on any edge
    let minDist = Infinity;
    let nearest = resolvedPos;
    for (let i = 0; i < roomPoints.length; i++) {
      const a = roomPoints[i];
      const b = roomPoints[(i + 1) % roomPoints.length];
      const p = getNearestPointOnSegment(resolvedPos, a, b);
      const dist = Math.sqrt((p[0] - px)**2 + (p[1] - pz)**2);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    resolvedPos = nearest;
  }

  // Check corners and push back if clipping
  const euler = new THREE.Euler(...(item.rotation || [0, 0, 0]));
  const matrix = new THREE.Matrix4().makeRotationFromEuler(euler);
  const bottomCorners = [
    new THREE.Vector3(-sx/2, 0, -sz/2), new THREE.Vector3(sx/2, 0, -sz/2),
    new THREE.Vector3(sx/2, 0, sz/2), new THREE.Vector3(-sx/2, 0, sz/2),
  ];

  let shift = [0, 0];
  bottomCorners.forEach(c => {
    c.applyMatrix4(matrix);
    const cx = resolvedPos[0] + c.x;
    const cz = resolvedPos[1] + c.z;
    if (!isPointInPolygon([cx, cz], roomPoints)) {
       // Find vector to push back
       for (let i = 0; i < roomPoints.length; i++) {
          const a = roomPoints[i], b = roomPoints[(i+1)%roomPoints.length];
          const p = getNearestPointOnSegment([cx, cz], a, b);
          shift[0] += (p[0] - cx);
          shift[1] += (p[1] - cz);
       }
    }
  });

  return {
    position: [resolvedPos[0] + shift[0], resolvedY, resolvedPos[1] + shift[1]],
    rotation: item.rotation
  };
};
