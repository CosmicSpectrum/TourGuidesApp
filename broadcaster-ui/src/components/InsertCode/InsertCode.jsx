import React, {useState} from "react";
import {Card, Title, Paragraph, inputDesign} from '../globalStyles/styles'
import {CodeWrapper, InputWrapper} from './styles'
import { TextField } from "@mui/material";
import ButtonComponent from "../Button/ButtonComponent";

export default function InsertCode(){
    const [isLoading, setIsLoading] = useState(false);

    return(
        <CodeWrapper>
            <Card height="37vmax" width={"95%"}>
                <Title fontSize={"4vmax"}>
                    כניסת מטיילים
                </Title>
                <InputWrapper>
                    <Paragraph fontSize={"1.7vmax"} textAlign="center">
                        מצטרפים לסיור? הכניסו את קוד החדר שקיבלתם מהמדריך כאן:
                    </Paragraph>
                    <TextField 
                        id="roomCode"
                        label="הכנס קוד חדר"
                        color="success"
                        autoComplete="off"
                        variant="standard"
                        sx={inputDesign}
                    />
                    <ButtonComponent 
                        isLoading={isLoading} 
                        title="הכנס לחדר"
                    />
                </InputWrapper>
            </Card>
        </CodeWrapper>
    )
}