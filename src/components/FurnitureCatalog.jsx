import { useState } from 'react'
import { furnitureCatalog, categories } from '../models/furnitureCatalog'
import usePlannerStore from '../store/plannerStore'
import { createFurnitureInstance } from '../utils/furnitureUtils'

export default function FurnitureCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { addFurniture, setMode } = usePlannerStore()
  
  // Filter furniture by category
  const filteredFurniture = selectedCategory === 'all' 
    ? furnitureCatalog 
    : furnitureCatalog.filter(item => item.category === selectedCategory)
  
  // Add furniture to the scene
  const handleAddFurniture = (item) => {
    // Позиционируем мебель в центре комнаты
    const position = [0, 0, 0]
    const newFurniture = createFurnitureInstance(item, position)
    
    addFurniture(newFurniture)
    setMode('view') // Перевести в режим просмотра для взаимодействия
  }
  
  return (
    <div className="furniture-catalog">
      <h3>Мебельный каталог</h3>
      
      {/* Category filter */}
      <div className="category-filter">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''} 
          onClick={() => setSelectedCategory('all')}
        >
          Все
        </button>
        {categories.map(category => (
          <button 
            key={category.id} 
            className={selectedCategory === category.id ? 'active' : ''}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Furniture items */}
      <div className="furniture-grid">
        {filteredFurniture.map(item => (
          <div 
            key={item.id} 
            className="furniture-item"
            onClick={() => handleAddFurniture(item)}
          >
            <div 
              className="furniture-preview" 
              style={{ 
                backgroundColor: item.color,
                width: `${Math.min(item.dimensions.width * 30, 100)}px`,
                height: `${Math.min(item.dimensions.height * 30, 100)}px`
              }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 