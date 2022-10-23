import React, {useState, useRef} from "react";
import {Card, Title, Paragraph, inputDesign} from '../globalStyles/styles'
import {CodeWrapper, InputWrapper} from './styles'
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";
import AuthNetwork from "../../network/authFunctions";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../context/appContext";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function InsertCode(){
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [open, setOpen] = useState(false);
    const {setRoom,language} = useMainContext();
    const Navigate = useNavigate();
    const roomCodeRef = useRef();

    const getRoom = ()=>{
        if(roomCodeRef.current.value.length > 0){
            setIsError(false);
            setIsLoading(true);
            AuthNetwork.getRoom(roomCodeRef.current.value).then(room=>{
                if(room){
                    setRoom(room);
                    Navigate(`/room/${room.roomCode}`);
                }else{
                    setOpen(true);
                    setIsLoading(false)
                }
            })
        }else{
            setIsLoading(false);
            setIsError(true);
        }
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    return(
        <CodeWrapper>
            <Card minHeight="37vmax" width={"95%"}>
                <Title fontSize={"4vmax"}>
                   {language ? "כניסת מטיילים" : "Tourists Entrence"}
                </Title>
                <InputWrapper>
                    <Paragraph fontSize={"1.7vmax"} textAlign="center">
                        {language ? "מצטרפים לסיור? הכניסו את קוד החדר שקיבלתם מהמדריך כאן:" : "Joining a tour? Please enter the room code you got from the guide here:"}
                    </Paragraph>
                    <TextField 
                        id="roomCode"
                        label={language ? "הכנס קוד חדר" : "Insert code here"}
                        color="success"
                        autoComplete="off"
                        variant="standard"
                        sx={{...inputDesign, marginBottom: "0"}}
                        inputRef={roomCodeRef}
                        error={isError}
                        helperText={isError &&  (language ?  'יש למלא את השדה' : 'Please fill the input')}
                    />
                    <ButtonComponent 
                        isLoading={isLoading} 
                        title={language ? "הכנס לחדר" : 'Join room'}
                        onClick={()=>{getRoom()}}
                    />
                </InputWrapper>
            </Card>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                   {language ? 
                    "לא הצלחנו למצוא את החדר שאתם מבקשים.. נסו לבדוק את הקוד שהזנתם ולנסות שוב."
                    : "Incorrect room code. Please recheck the code you entered and try again"
                }
                 </Alert>
            </Snackbar> 
        </CodeWrapper>
    )
}