import React from "react";

function Navbar({ user, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand">📝 Todo App</span>
      <div className="ml-auto">
        {user && (
          <>
            <span className="text-white mr-3">Hi, {user.displayName}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;