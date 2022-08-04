import React, {useEffect, useRef, useState} from 'react';
import {Card, Title, Paragraph} from '../../components/globalStyles/styles';
import {RoomWrapper, MicButtonWrappers, StreamAudio, EndButtonWrapper,DescriptionWrapper} from './styles';
import { useParams } from 'react-router-dom';
import { useMainContext } from '../../context/appContext';
import RoomNetwork from '../../network/roomNetwork';
import ButtonComponent from '../../components/Button/ButtonComponent';
import { myPeer } from '../../utils/peerConnection';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function Room(){
    const {roomId} = useParams();
    const streamRef = useRef();
    const Navigate = useNavigate();
    const {room, socket, setRoom, language} = useMainContext();
    const [peerId, setPeerId] = useState('');

    useEffect(()=>{
        if(!room){
            RoomNetwork.getRoomByRoomCode(roomId).then(room=>{
                setRoom(room);
            })
        }
    },[room])

    useEffect(()=>{
        if(!sessionStorage.getItem('firstLoad')){
            sessionStorage.setItem("firstLoad","hey");
            window.location.reload(false);
        }else{
            sessionStorage.clear();
            myPeer.on("open", userId=>{
                setPeerId(userId);
                socket.emit('join-room', roomId, userId)
            });

            myPeer.on("call", call => {
                call.answer();
                call.on('stream', stream => {
                    if(streamRef.current){
                        streamRef.current.srcObject = stream;
                    }
                })
            })

            socket.on('room-closed',()=>{
                roomEnded();
            })
        }
    }, [])

    const roomEnded = ()=>{
        Swal.fire({
            title: language ? "הטיול נגמר" : "Tour Ended",
            icon: "error",
            text: language ?  "המדריך סגר את חדר הטיול והוא הסתיים." : "The guide ended the tour",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: language ? "חזור לדף הבית" : "Back To Homepage",
        }).then(()=>{
            socket.emit('userLeave', roomId);
            Navigate('/')
        })
    }

    const exitRoom = ()=>{
        Swal.fire({
            title: language ? "יציאה מהטיול" : "Leave Tour",
            text: language ? "האם אתם בטוחים שתרצו לעזוב את הטיול?" :"Are you sure you want to leave the tour room?",
            icon: "question",
            cancelButtonText: language ? "ביטול" : "Cancel",
            confirmButtonText: language ? "עזוב טיול" : "Leave Tour",
            showCancelButton: true,
            reverseButtons: language ? true : false,
            confirmButtonColor: "#2e7d32",
            cancelButtonColor: "#d32f2f"
        }).then((result)=>{
            if(result.isConfirmed){
                socket.emit('userLeave', roomId, peerId);
                Navigate('/')
            }
        })
    }

    const playStream =()=>{
        streamRef.current.play();
    }

    const stopStream = ()=>{
        streamRef.current.pause();
    }

    return (
        <RoomWrapper>
            <Card width="95%" height="85vmax">
                <Title fontSize={'3.5vmax'}>{`${language ? "קוד החדר:" : "Room Code:"} ${roomId}`}</Title>
                <Title fontSize={'2.5vmax'}>{language ?'תיאור הטיול:' : "Tour Description:"}</Title>
                <DescriptionWrapper>
                    <Paragraph direction="rtl" textAlign="center">
                        {room && room.tourDescription}
                    </Paragraph>
                </DescriptionWrapper>
                <MicButtonWrappers>
                    <ButtonComponent 
                        title={language ? "הפסק להאזין" : "Stop Listening"}
                        color={"error"}
                        onClick={stopStream}
                    />
                    <ButtonComponent 
                        title={language ? "האזן לשידור" : "Start Listening"}
                        onClick={playStream}
                    />
                </MicButtonWrappers>
                <EndButtonWrapper>
                    <ButtonComponent 
                        title={language ? 'יציאה מהטיול' : "Leave Tour"}
                        onClick={()=>{exitRoom()}}
                    />
                </EndButtonWrapper>
            </Card>
            <StreamAudio ref={streamRef} />
        </RoomWrapper>
    )
}