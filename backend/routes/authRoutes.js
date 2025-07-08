const express = require("express");
const passport = require("passport");
const router = express.Router();

// 🌐 Google Login
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

// ✅ Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL, // fallback on failure
    session: true,
  }),
  (req, res) => {
    // 🔁 Redirect to frontend on success
    res.redirect(process.env.CLIENT_URL);
  }
);

// 🔐 Logout (GET)
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect(process.env.CLIENT_URL);
    });
  });
});

// 🔐 Logout (POST)
router.post("/logout", (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    req.session.destroy(() => {
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ message: "Logged out" });
    });
  });
});

// 👤 Current logged-in user
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
