// Каталог мебели с их свойствами
const furnitureCatalog = [
  {
    id: 1,
    name: "Диван угловой",
    category: "furniture",
    type: "sofas",
    model: "/models/corner-sofa.glb",
    preview: "/previews/corner-sofa.png",
    dimensions: { width: 2.8, length: 2.2, height: 0.9 },
  },
  {
    id: 2,
    name: "Диван прямой",
    category: "furniture",
    type: "sofas",
    model: "/models/straight-sofa.glb",
    preview: "/previews/straight-sofa.png",
    dimensions: { width: 2.2, length: 0.9, height: 0.85 },
  },
  {
    id: 3,
    name: "Стул обеденный",
    category: "furniture",
    type: "chairs",
    model: "/models/dining-chair.glb",
    preview: "/previews/dining-chair.png",
    dimensions: { width: 0.45, length: 0.5, height: 0.95 },
  },
  {
    id: 4,
    name: "Кресло офисное",
    category: "furniture",
    type: "chairs",
    model: "/models/office-chair.glb",
    preview: "/previews/office-chair.png",
    dimensions: { width: 0.65, length: 0.68, height: 1.2 },
  },
  {
    id: 5,
    name: "Обои светлые",
    category: "textures",
    type: "wallpapers",
    texture: "/textures/light-wallpaper.jpg",
    preview: "/previews/light-wallpaper.png",
  },
  {
    id: 6,
    name: "Обои темные",
    category: "textures",
    type: "wallpapers",
    texture: "/textures/dark-wallpaper.jpg",
    preview: "/previews/dark-wallpaper.png",
  },
  {
    id: 7,
    name: "Паркет светлый",
    category: "textures",
    type: "flooring",
    texture: "/textures/light-parquet.jpg",
    preview: "/previews/light-parquet.png",
  },
  {
    id: 8,
    name: "Паркет темный",
    category: "textures",
    type: "flooring",
    texture: "/textures/dark-parquet.jpg",
    preview: "/previews/dark-parquet.png",
  },
];

export default furnitureCatalog;

// Категории мебели
export const categories = [
  { id: "livingRoom", name: "Гостиная" },
  { id: "diningRoom", name: "Столовая" },
  { id: "bedroom", name: "Спальня" },
  { id: "office", name: "Офис" },
  { id: "kitchen", name: "Кухня" },
];
