import React, {useLayoutEffect,useEffect} from 'react';
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
import Broadcaster from './pages/broadcasterSide/BroadcasterSide';
import Listener from './pages/listenerSide/Listenter';
import {socket} from './utils/initiateSocket';
import isMobile from './utils/isMobile';
import NotSupported from './pages/NotSupported/NotSupported';
import Login from './pages/Login/Login';
import {CacheProvider} from '@emotion/react';
import createCache from '@emotion/cache';
import {prefixer} from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import {createTheme, ThemeProvider} from '@mui/material';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import Bar from './components/Bar/Bar';

const theme = createTheme({
  direction: 'rtl'
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin]
});

function App() {
  const navigation = useNavigate();

  useEffect(()=>{
    if(!isMobile()){
      navigation('/notSupported');
    }
  },[])

  useLayoutEffect(()=>{
    document.body.setAttribute("dir", 'rtl');
  })

  return (
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <Bar />
          <Routes>
            <Route path='/talker' element={<Broadcaster roomId={"1234"} socket={socket} />} />
            <Route path='/listener' element={<Listener roomId={"1234"} socket={socket} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/notSupported' element={<NotSupported />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='/' element={<Navigate to="/login" replace />} />
          </Routes>
        </ThemeProvider>
      </CacheProvider>
  );
}

export default App;
