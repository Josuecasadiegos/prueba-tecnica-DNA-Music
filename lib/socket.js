// lib/socket.js
import { Server } from 'socket.io';

let io;

export function initIO(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
  }
  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io no inicializado');
  return io;
}