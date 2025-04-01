import { OrbitControls } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import usePlannerStore from '../store/plannerStore'
import * as THREE from 'three'

// Константы для кнопок мыши в OrbitControls
const MOUSE_BUTTONS = {
  NONE: 0,
  ROTATE: 1,
  PAN: 2
};

export default function CustomControls() {
  const { camera } = useThree()
  const controlsRef = useRef()
  const [viewMode, setViewMode] = useState('3D')
  const [rotationEnabled, setRotationEnabled] = useState(false)
  
  // Add a new state to the store if needed
  useEffect(() => {
    const store = usePlannerStore.getState()
    if (store.rotationEnabled === undefined) {
      usePlannerStore.setState({ 
        rotationEnabled: false,
        setRotationEnabled: (enabled) => usePlannerStore.setState({ rotationEnabled: enabled })
      })
    }
  }, [])
  
  // Subscribe to store changes
  useEffect(() => {
    const unsubscribeViewMode = usePlannerStore.subscribe(
      state => setViewMode(state.viewMode)
    )
    
    const unsubscribeRotation = usePlannerStore.subscribe(
      state => {
        if (state.rotationEnabled !== undefined) {
          setRotationEnabled(state.rotationEnabled)
        }
      }
    )
    
    return () => {
      unsubscribeViewMode()
      unsubscribeRotation()
    }
  }, [])
  
  // Set initial camera position
  useEffect(() => {
    // Initial position of camera
    if (viewMode === '2D') {
      // Устанавливаем камеру строго над сценой
      camera.position.set(0, 15, 0)
      camera.up.set(0, 0, -1) // Важно для правильной ориентации в 2D
      camera.lookAt(0, 0, 0)
    } else {
      camera.position.set(8, 8, 8)
      camera.up.set(0, 1, 0)
      camera.lookAt(0, 0, 0)
    }
  }, [])
  
  // Update camera and controls based on view mode
  useEffect(() => {
    if (controlsRef.current) {
      if (viewMode === '2D') {
        // Полный сброс для правильного 2D вида
        // 1. Сначала сбрасываем контролы
        controlsRef.current.reset()
        
        // 2. Устанавливаем камеру строго перпендикулярно сцене
        camera.position.set(0, 15, 0)
        camera.up.set(0, 0, -1) // Устанавливаем вектор "вверх" для правильной ориентации
        
        // 3. Принудительно задаем углы поворота
        const euler = new THREE.Euler(-Math.PI/2, 0, 0, 'XYZ')
        camera.quaternion.setFromEuler(euler)
        
        // 4. Убеждаемся, что камера смотрит на центр сцены
        camera.lookAt(0, 0, 0)
        
        // 5. Отключаем вращение в 2D режиме
        controlsRef.current.enableRotate = false
        
        // 6. Настраиваем кнопки мыши
        controlsRef.current.mouseButtons = {
          LEFT: THREE.MOUSE.PAN, 
          MIDDLE: THREE.MOUSE.PAN,
          RIGHT: THREE.MOUSE.PAN
        }
      } else {
        // 3D perspective view
        camera.up.set(0, 1, 0) // Стандартный вектор "вверх"
        camera.position.set(8, 8, 8)
        camera.lookAt(0, 0, 0)
        
        // Enable rotation
        controlsRef.current.enableRotate = true
        
        // Configure mouse buttons
        controlsRef.current.mouseButtons = {
          LEFT: rotationEnabled ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.ROTATE,
          RIGHT: THREE.MOUSE.PAN
        }
      }
      
      // Update controls
      controlsRef.current.update()
    }
  }, [viewMode, rotationEnabled, camera])
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.1}
      minDistance={5}
      maxDistance={30}
      makeDefault
      target={[0, 0, 0]}
      enablePan={true}
      enableZoom={true}
      enableRotate={viewMode === '3D'}
    />
  )
} 