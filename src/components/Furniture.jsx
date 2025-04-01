import { useRef, useState, useEffect } from 'react'
import usePlannerStore from '../store/plannerStore'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export default function Furniture({ item, index }) {
  const { camera, gl } = useThree()
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPositionRef = useRef(new THREE.Vector3())
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0))
  const intersectionPointRef = useRef(new THREE.Vector3())
  const raycaster = useRef(new THREE.Raycaster())
  const pointer = useRef(new THREE.Vector2())
  
  // Get store functions
  const store = usePlannerStore.getState()
  const {
    selectedFurniture,
    setSelectedFurniture,
    viewMode,
    mode
  } = usePlannerStore()
  
  const isSelected = selectedFurniture === index
  
  // Make sure store has the necessary functions
  useEffect(() => {
    // Add necessary functions if they don't exist
    if (!store.updateFurniturePosition) {
      usePlannerStore.setState({
        updateFurniturePosition: (index, x, z) => {
          const furniture = [...usePlannerStore.getState().furniture];
          if (furniture[index]) {
            furniture[index] = { ...furniture[index], x, z };
            usePlannerStore.setState({ furniture });
          }
        }
      });
    }
    
    if (!store.updateFurnitureRotation) {
      usePlannerStore.setState({
        updateFurnitureRotation: (index, rotation) => {
          const furniture = [...usePlannerStore.getState().furniture];
          if (furniture[index]) {
            furniture[index] = { ...furniture[index], rotation };
            usePlannerStore.setState({ furniture });
          }
        }
      });
    }
    
    if (!store.deleteFurniture) {
      usePlannerStore.setState({
        deleteFurniture: (index) => {
          const furniture = [...usePlannerStore.getState().furniture];
          furniture.splice(index, 1);
          usePlannerStore.setState({ furniture });
        }
      });
    }
  }, []);
  
  // Update position and rotation when they change
  useEffect(() => {
    if (ref.current) {
      ref.current.position.set(item.x || 0, item.height / 2, item.z || 0)
      ref.current.rotation.y = item.rotation || 0
    }
  }, [item.x, item.z, item.height, item.rotation])
  
  // Set up event handlers
  const handlePointerDown = (e) => {
    if (mode === 'view') return
    
    e.stopPropagation()
    
    // Select this furniture item
    setSelectedFurniture(index)
    
    // Start dragging process
    setIsDragging(true)
    
    // Save starting position
    dragStartPositionRef.current.copy(ref.current.position)
    
    // Create drag plane
    const normal = new THREE.Vector3(0, 1, 0)
    dragPlaneRef.current = new THREE.Plane(normal, -ref.current.position.y)
    
    // Capture mouse position at start of drag
    pointer.current.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    )
    
    // Add global event listeners
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    
    // Change cursor to grabbing
    gl.domElement.style.cursor = 'grabbing'
  }
  
  const handlePointerMove = (e) => {
    if (!isDragging) return
    
    // Update pointer coordinates
    pointer.current.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    )
  }
  
  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false)
      
      // Remove global event listeners
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      
      // Reset cursor
      gl.domElement.style.cursor = hovered ? 'grab' : 'auto'
    }
  }
  
  // Handle hover state
  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHovered(true)
    if (!isDragging && mode !== 'view') {
      gl.domElement.style.cursor = 'grab'
    }
  }
  
  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHovered(false)
    if (!isDragging) {
      gl.domElement.style.cursor = 'auto'
    }
  }
  
  // Process keyboard events for rotation and deletion
  useEffect(() => {
    if (!isSelected) return
    
    const handleKeyDown = (e) => {
      if (isSelected) {
        const store = usePlannerStore.getState();
        if (e.key === 'r' || e.key === 'R') {
          // Rotate 90 degrees
          if (store.updateFurnitureRotation) {
            store.updateFurnitureRotation(index, (item.rotation || 0) + Math.PI / 2);
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          // Delete furniture
          if (store.deleteFurniture) {
            store.deleteFurniture(index);
          }
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSelected, index, item.rotation])
  
  // Update position while dragging
  useFrame(() => {
    if (isDragging) {
      // Cast ray from camera to pointer
      raycaster.current.setFromCamera(pointer.current, camera)
      
      // Find intersection with the drag plane
      if (raycaster.current.ray.intersectPlane(dragPlaneRef.current, intersectionPointRef.current)) {
        // Update furniture position in store
        const store = usePlannerStore.getState();
        if (store.updateFurniturePosition) {
          store.updateFurniturePosition(index, intersectionPointRef.current.x, intersectionPointRef.current.z);
        }
      }
    }
  })
  
  // Item color based on selection/hover state
  const color = isSelected ? '#2196f3' : (hovered ? '#64b5f6' : item.color || '#e0e0e0')
  
  return (
    <group 
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh receiveShadow castShadow>
        <boxGeometry args={[item.width, item.height, item.depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Label for the furniture item */}
      {viewMode === '2D' && (
        <Html position={[0, item.height / 2 + 0.2, 0]} center>
          <div style={{ 
            background: 'rgba(0,0,0,0.7)', 
            color: 'white', 
            padding: '2px 5px', 
            borderRadius: '3px',
            fontSize: '10px',
            pointerEvents: 'none'
          }}>
            {item.name}
          </div>
        </Html>
      )}
    </group>
  )
} 
