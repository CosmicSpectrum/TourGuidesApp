import React,{useState, useRef} from "react";
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";
import {Title, Paragraph} from '../globalStyles/styles';
import { OtpWrapper } from "../ValidateOtp/styles";
import { inputDesign } from "../globalStyles/styles";
import AuthNetwork from "../../network/authFunctions";
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useMainContext } from "../../context/appContext";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CreateNewPassword(){
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessagae] = useState("")
    const [firstError,setFirstError]= useState(false);
    const [secondError,setSecondError]= useState(false);
    const [email, setEmail] = useState(new URLSearchParams(window.location.search).get('email'));
    const [otp, setOtp] = useState(sessionStorage.getItem('otp'));
    const [open, setOpen] = useState(false);
    const firstPasswordRef = useRef();
    const secondPasswordRef = useRef();
    const Navigate = useNavigate();
    const {language} = useMainContext();
    

    const updatePassword = ()=>{
        if(comparePasswords() && validateEmptyFileds()){
            setIsLoading(true);
            AuthNetwork.updatePassword(otp,email, firstPasswordRef.current.value).then(res=>{
                if(res.status){
                    Cookie.set("auth-token", res.token, {expires: 1});
                    sessionStorage.removeItem('otp');
                    Navigate('/createRoom');
                }
            }).catch(err=>{
                setMessagae(language ? 'אופס.. קרתה תקלה אצלנו, נסו שוב בעוד מספר דקות' : "Oops... Somthing went wrong. Please try again later");
                setOpen(true);
                setIsLoading(false);
            })
        }
        setFirstError(firstPasswordRef.current.value.length === 0)
        setSecondError(secondPasswordRef.current.value.length === 0)
    }

    const comparePasswords = ()=>{
        if(firstPasswordRef.current.value === secondPasswordRef.current.value){
            return true;
        }else{
            setMessagae(language ? 'שימו לב שהסיסמאות שהזנתם אינן תואמות' : "The passwords you've entered doesn't match");
            setOpen(true);
            return false;
        }
    }

    const validateEmptyFileds = ()=>{
        if(firstPasswordRef.current.value.lenght !== 0 && secondPasswordRef.current.value.lenght !== 0){
            return true;
        }else{
            return false;
        }
    }

    const handleClose = ()=>{
        setOpen(false);
    }


    return (
        <OtpWrapper>
            <Title fontSize={"4vmax"}>
                {language ? "איפוס סיסמה" : "Create New Password"}
            </Title>
            <Paragraph fontSize={"1.7vmax"}>
                {language ? "אנא הזן את הסיסמה החדשה" : "Please enter the new password"}
            </Paragraph>
            <TextField 
                id="firstType"
                label={language ? "סיסמה חדשה" : "New Password"}
                sx={inputDesign}
                autoComplete="off"
                variant="standard"
                color="success"
                type="password"
                inputRef={firstPasswordRef}
                error={firstError}
                helperText={firstError && (language ? "יש למלא שדה זה" : "Please fill the input")}
            />
            <TextField 
                id="secondType"
                label={language ? "אימות סיסמה" : "Reenter password"}
                sx={inputDesign}
                autoComplete="off"
                variant="standard"
                color="success"
                type={"password"}
                error={secondError}
                inputRef={secondPasswordRef}
                helperText={secondError && (language ? "יש למלא שדה זה" : "Please fill the input")}
            />
            <ButtonComponent 
                isLoading={isLoading}
                title={language ? "אפס סיסמה" : "Submit"}
                onClick={()=>{updatePassword()}}
            />
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={'error'} sx={{ width: '100%' }}>
                    {message}
                 </Alert>
            </Snackbar> 
        </OtpWrapper>
    )
}