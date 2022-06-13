import React from "react";
import {Title, Paragraph, inputDesign} from '../globalStyles/styles';
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";
import {OtpWrapper} from './styles'

export default function ValidateOtp({isLoading = false}){
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
        />
        <ButtonComponent isLoading={isLoading} title="שלח" />
    </OtpWrapper>)
}