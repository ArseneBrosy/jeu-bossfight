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

  socket.on('message', (msg) => {
    console.log(`Message reçu de ${socket.id} : ${msg}`);
  });

  socket.on('joinGame', () => {
    matchmaking.joinGame(socket);
  });

  socket.on('disconnect', () => {
    matchmaking.handleDisconnect(socket);
  });
});