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
                setMessagae('אופס.. קרתה תקלה אצלנו, נסו שוב בעוד מספר דקות');
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
            setMessagae('שימו לב שהסיסמאות שהזנתם אינן תואמות');
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
                איפוס סיסמה
            </Title>
            <Paragraph fontSize={"1.7vmax"}>
                אנא הזן את הסיסמה החדשה
            </Paragraph>
            <TextField 
                id="firstType"
                label={"סיסמה חדשה"}
                sx={inputDesign}
                autoComplete="off"
                variant="standard"
                color="success"
                type="password"
                inputRef={firstPasswordRef}
                error={firstError}
                helperText={firstError && "יש למלא שדה זה"}
            />
            <TextField 
                id="secondType"
                label={"אימות סיסמה"}
                sx={inputDesign}
                autoComplete="off"
                variant="standard"
                color="success"
                type={"password"}
                error={secondError}
                inputRef={secondPasswordRef}
                helperText={secondError && "יש למלא שדה זה"}
            />
            <ButtonComponent 
                isLoading={isLoading}
                title="אפס סיסמה"
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