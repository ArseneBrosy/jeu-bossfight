/**
 * Main script that manage connections with the server
 * @author ArseneBrosy
 * @since 2024-10-02
 */

import { io } from 'https://cdn.socket.io/4.8.0/socket.io.esm.min.js';

const socket = io('ws://172.233.246.192:3000');

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('disconnect', () => {})