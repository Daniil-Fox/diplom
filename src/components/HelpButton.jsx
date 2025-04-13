import React, { useState } from "react";
import usePlannerStore from "../store/plannerStore";
import "../styles/HelpButton.css";

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { viewMode } = usePlannerStore();

  const getInstructions = () => {
    if (viewMode === "3D") {
      return [
        "Перетащите мебель из каталога в комнату",
        "Перемещайте мебель, перетаскивая её",
        "Нажмите R для вращения выбранной мебели",
        "Нажмите Delete для удаления выбранной мебели",
        "Используйте среднюю кнопку мыши для вращения камеры",
        "Нажмите кнопку вращения или клавишу R для включения/выключения вращения камеры левой кнопкой мыши",
      ];
    }
    return [
      "Перетащите мебель из каталога в комнату",
      "Перемещайте мебель, перетаскивая её",
      "Нажмите Delete для удаления выбранной мебели",
      "Перетащите синюю стрелку для изменения размера комнаты",
      "В 2D режиме мебель нельзя вращать",
    ];
  };

  return (
    <>
      <button className="help-button" onClick={() => setIsOpen(true)}>
        <span>?</span>
      </button>

      {isOpen && (
        <div className="help-overlay" onClick={() => setIsOpen(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>Инструкция по использованию</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>
            <div className="help-modal-content">
              <ul>
                {getInstructions().map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpButton;
