// Settings Modal Component
function SettingsModal({ show, onClose, settings, onSettingsChange }) {
  const [tempSettings, setTempSettings] = useState(settings);

  useEffect(() => {
    setTempSettings(settings);
  }, [settings, show]);

  const handleSave = () => {
    onSettingsChange(tempSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings = {
      theme: "light",
      autoSave: true,
      notifications: true,
      soundEffects: false,
      compactView: false,
      showCompletedTasks: true,
    };
    // Replaced confirm with a custom message box
    const resetConfirmed = window.prompt(
      "Are you sure you want to reset all settings to default? Type 'RESET' to confirm."
    );
    if (resetConfirmed === "RESET") {
      setTempSettings(defaultSettings);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-cog me-2"></i>Settings
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Appearance</h6>
              <div className="mb-3">
                <label htmlFor="themeSelect" className="form-label">
                  Theme
                </label>
                <select
                  className="form-select"
                  id="themeSelect"
                  value={tempSettings.theme}
                  onChange={(e) =>
                    setTempSettings({ ...tempSettings, theme: e.target.value })
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="compactView"
                  checked={tempSettings.compactView}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      compactView: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="compactView">
                  Compact View
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold mb-3">Behavior</h6>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="autoSave"
                  checked={tempSettings.autoSave}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      autoSave: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="autoSave">
                  Auto-save changes
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="notifications"
                  checked={tempSettings.notifications}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      notifications: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="notifications">
                  Show notifications
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="soundEffects"
                  checked={tempSettings.soundEffects}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      soundEffects: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="soundEffects">
                  Sound effects
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="showCompletedTasks"
                  checked={tempSettings.showCompletedTasks}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      showCompletedTasks: e.target.checked,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="showCompletedTasks">
                  Show completed tasks
                </label>
              </div>
            </div>

            <div className="mb-3">
              <h6 className="fw-bold mb-3">Data Management</h6>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    const modal = new bootstrap.Modal(
                      document.getElementById("messageModal")
                    );
                    document.getElementById("messageModalBody").innerText =
                      "Export feature coming soon!";
                    modal.show();
                  }}
                >
                  <i className="fas fa-download me-2"></i>Export Tasks
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    const modal = new bootstrap.Modal(
                      document.getElementById("messageModal")
                    );
                    document.getElementById("messageModalBody").innerText =
                      "Import feature coming soon!";
                    modal.show();
                  }}
                >
                  <i className="fas fa-upload me-2"></i>Import Tasks
                </button>
                <button
                  className="btn btn-outline-warning"
                  onClick={handleReset}
                >
                  <i className="fas fa-undo me-2"></i>Reset Settings
                </button>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              <i className="fas fa-save me-2"></i>Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}