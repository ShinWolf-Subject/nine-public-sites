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