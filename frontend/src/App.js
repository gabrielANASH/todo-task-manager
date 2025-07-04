import React, { useEffect, useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [user, setUser] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/user", {
          credentials: "include",
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      alert("⚠️ Failed to logout");
    }
  };

  // 🔐 Not logged in? Show modern login screen
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
            href="http://localhost:5000/api/auth/google"
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

  // ✅ Logged in UI
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
