import React, {useState, createContext} from 'react';
import {socket} from '../utils/initiateSocket';
import Cookie from 'js-cookie';

const MainContext = createContext();

const ContextProvider = ({children})=>{
    const [token, setToken] = useState(Cookie.get("auth-token"));
    const [roomCode, setRoomCode] = useState('');
    const [room, setRoom] = useState({});


    const value = {token,setToken,roomCode,setRoomCode,room, setRoom, socket};
    return <MainContext.Provider value={value}>{children}</MainContext.Provider>
}

const useMainContext = () => {
    const context = React.useContext(MainContext);
    if(context === undefined){
        throw new Error('useContext must be used in context provider');
    }
    return context;
}


export {useMainContext,ContextProvider};