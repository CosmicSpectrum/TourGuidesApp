import React from "react";
import {BrowserNotSupported} from "@mui/icons-material"
import {NotSupportedWrapper, NotSupportedTitle} from './style';

export default function NotSupported(){
    return(
        <NotSupportedWrapper>
            <BrowserNotSupported sx={{fontSize: "10vmin"}} />
            <NotSupportedTitle>
                שימו לב, האפליקציה מותאמת למובייל בלבד!
            </NotSupportedTitle>
        </NotSupportedWrapper>
    )
}