import React, {useState} from "react";
import {Title, Card, Label, inputDesign, Paragraph} from '../globalStyles/styles';
import { LoginWrapper,InputWrappers } from "./style";
import TextField from '@mui/material/TextField';
import ButtonComponent from "../Button/ButtonComponent";

export default function LoginForm(){
    const [isLoading, setIsLoading] = useState(false);
    const [toggleResetPassword, setResetPassword] = useState(true);

    return (
        <LoginWrapper>
            <Card height="45vmax" width="95%">
            {toggleResetPassword ? <InputWrappers>
                    <Title fontSize={"4vmax"}>
                        כניסת מורי דרך
                    </Title>
                    <TextField 
                        id="username" 
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label="שם משתמש" 
                        variant="standard" 
                    />
                    <TextField 
                        type={"password"} 
                        id="password" 
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label="סיסמה" 
                        variant="standard" 
                    />
                    <ButtonComponent 
                        title="התחבר" 
                        isLoading={isLoading} 
                    />
                    <Label marginTop={"5%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
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
                        sx={inputDesign} 
                        color="success" 
                        autoComplete={"off"} 
                        label="הכנס כתובת אימייל" 
                        variant="standard" 
                    />
                    <ButtonComponent 
                        title="אפס סיסמה" 
                        isLoading={isLoading} 
                    />
                    <Label marginTop={"5%"} onClick={()=>{setResetPassword(!toggleResetPassword)}}>
                        חזור להתחברות
                    </Label>
                </InputWrappers>
                }
            </Card>
        </LoginWrapper>
    )
}