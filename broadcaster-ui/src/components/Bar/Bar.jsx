import React from "react";
import {LogoutCenterWrapper} from './style'
import {Paragraph} from '../globalStyles/styles';
import { useMainContext } from "../../context/appContext";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Drawer from "./Drawer/Drawer";



export default function Bar({}){
    const {logout,user, language, setLanguage} = useMainContext();

    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="sticky" color="success">
            <Toolbar>
            <Drawer />
              {user && 
            <>
                <LogoutCenterWrapper language={language} onClick={()=>{logout();}}>
                    <Paragraph textColor="white" fontSize="1.7vmax" textAlign="center">
                        {language ? "התנתק" : "Logout"}
                    </Paragraph>
                </LogoutCenterWrapper>
            </>
            }
            </Toolbar>
          </AppBar>
        </Box>
      );
}