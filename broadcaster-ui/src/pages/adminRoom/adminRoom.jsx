import React, {useEffect, useState,useRef} from "react";
import { useMainContext } from "../../context/appContext";
import Cookie from 'js-cookie';
import {Card, Title,inputDesign} from '../../components/globalStyles/styles';
import {AdminRoomWrapper, ButtonWrappers, EndButtonWrapper,FilesWrapper, FetchingWrapper,PdfWrapper} from './style';
import ButtonComponent from "../../components/Button/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { StartStream } from "../../utils/OpenStream";
import { myPeer } from "../../utils/peerConnection";
import RoomNetwork from "../../network/roomNetwork";
import Swal from 'sweetalert2';
import { TextField, CircularProgress, Autocomplete } from '@mui/material';
import FilesNetwork from "../../network/FilesNetwork";
import getFileType from "../../utils/getFileType";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';


export default function AdminRoom(){
    const [Stream , setStream] = useState(null);
    const [files, setFiles] = useState([]);
    const [pack, setPack] = useState(null);
    const [room, setRoom] = useState(null);
    const [showFile, setShowFile] = useState(false);
    const [selectedFile, setSelection] = useState(null);
    const [isFetchingFile ,setFecthingFile] = useState(false);
    const {user, socket ,getUser, language} = useMainContext();
    const Navigate = useNavigate();
    const {roomId} = useParams();
    const fileBuffer = useRef();

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }
    },[user,Navigate,getUser]);

    useEffect(()=>{
        if(!localStorage.getItem('firstLoad')){
            localStorage.setItem('firstLoad', true);
            window.location.reload()
        }

        if(!room){
            RoomNetwork.getRoomByRoomCode(roomId).then(room=>{
                setRoom(room);
            })
        }
    },[])

    useEffect(()=>{
        let temp = [];
        if(files.length === 0 && room?.guidePack){
            FilesNetwork.getPackById(room.guidePack).then(returnedPack=>{
                setPack(pack);
                returnedPack.packItems.map(item=>{
                    temp.push({id: item.uid , label: item.fileName})
                })
                setFiles(temp);
            })
        }
    },[files, room])

    useEffect(()=>{
        myPeer.on("open", userId=>{
            socket.emit('join-room', roomId, userId, true);
        });
    }, [myPeer])

    useEffect(()=>{
        if(Stream){
            socket.on('user-connected', userId=>{
                myPeer.call(userId,Stream);
            })

            RoomNetwork.getActiveListeners(roomId).then(listeners=>{
                listeners.map(listener=> myPeer.call(listener, Stream))
            })
        }
    }, [Stream])

    const openMic = ()=>{
        if(!Stream){
            StartStream().then(stream => {
                setStream(stream);
            })
        }else{
            Stream.getAudioTracks()[0].enabled = true;
        }
    }

    const closeMic = ()=>{
        Stream.getAudioTracks()[0].enabled = false;
    }
    
    const endRoom = ()=>{
        RoomNetwork.deleteRoom(roomId).then(res=>{
            if(res){
                socket.emit('roomEnded', roomId);
                Stream && Stream.getTracks().forEach((track)=>{
                    track.stop();
                });
                Navigate('/createRoom');
            }
        })
    }

    const showFileEvent = ()=>{
        socket.emit('showFile', selectedFile, roomId);
        setShowFile(true);
        fetchFile();
    }

    const fetchFile = ()=>{
        setFecthingFile(true);
        FilesNetwork.download(selectedFile).then(blob=>{
            fileBuffer.current = blob;
            setFecthingFile(false)
        })
    }

    const confirmEndTour = ()=>{
        Swal.fire({
            title: language ? "סיום טיול" : "End Tour",
            icon: "question",
            text: language ? "האם אתם בטוחים שתרצו לסיים את הסיור?" : "Are you sure you want to end the tour?",
            confirmButtonColor: "#2e7d32",
            cancelButtonColor: "#d32f2f",
            cancelButtonText: language ? "ביטול" : "Cancel",
            confirmButtonText: language ? "סיים סיור" : "End Tour",
            showCancelButton: true,
            reverseButtons: language ? true : false
        }).then(result=>{
            if(result.isConfirmed){
                endRoom();
                localStorage.clear();
            }
        })
    }

    const getFilePlatform = ()=>{
        switch(getFileType(fileBuffer.current?.type, language)){
            case 'תמונה':
                return <img 
                            style={{maxWidth: "300px", maxHeight: "400px", marginTop: "5%"}} 
                            src={URL.createObjectURL(fileBuffer.current)} 
                            alt='pic' 
                        />
            case 'מסמך':
                return (
                    <div 
                        style={{
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            height: '300px',
                            width: '90%',
                            marginTop:"5%"
                            }}
                    >
                        <Viewer fileUrl={URL.createObjectURL(fileBuffer.current)} />
                    </div>
                )
            default:
                return;
        }
    }

    return (
        <AdminRoomWrapper>
            <Card width="95%">
                <Title fontSize={'3.5vmax'}>{`${language ? "קוד החדר:" : "Room Code:"} ${roomId}`}</Title>
                <Title fontSize={'2.5vmax'} marginBottom="0%">
                    {language ? 'שליטה במיקרופון' : "Mic Controls"}
                </Title>
                <ButtonWrappers>
                    <ButtonComponent 
                        title={language ? "כבה מיקרופון" : "Mute Mic"}
                        color={"error"}
                        marginTop={'4%'}
                        onClick={()=>{closeMic();}}
                    />
                    <ButtonComponent 
                        marginTop={'4%'}
                        title={language ? "הפעל מיקרופון" : "Activate Mic"}
                        onClick={()=>{openMic();}}
                    />
                </ButtonWrappers>
                {room?.guidePack && 
                <FilesWrapper>
                    <Title fontSize={'2.5vmax'} marginBottom="0%">
                        {language ? 'קבצי המארז' : "Pack Files"}
                    </Title>                
                    <Autocomplete 
                        renderInput={(params)=> <TextField 
                                                    {...params} 
                                                    sx={{...inputDesign, width: '100%'}} 
                                                    variant={'standard'}
                                                    color='success'
                                                    label={language ? 'בחר קובץ להצגה' : "Choose a file"}
                                                />}
                        options={files}
                        color='success'
                        sx={{width: "100%"}}
                        noOptionsText={language ? 'לא נמצאו אפשרויות' : 'No Options Found'}
                        onChange={(e, value)=>{setSelection(value.id);}}
                        clearIcon={false}
                    />
                    <ButtonWrappers>
                        <ButtonComponent 
                            marginTop={"0%"}
                            title={language ? "הסתר קובץ" : "Hide File"}
                            disabled={showFile ? false : true}
                            onClick={()=>setShowFile(false)}
                            color={"error"}
                        />
                        <ButtonComponent 
                            marginTop={'0%'}
                            disabled={selectedFile ? false : true}
                            title={language ? "הצג קובץ" : "Show File"}
                            onClick={()=>{showFileEvent()}}
                        />
                    </ButtonWrappers>
                    {
                        (isFetchingFile) ? 
                        <FetchingWrapper>
                            <CircularProgress 
                                color='success'
                                size={50}
                            /> 
                        </FetchingWrapper>
                        :
                        showFile && getFilePlatform()
                    }
                </FilesWrapper>
                }
                <EndButtonWrapper>
                    <ButtonComponent 
                        title={language ? "סיים טיול" : "End Tour"}
                        onClick={()=>{confirmEndTour();}}
                    />
                </EndButtonWrapper>
            </Card>
        </AdminRoomWrapper>
    )
}