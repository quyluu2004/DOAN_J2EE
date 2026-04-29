import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Quản lý tầng
  floors: [{ id: 'floor-1', name: 'Tầng 1', items: [], walls: [] }],
  activeFloorId: 'floor-1',

  // Kích thước phòng & Điểm đa giác sàn
  roomWidth: 10,
  roomDepth: 10,
  roomArea: 100, // Initial area
  roomPoints: [[-5, -5], [5, -5], [5, 5], [-5, 5]], // x, z points
  wallHeight: 3,

  // Màu tường & loại sàn
  wallColor: '#F5F0E8',
  floorType: 'wood', // 'wood' | 'tile' | 'marble' | 'concrete'
  floorColor: '#C4A882',

  // Vật thể đang chọn
  selectedId: null,

  // Chế độ công cụ: 'select' | 'wall' | 'door' | 'window'
  toolMode: 'select',
  wallStart: null,
  previewPoint: null,
  rulerPoints: [], // [start, end] for ruler tool

  // Chế độ xem: '3D' | '2D'
  viewMode: '3D',

  // Chế độ Transform cho nội thất: 'translate' | 'rotate'
  transformMode: 'translate',


  // --- Appearance ---
  setWallColor: (color) => set({ wallColor: color }),
  setFloorType: (type) => set({ floorType: type }),
  setFloorColor: (color) => set({ floorColor: color }),

  // --- Tool Mode & View Mode ---
  setToolMode: (mode) => set({ toolMode: mode, wallStart: null, previewPoint: null, selectedId: null, transformMode: 'translate' }),
  setViewMode: (mode) => set({ viewMode: mode, selectedId: null, toolMode: 'select', previewPoint: null, transformMode: 'translate' }),
  setTransformMode: (mode) => set({ transformMode: mode }),


  // --- Wall Drawing ---
  setWallStart: (point) => set({ wallStart: point }),
  setPreviewPoint: (point) => set({ previewPoint: point }),

  addWall: (wall) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, walls: [...(f.walls || []), { ...wall, id: Math.random().toString(36).substr(2, 9), thickness: 0.15 }] }
        : f
    ),
    wallStart: null,
    previewPoint: null
  })),

  removeWall: (wallId) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, walls: (f.walls || []).filter(w => w.id !== wallId) }
        : f
    ),
    selectedId: state.selectedId === `wall-${wallId}` ? null : state.selectedId
  })),

  updateWall: (wallId, updates) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, walls: (f.walls || []).map(w => w.id === wallId ? { ...w, ...updates } : w) }
        : f
    )
  })),

  // --- Ruler ---
  setRulerPoints: (points) => set({ rulerPoints: points }),
  clearRuler: () => set({ rulerPoints: [] }),

  // --- Annotations ---
  addAnnotation: (text, position) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, annotations: [...(f.annotations || []), { id: Math.random().toString(36).substr(2, 9), text, position }] }
        : f
    )
  })),

  removeAnnotation: (id) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, annotations: (f.annotations || []).filter(a => a.id !== id) }
        : f
    )
  })),

  updateAnnotation: (id, updates) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, annotations: (f.annotations || []).map(a => a.id === id ? { ...a, ...updates } : a) }
        : f
    )
  })),

  // --- Room Size & Points ---
  setRoomWidth: (w) => {
    const width = Math.max(4, Math.min(30, w));
    const hW = width / 2;
    const hD = get().roomDepth / 2;
    set({
      roomWidth: width,
      roomPoints: [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]],
      roomArea: width * get().roomDepth
    });
  },
  setRoomDepth: (d) => {
    const depth = Math.max(4, Math.min(30, d));
    const hW = get().roomWidth / 2;
    const hD = depth / 2;
    set({
      roomDepth: depth,
      roomPoints: [[-hW, -hD], [hW, -hD], [hW, hD], [-hW, hD]],
      roomArea: get().roomWidth * depth
    });
  },
  setWallHeight: (h) => set({ wallHeight: Math.max(2, Math.min(6, h)) }),

  updateRoomPoint: (index, x, z) => set((state) => {
    const newPoints = [...state.roomPoints];
    newPoints[index] = [x, z];
    
    // Calculate bounding box for roomWidth/roomDepth consistency
    const xs = newPoints.map(p => p[0]);
    const zs = newPoints.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    const width = maxX - minX;
    const depth = maxZ - minZ;
    
    // Shoelace formula for Area
    let trueArea = 0;
    for (let i = 0; i < newPoints.length; i++) {
        const [x1, z1] = newPoints[i];
        const [x2, z2] = newPoints[(i + 1) % newPoints.length];
        trueArea += (x1 * z2 - x2 * z1);
    }
    trueArea = Math.abs(trueArea) / 2;

    return { 
      roomPoints: newPoints,
      roomWidth: width,
      roomDepth: depth,
      roomArea: trueArea
    };
  }),

  addRoomPoint: (index, x, z) => set((state) => {
    const newPoints = [...state.roomPoints];
    newPoints.splice(index, 0, [x, z]);
    
    const xs = newPoints.map(p => p[0]);
    const zs = newPoints.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    
    let trueArea = 0;
    for (let i = 0; i < newPoints.length; i++) {
        const [x1, z1] = newPoints[i];
        const [x2, z2] = newPoints[(i + 1) % newPoints.length];
        trueArea += (x1 * z2 - x2 * z1);
    }
    trueArea = Math.abs(trueArea) / 2;

    return { 
      roomPoints: newPoints, 
      roomWidth: maxX - minX,
      roomDepth: maxZ - minZ,
      roomArea: trueArea 
    };
  }),

  translateRoomEdge: (index, dx, dz) => set((state) => {
    const newPoints = [...state.roomPoints];
    const idx1 = index;
    const idx2 = (index + 1) % newPoints.length;
    
    newPoints[idx1] = [newPoints[idx1][0] + dx, newPoints[idx1][1] + dz];
    newPoints[idx2] = [newPoints[idx2][0] + dx, newPoints[idx2][1] + dz];
    
    const xs = newPoints.map(p => p[0]);
    const zs = newPoints.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minZ = Math.min(...zs), maxZ = Math.max(...zs);
    
    let trueArea = 0;
    for (let i = 0; i < newPoints.length; i++) {
        const [p1x, p1z] = newPoints[i];
        const [p2x, p2z] = newPoints[(i + 1) % newPoints.length];
        trueArea += (p1x * p2z - p2x * p1z);
    }
    trueArea = Math.abs(trueArea) / 2;

    return { 
      roomPoints: newPoints,
      roomWidth: maxX - minX,
      roomDepth: maxZ - minZ,
      roomArea: trueArea
    };
  }),

  // --- Floors ---
  addFloor: () => set((state) => {
    const newId = `floor-${Date.now()}`;
    const newFloor = { id: newId, name: `Tầng ${state.floors.length + 1}`, items: [], walls: [] };
    return { floors: [...state.floors, newFloor], activeFloorId: newId };
  }),

  removeFloor: (id) => set((state) => {
    if (state.floors.length <= 1) return state;
    const newFloors = state.floors.filter(f => f.id !== id);
    return {
      floors: newFloors,
      activeFloorId: state.activeFloorId === id ? newFloors[0].id : state.activeFloorId
    };
  }),

  setActiveFloor: (id) => set({ activeFloorId: id, selectedId: null, wallStart: null, previewPoint: null }),

  // --- Items ---
  addItem: (item) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, items: [...f.items, { 
            ...item, 
            id: Math.random().toString(36).substr(2, 9),
            isColliding: false,
            lastValidPosition: item.position || [0, 0, 0],
            lastValidRotation: item.rotation || [0, 0, 0]
          }] }
        : f
    )
  })),

  removeItem: (id) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, items: f.items.filter(i => i.id !== id) }
        : f
    ),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),

  updateItem: (id, updates) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, items: f.items.map(i => {
            if (i.id === id) {
              const newItem = { ...i, ...updates };
              // If not colliding, update last valid state
              if (!newItem.isColliding) {
                newItem.lastValidPosition = newItem.position;
                newItem.lastValidRotation = newItem.rotation;
              }
              return newItem;
            }
            return i;
          }) }
        : f
    )
  })),

  revertItem: (id) => set((state) => ({
    floors: state.floors.map(f =>
      f.id === state.activeFloorId
        ? { ...f, items: f.items.map(i => 
            i.id === id 
              ? { ...i, position: i.lastValidPosition, rotation: i.lastValidRotation, isColliding: false } 
              : i
          ) }
        : f
    )
  })),

  setSelectedId: (id) => set({ selectedId: id }),

  // Export/Import
  getDesignData: () => {
    const state = get();
    return JSON.stringify({
      roomWidth: state.roomWidth, roomDepth: state.roomDepth, wallHeight: state.wallHeight,
      roomArea: state.roomArea, roomPoints: state.roomPoints,
      wallColor: state.wallColor, floorType: state.floorType, floorColor: state.floorColor,
      floors: state.floors
    });
  },

  loadDesignData: (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      set({
        roomWidth: data.roomWidth || 10, roomDepth: data.roomDepth || 10, wallHeight: data.wallHeight || 3,
        roomArea: data.roomArea || 100, roomPoints: data.roomPoints || [[-5, -5], [5, -5], [5, 5], [-5, 5]],
        wallColor: data.wallColor || '#F5F0E8', floorType: data.floorType || 'wood', floorColor: data.floorColor || '#C4A882',
        floors: data.floors || [{ id: 'floor-1', name: 'Tầng 1', items: [], walls: [] }],
        activeFloorId: data.floors?.[0]?.id || 'floor-1'
      });
    } catch (e) { console.error('Failed to load design data', e); }
  }
}));
