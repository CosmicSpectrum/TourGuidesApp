import React from "react";
import {BarWrapper, UserLabelCenterWrapper, LogoutCenterWrapper} from './style'
import {Paragraph} from '../globalStyles/styles';
import { useMainContext } from "../../context/appContext";

export default function Bar({}){
    const {logout,user} = useMainContext();

    return (
        <BarWrapper>
            {user && 
            <>
                <LogoutCenterWrapper onClick={()=>{logout();}}>
                    <Paragraph textColor="white" fontSize="1.7vmax" textAlign="center">
                        התנתק
                    </Paragraph>
                </LogoutCenterWrapper>
            </>
            }
        </BarWrapper>
    )
}