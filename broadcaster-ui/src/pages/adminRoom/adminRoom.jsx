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
    const {user, socket ,getUser} = useMainContext();
    const Navigate = useNavigate();
    const {roomId} = useParams();

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }
    },[user]);

    useEffect(()=>{
        myPeer.on("open", userId=>{
            socket.emit('join-room', roomId, userId)
        });
    }, [])

    useEffect(()=>{
        if(Stream){
            socket.on('user-connected', userId=>{
                myPeer.call(userId,Stream);
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
                Navigate('/createRoom');
                socket.emit('roomEnded', roomId);
            }
        })
    }

    const confirmEndTour = ()=>{
        Swal.fire({
            title: "סיום טיול",
            icon: "question",
            text: "האם אתם בטוחים שתרצו לסיים את הסיור?",
            confirmButtonColor: "#2e7d32",
            cancelButtonColor: "#d32f2f",
            cancelButtonText: "סגור",
            confirmButtonText: "סיים סיור",
            showCancelButton: true,
            reverseButtons: true
        }).then(result=>{
            if(result.isConfirmed){
                endRoom();
            }
        })
    }

    return (
        <AdminRoomWrapper>
            <Card width="95%" height="85vmax">
                <Title fontSize={'3.5vmax'}>{`קוד החדר: ${roomId}`}</Title>
                <MicButtonWrappers>
                    <ButtonComponent 
                        title="הפעל מיקרופון"
                        onClick={()=>{openMic();}}
                    />
                    <ButtonComponent 
                        title="כבה מיקרופון"
                        color={"error"}
                        onClick={()=>{closeMic();}}
                    />
                </MicButtonWrappers>
                <EndButtonWrapper>
                    <ButtonComponent 
                        title="סיים טיול"
                        onClick={()=>{confirmEndTour();}}
                    />
                </EndButtonWrapper>
            </Card>
        </AdminRoomWrapper>
    )
}