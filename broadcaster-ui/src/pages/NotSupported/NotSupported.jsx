import React from "react";
import {BrowserNotSupported} from "@mui/icons-material"
import {NotSupportedWrapper, NotSupportedTitle} from './style';
import { useMainContext } from "../../context/appContext"; 

export default function NotSupported(){
    const {language} = useMainContext();

    return(
        <NotSupportedWrapper>
            <BrowserNotSupported sx={{fontSize: "10vmin"}} />
            <NotSupportedTitle>
                {language ? "שימו לב, האפליקציה מותאמת למובייל בלבד!" : "Please use mobile device in order to access the app!"}
            </NotSupportedTitle>
        </NotSupportedWrapper>
    )
}