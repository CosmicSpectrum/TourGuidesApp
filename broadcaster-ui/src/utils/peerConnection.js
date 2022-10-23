import Peer from 'peerjs';
export const myPeer = new Peer(undefined,{
    host: '/',
    port: 3002,
    secure: false
});
