import { v4 as uuidv4 } from 'uuid'

export function createFurnitureInstance(catalogItem, position = [0, 0, 0], rotation = 0) {
  // Извлекаем размеры из объекта каталога
  const { width, depth, height } = catalogItem.dimensions
  
  // Создаем расширенный объект мебели, совместимый с компонентом Furniture
  return {
    id: uuidv4(),
    catalogId: catalogItem.id,
    name: catalogItem.name,
    width: width,
    height: height,
    depth: depth,
    x: position[0],
    z: position[2],
    rotation: rotation,
    item: {
      name: catalogItem.name,
      width: width,
      height: height,
      depth: depth
    }
  }
} 