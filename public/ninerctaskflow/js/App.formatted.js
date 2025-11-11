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

// Stats Card Component
function StatsCard({ number, label }) {
  return (
    <div className="stats-card">
      <div className="stats-number">{number}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}

// Stats Overview Component
function StatsOverview({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "done").length;
  const pendingTasks = totalTasks - completedTasks;

  // Calculate overdue tasks
  const today = new Date();
  const overdueTasks = tasks.filter((task) => {
    if (task.status === "done") return false;
    const dueDate = new Date(task.dueDate);
    return dueDate < today;
  }).length;

  return (
    <div className="row mb-4">
      <div className="col-md-3 col-sm-6">
        <StatsCard number={totalTasks} label="Total Tasks" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={completedTasks} label="Completed" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={pendingTasks} label="Pending" />
      </div>
      <div className="col-md-3 col-sm-6">
        <StatsCard number={overdueTasks} label="Overdue" />
      </div>
    </div>
  );
}

// Task Card Component
function TaskCard({ task, onEdit, onDelete, onDragStart, onDragEnd }) {
  const priorityClass = `priority-badge badge-${task.priority}`;
  const priorityText =
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", task.id.toString());
    e.currentTarget.classList.add("dragging");
    onDragStart && onDragStart(task);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
    onDragEnd && onDragEnd();
  };

  return (
    <div
      className={`task-card ${task.priority}-priority`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="task-title">{task.title}</div>
      <div className="task-description">
        {task.description || "No description"}
      </div>
      <div className="task-meta">
        <span className={priorityClass}>{priorityText}</span>
        <span className="due-date">
          <i className="far fa-calendar-alt me-1"></i> {formattedDate}
        </span>
      </div>
      <div className="task-actions">
        <button
          className="btn btn-sm btn-outline-secondary edit-task"
          onClick={() => onEdit(task)}
        >
          <i className="fas fa-edit"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-danger delete-task"
          onClick={() => onDelete(task.id)}
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

// Helper functions for TaskColumn
function getStatusBadgeColor(status) {
  switch (status) {
    case "todo":
      return "primary";
    case "progress":
      return "info";
    case "review":
      return "warning";
    case "done":
      return "success";
    default:
      return "secondary";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "todo":
      return "fas fa-clipboard-list";
    case "progress":
      return "fas fa-spinner";
    case "review":
      return "fas fa-search";
    case "done":
      return "fas fa-check-circle";
    default:
      return "fas fa-tasks";
  }
}

function getEmptyStateText(status) {
  switch (status) {
    case "todo":
      return "No tasks here yet";
    case "progress":
      return "No tasks in progress";
    case "review":
      return "No tasks to review";
    case "done":
      return "No completed tasks";
    default:
      return "No tasks";
  }
}

// Task Column Component
function TaskColumn({
  title,
  status,
  tasks,
  count,
  onEdit,
  onDelete,
  onTaskMove,
  draggedTask,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set to false if we're actually leaving the column
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId && taskId !== "" && status) {
      onTaskMove(parseInt(taskId), status);
    }
  };

  return (
    <div className="col-lg-3 col-md-6">
      <div className="task-column">
        <h5>
          {title}{" "}
          <span className={`badge bg-${getStatusBadgeColor(status)}`}>
            {count}
          </span>
        </h5>
        <div
          className={`task-list drop-zone ${isDragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {tasks.length === 0 ? (
            <div className="empty-state">
              <i className={getStatusIcon(status)}></i>
              <p>{getEmptyStateText(status)}</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Task Modal Component
function TaskModal({ show, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setStatus(taskToEdit.status);
    } else {
      // Reset form for new task
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(new Date().toISOString().split("T")[0]);
      setStatus("todo");
    }
  }, [taskToEdit, show]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const taskData = {
      id: taskToEdit ? taskToEdit.id : Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      status,
    };

    onSave(taskData);
    onClose();
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
              {taskToEdit ? "Edit Task" : "Add New Task"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="taskTitle" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="taskTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="taskDescription" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="taskDescription"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="taskPriority" className="form-label">
                  Priority
                </label>
                <select
                  className="form-select"
                  id="taskPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="taskDueDate" className="form-label">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="taskDueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="taskStatus" className="form-label">
                Status
              </label>
              <select
                className="form-select"
                id="taskStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
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
              onClick={handleSubmit}
            >
              {taskToEdit ? "Update Task" : "Save Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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

// Help/Guide Modal Component
function HelpModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-question-circle me-2"></i>TaskFlow User Guide
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="accordion" id="helpAccordion">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#getting-started"
                  >
                    <i className="fas fa-play-circle me-2 text-primary"></i>
                    Getting Started
                  </button>
                </h2>
                <div
                  id="getting-started"
                  className="accordion-collapse collapse show"
                >
                  <div className="accordion-body">
                    <p>
                      <strong>Welcome to TaskFlow!</strong> This is your personal
                      task management dashboard.
                    </p>
                    <ul>
                      <li>
                        <strong>Dashboard Overview:</strong> View your task
                        statistics at the top
                      </li>
                      <li>
                        <strong>Four Columns:</strong> Tasks are organized into To
                        Do, In Progress, Review, and Done
                      </li>
                      <li>
                        <strong>Quick Actions:</strong> Use the "Add New Task"
                        button to create tasks quickly
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#managing-tasks"
                  >
                    <i className="fas fa-tasks me-2 text-success"></i>Managing
                    Tasks
                  </button>
                </h2>
                <div
                  id="managing-tasks"
                  className="accordion-collapse collapse"
                >
                  <div className="accordion-body">
                    <h6>
                      <i className="fas fa-plus text-primary"></i> Creating Tasks
                    </h6>
                    <p>
                      Click "Add New Task" to create a new task with title,
                      description, priority, due date, and status.
                    </p>

                    <h6>
                      <i className="fas fa-edit text-warning"></i> Editing Tasks
                    </h6>
                    <p>
                      Click the edit icon on any task card to modify its details.
                    </p>

                    <h6>
                      <i className="fas fa-trash text-danger"></i> Deleting Tasks
                    </h6>
                    <p>
                      Click the trash icon to delete a task (you'll be asked to
                      confirm).
                    </p>

                    <h6>
                      <i className="fas fa-palette text-info"></i> Priority Levels
                    </h6>
                    <ul>
                      <li>
                        <span className="badge badge-high">High</span> - Red
                        border, urgent tasks
                      </li>
                      <li>
                        <span className="badge badge-medium">Medium</span> -
                        Orange border, normal priority
                      </li>
                      <li>
                        <span className="badge badge-low">Low</span> - Blue
                        border, when time permits
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#drag-drop"
                  >
                    <i className="fas fa-hand-rock me-2 text-warning"></i>Drag &
                    Drop
                  </button>
                </h2>
                <div id="drag-drop" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <p>
                      <strong>Move tasks between columns easily!</strong>
                    </p>
                    <ol>
                      <li>Click and hold on any task card</li>
                      <li>Drag the task to a different column</li>
                      <li>Drop it in the desired column</li>
                    </ol>
                    <div className="alert alert-info">
                      <i className="fas fa-lightbulb me-2"></i>
                      <strong>Tip:</strong> The column will highlight when you
                      hover over it with a task.
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#workflow"
                  >
                    <i className="fas fa-sitemap me-2 text-info"></i>Workflow
                  </button>
                </h2>
                <div id="workflow" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <p>
                      <strong>Recommended task workflow:</strong>
                    </p>
                    <div className="row text-center">
                      <div className="col-3">
                        <div className="border rounded p-2 mb-2">
                          <i className="fas fa-clipboard-list fa-2x text-primary mb-2"></i>
                          <h6>To Do</h6>
                          <small>New tasks and planning</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="border rounded p-2 mb-2">
                          <i className="fas fa-spinner fa-2x text-info mb-2"></i>
                          <h6>In Progress</h6>
                          <small>Currently working on</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="border rounded p-2 mb-2">
                          <i className="fas fa-search fa-2x text-warning mb-2"></i>
                          <h6>Review</h6>
                          <small>Ready for review/testing</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="border rounded p-2 mb-2">
                          <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                          <h6>Done</h6>
                          <small>Completed tasks</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#tips"
                  >
                    <i className="fas fa-star me-2 text-warning"></i>Tips &
                    Shortcuts
                  </button>
                </h2>
                <div id="tips" className="accordion-collapse collapse">
                  <div className="accordion-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h6>
                          <i className="fas fa-clock text-danger"></i> Due Dates
                        </h6>
                        <p>
                          Set due dates to track deadlines. Overdue tasks are
                          counted in your statistics.
                        </p>

                        <h6>
                          <i className="fas fa-mobile-alt text-info"></i> Mobile
                          Friendly
                        </h6>
                        <p>
                          TaskFlow works great on mobile devices. Drag and drop is
                          supported on touch screens.
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6>
                          <i className="fas fa-chart-bar text-success"></i>{" "}
                          Statistics
                        </h6>
                        <p>
                          Monitor your productivity with the overview cards showing
                          total, completed, pending, and overdue tasks.
                        </p>

                        <h6>
                          <i className="fas fa-cog text-secondary"></i> Settings
                        </h6>
                        <p>
                          Customize your experience using the settings panel (gear
                          icon).
                        </p>
                      </div>
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              <i className="fas fa-check me-2"></i>Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Message Modal
function MessageModal() {
  return (
    <div
      className="modal fade"
      id="messageModal"
      tabIndex="-1"
      aria-labelledby="messageModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="messageModalLabel">
              Notification
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body" id="messageModalBody">
            {/* Message will be inserted here */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function TaskFlowApp() {
  // Check localStorage for saved tasks and settings on initial load
  const initialTasks = JSON.parse(localStorage.getItem("tasks")) || sampleTasks;
  const initialSettings = JSON.parse(localStorage.getItem("settings")) || {
    theme: "light",
    autoSave: true,
    notifications: true,
    soundEffects: false,
    compactView: false,
    showCompletedTasks: true,
  };

  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  // Effect to save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Effect to save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  // Update body class based on theme setting
  useEffect(() => {
    const body = document.body;
    body.classList.remove("light-theme", "dark-theme");
    if (settings.theme === "dark") {
      body.classList.add("dark-theme");
    } else if (settings.theme === "light") {
      body.classList.add("light-theme");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        body.classList.add("dark-theme");
      } else {
        body.classList.add("light-theme");
      }
    }
  }, [settings.theme]);

  // Filter tasks by status - also consider settings
  const allTasks = settings.showCompletedTasks
    ? tasks
    : tasks.filter((task) => task.status !== "done");
  const todoTasks = allTasks.filter((task) => task.status === "todo");
  const progressTasks = allTasks.filter((task) => task.status === "progress");
  const reviewTasks = allTasks.filter((task) => task.status === "review");
  const doneTasks = settings.showCompletedTasks
    ? tasks.filter((task) => task.status === "done")
    : [];

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    // Replaced confirm with a custom message box
    const deleteConfirmed = window.prompt(
      "Are you sure you want to delete this task? Type 'DELETE' to confirm."
    );
    if (deleteConfirmed === "DELETE") {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map((task) => (task.id === taskData.id ? taskData : task)));
    } else {
      // Add new task
      setTasks([...tasks, taskData]);
    }
  };

  const handleTaskMove = useCallback((taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    // The useEffect hook now handles theme changes automatically
    console.log("Settings updated:", newSettings);
  };

  return (
    <div
      className={`app-container ${settings.compactView ? "compact-mode" : ""}`}
    >
      <Header
        onSettingsClick={() => setShowSettings(true)}
        onHelpClick={() => setShowHelp(true)}
      />

      <div className="container">
        <StatsOverview tasks={tasks} />

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="h4">My Tasks</h2>
              <button
                className="btn btn-add-task text-white"
                onClick={handleAddTask}
              >
                <i className="fas fa-plus me-2"></i> Add New Task
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            count={todoTasks.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onTaskMove={handleTaskMove}
            draggedTask={draggedTask}
          />
          <TaskColumn
            title="In Progress"
            status="progress"
            tasks={progressTasks}
            count={progressTasks.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onTaskMove={handleTaskMove}
            draggedTask={draggedTask}
          />
          <TaskColumn
            title="Review"
            status="review"
            tasks={reviewTasks}
            count={reviewTasks.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onTaskMove={handleTaskMove}
            draggedTask={draggedTask}
          />
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            count={doneTasks.length}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onTaskMove={handleTaskMove}
            draggedTask={draggedTask}
          />
        </div>
      </div>

      <TaskModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveTask}
        taskToEdit={editingTask}
      />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <HelpModal show={showHelp} onClose={() => setShowHelp(false)} />

      <MessageModal />
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<TaskFlowApp />);