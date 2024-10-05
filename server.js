/**
 * Main script that manage connections with clients
 * @author ArseneBrosy
 * @since 2024-10-02
 */

const { Server } = require('socket.io');

const io = new Server(3000, {
  cors: {
    origin: '*'
  }
});
const matchmaking = require('./matchmaking');

io.on('connection', (socket) => {
  console.log(`Client connected : ${socket.id}`);

  socket.on('joinGame', (player) => {
    matchmaking.joinGame(socket, player);
  });

  socket.on('leaveGame', () => {
    matchmaking.leaveGame(socket);
  });

  socket.on('startGame', () => {
    matchmaking.startGame(socket);
  })

  socket.on('disconnect', () => {
    matchmaking.leaveGame(socket);
  });
});