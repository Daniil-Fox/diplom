import { create } from 'zustand'

const usePlannerStore = create((set) => ({
  // Room dimensions
  roomDimensions: { width: 10, length: 10, height: 3 },
  setRoomDimensions: (dimensions) => set({ roomDimensions: dimensions }),
  updateRoomDimension: (dimension, value) => set((state) => ({
    roomDimensions: {
      ...state.roomDimensions,
      [dimension]: value
    }
  })),
  
  // Mode (e.g., 'view', 'add', 'edit', 'delete')
  mode: 'view',
  setMode: (mode) => set({ mode }),
  
  // Furniture collection
  furniture: [],
  addFurniture: (item) => set((state) => ({ 
    furniture: [...state.furniture, item] 
  })),
  removeFurniture: (id) => set((state) => ({ 
    furniture: state.furniture.filter(item => item.id !== id) 
  })),
  updateFurniture: (id, updates) => set((state) => ({
    furniture: state.furniture.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  // View mode (2D or 3D)
  viewMode: '3D',
  setViewMode: (viewMode) => set({ viewMode }),
  
  // Selected wall for resizing (in 2D mode)
  selectedWall: null,
  setSelectedWall: (wall) => set({ selectedWall: wall }),
  
  // Selected object
  selectedObject: null,
  setSelectedObject: (id) => set({ selectedObject: id }),
  
  // Camera reference for use outside components
  camera: null,
  setCameraPosition: (position) => set({ cameraPosition: position }),
  
  // Selected furniture (for new implementation)
  selectedFurniture: null,
  setSelectedFurniture: (index) => set({ selectedFurniture: index }),
  
  // Camera rotation control
  rotationEnabled: false,
  setRotationEnabled: (enabled) => set({ rotationEnabled: enabled }),
  
  // Furniture position update (new implementation)
  updateFurniturePosition: (index, x, z) => set((state) => {
    const furniture = [...state.furniture];
    if (furniture[index]) {
      furniture[index] = { ...furniture[index], x, z };
      return { furniture };
    }
    return {};
  }),
  
  // Furniture rotation update (new implementation)
  updateFurnitureRotation: (index, rotation) => set((state) => {
    const furniture = [...state.furniture];
    if (furniture[index]) {
      furniture[index] = { ...furniture[index], rotation };
      return { furniture };
    }
    return {};
  }),
  
  // Delete furniture (new implementation)
  deleteFurniture: (index) => set((state) => {
    const furniture = [...state.furniture];
    if (index >= 0 && index < furniture.length) {
      furniture.splice(index, 1);
      return { furniture, selectedFurniture: null };
    }
    return {};
  }),
}))

export default usePlannerStore 