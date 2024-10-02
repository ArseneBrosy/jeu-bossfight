/**
 * Script that put the players in games
 * @author ArseneBrosy
 * @since 2024-10-02
 */

const MAX_PLAYERS_PER_GAME = 5;
let games = [];

function joinGame(socket) {
  let gameFound = false;

  for (let game of games) {
    if (game.players.length < MAX_PLAYERS_PER_GAME) {
      game.players.push(socket.id);
      socket.join(game.id);
      socket.emit('gameJoined', { gameId: game.id, players: game.players });
      console.log(`Player ${socket.id} joined the game ${game.id}.`);
      gameFound = true;
      break;
    }
  }

  if (!gameFound) {
    const newGame = {
      id: `game-${games.length + 1}`,
      players: [socket.id],
    };
    games.push(newGame);
    socket.join(newGame.id);
    socket.emit('gameJoined', { gameId: newGame.id, players: newGame.players });
    console.log(`Player ${socket.id} joined and created the game ${newGame.id}.`);
  }
}

function handleDisconnect(socket) {
  games.forEach((game) => {
    const playerIndex = game.players.indexOf(socket.id);
    if (playerIndex !== -1) {
      game.players.splice(playerIndex, 1);
      console.log(`Player ${socket.id} left the game ${game.id}.`);

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
  handleDisconnect,
};