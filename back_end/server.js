const app = require('./app');
const connectDB = require('./config/database');
const http = require('http');
const { init } = require('./services/socketService');

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
// Initialize Socket.IO
init(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`####\nHTTP & WebSocket running on port ${PORT}\n####`);
});
