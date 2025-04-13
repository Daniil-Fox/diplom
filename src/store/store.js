import { create } from "zustand";

const useStore = create((set) => ({
  // Размеры комнаты
  roomWidth: 5,
  roomLength: 4,
  setRoomDimensions: (width, length) =>
    set({ roomWidth: width, roomLength: length }),

  // Режим просмотра
  viewMode: "3D",
  setViewMode: (mode) => set({ viewMode: mode }),

  // Выбранный элемент
  selectedItem: null,
  setSelectedItem: (item) => set({ selectedItem: item }),

  // Список мебели в комнате
  furniture: [],
  addFurniture: (item) =>
    set((state) => ({ furniture: [...state.furniture, item] })),
  removeFurniture: (id) =>
    set((state) => ({
      furniture: state.furniture.filter((item) => item.id !== id),
    })),
  updateFurniture: (id, updates) =>
    set((state) => ({
      furniture: state.furniture.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  // Текстуры
  wallTexture: null,
  floorTexture: null,
  setWallTexture: (texture) => set({ wallTexture: texture }),
  setFloorTexture: (texture) => set({ floorTexture: texture }),
}));

export default useStore;
