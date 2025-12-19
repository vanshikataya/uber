require('dotenv').config();
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the same server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // frontend URL (Vite dev server)
        methods: ["GET", "POST"],
    },
});

// Handle socket.io connections
io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Start server
server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
