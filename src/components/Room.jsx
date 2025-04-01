import { useEffect, useRef, useState } from 'react'
import usePlannerStore from '../store/plannerStore'
import { Html, Box, Cone } from '@react-three/drei'
import { Vector3 } from 'three'

export default function Room() {
  const { roomDimensions, updateRoomDimension, viewMode, selectedWall, setSelectedWall } = usePlannerStore()
  const { width, length, height } = roomDimensions
  const wallsRef = useRef()
  
  // Wall refs for selection and resizing
  const northWallRef = useRef()
  const southWallRef = useRef()
  const eastWallRef = useRef()
  const westWallRef = useRef()
  const floorRef = useRef()
  
  // Hover states for walls
  const [hoveredWall, setHoveredWall] = useState(null)
  // Resize arrow states
  const [isDraggingArrow, setIsDraggingArrow] = useState(false)
  const dragStartPos = useRef(null)
  const dragStartDimension = useRef(null)

  // Handle wall selection
  const handleWallClick = (wall) => {
    if (viewMode === '2D') {
      setSelectedWall(wall === selectedWall ? null : wall)
    }
  }

  // Update wall positions when dimensions change
  useEffect(() => {
    if (wallsRef.current) {
      wallsRef.current.position.y = height / 2
    }
  }, [height, width, length])

  // Get arrow position and rotation based on selected wall
  const getArrowProps = () => {
    if (!selectedWall) return null;
    
    let position, direction, dimension;
    
    switch(selectedWall) {
      case 'north':
        position = [0, 0, -length/2 - 0.5];
        direction = [0, 0, -1];
        dimension = 'length';
        break;
      case 'south':
        position = [0, 0, length/2 + 0.5];
        direction = [0, 0, 1];
        dimension = 'length';
        break;
      case 'east':
        position = [width/2 + 0.5, 0, 0];
        direction = [1, 0, 0];
        dimension = 'width';
        break;
      case 'west':
        position = [-width/2 - 0.5, 0, 0];
        direction = [-1, 0, 0];
        dimension = 'width';
        break;
      default:
        return null;
    }
    
    return { position, direction, dimension };
  }

  // Handle arrow drag start
  const handleArrowDragStart = (e, dimension) => {
    e.stopPropagation();
    setIsDraggingArrow(true);
    dragStartPos.current = e.point.clone();
    dragStartDimension.current = { 
      dimension, 
      value: dimension === 'width' ? width : length 
    };
    
    // Add global event listeners for drag and release
    window.addEventListener('mousemove', handleArrowDrag);
    window.addEventListener('mouseup', handleArrowDragEnd);
  }
  
  // Handle arrow dragging
  const handleArrowDrag = (e) => {
    if (!isDraggingArrow || !dragStartPos.current || !dragStartDimension.current) return;
    
    const { dimension } = dragStartDimension.current;
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    // Calculate delta based on mouse movement and dimension
    let delta = 0;
    if (dimension === 'width') {
      delta = mouseX * 0.2; // Scale factor to control sensitivity
    } else {
      delta = -mouseY * 0.2; // Scale factor to control sensitivity
    }
    
    // Apply delta to the original dimension
    let newValue = dragStartDimension.current.value + delta;
    
    // Enforce minimum size
    newValue = Math.max(newValue, 1);
    
    // Update dimension if changed
    if (newValue !== (dimension === 'width' ? width : length)) {
      updateRoomDimension(dimension, newValue);
    }
  }
  
  // Handle arrow drag end
  const handleArrowDragEnd = () => {
    setIsDraggingArrow(false);
    dragStartPos.current = null;
    
    // Remove global event listeners
    window.removeEventListener('mousemove', handleArrowDrag);
    window.removeEventListener('mouseup', handleArrowDragEnd);
  }

  // Render resize arrow if a wall is selected in 2D mode
  const renderResizeArrow = () => {
    if (viewMode !== '2D' || !selectedWall) return null;
    
    const arrowProps = getArrowProps();
    if (!arrowProps) return null;
    
    const { position, direction, dimension } = arrowProps;
    
    // Calculate the rotation quaternion based on direction
    const dirVector = new Vector3(...direction);
    
    return (
      <group position={position}>
        {/* Arrow stem */}
        <Box 
          args={[0.2, 0.2, 1]} 
          position={[direction[0] * 0.5, direction[1] * 0.5, direction[2] * 0.5]} 
          lookAt={dirVector.add(new Vector3(...position))}
          onPointerDown={(e) => handleArrowDragStart(e, dimension)}
          onPointerOver={() => document.body.style.cursor = 'grab'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <meshStandardMaterial color="#2196f3" />
        </Box>
        
        {/* Arrow head */}
        <Cone 
          args={[0.3, 0.5, 8]} 
          position={[direction[0] * 1, direction[1] * 1, direction[2] * 1]} 
          rotation={direction[0] !== 0 ? [0, 0, Math.PI/2 * -direction[0]] : [direction[2] === 1 ? Math.PI : 0, 0, 0]}
          onPointerDown={(e) => handleArrowDragStart(e, dimension)}
          onPointerOver={() => document.body.style.cursor = 'grab'}
          onPointerOut={() => document.body.style.cursor = 'auto'}
        >
          <meshStandardMaterial color="#2196f3" />
        </Cone>
      </group>
    );
  };

  return (
    <group ref={wallsRef}>
      {/* Floor */}
      <mesh 
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -height / 2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* North wall (back wall) */}
      <mesh 
        ref={northWallRef}
        position={[0, 0, -length / 2]} 
        receiveShadow
        onClick={() => handleWallClick('north')}
        onPointerOver={() => viewMode === '2D' && setHoveredWall('north')}
        onPointerOut={() => setHoveredWall(null)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={hoveredWall === 'north' || selectedWall === 'north' ? '#aaccff' : '#ffffff'} 
        />
      </mesh>

      {/* South wall (front wall) */}
      <mesh 
        ref={southWallRef}
        position={[0, 0, length / 2]} 
        rotation={[0, Math.PI, 0]}
        receiveShadow
        onClick={() => handleWallClick('south')}
        onPointerOver={() => viewMode === '2D' && setHoveredWall('south')}
        onPointerOut={() => setHoveredWall(null)}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          color={hoveredWall === 'south' || selectedWall === 'south' ? '#aaccff' : '#ffffff'} 
          opacity={viewMode === '3D' ? 0.3 : 1}
          transparent={viewMode === '3D'}
        />
      </mesh>

      {/* East wall (right wall) */}
      <mesh 
        ref={eastWallRef}
        position={[width / 2, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        receiveShadow
        onClick={() => handleWallClick('east')}
        onPointerOver={() => viewMode === '2D' && setHoveredWall('east')}
        onPointerOut={() => setHoveredWall(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={hoveredWall === 'east' || selectedWall === 'east' ? '#aaccff' : '#f5f5f5'} 
        />
      </mesh>

      {/* West wall (left wall) */}
      <mesh 
        ref={westWallRef}
        position={[-width / 2, 0, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        receiveShadow
        onClick={() => handleWallClick('west')}
        onPointerOver={() => viewMode === '2D' && setHoveredWall('west')}
        onPointerOut={() => setHoveredWall(null)}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial 
          color={hoveredWall === 'west' || selectedWall === 'west' ? '#aaccff' : '#f5f5f5'} 
        />
      </mesh>

      {/* Resize arrow */}
      {renderResizeArrow()}
    </group>
  )
} 