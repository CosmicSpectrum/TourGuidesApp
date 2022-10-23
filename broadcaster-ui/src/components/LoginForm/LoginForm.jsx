import React, {useState,useRef, useEffect} from "react";
import {Title, Card, Label, inputDesign, Paragraph} from '../globalStyles/styles';
import { LoginWrapper,InputWrappers } from "./style";
import TextField from '@mui/material/TextField';
import ButtonComponent from "../Button/ButtonComponent";
import AuthNetwork from "../../network/authFunctions";
import Cookie from 'js-cookie';
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useMainContext } from "../../context/appContext";


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function LoginForm(){
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorUsername, setUsernameError] = useState(false);
    const [isErrorPassword, setPasswordError] = useState(false);
    const [isEmailError, setEmailError] = useState(false);
    const [snackBarMessage, setMessage] = useState('')
    const [toggleResetPassword, setResetPassword] = useState(true);
    const [open, setOpen] = useState(false);
    const [isSuccessfulRequest, setSuccesseful] = useState(false);
    const Navigate = useNavigate();
    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const {setUser, language} = useMainContext();

    useEffect(()=>{
        if(toggleResetPassword){
            passwordRef.current.value = null;
        }else{
            emailRef.current.value = null;
        }
    },[toggleResetPassword])

    const login = ()=>{
        if(usernameRef.current.value.length !== 0 && passwordRef.current.value.length !== 0 ){
            setIsLoading(true);
            AuthNetwork.login(usernameRef.current.value,passwordRef.current.value).then(response=>{
                if(response){
                    Cookie.set('auth-token', response.token,{expires: 1});
                    setUser(response.user);
                    Navigate('/createRoom');
                }else{
                    setMessage(language ? 'שם משתמש או סיסמה אינם נכונים.': "Incorrect username or password.");
                    setOpen(true);
                    setIsLoading(false);
                }
            }).catch(err=>{
                setIsLoading(false);
                setMessage(language ? "קרתה תקלה אצלנו, נסו להתחבר שנית מאוחר יותר." : "Oops... Somthing went wrong. Try again later");
                setOpen(true);
            })
        }
        setPasswordError(passwordRef.current.value.length === 0);
        setUsernameError(usernameRef.current.value.length === 0);
    }

    const resetPasswordRequest = ()=>{
        if(emailRef.current.value.length !== 0 && validateEmail(emailRef.current.value)){
            setIsLoading(true);
            AuthNetwork.requestPasswordChange(emailRef.current.value.toLowerCase()).then(status=>{
                if(status){
                    setOpen(true);
                    setIsLoading(false);
                    setMessage(language ? "נשלח מייל לאיפוס הסיסמה למייל אותו הזנתם." : "Check your email to continue the proccess.");
                    setSuccesseful(true);
                }else{
                    setOpen(true);
                    setIsLoading(false);
                    setMessage(language ? "המייל שהזנתם לא שייך לאף משתמש רשום, בדקו את האיות ונסו שנית." : "The email inserted doesn't exist, please check it and try again.");
                }
            }).catch(err=>{
                setOpen(true);
                setIsLoading(false)
                setMessage(language ? "קרתה תקלה אצלנו, נסו שנית מאוחר יותר." : "Oops... Somthing went wrong. Try again later");
            })
        }
        setEmailError(emailRef.current.value.length === 0 || !validateEmail(emailRef.current.value))
    }

    const handleClose = ()=>{
        setOpen(false);

        if(isSuccessfulRequest){
            setSuccesseful(false);
        }
    }

    const validateEmail = (email)=>{
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        if(!regex.test(email)){
            return false;
        }
        return true;
    }

    return (
        <LoginWrapper>
            <Card minHeight="45vmax" width="95%">
            {toggleResetPassword ? <InputWrappers>
                    <Title fontSize={"4vmax"} marginBottom={'0'}>
                        {language ? "כניסת מורי דרך" : "Guides Login"}
                    </Title>
                    <TextField 
                        id="username" 
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label={language ? "שם משתמש" : "Username"} 
                        variant="standard" 
                        inputRef={usernameRef}
                        error={isErrorUsername}
                        helperText={isErrorUsername && (language ? 'יש למלא את השדה' : "Please fill the input")}
                    />
                    <TextField 
                        type={"password"} 
                        id="password" 
                        sx={{...inputDesign, marginBottom: "0"}} 
                        color="success" 
                        autoComplete={"off"} 
                        label={language ? "סיסמה" : "Password"} 
                        variant="standard" 
                        inputRef={passwordRef}
                        error={isErrorPassword}
                        helperText={isErrorPassword && (language ? 'יש למלא את השדה' : "Please fill the input")}
                    />
                    <ButtonComponent 
                        title={language ? "התחבר" : "Login"} 
                        isLoading={isLoading}
                        onClick={()=>{login()}}
                    />
                    <Label marginTop={"3%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
                        {language ?"שכחת סיסמה?" : "Forgot Password?"}
                    </Label>
                </InputWrappers> : 
                <InputWrappers>
                    <Title fontSize={"4vmax"}>
                        {language ? "איפוס סיסמה" : "Reset Password"}
                    </Title>
                    <Paragraph fontSize={'1.7vmax'}>
                        {language ? "הכנס את המייל שאיתו נרשמת למערכת:" : "Please enter your email address:"}
                    </Paragraph>
                    <TextField 
                        id="email" 
                        type={"email"}
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label={language ? "הכנס כתובת אימייל" : "Insert mail here"} 
                        variant="standard" 
                        inputRef={emailRef}
                        helperText={isEmailError && (language ? 'הכנס כתובת מייל תקינה' : "Please enter a valid email address")}
                        error={isEmailError}
                    />
                    <ButtonComponent 
                        title={language ? "אפס סיסמה" : "Submit"} 
                        isLoading={isLoading} 
                        onClick={()=>{resetPasswordRequest();}}
                    />
                    <Label marginTop={"5%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
                        {language ? "חזור להתחברות" : "Back to login"}
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