const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./config/passport")(passport);

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ✅ Trust proxy (for secure cookies on Render)
app.set("trust proxy", 1);

// ✅ CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// ✅ Parse incoming JSON
app.use(express.json());

// ✅ Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none", // Needed for cross-site cookies
    secure: true,     // Required on HTTPS
  }
}));

// ✅ Passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Health check
app.get("/", (req, res) => res.send("✅ Backend running"));

module.exports = app;
