import React, { useEffect, useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
    status: "Pending",
  });

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

  // Start editing a task
  const handleEdit = (task) => {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.map((task) => (task._id === editingTask._id ? data : task)));
        setEditingTask(null);
      } else {
        alert(data.message || "Edit failed");
      }
    } catch (err) {
      alert("Edit error");
    }
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingTask(null);
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
                {editingTask && editingTask._id === task._id ? (
                  <form className="mb-2" onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      name="title"
                      className="form-control mb-1"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                    />
                    <textarea
                      name="description"
                      className="form-control mb-1"
                      value={editForm.description}
                      onChange={handleEditChange}
                    />
                    <input
                      type="date"
                      name="dueDate"
                      className="form-control mb-1"
                      value={editForm.dueDate}
                      onChange={handleEditChange}
                    />
                    <select
                      name="priority"
                      className="form-select mb-1"
                      value={editForm.priority}
                      onChange={handleEditChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <select
                      name="status"
                      className="form-select mb-1"
                      value={editForm.status}
                      onChange={handleEditChange}
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                    </select>
                    <button type="submit" className="btn btn-success btn-sm me-2">Save</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={handleEditCancel}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <strong>{task.title}</strong> <br />
                    <small>{task.description}</small>
                    <br />
                    <span className="badge bg-secondary">{task.priority}</span>
                    <span className="badge bg-info ms-2">{task.status}</span>
                    <span className="badge bg-light text-dark ms-2">{task.dueDate}</span>
                  </>
                )}
              </div>
              <div>
                {!editingTask || editingTask._id !== task._id ? (
                  <>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;