module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 New socket connection");

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("taskUpdated", ({ userIds, task }) => {
      userIds.forEach((id) => io.to(id).emit("taskUpdated", task));
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });
  });
};
