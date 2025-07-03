import React, { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(Array.isArray(data) ? data : []);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  // Edit handler (not implemented)
  const handleEdit = (task) => {
    alert("Editing not yet implemented. Task: " + task.title);
  };

  return (
    <div>
      <h5>Your Tasks</h5>
      {tasks.length === 0 ? (
        <div>No tasks found.</div>
      ) : (
        <ul className="list-group">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{task.title}</strong> <br />
                <small>{task.description}</small>
                <br />
                <span className="badge bg-secondary">{task.priority}</span>
                <span className="badge bg-info ms-2">{task.status}</span>
                <span className="badge bg-light text-dark ms-2">{task.dueDate}</span>
              </div>
              <div>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(task)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;