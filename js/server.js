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

socket.on('gameJoined', (lobby) => {
  openPage('game-lobby');
  fillLobbyPage(lobby);
})

socket.on('disconnect', () => {})

//region ACTIONS
  document.getElementById('join-game-button').addEventListener('click', () => {
    socket.emit('joinGame');
  });
//endregion