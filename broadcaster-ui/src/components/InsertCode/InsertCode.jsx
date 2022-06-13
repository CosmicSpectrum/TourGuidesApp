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
    const {setRoom} = useMainContext();
    const Navigate = useNavigate();
    const roomCodeRef = useRef();

    const getRoom = ()=>{
        if(roomCodeRef.current.value.length > 0){
            setIsError(false);
            setIsLoading(true);
            AuthNetwork.getRoom(roomCodeRef.current.value).then(room=>{
                if(room){
                    setRoom(room);
                    Navigate('/room');
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
            <Card height="37vmax" width={"95%"}>
                <Title fontSize={"4vmax"}>
                    כניסת מטיילים
                </Title>
                <InputWrapper>
                    <Paragraph fontSize={"1.7vmax"} textAlign="center">
                        מצטרפים לסיור? הכניסו את קוד החדר שקיבלתם מהמדריך כאן:
                    </Paragraph>
                    <TextField 
                        id="roomCode"
                        label="הכנס קוד חדר"
                        color="success"
                        autoComplete="off"
                        variant="standard"
                        sx={{...inputDesign, marginBottom: "0"}}
                        inputRef={roomCodeRef}
                        error={isError}
                        helperText={isError ? 'יש למלא את השדה' : ''}
                    />
                    <ButtonComponent 
                        isLoading={isLoading} 
                        title="הכנס לחדר"
                        onClick={()=>{getRoom()}}
                    />
                </InputWrapper>
            </Card>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    לא הצלחנו למצוא את החדר שאתם מבקשים.. נסו לבדוק את הקוד שהזנתם ולנסות שוב.
                 </Alert>
            </Snackbar> 
        </CodeWrapper>
    )
}