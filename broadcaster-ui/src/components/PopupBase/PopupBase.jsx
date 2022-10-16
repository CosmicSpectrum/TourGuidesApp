import React from 'react';
import {PopupOverlay, PopupBody} from './style';
import CloseIcon from '@mui/icons-material/Close';
import { useMainContext } from '../../context/appContext';

export default function PopupBase({height, width, setShown, children}){
    const {language} = useMainContext();

    return(
        <PopupOverlay>
            <PopupBody height={height} width={width} language={language}>
                <CloseIcon style={{padding: "15px"}} onClick={()=>setShown(false)} />
                {children}
            </PopupBody>
        </PopupOverlay>
    ) 

}