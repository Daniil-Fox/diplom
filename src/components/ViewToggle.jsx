import usePlannerStore from "../store/plannerStore";

export default function ViewToggle() {
  const { viewMode, setViewMode, setRotationEnabled } = usePlannerStore();

  // Toggle between 2D and 3D views
  const toggleViewMode = () => {
    const newMode = viewMode === "3D" ? "2D" : "3D";
    console.log("Changing view mode from", viewMode, "to", newMode);
    setViewMode(newMode);

    // При переключении в 2D режим отключаем вращение камеры
    if (newMode === "2D") {
      console.log("Disabling camera rotation in 2D mode");
      setRotationEnabled(false);
    }
  };

  return (
    <div className="view-toggle">
      <button className="view-toggle-btn" onClick={toggleViewMode}>
        Switch to {viewMode === "3D" ? "2D" : "3D"}
      </button>
      <div style={{ fontSize: "10px", marginTop: "5px" }}>
        Current mode: {viewMode}
      </div>
    </div>
  );
}
