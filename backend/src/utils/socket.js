let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require("socket.io");
    const allowedOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(",") 
      : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

    io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io is not initialized!");
    }
    return io;
  }
};
