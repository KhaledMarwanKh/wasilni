const socketIO = require('socket.io');

let io;

const init = (server) => {
  io = socketIO(server, {
    cors: {
      origin: '*', // Allow all origins (update in production)
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_driver_room', (driverId) => {
      socket.join(`driver_${driverId}`);
      console.log(`Driver ${driverId} joined room: driver_${driverId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
};

module.exports = { init, getIO };
