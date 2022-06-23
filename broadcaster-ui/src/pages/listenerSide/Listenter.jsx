import React, {useEffect, useState, useRef} from "react"; 
import { myPeer } from "../../utils/peerConnection";
import io from 'socket.io-client'
const socket = io('http://localhost:3001');


export default function Listener({roomId}){
    const audioRef = useRef();
    
    useEffect(()=>{
        myPeer.on("open", userId=>{
            socket.emit('join-room', roomId, userId)
        });

        myPeer.on("call", call => {
            call.answer();
            call.on('stream', stream => {
                console.log(stream);
                audioRef.current.srcObject = stream;
            })
        })
    
    }, [myPeer])

    return(<>
    <audio ref={audioRef}></audio>
    <button onClick={()=>{audioRef.current.play();}}>לחץ כדי להאזין</button>
    <button onClick={()=>{audioRef.current.pause();}}>שקט עולם</button>
    </>)
}