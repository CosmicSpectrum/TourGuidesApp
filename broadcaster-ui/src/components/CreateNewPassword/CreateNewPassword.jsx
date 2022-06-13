import React from "react";
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";
import {Title, Paragraph} from '../globalStyles/styles';
import { OtpWrapper } from "../ValidateOtp/styles";
import { inputDesign } from "../globalStyles/styles";

export default function CreateNewPassword({isLoading = false}){
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
            />
            <TextField 
                id="secondType"
                label={"אימות סיסמה"}
                sx={inputDesign}
                autoComplete="off"
                variant="standard"
                color="success"
                type={"password"}
            />
            <ButtonComponent 
                isLoading={isLoading}
                title="אפס סיסמה"
            />
        </OtpWrapper>
    )
}