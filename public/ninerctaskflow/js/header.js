const { useState, useEffect, useRef, useCallback } = React;

// Header Component
function Header({ onSettingsClick, onHelpClick }) {
  return (
    <header className="header mb-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="h3 mb-0">
              <i className="fas fa-tasks me-2"></i> TaskFlow
            </h1>
            <p className="mb-0">Manage your tasks with ease</p>
          </div>
          <div className="col-md-6 text-md-end">
            <button
              className="btn btn-light me-2"
              onClick={onSettingsClick}
              title="Settings"
            >
              <i className="fas fa-cog"></i>
            </button>
            <button
              className="btn btn-light"
              onClick={onHelpClick}
              title="Help & Guide"
            >
              <i className="fas fa-question-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}