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