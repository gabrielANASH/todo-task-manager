import React, { useState } from "react";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      description,
      dueDate,
      priority,
      status: "Pending",
    };

    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // session-based
        body: JSON.stringify(newTask),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Task saved!");
        if (typeof onAdd === "function") onAdd(data);
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("Low");
      } else {
        alert("❌ " + (data.message || "Failed to save task"));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Something went wrong");
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">📝 Add New Task</h5>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            className="form-control mb-3"
            placeholder="Task Description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* ✅ Submit button inside the form, with spacing */}
          <button type="submit" className="btn btn-primary w-100">
            ➕ Add Task
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
