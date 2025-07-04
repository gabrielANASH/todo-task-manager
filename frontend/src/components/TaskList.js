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
      {/* Sort Filters */}
      <div className="d-flex flex-wrap align-items-center justify-content-start gap-3 mb-3">
        <div>
          <label className="form-label me-2 mb-0">Sort by:</label>
          <select className="form-select" value={sortField} onChange={e => setSortField(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div>
          <label className="form-label me-2 mb-0">Order:</label>
          <select className="form-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
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

      <h5 className="mb-3">📋 Your Tasks</h5>
      {tasks.length === 0 ? (
        <div className="alert alert-warning">No tasks found.</div>
      ) : (
        <div className="row g-3">
          {tasks.map((task) => (
            <div key={task._id} className="col-md-6">
              <div className="card">
                <div className="card-body">
                  {editingTask && editingTask._id === task._id ? (
                    <form onSubmit={handleEditSubmit}>
                      <input type="text" name="title" className="form-control mb-2" value={editForm.title} onChange={handleEditChange} required />
                      <textarea name="description" className="form-control mb-2" value={editForm.description} onChange={handleEditChange} />
                      <input type="date" name="dueDate" className="form-control mb-2" value={editForm.dueDate} onChange={handleEditChange} />
                      <select name="priority" className="form-select mb-2" value={editForm.priority} onChange={handleEditChange}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                      <select name="status" className="form-select mb-2" value={editForm.status} onChange={handleEditChange}>
                        <option>Pending</option>
                        <option>Completed</option>
                      </select>
                      <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success btn-sm">✅ Save</button>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleEditCancel}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h5 className="card-title mb-1">{task.title}</h5>
                      <p className="card-text mb-2 text-muted">{task.description}</p>
                      <div className="mb-2">
                        <span className="badge bg-secondary">{task.priority}</span>
                        <span className="badge bg-info badge-pulse ms-2">{task.status}</span>
                        <span className="badge bg-light text-dark ms-2">Due: {task.dueDate}</span>
                      </div>
                      <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleEdit(task)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Buttons */}
      {!reset && (
        <div className="mt-4 d-flex justify-content-center align-items-center gap-3">
          <button className="btn btn-outline-primary btn-sm" disabled={page <= 1} onClick={handlePrevPage}>
            ⬅ Prev
          </button>
          <span className="fw-semibold">Page {page} of {totalPages}</span>
          <button className="btn btn-outline-primary btn-sm" disabled={page >= totalPages} onClick={handleNextPage}>
            Next ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskList;
