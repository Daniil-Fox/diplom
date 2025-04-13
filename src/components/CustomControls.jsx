import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import usePlannerStore from "../store/plannerStore";
import * as THREE from "three";

// Константы для кнопок мыши в OrbitControls
const MOUSE_BUTTONS = {
  NONE: 0,
  ROTATE: 1,
  PAN: 2,
};

export default function CustomControls() {
  const { camera } = useThree();
  const controlsRef = useRef();
  const [viewMode, setViewMode] = useState("3D");
  const [rotationEnabled, setRotationEnabled] = useState(false);

  // Add a new state to the store if needed
  useEffect(() => {
    const store = usePlannerStore.getState();
    if (store.rotationEnabled === undefined) {
      usePlannerStore.setState({
        rotationEnabled: false,
        setRotationEnabled: (enabled) =>
          usePlannerStore.setState({ rotationEnabled: enabled }),
      });
    }
  }, []);

  // Subscribe to store changes
  useEffect(() => {
    const unsubscribeViewMode = usePlannerStore.subscribe((state) =>
      setViewMode(state.viewMode)
    );

    const unsubscribeRotation = usePlannerStore.subscribe((state) => {
      if (state.rotationEnabled !== undefined) {
        setRotationEnabled(state.rotationEnabled);
      }
    });

    // Подписываемся на изменение выбранной мебели
    const unsubscribeFurniture = usePlannerStore.subscribe((state) => {
      if (controlsRef.current) {
        // Если выбран объект мебели, отключаем контролы камеры вне зависимости от режима
        if (state.selectedFurniture !== null) {
          console.log(
            `Мебель выбрана в режиме ${state.viewMode}, отключаем контроль камеры`
          );
          controlsRef.current.enabled = false;
        } else {
          // Если объект не выбран, включаем контролы камеры
          console.log(
            `Мебель не выбрана в режиме ${state.viewMode}, включаем контроль камеры`
          );
          controlsRef.current.enabled = true;
        }
      }
    });

    return () => {
      unsubscribeViewMode();
      unsubscribeRotation();
      unsubscribeFurniture();
    };
  }, []);

  // Set initial camera position
  useEffect(() => {
    // Initial position of camera
    if (viewMode === "2D") {
      // Устанавливаем камеру строго над сценой
      camera.position.set(0, 15, 0);
      camera.up.set(0, 0, -1); // Важно для правильной ориентации в 2D
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(8, 8, 8);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0, 0);
    }
  }, []);

  // Update camera and controls based on view mode
  useEffect(() => {
    console.log(
      "Updating camera for viewMode:",
      viewMode,
      "controlsRef exists:",
      !!controlsRef.current
    );

    if (controlsRef.current) {
      if (viewMode === "2D") {
        console.log("Setting up 2D camera mode");

        // Полный сброс для правильного 2D вида
        // 1. Сначала сбрасываем контролы
        controlsRef.current.reset();

        // 2. Устанавливаем камеру строго перпендикулярно сцене
        camera.position.set(0, 15, 0);
        camera.up.set(0, 0, -1); // Устанавливаем вектор "вверх" для правильной ориентации

        // 3. Принудительно задаем углы поворота
        const euler = new THREE.Euler(-Math.PI / 2, 0, 0, "XYZ");
        camera.quaternion.setFromEuler(euler);

        // 4. Убеждаемся, что камера смотрит на центр сцены
        camera.lookAt(0, 0, 0);

        // 5. Отключаем вращение в 2D режиме
        controlsRef.current.enableRotate = false;

        // 6. В 2D режиме панорамирование только при зажатой средней клавише или пробеле
        controlsRef.current.enablePan = true;

        // 7. Настраиваем кнопки мыши для 2D режима
        controlsRef.current.mouseButtons = {
          LEFT: null, // Левая кнопка мыши не должна влиять на камеру, чтобы работало перетаскивание
          MIDDLE: THREE.MOUSE.PAN, // Средняя кнопка для перемещения вида
          RIGHT: THREE.MOUSE.PAN, // Правая кнопка для перемещения вида
        };

        // 8. Улучшаем масштабирование в 2D режиме
        controlsRef.current.enableZoom = true;
        controlsRef.current.zoomSpeed = 1.5; // Увеличиваем чувствительность зума

        // 9. Делаем масштабирование более отзывчивым
        controlsRef.current.enableDamping = false;

        // 10. Устанавливаем ключевые панорамирования для лучшего управления камерой
        controlsRef.current.keyPanSpeed = 15; // Увеличиваем скорость панорамирования с клавиатуры

        // 11. Улучшенное обнаружение событий перетаскивания стрелок и мебели
        const onArrowDragStart = (event) => {
          console.log(
            "Arrow drag start detected in CustomControls",
            event.detail
          );
          // Полностью отключаем камеру OrbitControls во время перетаскивания
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
        };

        const onArrowDragEnd = () => {
          console.log("Arrow drag end detected in CustomControls");
          // Восстанавливаем работу OrbitControls после перетаскивания,
          // только если нет выбранной мебели
          if (
            controlsRef.current &&
            usePlannerStore.getState().selectedFurniture === null
          ) {
            controlsRef.current.enabled = true;
          }
        };

        // Добавляем обработчики событий перетаскивания мебели
        const onFurnitureDragStart = () => {
          console.log("Furniture drag start detected");
          if (controlsRef.current) {
            controlsRef.current.enabled = false;
          }
        };

        const onFurnitureDragEnd = () => {
          console.log("Furniture drag end detected");
          // Не включаем контролы обратно, т.к. мебель остается выбранной
        };

        // Регистрируем обработчики событий
        window.addEventListener("arrow-drag-start", onArrowDragStart);
        window.addEventListener("arrow-drag-end", onArrowDragEnd);
        window.addEventListener("furniture-drag-start", onFurnitureDragStart);
        window.addEventListener("furniture-drag-end", onFurnitureDragEnd);

        // 12. Обновляем настройки для более эффективного взаимодействия
        controlsRef.current.minZoom = 0.5; // Разрешаем больший зум
        controlsRef.current.maxZoom = 2.5; // Ограничиваем максимальный зум

        // Сохраняем функцию для удаления обработчика
        controlsRef.current._cleanup2D = () => {
          console.log("Cleaning up 2D mode handlers");
          window.removeEventListener("arrow-drag-start", onArrowDragStart);
          window.removeEventListener("arrow-drag-end", onArrowDragEnd);
          window.removeEventListener(
            "furniture-drag-start",
            onFurnitureDragStart
          );
          window.removeEventListener("furniture-drag-end", onFurnitureDragEnd);
        };
      } else {
        console.log("Setting up 3D camera mode");
        // 3D perspective view

        // Удаляем обработчик, если он был установлен
        if (controlsRef.current._cleanup2D) {
          controlsRef.current._cleanup2D();
          controlsRef.current._cleanup2D = null;
        }

        camera.up.set(0, 1, 0); // Стандартный вектор "вверх"
        camera.position.set(8, 8, 8);
        camera.lookAt(0, 0, 0);

        // Enable rotation
        controlsRef.current.enableRotate = true;

        // Enable panning
        controlsRef.current.enablePan = true;

        // Восстанавливаем нормальную скорость зума
        controlsRef.current.zoomSpeed = 1.0;

        // Включаем демпинг для плавного перемещения камеры
        controlsRef.current.enableDamping = true;

        // Configure mouse buttons
        controlsRef.current.mouseButtons = {
          LEFT: rotationEnabled ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
          MIDDLE: THREE.MOUSE.ROTATE,
          RIGHT: THREE.MOUSE.PAN,
        };
      }

      // Update controls
      controlsRef.current.update();
    }
  }, [viewMode, rotationEnabled, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={viewMode !== "2D"} // отключаем демпинг в 2D для более отзывчивого зума
      dampingFactor={0.1}
      minDistance={5}
      maxDistance={30}
      makeDefault
      target={[0, 0, 0]}
      enablePan={true} // разрешаем панорамирование в обоих режимах
      enableZoom={true} // зум оставляем включенным во всех режимах
      enableRotate={viewMode === "3D"} // вращение только в 3D режиме
      zoomSpeed={viewMode === "2D" ? 1.5 : 1.0} // регулируем скорость зума в зависимости от режима
      panSpeed={viewMode === "2D" ? 1.5 : 1.0} // увеличиваем скорость панорамирования в 2D режиме
      keyPanSpeed={15} // увеличиваем скорость панорамирования с клавиатуры
    />
  );
}
