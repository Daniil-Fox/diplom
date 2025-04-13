import { useEffect, useRef, useState } from "react";
import usePlannerStore from "../store/plannerStore";
import { Html, Box, Cone } from "@react-three/drei";
import { Vector3 } from "three";

export default function Room() {
  const {
    roomDimensions,
    updateRoomDimension,
    viewMode,
    selectedWall,
    setSelectedWall,
  } = usePlannerStore();
  const { width, length, height } = roomDimensions;
  const wallsRef = useRef();

  // Wall refs for selection and resizing
  const northWallRef = useRef();
  const southWallRef = useRef();
  const eastWallRef = useRef();
  const westWallRef = useRef();
  const floorRef = useRef();

  // Hover states for walls
  const [hoveredWall, setHoveredWall] = useState(null);
  // Resize arrow states
  const isDraggingArrowRef = useRef(false);
  const dragStartPos = useRef(null);
  const dragStartDimension = useRef(null);

  // Handle wall selection
  const handleWallClick = (wall) => {
    console.log(
      "handleWallClick called with wall:",
      wall,
      "viewMode:",
      viewMode
    );
    if (viewMode === "2D") {
      console.log(
        "Setting selected wall to:",
        wall === selectedWall ? null : wall
      );
      setSelectedWall(wall === selectedWall ? null : wall);
    }
  };

  // Update wall positions when dimensions change
  useEffect(() => {
    if (wallsRef.current) {
      wallsRef.current.position.y = height / 2;

      // Добавляем анимацию при изменении размеров

      // Сначала меняем цвет всех стен на короткое время
      const animateWalls = () => {
        // Сохраняем оригинальные цвета
        const northWallMaterial = northWallRef.current?.material;
        const southWallMaterial = southWallRef.current?.material;
        const eastWallMaterial = eastWallRef.current?.material;
        const westWallMaterial = westWallRef.current?.material;
        const floorMaterial = floorRef.current?.material;

        // Цвет анимации
        const animColor = "#e3f2fd";

        // Применяем цвет анимации, если материалы существуют
        if (northWallMaterial) northWallMaterial.color.set(animColor);
        if (southWallMaterial) southWallMaterial.color.set(animColor);
        if (eastWallMaterial) eastWallMaterial.color.set(animColor);
        if (westWallMaterial) westWallMaterial.color.set(animColor);
        if (floorMaterial) floorMaterial.color.set("#dcedc8");

        // Возвращаем оригинальные цвета через небольшую задержку
        setTimeout(() => {
          // Восстанавливаем оригинальные цвета для стен, не являющихся выбранными
          if (northWallMaterial) {
            northWallMaterial.color.set(
              selectedWall === "north" ? "#aaccff" : "#ffffff"
            );
          }
          if (southWallMaterial) {
            southWallMaterial.color.set(
              selectedWall === "south" ? "#aaccff" : "#ffffff"
            );
          }
          if (eastWallMaterial) {
            eastWallMaterial.color.set(
              selectedWall === "east" ? "#aaccff" : "#f5f5f5"
            );
          }
          if (westWallMaterial) {
            westWallMaterial.color.set(
              selectedWall === "west" ? "#aaccff" : "#f5f5f5"
            );
          }
          if (floorMaterial) {
            floorMaterial.color.set("#f0f0f0");
          }
        }, 300);
      };

      // Запускаем анимацию
      animateWalls();
    }
  }, [height, width, length, selectedWall]);

  // Get arrow position and rotation based on selected wall
  const getArrowProps = () => {
    if (!selectedWall) return null;

    let position, direction, dimension;

    switch (selectedWall) {
      case "north":
        position = [0, 0, -length / 2 - 0.5];
        direction = [0, 0, -1];
        dimension = "length";
        break;
      case "south":
        position = [0, 0, length / 2 + 0.5];
        direction = [0, 0, 1];
        dimension = "length";
        break;
      case "east":
        position = [width / 2 + 0.5, 0, 0];
        direction = [1, 0, 0];
        dimension = "width";
        break;
      case "west":
        position = [-width / 2 - 0.5, 0, 0];
        direction = [-1, 0, 0];
        dimension = "width";
        break;
      default:
        return null;
    }

    return { position, direction, dimension };
  };

  // Handle arrow drag start
  const handleArrowDragStart = (e, { dimension }) => {
    console.log("handleArrowDragStart called with dimension:", dimension);
    e.stopPropagation();

    // Создаем глобальное событие, чтобы другие обработчики не мешали
    const event = new CustomEvent("arrow-drag-start", {
      detail: { dimension },
    });
    window.dispatchEvent(event);

    // Убеждаемся, что мы в режиме 2D и редактирования
    if (viewMode !== "2D") {
      console.log("Not in 2D mode, ignoring drag");
      return;
    }

    // Устанавливаем состояние перетаскивания
    isDraggingArrowRef.current = true;
    console.log("isDraggingArrow установлен в:", isDraggingArrowRef.current);

    // Сохраняем начальную точку и размер
    if (e.point) {
      dragStartPos.current = e.point.clone();
    } else if (e.intersections && e.intersections.length > 0) {
      dragStartPos.current = e.intersections[0].point.clone();
    } else {
      console.error("No point data available in event", e);
      dragStartPos.current = {
        x: 0,
        y: 0,
        z: 0,
        clone: () => dragStartPos.current,
      };
    }

    dragStartDimension.current = {
      dimension,
      value: dimension === "width" ? width : length,
    };
    console.log("Drag start data:", {
      point: dragStartPos.current,
      dimension,
      value: dimension === "width" ? width : length,
    });

    // Изменяем стиль курсора
    document.body.style.cursor = "grabbing";

    // Add global event listeners for drag and release
    window.addEventListener("mousemove", handleArrowDrag);
    window.addEventListener("mouseup", handleArrowDragEnd);
    // Добавляем обработчики touchmove и touchend для мобильных устройств
    window.addEventListener("touchmove", handleArrowDrag);
    window.addEventListener("touchend", handleArrowDragEnd);
  };

  // Handle arrow drag end
  const handleArrowDragEnd = () => {
    console.log("handleArrowDragEnd called");

    // Создаем глобальное событие завершения перетаскивания
    const event = new CustomEvent("arrow-drag-end");
    window.dispatchEvent(event);

    isDraggingArrowRef.current = false;
    dragStartPos.current = null;
    dragStartDimension.current = null;

    // Восстанавливаем стиль курсора
    document.body.style.cursor = "auto";

    // Remove global event listeners
    window.removeEventListener("mousemove", handleArrowDrag);
    window.removeEventListener("mouseup", handleArrowDragEnd);
    // Удаляем обработчики touchmove и touchend
    window.removeEventListener("touchmove", handleArrowDrag);
    window.removeEventListener("touchend", handleArrowDragEnd);
  };

  // Handle arrow dragging
  const handleArrowDrag = (e) => {
    console.log("handleArrowDrag called", {
      isDragging: isDraggingArrowRef.current,
      startPos: dragStartPos.current,
      startDim: dragStartDimension.current,
    });

    // Создаем глобальное событие перетаскивания
    const event = new CustomEvent("arrow-dragging");
    window.dispatchEvent(event);

    if (
      !isDraggingArrowRef.current ||
      !dragStartPos.current ||
      !dragStartDimension.current
    )
      return;

    // Получаем координаты мыши или сенсорного события
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      // Сенсорное событие
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Событие мыши
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const { dimension } = dragStartDimension.current;

    // Используем разные подходы в зависимости от направления стены
    let newValue;

    if (dimension === "width") {
      // Для боковых стен (east/west) используем смещение по X
      const screenX = clientX / window.innerWidth; // нормализуем к [0, 1]

      // Преобразуем координаты экрана в значение размера
      // Для width 10 единиц примерно соответствуют полной ширине экрана
      if (selectedWall === "east") {
        // При перетаскивании east wall вправо - увеличиваем размер
        newValue = dragStartDimension.current.value + (screenX - 0.5) * 20;
      } else {
        // west wall
        // При перетаскивании west wall влево - увеличиваем размер
        newValue = dragStartDimension.current.value - (screenX - 0.5) * 20;
      }
    } else {
      // для dimension === "length"
      // Для передней/задней стен (north/south) используем смещение по Y
      const screenY = clientY / window.innerHeight; // нормализуем к [0, 1]

      // Преобразуем координаты экрана в значение размера
      if (selectedWall === "north") {
        // При перетаскивании north wall вверх - увеличиваем размер
        newValue = dragStartDimension.current.value - (screenY - 0.5) * 20;
      } else {
        // south wall
        // При перетаскивании south wall вниз - увеличиваем размер
        newValue = dragStartDimension.current.value + (screenY - 0.5) * 20;
      }
    }

    // Enforce minimum size
    newValue = Math.max(newValue, 1);

    // Максимальный размер комнаты
    newValue = Math.min(newValue, 20);

    // Округляем до 1 десятичного знака для более плавного изменения
    newValue = Math.round(newValue * 10) / 10;

    console.log("New dimension value:", {
      dimension,
      newValue,
      currentValue: dimension === "width" ? width : length,
    });

    // Update dimension if changed
    if (Math.abs(newValue - (dimension === "width" ? width : length)) >= 0.1) {
      console.log("Calling updateRoomDimension with:", dimension, newValue);
      updateRoomDimension(dimension, newValue);
    }
  };

  // Render resize arrow if a wall is selected in 2D mode
  const renderResizeArrow = () => {
    if (viewMode !== "2D" || !selectedWall) return null;

    console.log("Rendering resize arrow for wall:", selectedWall);

    const arrowProps = getArrowProps();
    if (!arrowProps) return null;

    const { position, direction, dimension } = arrowProps;

    return (
      <group
        position={position}
        onPointerDown={(e) => handleArrowDragStart(e, { dimension })}
      >
        {/* Arrow body */}
        <Box args={[0.2, 0.2, 2]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#2196f3"
            emissive="#0d47a1"
            emissiveIntensity={0.8}
          />
        </Box>

        {/* Arrow head */}
        <Cone
          args={[0.4, 0.6, 8]}
          position={[
            direction[0] * 1.2,
            direction[1] * 1.2,
            direction[2] * 1.2,
          ]}
          rotation={
            direction[0] !== 0
              ? [0, 0, (Math.PI / 2) * -direction[0]]
              : [direction[2] === 1 ? Math.PI : 0, 0, 0]
          }
        >
          <meshStandardMaterial
            color="#2196f3"
            emissive="#0d47a1"
            emissiveIntensity={0.8}
          />
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
        userData={{ type: "floor" }}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* North wall (back wall) */}
      <mesh
        ref={northWallRef}
        position={[0, 0, -length / 2]}
        receiveShadow
        onClick={(e) => {
          console.log("North wall clicked", e);
          handleWallClick("north");
        }}
        onPointerOver={() => {
          console.log("North wall pointer over");
          viewMode === "2D" && setHoveredWall("north");
        }}
        onPointerOut={() => {
          console.log("North wall pointer out");
          setHoveredWall(null);
        }}
        userData={{ type: "wall", wall: "north" }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={
            hoveredWall === "north" || selectedWall === "north"
              ? "#aaccff"
              : "#ffffff"
          }
        />
      </mesh>

      {/* South wall (front wall) */}
      <mesh
        ref={southWallRef}
        position={[0, 0, length / 2]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
        onClick={() => handleWallClick("south")}
        onPointerOver={() => viewMode === "2D" && setHoveredWall("south")}
        onPointerOut={() => setHoveredWall(null)}
        userData={{ type: "wall", wall: "south" }}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={
            hoveredWall === "south" || selectedWall === "south"
              ? "#aaccff"
              : "#ffffff"
          }
          opacity={viewMode === "3D" ? 0.3 : 1}
          transparent={viewMode === "3D"}
        />
      </mesh>

      {/* East wall (right wall) */}
      <mesh
        ref={eastWallRef}
        position={[width / 2, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        onClick={() => handleWallClick("east")}
        onPointerOver={() => viewMode === "2D" && setHoveredWall("east")}
        onPointerOut={() => setHoveredWall(null)}
        userData={{ type: "wall", wall: "east" }}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          color={
            hoveredWall === "east" || selectedWall === "east"
              ? "#aaccff"
              : "#f5f5f5"
          }
        />
      </mesh>

      {/* West wall (left wall) */}
      <mesh
        ref={westWallRef}
        position={[-width / 2, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        onClick={() => handleWallClick("west")}
        onPointerOver={() => viewMode === "2D" && setHoveredWall("west")}
        onPointerOut={() => setHoveredWall(null)}
        userData={{ type: "wall", wall: "west" }}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          color={
            hoveredWall === "west" || selectedWall === "west"
              ? "#aaccff"
              : "#f5f5f5"
          }
        />
      </mesh>

      {/* Resize arrow */}
      {renderResizeArrow()}
    </group>
  );
}
