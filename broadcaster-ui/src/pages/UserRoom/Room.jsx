import React, {useEffect, useRef} from 'react';
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
    const {room, socket, setRoom} = useMainContext();

    useEffect(()=>{
        if(!room){
            RoomNetwork.getRoomByRoomCode(roomId).then(room=>{
                setRoom(room);
            })
        }
    },[room])

    useEffect(()=>{
        myPeer.on("open", userId=>{
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
    }, [])

    const roomEnded = ()=>{
        Swal.fire({
            title: "הטיול נגמר",
            icon: "error",
            text: "המדריך סגר את חדר הטיול והוא הסתיים.",
            confirmButtonColor: "#2e7d32",
            confirmButtonText: "חזור לדף הבית",
        }).then(()=>{
            socket.emit('userLeave', roomId);
            Navigate('/')
        })
    }

    const exitRoom = ()=>{
        Swal.fire({
            title: "האם תראה לעזוב את הטיול?",
            icon: "question",
            text: "האם תרצו לעזוב את חדר הסיור?",
            cancelButtonText: "סגור",
            confirmButtonText: "צא",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: "#2e7d32",
            cancelButtonColor: "#d32f2f"
        }).then((result)=>{
            if(result.isConfirmed){
                socket.emit('userLeave', roomId);
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
                <Title fontSize={'3.5vmax'}>{`קוד החדר: ${roomId}`}</Title>
                <Title fontSize={'2.5vmax'}>{'תיאור הטיול:'}</Title>
                <DescriptionWrapper>
                    <Paragraph direction="rtl" textAlign="center">
                        {room && room.tourDescription}
                    </Paragraph>
                </DescriptionWrapper>
                <MicButtonWrappers>
                    <ButtonComponent 
                        title="האזן לשידור"
                        onClick={playStream}
                    />
                    <ButtonComponent 
                        title="הפסק להאזין"
                        color={"error"}
                        onClick={stopStream}
                    />
                </MicButtonWrappers>
                <EndButtonWrapper>
                    <ButtonComponent 
                        title='יציאה'
                        onClick={()=>{exitRoom()}}
                    />
                </EndButtonWrapper>
            </Card>
            <StreamAudio ref={streamRef} />
        </RoomWrapper>
    )
}