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
    const {language} = useMainContext();

    const handleValidation = ()=>{
        if(otpRef.current.value.length !== 0){
            setIsLoading(true)
            AuthNetwork.validateOtp(otpRef.current.value,email).then(isValidated=>{
                if(isValidated){
                    sessionStorage.setItem('otp', otpRef.current.value);
                    setValidateOtp(true);
                }else{
                    setOpen(true);
                    setIsLoading(false);
                    setMessage(language ? "הקוד שהוכנס איננו תקין. בדקו את הקוד ונסו שנית" : "Incorrect OTP. Please recheck the entered code and try again.");
                }
            }).catch(err=>{
                setOpen(true);
                setIsLoading(false);
                setMessage(language ? 'אופס.. קרתה תקלה אצלנו, נסו שנית מאוחר יותר' : "Oops... Somthing went wrong. Please try again later.");
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
            {language ? "קוד אימות" : "OTP validation"}
        </Title>
        <Paragraph fontSize='1.7vmax'>
            {language ? "אנא הזן את קוד האימות שנשלח אליך במייל" : "Please enter the Otp sent to you via email"}
        </Paragraph>
        <TextField 
            id="otp"
            label={language ? "הכנס קוד אימות" : "Insert OTP here"}
            sx={inputDesign}
            autoComplete="off"
            variant="standard"
            color="success"
            inputRef={otpRef}
            error={otpError}
            helperText={otpError && (language ? "יש למלא שדה זה" : "Please fill the input")}
        />
        <ButtonComponent  onClick={()=>{handleValidation()}} isLoading={isLoading} title={language ? "שלח" : "Submit"} />
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar> 
    </OtpWrapper>)
}