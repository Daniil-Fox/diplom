import { useState, useEffect } from "react";
import usePlannerStore from "../store/plannerStore";
import "../styles/RoomSizeControls.css";

export default function RoomSizeControls() {
  const { roomDimensions, updateRoomDimension, viewMode } = usePlannerStore();
  const [width, setWidth] = useState(roomDimensions.width.toFixed(1));
  const [length, setLength] = useState(roomDimensions.length.toFixed(1));
  const [isEditing, setIsEditing] = useState({ width: false, length: false });

  // Обновляем локальные значения при изменении глобального состояния
  useEffect(() => {
    if (!isEditing.width) {
      setWidth(roomDimensions.width.toFixed(1));
    }
    if (!isEditing.length) {
      setLength(roomDimensions.length.toFixed(1));
    }
  }, [roomDimensions.width, roomDimensions.length, isEditing]);

  const handleWidthChange = (e) => {
    // Разрешаем только числа и точку/запятую
    const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setWidth(value);
    setIsEditing({ ...isEditing, width: true });
  };

  const handleLengthChange = (e) => {
    // Разрешаем только числа и точку/запятую
    const value = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
    setLength(value);
    setIsEditing({ ...isEditing, length: true });
  };

  const handleWidthBlur = () => {
    setIsEditing({ ...isEditing, width: false });

    const parsedWidth = parseFloat(width);
    if (!isNaN(parsedWidth)) {
      // Ограничиваем значение между 1 и 20
      const validWidth = Math.min(Math.max(parsedWidth, 1), 20);
      // Округляем до одного знака после запятой
      const roundedWidth = Math.round(validWidth * 10) / 10;
      updateRoomDimension("width", roundedWidth);
      // Обновляем инпут до валидного значения
      setWidth(roundedWidth.toFixed(1));
    } else {
      // Восстанавливаем предыдущее значение
      setWidth(roomDimensions.width.toFixed(1));
    }
  };

  const handleLengthBlur = () => {
    setIsEditing({ ...isEditing, length: false });

    const parsedLength = parseFloat(length);
    if (!isNaN(parsedLength)) {
      // Ограничиваем значение между 1 и 20
      const validLength = Math.min(Math.max(parsedLength, 1), 20);
      // Округляем до одного знака после запятой
      const roundedLength = Math.round(validLength * 10) / 10;
      updateRoomDimension("length", roundedLength);
      // Обновляем инпут до валидного значения
      setLength(roundedLength.toFixed(1));
    } else {
      // Восстанавливаем предыдущее значение
      setLength(roomDimensions.length.toFixed(1));
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      if (type === "width") {
        handleWidthBlur();
        e.target.blur(); // Убираем фокус с поля
      } else {
        handleLengthBlur();
        e.target.blur(); // Убираем фокус с поля
      }
    }
  };

  return (
    <div
      className={`room-size-controls ${
        viewMode === "2D" ? "room-size-controls-2d" : ""
      }`}
    >
      <h3 className="controls-title">Размеры комнаты</h3>
      <div className="control-group">
        <label htmlFor="room-width">Ширина:</label>
        <div className="input-wrapper">
          <input
            id="room-width"
            type="text"
            value={width}
            onChange={handleWidthChange}
            onBlur={handleWidthBlur}
            onKeyDown={(e) => handleKeyDown(e, "width")}
            onFocus={() => setIsEditing({ ...isEditing, width: true })}
          />
          <span className="unit">м</span>
        </div>
      </div>
      <div className="control-group">
        <label htmlFor="room-length">Длина:</label>
        <div className="input-wrapper">
          <input
            id="room-length"
            type="text"
            value={length}
            onChange={handleLengthChange}
            onBlur={handleLengthBlur}
            onKeyDown={(e) => handleKeyDown(e, "length")}
            onFocus={() => setIsEditing({ ...isEditing, length: true })}
          />
          <span className="unit">м</span>
        </div>
      </div>
      <div className="size-info">
        <span className="info-text">
          Площадь: {(roomDimensions.width * roomDimensions.length).toFixed(1)}{" "}
          м²
        </span>
      </div>
      <div className="size-hint">
        <span className="hint-text">Допустимые значения: от 1 до 20 м</span>
      </div>
    </div>
  );
}
