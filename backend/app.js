const express = require("express");
const cors = require("cors"); // ✅ Declare only once
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport")(passport);

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// Parse JSON body
app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: "keyboard cat", // You can use dotenv secret if you want
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "lax",
    secure: false, // Set true if using HTTPS (like in production)
  }
}));

// Passport auth
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Health check route
app.get("/", (req, res) => res.send("✅ Backend running"));

module.exports = app;
