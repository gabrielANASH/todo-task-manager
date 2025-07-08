const express = require("express");
const cors = require("cors"); // ✅ Only once
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport")(passport);

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express(); // ✅ Move this to top before using `app`

// ✅ CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: "keyboard cat", // Optional: use process.env.SESSION_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    secure: false, // Set to true if HTTPS
  },
}));

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());

// ✅ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Test route
app.get("/", (req, res) => res.send("✅ Backend running"));

module.exports = app;
