let io;

module.exports = {
  init: (httpServer, optional) => {
    io = require('socket.io')(httpServer, optional);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
