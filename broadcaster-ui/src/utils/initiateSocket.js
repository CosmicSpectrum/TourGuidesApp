import io from 'socket.io-client';

export const socket = io('http://172.20.10.10:3001/', {reconnection: true});