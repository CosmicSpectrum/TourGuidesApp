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
import {PDF, Img, Audio, Video} from '../../components/MediaElements/mediaElements'
import { ChangeCircleSharp } from "@mui/icons-material";

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
    const cacheRef = useRef();

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

        createCache().then(cache=>{
            cacheRef.current = cache;
        })
        
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

    const createCache = async ()=>{
        return await caches.open('admin-cache');
    }

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

    const fetchFile = async ()=>{
        setFecthingFile(true);
        FilesNetwork.fetchFileFromCdn(selectedFile).then(blob=>{
            fileBuffer.current = blob;
            setFecthingFile(false)
        })
    }

    const hideFile = ()=>{
        setShowFile(false);
        socket.emit('hideFile', roomId);
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
                return <Img fileRef={fileBuffer} />
            case 'מסמך':
                return <PDF fileRef={fileBuffer} />
            case 'שמע':
                return <Audio roomId={roomId} isAdmin={true} fileRef={fileBuffer} />
            case 'סרטון':
                return <Video roomId={roomId} isAdmin={true} fileRef={fileBuffer} />
            case 'Picture':
                return <Img fileRef={fileBuffer} />
            case 'Document':
                return <PDF fileRef={fileBuffer} />
            case 'Audio':
                return <Audio roomId={roomId} isAdmin={true} fileRef={fileBuffer} />
            case 'Video':
                return <Video roomId={roomId} isAdmin={true} fileRef={fileBuffer} />
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
                            onClick={()=>hideFile()}
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