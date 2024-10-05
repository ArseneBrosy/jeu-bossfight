/**
 * Script that put the players in games
 * @author ArseneBrosy
 * @since 2024-10-02
 */

const MAX_PLAYERS_PER_GAME = 5;
let games = [];
let nextGameId = 0;

/**
 * Instantiate a new player object
 * @param id his id
 * @param name his name
 * @returns an object with all of the player fields
 */
function createPlayer(id, name) {
  return {
    id: id,
    name: name,
    x: 0,
    y: 0,
  }
}

/**
 * Put the player who asked in a game or create one if there are none available
 * @param socket connection with the player
 * @param player the player
 */
function joinGame(socket, player) {
  let gameFound = false;
  let newPlayer = createPlayer(socket.id, player.name);

  for (let game of games) {
    if (game.players.length < MAX_PLAYERS_PER_GAME) {
      game.players.push(newPlayer);
      socket.join(game.id);
      socket.emit('gameJoined', { gameId: game.id, players: game.players });
      console.log(`Player ${socket.id} joined the game ${game.id}.`);
      gameFound = true;

      // broadcast
      for (let player of game.players) {
        socket.to(player.id).emit('playerJoined', newPlayer);
      }

      break;
    }
  }

  if (!gameFound) {
    const newGame = {
      id: `game-${nextGameId++}`,
      players: [newPlayer],
      state: 0,
    };
    games.push(newGame);
    socket.join(newGame.id);
    socket.emit('gameJoined', { gameId: newGame.id, players: newGame.players });
    console.log(`Player ${socket.id} joined and created the game ${newGame.id}.`);
  }
}

function startGame(socket) {
  games.forEach((game) => {
    const playerIndex = game.players.map(e => e.id).indexOf(socket.id);
    if (playerIndex !== -1) {
      game.state = 1;

      // broadcast
      for (let player of game.players) {
        socket.to(player.id).emit('gameStarted');
      }
      socket.emit('gameStarted');
    }
  });
}

/**
 * Remove the player who asked from his game
 * @param socket the player
 */
function leaveGame(socket) {
  games.forEach((game) => {
    const playerIndex = game.players.map(e => e.id).indexOf(socket.id);
    if (playerIndex !== -1) {
      game.players.splice(playerIndex, 1);
      console.log(`Player ${socket.id} left the game ${game.id}.`);

      // broadcast
      for (let player of game.players) {
        socket.to(player.id).emit('playerLeft', socket.id);
      }

      if (game.players.length === 0) {
        const gameIndex = games.indexOf(game);
        games.splice(gameIndex, 1);
        console.log(`The game ${game.id} has been deleted because it is empty.`);
      }
    }
  });
}

module.exports = {
  joinGame,
  leaveGame,
  startGame,
};