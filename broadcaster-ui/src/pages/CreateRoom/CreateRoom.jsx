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
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateRoom(){
    const [fetching, setFecthing] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const {user,getUser, setRoom, language} = useMainContext();
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

    useEffect(()=>{
        RoomNetwork.getRoomByCreator().then(room=>{
            if(room){
                Navigate(`/room-admin/${room.roomCode}`);
            }
        })
    }, [])

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
                return (language ? "בוקר טוב" : "Good Morning");
            case Now > 12 && Now < 18:
                return (language ? "צהריים טובים" : "Good Afternoon");
            default:
                return (language ? "ערב טוב": "Good Evening");
        }
    }

    return (
        <PageWrapper>
            <Card height="85vmax" width="95%">
               {!fetching ? 
               <>  
                   {user && <Title fontSize="3vmax" >{`${dayTime()} ${user.fullname}!`}</Title>}
                    <FormControl style={{marginBottom: '2rem', width: "95%", ...(language) ? {marginRight: '2.5%'} : {marginLeft: "2.5%"}}} fullWidth>
                        <Paragraph marginRight={language ? "1.5%" : undefined} marginLeft={!language ? "1.5%" : undefined}>
                           {language ? "בחר חבילת עזרים: (אופציונלי)" : "Pick guide pack: (Optional)"}
                        </Paragraph>
                        <NativeSelect color='success'>
                        </NativeSelect>
                    </FormControl>
                    <Paragraph marginRight={language ? "4%" : undefined} marginLeft={!language ? "4%" : undefined} marginTop="1%">
                       {language ? "לאן מטיילים היום?" : "Where are we heading today?"}
                    </Paragraph>
                    <InputWrapper language={language}>
                        <TextField 
                            id='trip-description'
                            variant='filled'
                            label={language ? "הכנס תיאור קצר על הטיול" : "Please enter a short description on today's tour"}
                            color='success'
                            inputRef={descriptionRef}
                            multiline
                            maxRows={15}
                            rows={10}
                            sx={{width: "96%"}}
                        />
                    </InputWrapper>
                    <ButtonWrapper>
                        <ButtonComponent 
                            isLoading={isLoading} 
                            title={language ? 'צור טיול' : "Create Tour"}
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
                   {language ? "אופס... קרתה אצלנו תקלה. נסו שנית מאוחר יותר" : "Oops... Somthing went wrong. Please try again later"}
                 </Alert>
            </Snackbar> 
        </PageWrapper>
    )
}