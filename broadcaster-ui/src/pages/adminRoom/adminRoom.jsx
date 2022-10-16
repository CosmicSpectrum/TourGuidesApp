import React, {useEffect, useState} from "react";
import { useMainContext } from "../../context/appContext";
import Cookie from 'js-cookie';
import {Card, Title} from '../../components/globalStyles/styles';
import {AdminRoomWrapper, MicButtonWrappers, EndButtonWrapper} from './style';
import ButtonComponent from "../../components/Button/ButtonComponent";
import { useNavigate, useParams } from "react-router-dom";
import { StartStream } from "../../utils/OpenStream";
import { myPeer } from "../../utils/peerConnection";
import RoomNetwork from "../../network/roomNetwork";
import Swal from 'sweetalert2';


export default function AdminRoom(){
    const [Stream , setStream] = useState(null);
    const {user, socket ,getUser, language} = useMainContext();
    const Navigate = useNavigate();
    const {roomId} = useParams();

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }
    },[user,Navigate,getUser]);

    useEffect(()=>{
        if(!sessionStorage.getItem('firstLoad')){
            sessionStorage.setItem("firstLoad","hey");
            window.location.reload(false);
        }else{
            sessionStorage.clear();
            myPeer.on("open", userId=>{
                socket.emit('join-room', roomId, userId, true);
            });
        }
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
            }
        })
    }

    return (
        <AdminRoomWrapper>
            <Card width="95%" height="85vmax">
                <Title fontSize={'3.5vmax'}>{`${language ? "קוד החדר:" : "Room Code:"} ${roomId}`}</Title>
                <MicButtonWrappers>
                    <ButtonComponent 
                        title={language ? "כבה מיקרופון" : "Mute Mic"}
                        color={"error"}
                        onClick={()=>{closeMic();}}
                    />
                    <ButtonComponent 
                        title={language ? "הפעל מיקרופון" : "Activate Mic"}
                        onClick={()=>{openMic();}}
                    />
                </MicButtonWrappers>
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