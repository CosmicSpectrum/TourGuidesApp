import React, {useState, createContext} from 'react';
import {socket} from '../utils/initiateSocket';
import Cookie from 'js-cookie';
import AuthNetwork from '../network/authFunctions';

const MainContext = createContext();

const ContextProvider = ({children})=>{
    const [token, setToken] = useState(Cookie.get("auth-token"));
    const [user, setUser] = useState(null);
    const [roomCode, setRoomCode] = useState('');
    const [room, setRoom] = useState({});

    const getUser = ()=>{
        AuthNetwork.getUser().then((user)=>{
            setUser(user);
        }).catch(err=>{
            console.log(err);
            setUser(null);
        });
    }

    const logout = ()=>{
        Cookie.remove('auth-token');
        setUser(null);
    }


    const value = {token,setToken,roomCode,setRoomCode,room, setRoom, socket, user, getUser, setUser,logout};
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