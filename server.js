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
const gamemanager = require('./gamemanager');

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
  });

  socket.on('instantiatePlayer', (player) => {
    gamemanager.instantiatePlayer(socket, player);
  });

  socket.on('updatePosition', (position) => {
    gamemanager.updatePlayerPosition(socket, position.x, position.y, position.dir);
  });

  socket.on('disconnect', () => {
    matchmaking.leaveGame(socket);
  });
});

//region Update lobby players
setInterval(() => {
  matchmaking.getGames().forEach((game) => {
    if (game.state !== 1) {
      return;
    }
    for (let player of game.players) {
      io.to(player.id).emit('updatePlayers', game.players);
    }
  });
}, 0);
//endregion