import React, { useState, useEffect, useCallback } from "react";
import usePlannerStore from "../store/plannerStore";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [previewTimer, setPreviewTimer] = useState(null);
  const [lastHoverTime, setLastHoverTime] = useState(0);
  const {
    roomWidth,
    roomLength,
    setRoomWidth,
    setRoomLength,
    addFurniture,
    viewMode,
    setActiveTool,
    setWallTexture,
    setFloorTexture,
  } = usePlannerStore();

  // Временное хранение настроек
  const [tempSettings, setTempSettings] = useState({
    roomWidth: roomWidth,
    roomLength: roomLength,
  });

  // Обновляем временные настройки при изменении значений в store
  useEffect(() => {
    setTempSettings({
      roomWidth: roomWidth,
      roomLength: roomLength,
    });
  }, [roomWidth, roomLength]);

  // Обновляем временные настройки при открытии меню
  useEffect(() => {
    if (isMenuOpen && selectedCategory === "Настройки") {
      setTempSettings({
        roomWidth: roomWidth,
        roomLength: roomLength,
      });
    }
  }, [isMenuOpen, selectedCategory, roomWidth, roomLength]);

  const handleToolClick = (category) => {
    if (selectedCategory === category) {
      setIsMenuOpen(!isMenuOpen);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory("");
      setSelectedItem(null);
      setIsMenuOpen(true);
    }
    // Сбрасываем курсор при смене категории
    document.body.style.cursor = "default";
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(
      subcategory === selectedSubcategory ? "" : subcategory
    );
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    switch (item.category) {
      case "Текстуры стен":
        document.body.style.cursor = `url('/icons/paint-roller.svg') 12 12, pointer`;
        setActiveTool("wall", {
          type: "texture",
          material: item.material,
          applyTexture: (wall) => setWallTexture(item.material),
        });
        break;

      case "Текстуры пола":
        document.body.style.cursor = `url('/icons/floor.svg') 12 12, pointer`;
        setActiveTool("floor", {
          type: "texture",
          material: item.material,
          applyTexture: () => setFloorTexture(item.material),
        });
        break;

      case "Мебель": {
        // Создаем объект мебели
        const boxObject = {
          id: Date.now(),
          type: "box",
          name: item.name,
          position: { x: 0, y: 0, z: 0 },
          rotation: { x: 0, y: 0, z: 0 },
          dimensions: item.dimensions || { width: 1, height: 1, depth: 1 },
          material: item.material || { color: "#cccccc" },
        };

        // Добавляем мебель в сцену
        addFurniture(boxObject);

        // В 3D режиме активируем инструмент размещения
        if (viewMode === "3D") {
          document.body.style.cursor = "move";
          setActiveTool("furniture", {
            type: "object",
            object: boxObject,
            addToScene: (position) => {
              const store = usePlannerStore.getState();
              const furniture = store.furniture;
              if (store.updateFurniturePosition && furniture) {
                store.updateFurniturePosition(
                  furniture.length - 1,
                  position.x,
                  position.z
                );
              }
            },
          });
        } else {
          // В 2D режиме размещаем мебель в центре комнаты
          // Используем setTimeout для гарантии, что мебель уже добавлена в store
          setTimeout(() => {
            const store = usePlannerStore.getState();
            const furniture = store.furniture;
            if (
              store.updateFurniturePosition &&
              furniture &&
              furniture.length > 0
            ) {
              store.updateFurniturePosition(
                furniture.length - 1,
                roomWidth / 2,
                roomLength / 2
              );
            }
          }, 100);
        }
        break;
      }

      default:
        break;
    }
  };

  const handleTempSettingChange = (setting, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTempSettings((prev) => ({
        ...prev,
        [setting]: Math.max(1, Math.min(20, numValue)),
      }));
    }
  };

  const handleApplySettings = () => {
    setRoomWidth(tempSettings.roomWidth);
    setRoomLength(tempSettings.roomLength);
  };

  const handleItemHover = useCallback(
    (item) => {
      const now = Date.now();
      const timeSinceLastHover = now - lastHoverTime;
      const delay = timeSinceLastHover > 5000 ? 1000 : 100;

      if (previewTimer) {
        clearTimeout(previewTimer);
      }

      if (item) {
        const timer = setTimeout(() => {
          setHoveredItem(item);
        }, delay);
        setPreviewTimer(timer);
      } else {
        setHoveredItem(null);
      }

      setLastHoverTime(now);
    },
    [lastHoverTime, previewTimer]
  );

  // Каталог мебели
  const furnitureCatalog = {
    Кресла: [
      {
        id: 1,
        name: "Кресло мягкое",
        preview: "/previews/armchair1.jpg",
        icon: "/icons/armchair.svg",
        dimensions: { width: 0.8, height: 1, depth: 0.8 },
        material: { color: "#8B4513" },
      },
      {
        id: 2,
        name: "Кресло офисное",
        preview: "/previews/armchair2.jpg",
        icon: "/icons/office-chair.svg",
      },
      {
        id: 3,
        name: "Кресло-качалка",
        preview: "/previews/armchair3.jpg",
        icon: "/icons/rocking-chair.svg",
      },
    ],
    Диваны: [
      {
        id: 4,
        name: "Диван угловой",
        preview: "/previews/sofa1.jpg",
        icon: "/icons/corner-sofa.svg",
      },
      {
        id: 5,
        name: "Диван прямой",
        preview: "/previews/sofa2.jpg",
        icon: "/icons/sofa.svg",
      },
      {
        id: 6,
        name: "Диван-кровать",
        preview: "/previews/sofa3.jpg",
        icon: "/icons/sofa-bed.svg",
      },
    ],
    Кровати: [
      {
        id: 7,
        name: "Кровать двуспальная",
        preview: "/previews/bed1.jpg",
        icon: "/icons/bed.svg",
      },
      {
        id: 8,
        name: "Кровать односпальная",
        preview: "/previews/bed2.jpg",
        icon: "/icons/bed.svg",
      },
      {
        id: 9,
        name: "Кровать с подъемным механизмом",
        preview: "/previews/bed3.jpg",
        icon: "/icons/bed.svg",
      },
    ],
    Шкафы: [
      {
        id: 10,
        name: "Шкаф-купе",
        preview: "/previews/wardrobe1.jpg",
        icon: "/icons/wardrobe.svg",
      },
      {
        id: 11,
        name: "Шкаф распашной",
        preview: "/previews/wardrobe2.jpg",
        icon: "/icons/wardrobe.svg",
      },
      {
        id: 12,
        name: "Шкаф угловой",
        preview: "/previews/wardrobe3.jpg",
        icon: "/icons/wardrobe.svg",
      },
    ],
    "Столы и стулья": [
      {
        id: 13,
        name: "Обеденный стол",
        preview: "/previews/table1.jpg",
        icon: "/icons/table-chair.svg",
      },
      {
        id: 14,
        name: "Письменный стол",
        preview: "/previews/table2.jpg",
        icon: "/icons/table-chair.svg",
      },
      {
        id: 15,
        name: "Стул обеденный",
        preview: "/previews/chair1.jpg",
        icon: "/icons/chair.svg",
      },
      {
        id: 16,
        name: "Стул офисный",
        preview: "/previews/chair2.jpg",
        icon: "/icons/chair.svg",
      },
    ],
  };

  // Каталог текстур стен
  const wallTextureCatalog = {
    Обои: [
      {
        id: "w1",
        name: "Обои светлые",
        preview: "/previews/wallpaper1.jpg",
        icon: "/icons/wallpaper.svg",
        material: { color: "#F5F5DC" },
      },
      {
        id: "w2",
        name: "Обои цветочные",
        preview: "/previews/wallpaper2.jpg",
        icon: "/icons/wallpaper.svg",
        material: { color: "#DEB887" },
      },
      {
        id: "w3",
        name: "Обои полосатые",
        preview: "/previews/wallpaper3.jpg",
        icon: "/icons/wallpaper.svg",
        material: { color: "#E6E6FA" },
      },
    ],
    Краска: [
      {
        id: "p1",
        name: "Краска белая",
        preview: "/previews/paint1.jpg",
        icon: "/icons/paint.svg",
        material: { color: "#FFFFFF" },
      },
      {
        id: "p2",
        name: "Краска бежевая",
        preview: "/previews/paint2.jpg",
        icon: "/icons/paint.svg",
        material: { color: "#F5F5DC" },
      },
      {
        id: "p3",
        name: "Краска серая",
        preview: "/previews/paint3.jpg",
        icon: "/icons/paint.svg",
        material: { color: "#808080" },
      },
    ],
  };

  // Каталог текстур пола
  const floorTextureCatalog = {
    Паркет: [
      {
        id: "f1",
        name: "Паркет темный",
        preview: "/previews/parquet1.jpg",
        icon: "/icons/floor.svg",
        material: { color: "#8B4513" },
      },
      {
        id: "f2",
        name: "Паркет светлый",
        preview: "/previews/parquet2.jpg",
        icon: "/icons/floor.svg",
        material: { color: "#DEB887" },
      },
    ],
    Ламинат: [
      {
        id: "l1",
        name: "Ламинат дуб",
        preview: "/previews/laminate1.jpg",
        icon: "/icons/floor.svg",
        material: { color: "#D2B48C" },
      },
      {
        id: "l2",
        name: "Ламинат венге",
        preview: "/previews/laminate2.jpg",
        icon: "/icons/floor.svg",
        material: { color: "#4A3C2A" },
      },
    ],
  };

  const categoryIcons = {
    Мебель: "/icons/furniture.svg",
    Кресла: "/icons/armchair.svg",
    Диваны: "/icons/sofa.svg",
    Кровати: "/icons/bed.svg",
    Шкафы: "/icons/wardrobe.svg",
    "Столы и стулья": "/icons/table-chair.svg",
  };

  const getCurrentCatalog = () => {
    switch (selectedCategory) {
      case "Мебель":
        return furnitureCatalog;
      case "Текстуры стен":
        return wallTextureCatalog;
      case "Текстуры пола":
        return floorTextureCatalog;
      default:
        return {};
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-tools">
        <button
          className={`tool-button ${
            selectedCategory === "Мебель" ? "active" : ""
          }`}
          onClick={() => handleToolClick("Мебель")}
        >
          <img src="/icons/furniture.svg" alt="Мебель" />
        </button>
        <button
          className={`tool-button ${
            selectedCategory === "Текстуры стен" ? "active" : ""
          }`}
          onClick={() => handleToolClick("Текстуры стен")}
        >
          <img src="/icons/paint-roller.svg" alt="Текстуры стен" />
        </button>
        <button
          className={`tool-button ${
            selectedCategory === "Текстуры пола" ? "active" : ""
          }`}
          onClick={() => handleToolClick("Текстуры пола")}
        >
          <img src="/icons/floor.svg" alt="Текстуры пола" />
        </button>
        <button
          className={`tool-button ${
            selectedCategory === "Поиск" ? "active" : ""
          }`}
          onClick={() => handleToolClick("Поиск")}
        >
          <img src="/icons/search.svg" alt="Поиск" />
        </button>
        <button
          className={`tool-button ${selectedCategory === "AI" ? "active" : ""}`}
          onClick={() => handleToolClick("AI")}
        >
          <img src="/icons/ai.svg" alt="AI" />
        </button>
        <button
          className={`tool-button ${
            selectedCategory === "Настройки" ? "active" : ""
          }`}
          onClick={() => handleToolClick("Настройки")}
        >
          <img src="/icons/settings.svg" alt="Настройки" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="sidebar-menu">
          <div className="menu-header">
            <h2>{selectedCategory}</h2>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.cursor = "default";
              }}
            >
              &times;
            </button>
          </div>

          {(selectedCategory === "Мебель" ||
            selectedCategory === "Текстуры стен" ||
            selectedCategory === "Текстуры пола") && (
            <div className="menu-content">
              {Object.entries(getCurrentCatalog()).map(
                ([subcategory, items]) => (
                  <div key={subcategory} className="menu-item-container">
                    <div
                      className={`menu-item ${
                        selectedSubcategory === subcategory ? "active" : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcategory)}
                    >
                      <img
                        src={items[0]?.icon || categoryIcons[subcategory]}
                        alt={subcategory}
                      />
                      <span>{subcategory}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {selectedSubcategory && (
            <div className="submenu">
              <div className="menu-header">
                <h2>{selectedSubcategory}</h2>
              </div>
              <div className="menu-content">
                {getCurrentCatalog()[selectedSubcategory]?.map((item) => (
                  <div
                    key={item.id}
                    className="menu-item"
                    onClick={() =>
                      handleItemClick({ ...item, category: selectedCategory })
                    }
                    onMouseEnter={() => handleItemHover(item)}
                    onMouseLeave={() => handleItemHover(null)}
                  >
                    <img src={item.icon} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hoveredItem && (
            <div className="preview-popup">
              <div className="preview-container">
                <img
                  src={hoveredItem.preview}
                  alt={hoveredItem.name}
                  className="preview-image"
                />
              </div>
              <div className="preview-info">
                <h3>{hoveredItem.name}</h3>
                {hoveredItem.dimensions && (
                  <p>
                    Размеры: {hoveredItem.dimensions.width}x
                    {hoveredItem.dimensions.height}x
                    {hoveredItem.dimensions.depth} м
                  </p>
                )}
              </div>
            </div>
          )}

          {selectedItem && (
            <div className="submenu details-menu">
              <div className="menu-header">
                <h2>{selectedItem.name}</h2>
              </div>
              <div className="menu-content">
                <div className="preview-container">
                  <img
                    src={selectedItem.preview}
                    alt={selectedItem.name}
                    className="preview-image"
                  />
                </div>
                <button
                  className="add-to-scene-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick({
                      ...selectedItem,
                      category: selectedCategory,
                    });
                  }}
                >
                  Добавить в сцену
                </button>
              </div>
            </div>
          )}

          {selectedCategory === "Текстуры стен" && (
            <div className="menu-content">
              <div className="menu-item">
                <span>Обои</span>
              </div>
              <div className="menu-item">
                <span>Краска</span>
              </div>
              <div className="menu-item">
                <span>Плитка</span>
              </div>
            </div>
          )}

          {selectedCategory === "Текстуры пола" && (
            <div className="menu-content">
              <div className="menu-item">
                <span>Паркет</span>
              </div>
              <div className="menu-item">
                <span>Ламинат</span>
              </div>
              <div className="menu-item">
                <span>Плитка</span>
              </div>
              <div className="menu-item">
                <span>Ковролин</span>
              </div>
            </div>
          )}

          {selectedCategory === "Поиск" && (
            <div className="menu-content">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="search-input"
                />
              </div>
            </div>
          )}

          {selectedCategory === "AI" && (
            <div className="menu-content">
              <div className="ai-container">
                <p>AI функционал в разработке</p>
              </div>
            </div>
          )}

          {selectedCategory === "Настройки" && (
            <div className="menu-content">
              <div className="settings-section">
                <h3>Размеры комнаты</h3>
                <div className="room-size-controls">
                  <div className="size-control">
                    <label>Ширина (м):</label>
                    <input
                      type="number"
                      value={tempSettings.roomWidth}
                      min="1"
                      max="20"
                      step="0.1"
                      onChange={(e) =>
                        handleTempSettingChange("roomWidth", e.target.value)
                      }
                    />
                  </div>
                  <div className="size-control">
                    <label>Длина (м):</label>
                    <input
                      type="number"
                      value={tempSettings.roomLength}
                      min="1"
                      max="20"
                      step="0.1"
                      onChange={(e) =>
                        handleTempSettingChange("roomLength", e.target.value)
                      }
                    />
                  </div>
                </div>
                <button
                  className="settings-apply-button"
                  onClick={handleApplySettings}
                >
                  Применить
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
