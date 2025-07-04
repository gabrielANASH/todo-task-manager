import React from "react";

function Navbar({ user, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 px-4">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold fs-4">📝 Todo Manager</span>

        <div className="d-flex align-items-center ms-auto gap-3">
          {user && (
            <>
              <span className="text-white fw-semibold">
                👋 Hello, {user.displayName || user.email}
              </span>
              <button
                className="btn btn-outline-light btn-sm rounded-pill px-3"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
