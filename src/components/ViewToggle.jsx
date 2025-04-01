import usePlannerStore from '../store/plannerStore'

export default function ViewToggle() {
  const { viewMode, setViewMode, setRotationEnabled } = usePlannerStore()

  // Toggle between 2D and 3D views
  const toggleViewMode = () => {
    const newMode = viewMode === '3D' ? '2D' : '3D'
    setViewMode(newMode)
    
    // При переключении в 2D режим отключаем вращение камеры
    if (newMode === '2D') {
      setRotationEnabled(false)
    }
  }

  return (
    <div className="view-toggle">
      <button className="view-toggle-btn" onClick={toggleViewMode}>
        Switch to {viewMode === '3D' ? '2D' : '3D'}
      </button>
    </div>
  )
} 