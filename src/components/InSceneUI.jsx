import { Html } from '@react-three/drei'
import usePlannerStore from '../store/plannerStore'

export default function InSceneUI() {
  const { viewMode } = usePlannerStore()

  return (
    <Html
      position={[0, 0, 0]}
      wrapperClass="scene-ui-wrapper"
      prepend
      center
      fullscreen
    >
      <div className="scene-ui">
        <div className="scene-mode-indicator">
          {viewMode === '2D' ? '2D Top View' : '3D View'}
        </div>
      </div>
    </Html>
  )
} 