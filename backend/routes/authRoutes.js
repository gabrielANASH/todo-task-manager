const express = require("express");
const passport = require("passport");
const router = express.Router();

// Login with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
  }),
  (req, res) => {
    res.redirect("http://localhost:3000");
  }
);

// Logout (GET)
router.get("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" }); // Important: clear cookie for all paths
      res.redirect(process.env.CLIENT_URL);
    });
  });
});

// Logout (POST)
router.post("/logout", (req, res) => {
  req.logout(function(err) {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" }); // Important: clear cookie for all paths
      res.json({ message: "Logged out" });
    });
  });
});

// Fetch current logged-in user
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;