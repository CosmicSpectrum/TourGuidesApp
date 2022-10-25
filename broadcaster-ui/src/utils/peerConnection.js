import Peer from 'peerjs';
export const myPeer = new Peer(undefined,{
    host: 'peerjs-listen-on-the-way.herokuapp.com',
    port: 443,
    secure: true
});
