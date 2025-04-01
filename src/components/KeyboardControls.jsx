import { useEffect } from 'react'
import usePlannerStore from '../store/plannerStore'

export default function KeyboardControls() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Игнорируем нажатия, если фокус в input или textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return
      }

      const store = usePlannerStore.getState()
      
      // Переключение режима вращения камеры по клавише R
      if (e.key.toLowerCase() === 'r' && store.setRotationEnabled) {
        e.preventDefault() // Предотвращаем стандартное поведение клавиши
        store.setRotationEnabled(!store.rotationEnabled)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return null // Этот компонент не рендерит никакого UI
} 