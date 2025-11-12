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