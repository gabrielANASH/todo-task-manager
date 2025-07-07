const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const app = require("./app");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Use socket routes
require("./sockets/taskSocket")(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Allowed client: ${process.env.CLIENT_URL}`);
});
