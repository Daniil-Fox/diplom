import React from "react";
import usePlannerStore from "../store/plannerStore";
import "../styles/Header.css";

const Header = () => {
  const { viewMode, setViewMode } = usePlannerStore();
  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  const handleUndo = () => {
    // Здесь будет логика отмены действия
    setCanRedo(true);
  };

  const handleRedo = () => {
    // Здесь будет логика возврата действия
  };

  return (
    <div className="header">
      <div className="header-actions">
        <button
          className={`action-button ${!canUndo ? "disabled" : ""}`}
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 7h6a4 4 0 0 1 4 4v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 7l4-4M3 7l4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Отменить</span>
        </button>
        <button
          className={`action-button ${!canRedo ? "disabled" : ""}`}
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 7h-6a4 4 0 0 0-4 4v6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 7l-4-4M21 7l-4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Вернуть</span>
        </button>
      </div>
      <div className="view-mode-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={viewMode === "3D"}
            onChange={() => setViewMode(viewMode === "2D" ? "3D" : "2D")}
          />
          <span className="slider">
            <span className="mode-label">2D</span>
            <span className="mode-label">3D</span>
          </span>
        </label>
      </div>
      <div className="header-right">
        <button className="auth-button">Зарегистрироваться</button>
      </div>
    </div>
  );
};

export default Header;
