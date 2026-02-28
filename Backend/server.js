require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const port = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize socket.io with handlers from socket.js
initializeSocket(server);

// Start server
server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});
