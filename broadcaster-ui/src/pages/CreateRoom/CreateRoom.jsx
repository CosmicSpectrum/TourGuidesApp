import React,{useEffect, useRef,useState} from 'react';
import {Card, Title, Paragraph} from '../../components/globalStyles/styles';
import {PageWrapper, InputWrapper, ButtonWrapper, FetchingWrapper} from './styles'
import { useMainContext } from "../../context/appContext";
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { TextField, CircularProgress } from '@mui/material';
import ButtonComponent from '../../components/Button/ButtonComponent';
import RoomNetwork from '../../network/roomNetwork';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateRoom(){
    const [fetching, setFecthing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {user,getUser, setRoom} = useMainContext();
    const Navigate = useNavigate();
    const descriptionRef = useRef();

    useEffect(()=>{
        if(!user && Cookie.get("auth-token")){
            getUser();
        } else if(!Cookie.get("auth-token")){
            Navigate('/');
        }else if(user){
            setFecthing(false);
        }
    },[user])

    const handleClose = ()=>{
        setOpen(false);
    }

    const createRoom = ()=>{
        setIsLoading(true);
        const tourDescription = descriptionRef.current.value;
        RoomNetwork.createRoom(tourDescription).then(room=>{
            if(room){
                setRoom(room);
                Navigate(`/room-admin/${room.roomCode}`)
            }
        }).catch(err=>{
            setIsLoading(false);
            setOpen(true);
        })
    }

    const dayTime = ()=>{
        const Now = new Date().getHours();
        
        switch(true){
            case Now < 12:
                return "בוקר טוב";
            case Now > 12 && Now < 18:
                return "צהריים טובים";
            default:
                return "ערב טוב";
        }
    }

    return (
        <PageWrapper>
            <Card height="85vmax" width="95%">
               {!fetching ? 
               <>  
                   {user && <Title fontSize="3vmax" >{`${dayTime()} ${user.fullname}!`}</Title>}
                    <Paragraph marginRight="4%" marginTop="1%">
                        לאן מטיילים היום?
                    </Paragraph>
                    <InputWrapper>
                        <TextField 
                            id='trip-description'
                            variant='filled'
                            label="הכנס תיאור קצר על הטיול"
                            color='success'
                            inputRef={descriptionRef}
                            multiline
                            maxRows={15}
                            rows={15}
                            sx={{width: "96%"}}
                        />
                    </InputWrapper>
                    <ButtonWrapper>
                        <ButtonComponent 
                            isLoading={isLoading} 
                            title='צור טיול'
                            onClick={()=>{createRoom()}}
                        />
                    </ButtonWrapper>
               </>
               : <FetchingWrapper>
                    <CircularProgress 
                        color='success'
                        size={50}
                    />
                </FetchingWrapper>}
            </Card>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={'error'} sx={{ width: '100%' }}>
                   אופס... קרתה אצלנו תקלה. נסו שנית מאוחר יותר
                 </Alert>
            </Snackbar> 
        </PageWrapper>
    )
}