import React from "react";
import {BarWrapper, Image,LogoWrapper, LogoutCenterWrapper, LanguageWrapper} from './style'
import {Paragraph} from '../globalStyles/styles';
import { useMainContext } from "../../context/appContext";
import imageSrc from '../../media/logonew.png';
import Cookie from 'js-cookie'

export default function Bar({}){
    const {logout,user, language, setLanguage} = useMainContext();

    return (
        <BarWrapper>
            {user && 
            <>
                <LogoutCenterWrapper language={language} onClick={()=>{logout();}}>
                    <Paragraph textColor="white" fontSize="1.7vmax" textAlign="center">
                        {language ? "התנתק" : "Logout"}
                    </Paragraph>
                </LogoutCenterWrapper>
            </>
            }
            <LogoWrapper>
                <Image src={imageSrc} />
            </LogoWrapper>
            <LanguageWrapper onClick={()=>{Cookie.set("language", !language); setLanguage(!language);}} language={language}>
                <Paragraph textColor="white" fontSize="1.7vmax" textAlign="center">
                    {language ? 'EN' : "עב"}
                </Paragraph>
            </LanguageWrapper>
        </BarWrapper>
    )
}