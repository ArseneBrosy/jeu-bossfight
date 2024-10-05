/**
 * Manage connections with the server
 * @author ArseneBrosy
 * @since 2024-10-02
 */

import { io } from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js';

const socket = io('ws://172.233.246.192:3000');

socket.on('connect', () => {
  console.log(socket.id);
  openPage('home');
});

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

socket.on('disconnect', () => {})

//region ACTIONS
document.getElementById('join-game-button').addEventListener('click', () => {
  if (document.querySelector('#home-pseudo').value !== '') {
    socket.emit('joinGame', {name: document.querySelector('#home-pseudo').value});
  }
});

document.getElementById('game-lobby-quit-button').addEventListener('click', () => {
  socket.emit('leaveGame');
  openPage('home');
});
//endregion