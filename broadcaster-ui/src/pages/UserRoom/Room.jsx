import React, {useEffect,useRef, useState} from 'react';
import {Card, Title, Paragraph} from '../../components/globalStyles/styles';
import {RoomWrapper, MicButtonWrappers, StreamAudio, EndButtonWrapper,DescriptionWrapper, FilesViewWrapper} from './styles';
import { useParams } from 'react-router-dom';
import { useMainContext } from '../../context/appContext';
import RoomNetwork from '../../network/roomNetwork';
import ButtonComponent from '../../components/Button/ButtonComponent';
import { myPeer } from '../../utils/peerConnection';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {PDF, Img, Audio, Video} from '../../components/MediaElements/mediaElements'
import FilesNetwork from '../../network/FilesNetwork';
import {CircularProgress} from '@mui/material'
import getFileType from '../../utils/getFileType';

export default function Room(){
    const {roomId} = useParams();
    const streamRef = useRef();
    const fileRef = useRef();
    const mediaRef = useRef();
    const Navigate = useNavigate();
    const {room, socket, setRoom, language} = useMainContext();
    const [peerId, setPeerId] = useState('');
    const [showFile, setShowFile] = useState(false);
    const [fetchingFile, setFetchingFile] = useState(false);

    useEffect(()=>{
        if(!room){
            RoomNetwork.getRoomByRoomCode(roomId).then(room=>{
                setRoom(room);
            })
        }
    },[room])

    useEffect(()=>{
        if(!localStorage.getItem('firstLoad')){
            localStorage.setItem("firstLoad","hey");
            window.location.reload(false);
        }else{
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

            socket.on('getFile', fileId=>{
                setShowFile(true);
                fetchFile(fileId);
            })

            socket.on('startMedia', ()=>{
                mediaRef.current?.play();
            })

            socket.on('stopMedia', ()=>{
                mediaRef.current?.pause();
            })

            socket.on('hideMedia',()=>{
                setShowFile(false);
            })

            socket.on('newMediaTime', (newTime) => {
                mediaRef.current.currentTime = newTime;
            })

            socket.on('mute', muteStatus=>{
                mediaRef.current.muted = muteStatus;
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
            localStorage.clear();
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
                localStorage.clear();
                Navigate('/')
            }
        })
    }

    const getFilePlatform = ()=>{
        switch(getFileType(fileRef.current?.type, language)){
            case 'תמונה':
                return <Img fileRef={fileRef} />
            case 'מסמך':
                return <PDF fileRef={fileRef} />
            case 'שמע':
                return <Audio mediaRef={mediaRef} roomId={roomId} fileRef={fileRef} />
            case 'סרטון':
                return <Video mediaRef={mediaRef} roomId={roomId} fileRef={fileRef} />
            case 'Picture':
                return <Img fileRef={fileRef} />
            case 'Document':
                return <PDF fileRef={fileRef} />
            case 'Audio':
                return <Audio mediaRef={mediaRef} roomId={roomId} fileRef={fileRef} />
            case 'Video':
                return <Video mediaRef={mediaRef} roomId={roomId} fileRef={fileRef} />
            default:
                return;
        }
    }

    const playStream =()=>{
        streamRef.current.play();
    }

    const stopStream = ()=>{
        streamRef.current.pause();
    }

    const fetchFile = (fileId)=>{
        setFetchingFile(true);
        FilesNetwork.download(fileId).then(file=>{
            fileRef.current = file;
            setFetchingFile(false);
        })
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
                {showFile && 
                    <FilesViewWrapper>
                        {
                            fetchingFile ? 
                                <CircularProgress 
                                    color='success'
                                    size={50}
                                    sx={{marginTop: "10%"}}
                                /> :
                                getFilePlatform()
                        }
                    </FilesViewWrapper>
                }
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