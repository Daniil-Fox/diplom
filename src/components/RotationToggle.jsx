import usePlannerStore from '../store/plannerStore'
import { useState, useEffect } from 'react'

export default function RotationToggle() {
  const [rotationEnabled, setRotationEnabled] = useState(false)
  
  // Get rotation state from store and listen for changes
  useEffect(() => {
    // Try to get initial state
    const store = usePlannerStore.getState()
    if (store.rotationEnabled !== undefined) {
      setRotationEnabled(store.rotationEnabled)
    }
    
    // Set up subscription to store changes
    const unsubscribe = usePlannerStore.subscribe(
      state => {
        if (state.rotationEnabled !== undefined) {
          setRotationEnabled(state.rotationEnabled)
        }
      }
    )
    
    return () => unsubscribe()
  }, [])
  
  // Toggle rotation mode
  const toggleRotation = () => {
    const store = usePlannerStore.getState()
    const newRotationState = !rotationEnabled
    
    if (store.setRotationEnabled) {
      store.setRotationEnabled(newRotationState)
      
      // Update cursor style directly on the canvas element
      const canvas = document.querySelector('canvas')
      if (canvas) {
        if (newRotationState) {
          // Custom cursor for rotation mode
          canvas.style.cursor = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMykiLz48cGF0aCBkPSJNOCAxMmE0IDQgMCAxIDAgOCAwIDQgNCAwIDAgMC04IDB6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTEwIDZDNyA4IDcgMTYgMTAgMThNMTQgNmMzIDIgMyAxMCAwIDEyIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==), auto'
        } else {
          // Default cursor for pan mode
          canvas.style.cursor = 'auto'
        }
        
        // Focus the canvas to ensure events are captured correctly
        canvas.focus()
      }
    }
  }
  
  return (
    <div className="rotation-toggle">
      <button 
        className={`rotation-toggle-btn ${rotationEnabled ? 'active' : ''}`} 
        onClick={toggleRotation}
        title={rotationEnabled ? "Выключить вращение камеры" : "Включить вращение камеры"}
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M10 6C7 8 7 16 10 18M14 6c3 2 3 10 0 12" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
    </div>
  )
} 