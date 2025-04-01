import { Canvas } from '@react-three/fiber'
import { Grid, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Scene from './components/Scene'
import FurnitureCatalog from './components/FurnitureCatalog'
import Instructions from './components/Instructions'
import CustomControls from './components/CustomControls'
import ViewToggle from './components/ViewToggle'
import RotationToggle from './components/RotationToggle'
import InSceneUI from './components/InSceneUI'
import KeyboardControls from './components/KeyboardControls'
import usePlannerStore from './store/plannerStore'
import './App.css'

function App() {
  const { viewMode } = usePlannerStore()
  
  return (
    <div className="app">
      <KeyboardControls />
      <div className="canvas-container">
        <Canvas
          shadows
          camera={{
            position: [10, 10, 10],
            fov: 45
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[2.5, 8, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            
            {/* Grid helper */}
            <Grid
              position={[0, -0.01, 0]} 
              args={[100, 100]}
              cellSize={1}
              cellThickness={1}
              cellColor="#6f6f6f"
              sectionSize={3}
            />

            {/* Scene with Room and Furniture */}
            <Scene />

            {/* Custom controls based on view mode */}
            <CustomControls />
          </Suspense>
          <Environment preset="city" />
        </Canvas>
        
        {/* UI Overlays */}
        <ViewToggle />
        {viewMode === '3D' && <RotationToggle />}
        <Instructions />
        <FurnitureCatalog />
      </div>
    </div>
  )
}

export default App
