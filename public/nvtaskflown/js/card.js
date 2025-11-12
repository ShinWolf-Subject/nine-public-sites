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