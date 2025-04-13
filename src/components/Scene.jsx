import { useEffect } from "react";
import usePlannerStore from "../store/plannerStore";
import Room from "./Room";
import Furniture from "./Furniture";
import { useThree } from "@react-three/fiber";

export default function Scene() {
  const { furniture, setMode, viewMode, setSelectedFurniture } =
    usePlannerStore();
  const { gl } = useThree();

  // Set appropriate mode when component mounts or view mode changes
  useEffect(() => {
    // When switching to 2D mode, set to 'edit' mode for wall resizing
    // When switching to 3D mode, set to 'view' mode for normal interaction
    setMode(viewMode === "2D" ? "edit" : "view");
  }, [setMode, viewMode]);

  // Обработчик клика на пустое место в сцене для отмены выбора мебели
  const handleSceneClick = (e) => {
    // Проверяем, что клик произошел не на мебели и не на стенах
    if (
      e.object.userData &&
      e.object.userData.type !== "furniture" &&
      e.object.userData.type !== "wall"
    ) {
      console.log("Клик на пустое место в сцене, отмена выбора мебели");
      setSelectedFurniture(null);
    }
  };

  return (
    <group onClick={handleSceneClick}>
      <Room />

      {/* Render all furniture items */}
      {furniture.map((item, index) => (
        <Furniture key={item.id} item={item} index={index} />
      ))}

      {/* Невидимая плоскость под всей сценой для отслеживания кликов */}
      <mesh
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        userData={{ type: "floor" }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
