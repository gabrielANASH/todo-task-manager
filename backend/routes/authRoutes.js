const express = require("express");
const passport = require("passport");
const router = express.Router();

// 🌐 Google Login
router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // 👈 ADD THIS
}));

// ✅ Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL,
    successRedirect: process.env.CLIENT_URL, // safer redirect
    session: true,
  })
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

// 👤 Get current user (for frontend session check)
router.get("/user", (req, res) => {
  res.json(req.user || null);
});

module.exports = router;
