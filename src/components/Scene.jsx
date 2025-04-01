import { useEffect } from 'react'
import usePlannerStore from '../store/plannerStore'
import Room from './Room'
import Furniture from './Furniture'

export default function Scene() {
  const { furniture, setMode, viewMode } = usePlannerStore()
  
  // Set appropriate mode when component mounts or view mode changes
  useEffect(() => {
    // When switching to 2D mode, set to 'edit' mode for wall resizing
    // When switching to 3D mode, set to 'view' mode for normal interaction
    setMode(viewMode === '2D' ? 'edit' : 'view')
  }, [setMode, viewMode])

  return (
    <>
      <Room />
      
      {/* Render all furniture items */}
      {furniture.map((item, index) => (
        <Furniture
          key={item.id}
          item={item.item}
          index={index}
        />
      ))}
    </>
  )
} 