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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [reset, setReset] = useState(false);

  const fetchTasks = async () => {
    let url;
    if (reset) {
      url = `http://localhost:5000/api/tasks/all?sortField=${sortField}&sortOrder=${sortOrder}`;
    } else {
      url = `http://localhost:5000/api/tasks?page=${page}&limit=5&sortField=${sortField}&sortOrder=${sortOrder}`;
    }

    try {
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      console.log("Fetched tasks:", data);

      if (res.ok) {
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setTotalPages(data.totalPages || 1);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Fetch error", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, sortField, sortOrder, reset]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

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
        alert("Edit failed");
      }
    } catch (err) {
      alert("Edit error");
    }
  };

  const handleEditCancel = () => {
    setEditingTask(null);
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div>
      <div className="mb-2">
        <label>Sort by: </label>
        <select value={sortField} onChange={e => setSortField(e.target.value)}>
          <option value="dueDate">Due Date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

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
                    <input type="text" name="title" className="form-control mb-1" value={editForm.title} onChange={handleEditChange} required />
                    <textarea name="description" className="form-control mb-1" value={editForm.description} onChange={handleEditChange} />
                    <input type="date" name="dueDate" className="form-control mb-1" value={editForm.dueDate} onChange={handleEditChange} />
                    <select name="priority" className="form-select mb-1" value={editForm.priority} onChange={handleEditChange}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <select name="status" className="form-select mb-1" value={editForm.status} onChange={handleEditChange}>
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
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Show pagination only in paginated view */}
      {!reset && (
        <div className="mt-3">
          <button className="btn btn-outline-primary btn-sm me-2" disabled={page <= 1} onClick={handlePrevPage}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-outline-primary btn-sm ms-2" disabled={page >= totalPages} onClick={handleNextPage}>Next</button>
        </div>
      )}

      {/* Always show toggle button */}
      <div className="mt-2">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => {
            setReset(!reset);
            setPage(1);
          }}
        >
          {reset ? "Back to Paginated View" : "Show All Tasks"}
        </button>
      </div>
    </div>
  );
}

export default TaskList;
