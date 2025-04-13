import React, { useEffect } from "react";
import usePlannerStore from "../store/plannerStore";

const SceneInteraction = () => {
  const { activeToolType, activeToolData, clearActiveTool, viewMode } =
    usePlannerStore();

  useEffect(() => {
    const handleSceneClick = (event) => {
      if (!activeToolType || !activeToolData) return;

      // Получаем информацию о точке клика из события
      // В реальном приложении эти данные будут приходить из Three.js
      const intersection = {
        point: { x: event.clientX, y: 0, z: event.clientY },
        object: event.target.dataset.objectType,
      };

      switch (activeToolType) {
        case "wall":
          if (intersection.object === "wall") {
            activeToolData.applyTexture(intersection.object);
          }
          break;

        case "floor":
          if (intersection.object === "floor") {
            activeToolData.applyTexture();
          }
          break;

        case "furniture":
          if (viewMode === "3D") {
            activeToolData.addToScene(intersection.point);
            clearActiveTool();
          }
          break;

        default:
          break;
      }
    };

    // В 2D режиме слушаем клики на канвасе
    const canvas2D = document.querySelector(".planner-2d-canvas");
    if (canvas2D) {
      canvas2D.addEventListener("click", handleSceneClick);
    }

    // В 3D режиме слушаем клики на Three.js канвасе
    const canvas3D = document.querySelector(".planner-3d-canvas");
    if (canvas3D) {
      canvas3D.addEventListener("click", handleSceneClick);
    }

    return () => {
      if (canvas2D) {
        canvas2D.removeEventListener("click", handleSceneClick);
      }
      if (canvas3D) {
        canvas3D.removeEventListener("click", handleSceneClick);
      }
    };
  }, [activeToolType, activeToolData, clearActiveTool, viewMode]);

  return null; // Этот компонент не рендерит UI
};

export default SceneInteraction;
