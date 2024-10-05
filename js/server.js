/**
 * Manage connections with the server
 * @author ArseneBrosy
 * @since 2024-10-02
 */

import { io } from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js';

const socket = io('ws://172.233.246.192:3000');

socket.on('connect', () => {
  playerId = socket.id;
  openPage('home');
});

//region LOBBY
socket.on('gameJoined', (lobby_) => {
  openPage('game-lobby');
  lobby = lobby_;
  fillLobbyPage();
});

socket.on('playerJoined', (player) => {
  lobby.players.push(player);
  fillLobbyPage();
});

socket.on('playerLeft', (playerId) => {
  const index = lobby.players.map(e => e.id).indexOf(playerId);
  if (index > -1) {
    lobby.players.splice(index, 1);
  }

  fillLobbyPage();
});

socket.on('gameStarted', () => {
  lobby.state = 1;
  openPage('game');
  socket.emit('instantiatePlayer', player);
})
//endregion

//region GAME
socket.on('updatePlayers', (players) => {
  lobby.players = players;
});
//endregion

// lost connection with the server
socket.on('disconnect', () => {
  openPage('connection');
})

//region ACTIONS
// join game
document.getElementById('join-game-button').addEventListener('click', () => {
  if (document.querySelector('#home-pseudo').value !== '') {
    socket.emit('joinGame', {name: document.querySelector('#home-pseudo').value});
  }
});

// quit game
document.getElementById('game-lobby-quit-button').addEventListener('click', () => {
  socket.emit('leaveGame');
  openPage('home');
});

// start game
document.getElementById('game-lobby-start-button').addEventListener('click', () => {
  socket.emit('startGame');
});
//endregion

//region Player
setInterval(() => {
  if (openedPage !== 'game') {
    return;
  }

  socket.emit('updatePosition', {
    x: player.transform.x,
    y: player.transform.y,
  });
}, 0);
//endregion