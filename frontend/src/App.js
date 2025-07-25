import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check user authentication on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/user`, {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      alert("⚠️ Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  // ✅ If not logged in, show login card
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark mb-2">✨ Welcome to Todo Task Manager</h2>
            <p className="text-muted mb-0">Login to organize your day like a pro!</p>
          </div>
          <a
            className="btn btn-outline-dark btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
            href={`${API_BASE}/api/auth/google`}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google icon"
              width="24"
              height="24"
            />
            <span>Sign in with Google</span>
          </a>
        </div>
      </div>
    );
  }

  // ✅ Authenticated UI
  return (
    <div className="bg-body-secondary min-vh-100">
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="container py-4">
        <h2 className="mb-4 text-dark">
          Welcome, {user.displayName || user.email} 🎉
        </h2>
        <TaskForm onAdd={() => {}} />
        <TaskList />
      </div>
    </div>
  );
}

export default App;
