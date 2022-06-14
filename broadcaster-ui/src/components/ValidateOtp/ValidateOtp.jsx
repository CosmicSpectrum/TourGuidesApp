import React, {useState, useRef} from "react";
import {Title, Paragraph, inputDesign} from '../globalStyles/styles';
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";
import {OtpWrapper} from './styles';
import AuthNetwork from "../../network/authFunctions";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useMainContext } from "../../context/appContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ValidateOtp({setValidateOtp}){
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setError] = useState(false);
    const [message, setMessage] = useState("");
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState(new URLSearchParams(window.location.search).get('email'));
    const otpRef = useRef();
    const {setRoomCode} = useMainContext();

    const handleValidation = ()=>{
        if(otpRef.current.value.length !== 0){
            setIsLoading(true)
            AuthNetwork.validateOtp(otpRef.current.value,email).then(isValidated=>{
                if(isValidated){
                    setValidateOtp(true);
                }else{
                    setRoomCode(otpRef.current.value);
                    setOpen(true);
                    setIsLoading(false);
                    setMessage("הקוד שהוכנס איננו תקין. בדקו את הקוד ונסו שנית");
                }
            }).catch(err=>{
                setOpen(true);
                setIsLoading(false);
                setMessage('אופס.. קרתה תקלה אצלנו, נסו שנית מאוחר יותר');
            })
        }
        setError(otpRef.current.value.length === 0)
    }

    const handleClose = ()=>{
        setOpen(false);
    }
    

    return (
    <OtpWrapper>
        <Title fontSize={'4vmax'}>
            קוד אימות
        </Title>
        <Paragraph fontSize='1.7vmax'>
            אנא הזן את קוד האימות שנשלח אליך במייל
        </Paragraph>
        <TextField 
            id="otp"
            label={"הכנס קוד אימות"}
            sx={inputDesign}
            autoComplete="off"
            variant="standard"
            color="success"
            inputRef={otpRef}
            error={otpError}
            helperText={otpError && "יש למלא שדה זה"}
        />
        <ButtonComponent  onClick={()=>{handleValidation()}} isLoading={isLoading} title="שלח" />
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar> 
    </OtpWrapper>)
}