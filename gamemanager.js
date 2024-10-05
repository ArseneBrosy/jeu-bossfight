/**
 * Manage all players in a game
 * @author ArseneBrosy
 * @since 2024-10-05
 */

const matchmaking = require('./matchmaking');

/**
 * Create the player who asked's player object
 * that contains all of his in-game fields
 * @param socket the connection with the player
 * @param player his fields to instantiate
 */
function instantiatePlayer(socket, player) {
  matchmaking.getGames().forEach((game) => {
    const playerIndex = game.players.map(e => e.id).indexOf(socket.id);
    if (playerIndex !== -1) {
      game.players[playerIndex].playerObject = player;
    }
  });
}

/**
 * Update the player who asked's position
 * @param socket the connection with the player
 * @param x his new x coordinate
 * @param y his new y coordinate
 */
function updatePlayerPosition(socket, x, y, dir) {
  matchmaking.getGames().forEach((game) => {
    const playerIndex = game.players.map(e => e.id).indexOf(socket.id);
    if (playerIndex !== -1) {
      game.players[playerIndex].playerObject.transform.x = x;
      game.players[playerIndex].playerObject.transform.y = y;
      game.players[playerIndex].playerObject.direction = dir;
    }
  });
}

module.exports = {
  instantiatePlayer,
  updatePlayerPosition
};