import React from "react";
import {Title, Card} from '../globalStyles/styles';
import { LoginWrapper,InputWrappers, inputDesign } from "./style";
import TextField from '@mui/material/TextField';

export default function LoginForm(){
    return (
        <LoginWrapper>
            <Card height="45vmax" width="95%">
                <Title fontSize={"4vmax"}>
                    כניסת מורי דרך
                </Title>
                <InputWrappers>
                    <TextField id="username" sx={inputDesign} color="success" autoComplete={"off"} label="שם משתמש" variant="standard" />
                    <TextField id="password" sx={inputDesign} color="success" autoComplete={"off"} label="סיסמה" variant="standard" />
                </InputWrappers>
            </Card>
        </LoginWrapper>
    )
}