import React, {useEffect, useState} from "react"; 
import {StartStream} from '../../utils/OpenStream';
import { myPeer } from "../../utils/peerConnection";

export default function Broadcaster({roomId, socket}){
    
    useEffect(()=>{

        myPeer.on("open", userId=>{
            socket.emit('join-room', roomId, userId)
        });
        StartStream().then(Stream => {
            socket.on('user-connected', userId=>{
                console.log(Stream);
                myPeer.call(userId,Stream);
            })
        });
    
    }, [])

    return(<></>)
}