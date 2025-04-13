import { useRef, useState, useEffect } from "react";
import usePlannerStore from "../store/plannerStore";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function Furniture({ item, index }) {
  const { camera, gl } = useThree();
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPositionRef = useRef(new THREE.Vector3());
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const intersectionPointRef = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());
  const pointer = useRef(new THREE.Vector2());

  // Get store functions
  const store = usePlannerStore.getState();
  const { selectedFurniture, setSelectedFurniture, viewMode, mode } =
    usePlannerStore();

  const isSelected = selectedFurniture === index;

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
        },
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
        },
      });
    }

    if (!store.deleteFurniture) {
      usePlannerStore.setState({
        deleteFurniture: (index) => {
          const furniture = [...usePlannerStore.getState().furniture];
          furniture.splice(index, 1);
          usePlannerStore.setState({ furniture });
        },
      });
    }
  }, []);

  // Update position and rotation when they change
  useEffect(() => {
    if (ref.current) {
      const x = item.position?.x || 0;
      const z = item.position?.z || 0;
      const height = item.dimensions?.height || 1;
      const rotation = item.rotation?.y || 0;
      ref.current.position.set(x, height / 2, z);
      ref.current.rotation.y = rotation;
    }
  }, [
    item.position?.x,
    item.position?.z,
    item.dimensions?.height,
    item.rotation?.y,
  ]);

  // Set up event handlers
  const handlePointerDown = (e) => {
    // Разрешаем перетаскивание в любом режиме, убираем проверку на mode === "view"
    e.stopPropagation();

    // Select this furniture item
    setSelectedFurniture(index);

    // Start dragging process
    setIsDragging(true);

    // Создаем и диспетчеризируем событие начала перетаскивания мебели
    const dragStartEvent = new CustomEvent("furniture-drag-start", {
      detail: { index, item },
    });
    window.dispatchEvent(dragStartEvent);

    // Save starting position
    dragStartPositionRef.current.copy(ref.current.position);

    // Create drag plane
    const normal = new THREE.Vector3(0, 1, 0);
    dragPlaneRef.current = new THREE.Plane(normal, -ref.current.position.y);

    // Capture mouse position at start of drag
    pointer.current.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    );

    // Add global event listeners
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    // Change cursor to grabbing
    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    // Update pointer coordinates
    pointer.current.set(
      (e.clientX / gl.domElement.clientWidth) * 2 - 1,
      -(e.clientY / gl.domElement.clientHeight) * 2 + 1
    );
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);

      // Создаем и диспетчеризируем событие окончания перетаскивания мебели
      const dragEndEvent = new CustomEvent("furniture-drag-end", {
        detail: { index, item },
      });
      window.dispatchEvent(dragEndEvent);

      // Remove global event listeners
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);

      // Reset cursor
      gl.domElement.style.cursor = hovered ? "grab" : "auto";
    }
  };

  // Handle hover state
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    if (!isDragging && mode !== "view") {
      gl.domElement.style.cursor = "grab";
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    if (!isDragging) {
      gl.domElement.style.cursor = "auto";
    }
  };

  // Process keyboard events for rotation and deletion
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e) => {
      if (isSelected) {
        const store = usePlannerStore.getState();
        if (e.key === "r" || e.key === "R") {
          // Rotate 90 degrees
          if (store.updateFurnitureRotation) {
            store.updateFurnitureRotation(
              index,
              (item.rotation || 0) + Math.PI / 2
            );
          }
        } else if (e.key === "Delete" || e.key === "Backspace") {
          // Delete furniture
          if (store.deleteFurniture) {
            store.deleteFurniture(index);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, index, item.rotation]);

  // Update position while dragging
  useFrame(() => {
    if (isDragging) {
      // Обновляем raycaster с текущими координатами указателя
      raycaster.current.setFromCamera(pointer.current, camera);

      // Настраиваем плоскость перетаскивания в зависимости от режима просмотра
      if (viewMode === "2D") {
        // В 2D режиме перетаскиваем по горизонтальной плоскости
        const normal = new THREE.Vector3(0, 1, 0);
        dragPlaneRef.current.set(normal, -ref.current.position.y);
      } else {
        // В 3D режиме плоскость перпендикулярна направлению камеры
        // для более интуитивного перетаскивания с любого угла
        const camPosition = camera.position.clone();
        const objPosition = ref.current.position.clone();
        const direction = camPosition.sub(objPosition).normalize();

        // Создаем плоскость перпендикулярную направлению камеры,
        // проходящую через центр объекта
        dragPlaneRef.current.setFromNormalAndCoplanarPoint(
          direction,
          ref.current.position
        );
      }

      // Находим пересечение с плоскостью перетаскивания
      if (
        raycaster.current.ray.intersectPlane(
          dragPlaneRef.current,
          intersectionPointRef.current
        )
      ) {
        // Сохраняем высоту объекта неизменной
        const y = ref.current.position.y;

        // В 3D режиме нужно учитывать, что пересечение может быть не на уровне пола
        const curX = Math.round(intersectionPointRef.current.x * 10) / 10;
        const curZ = Math.round(intersectionPointRef.current.z * 10) / 10;

        // Проверяем, действительно ли координаты изменились
        if (
          curX !== Math.round(item.position?.x * 10) / 10 ||
          curZ !== Math.round(item.position?.z * 10) / 10
        ) {
          // Напрямую обновляем позицию в хранилище
          const store = usePlannerStore.getState();
          if (store.updateFurniturePosition) {
            store.updateFurniturePosition(index, curX, curZ);
          }

          // Непосредственно обновляем положение объекта для мгновенной обратной связи
          if (ref.current) {
            ref.current.position.set(curX, y, curZ);
          }
        }
      }
    }
  });

  // Item color based on selection/hover state
  const color = isSelected
    ? "#2196f3" // синий для выбранного объекта
    : hovered
    ? "#64b5f6"
    : item.color || "#e0e0e0";

  return (
    <group
      ref={ref}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      userData={{ type: "furniture", id: item.id, index }}
    >
      {/* Обычная версия для 3D режима */}
      <mesh
        receiveShadow
        castShadow
        visible={viewMode === "3D"}
        userData={{ type: "furniture", id: item.id, index }}
      >
        <boxGeometry
          args={[
            item.dimensions.width,
            item.dimensions.height,
            item.dimensions.depth,
          ]}
        />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Упрощенная версия для 2D режима */}
      <mesh
        receiveShadow
        visible={viewMode === "2D"}
        rotation={[-Math.PI / 2, 0, 0]}
        userData={{ type: "furniture", id: item.id, index }}
      >
        <planeGeometry args={[item.dimensions.width, item.dimensions.depth]} />
        <meshStandardMaterial color={color} transparent={true} opacity={0.8} />
      </mesh>

      {/* Label for the furniture item */}
      {viewMode === "2D" && (
        <Html position={[0, item.dimensions.height / 2 + 0.2, 0]} center>
          <div
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "2px 5px",
              borderRadius: "3px",
              fontSize: "10px",
              pointerEvents: "none",
            }}
          >
            {item.name}
          </div>
        </Html>
      )}
    </group>
  );
}
