import React from 'react';
import { useMainContext } from '../../context/appContext';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


export const Img = ({fileRef})=>{
    return <img 
        style={{maxWidth: "300px", maxHeight: "400px", marginTop: "5%"}} 
        src={URL.createObjectURL(fileRef.current)} 
        alt='pic' 
    />
}

export const PDF = ({fileRef})=>{
    return (
        <div 
            style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '300px',
                width: '90%',
                marginTop:"5%"
                }}
        >
            <Viewer fileUrl={URL.createObjectURL(fileRef.current)} />
        </div>
    )
}

export const Audio = ({fileRef,isAdmin,roomId, mediaRef})=>{
    const {socket} = useMainContext();
    return (<audio 
        src={URL.createObjectURL(fileRef.current)} 
        controls
        ref={mediaRef}
        {...(isAdmin) && {onPlay: ()=>{
            socket.emit('playAudio',roomId);
        }}}
        {...(isAdmin) && {
            onPause: ()=>{
                socket.emit('pauseAudio',roomId)
            }
        }}
        style={{marginTop: '5%'}}
    />)
}

export const Video = ({fileRef,isAdmin,roomId, mediaRef})=>{
    const {socket} = useMainContext();
    return (
        <video 
            ref={mediaRef}
            {...(isAdmin) && {controls: true}}
            style={{
                marginTop: "5%",
                width: "90%"
            }}
            {...(isAdmin) && {onPlay: ()=>{
                socket.emit('playVideo', roomId);
            }}}

            {...(isAdmin) && {
                onPause: ()=>{
                    socket.emit('pauseVideo',roomId)
                }
            }}
        >
            <source 
                src={URL.createObjectURL(fileRef.current)} 
                type={fileRef.current.type}
            />
        </video>
    )
}