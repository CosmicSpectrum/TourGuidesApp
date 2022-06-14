import React, {useState,useRef} from "react";
import {Title, Card, Label, inputDesign, Paragraph} from '../globalStyles/styles';
import { LoginWrapper,InputWrappers } from "./style";
import TextField from '@mui/material/TextField';
import ButtonComponent from "../Button/ButtonComponent";
import AuthNetwork from "../../network/authFunctions";
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm(){
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorUsername, setUsernameError] = useState(false);
    const [isErrorPassword, setPasswordError] = useState(false);
    const [snackBarMessage, setMessage] = useState('')
    const [toggleResetPassword, setResetPassword] = useState(true);
    const [open, setOpen] = useState(false);
    const [isSuccessfulRequest, setSuccesseful] = useState(false);
    const Navigate = useNavigate();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();

    const login = ()=>{
        if(usernameRef.current.value.length !== 0 && passwordRef.current.value.length !== 0 ){
            setIsLoading(true);
            AuthNetwork.login(usernameRef.current.value,passwordRef.current.value).then(token=>{
                if(token){
                    Cookie.set('auth-token', token,{expires: 1});
                    Navigate('/createRoom');
                }else{
                    setMessage('שם משתמש או סיסמה אינם נכונים.');
                    setOpen(true);
                    setIsLoading(false);
                }
            }).catch(err=>{
                setIsLoading(false);
                setMessage("קרתה תקלה אצלנו, נסו להתחבר שנית מאוחר יותר.");
                setOpen(true);
            })
        }
        setPasswordError(passwordRef.current.value.length === 0);
        setUsernameError(usernameRef.current.value.length === 0);
    }

    const resetPasswordRequest = ()=>{
        if(emailRef.current.value.length !== 0){
            setIsLoading(true);
            AuthNetwork.requestPasswordChange(emailRef.current.value).then(status=>{
                if(status){
                    setOpen(true);
                    setIsLoading(false);
                    setMessage("נשלח מייל לאיפוס הסיסמה למייל אותו הזנתם.");
                    setSuccesseful(true);
                }else{
                    setOpen(true);
                    setIsLoading(false);
                    setMessage("המייל שהזנתם לא שייך לאף משתמש רשום, בדקו את האיות ונסו שנית.");
                }
            }).catch(err=>{
                setOpen(true);
                setIsLoading(false)
                setMessage("קרתה תקלה אצלנו, נסו להתחבר שנית מאוחר יותר.");
            })
        }
    }

    const handleClose = ()=>{
        setOpen(false);

        if(isSuccessfulRequest){
            setSuccesseful(false);
        }
    }

    return (
        <LoginWrapper>
            <Card height="45vmax" width="95%">
            {toggleResetPassword ? <InputWrappers>
                    <Title fontSize={"4vmax"} marginBottom={'0'}>
                        כניסת מורי דרך
                    </Title>
                    <TextField 
                        id="username" 
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label="שם משתמש" 
                        variant="standard" 
                        inputRef={usernameRef}
                        error={isErrorUsername}
                        helperText={isErrorUsername ? 'יש למלא את השדה' : ''}
                    />
                    <TextField 
                        type={"password"} 
                        id="password" 
                        sx={{...inputDesign, marginBottom: "0"}} 
                        color="success" 
                        autoComplete={"off"} 
                        label="סיסמה" 
                        variant="standard" 
                        inputRef={passwordRef}
                        error={isErrorPassword}
                        helperText={isErrorPassword ? 'יש למלא את השדה' : ''}
                    />
                    <ButtonComponent 
                        title="התחבר" 
                        isLoading={isLoading}
                        onClick={()=>{login()}}
                    />
                    <Label marginTop={"3%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
                        שכחת סיסמה?
                    </Label>
                </InputWrappers> : 
                <InputWrappers>
                    <Title fontSize={"4vmax"}>
                        איפוס סיסמה
                    </Title>
                    <Paragraph fontSize={'1.7vmax'}>
                        הכנס את המייל שאיתו נרשמת למערכת:
                    </Paragraph>
                    <TextField 
                        id="email" 
                        type={"email"}
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label="הכנס כתובת אימייל" 
                        variant="standard" 
                        inputRef={emailRef}
                    />
                    <ButtonComponent 
                        title="אפס סיסמה" 
                        isLoading={isLoading} 
                        onClick={()=>{resetPasswordRequest();}}
                    />
                    <Label marginTop={"5%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
                        חזור להתחברות
                    </Label>
                </InputWrappers>
                }
            </Card>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={open} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={isSuccessfulRequest ? 'success' : 'error'} sx={{ width: '100%' }}>
                    {snackBarMessage}
                 </Alert>
            </Snackbar> 
        </LoginWrapper>
    )
}