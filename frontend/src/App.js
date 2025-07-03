import React, { useEffect, useState } from "react";
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
    alert("Failed to logout");
  }
};
  // If not logged in, show login button
  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h2>Welcome to Todo App</h2>
        <a
          className="btn btn-danger"
          href="http://localhost:5000/api/auth/google"
        >
          Sign in with Google
        </a>
      </div>
    );
  }

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <div className="container mt-4">
        <h2>Welcome, {user.displayName} <span role="img" aria-label="party">🎉</span></h2>
        <TaskForm onAdd={() => {}} />
        <TaskList />
      </div>
    </div>
  );
}

export default App;