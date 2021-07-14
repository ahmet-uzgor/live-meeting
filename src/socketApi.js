const io = require('socket.io')();
const socketapi = {
    io: io
};

// Add your socket.io logic here!
io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId)
  })
})
// end of socket.io logic

module.exports = socketapi;