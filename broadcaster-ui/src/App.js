import React, {useLayoutEffect,useEffect} from 'react';
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
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
import CreateRoom from './pages/CreateRoom/CreateRoom';
import AdminRoom from './pages/adminRoom/adminRoom';
import Cookie from 'js-cookie';
import Room from './pages/UserRoom/Room';
import {useMainContext} from './context/appContext'

const theme = createTheme({
  direction: 'rtl'
});

const themeLtr = createTheme({
  direction: "ltr"
})

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin]
});

const cacheLtr = createCache({
  key: "muiltr",
  stylisPlugins: [prefixer]
})

function App() {
  const navigation = useNavigate();
  const {language} = useMainContext();

  useEffect(()=>{
    if(!isMobile()){
      navigation('/notSupported');
    }
  },[])

  useLayoutEffect(()=>{
    document.body.setAttribute("dir", language ? 'rtl': 'ltr');
  })

  return (
      <CacheProvider value={language ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={language ? theme : themeLtr}>
          <Bar />
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/notSupported' element={<NotSupported />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='/createRoom' element={<CreateRoom />} />
            <Route path='/room-admin/:roomId' element={<AdminRoom />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path='/' element={!Cookie.get('auth-token') ? <Navigate to="/login" replace /> : <Navigate to="/createRoom" replace />} />
          </Routes>
        </ThemeProvider>
      </CacheProvider>
  );
}

export default App;
