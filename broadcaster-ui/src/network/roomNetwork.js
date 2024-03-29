import axios from 'axios';
import Cookie from 'js-cookie'

export default class RoomNetwork{
    static #baseUrl = '/rooms';

    static createRoom(tourDescription, guidePack){
        return axios.post(`${this.#baseUrl}/createRoom`, 
            {tourDescription, guidePack}, 
            {headers: {"x-auth-token": Cookie.get("auth-token")}}).then(res=>{
                if(res.data.status){
                    return res.data.room;
                }
            }).catch(err=>{
                throw false;
            })
    }

    static deleteRoom(roomId){
        return axios.delete(`${this.#baseUrl}/deleteRoom?roomId=${roomId}`, 
         {headers: {'x-auth-token': Cookie.get("auth-token")}}).then(res=>{
            if(res.data.status){
                return true;
            }
        }).catch(err=>{
            throw false;
        })
    }

    static getRoomByCreator(){
        return axios.get(`${this.#baseUrl}/getRoomByCreator`,
        {headers: {"x-auth-token": Cookie.get('auth-token')}}).then(res=>{
            if(res.data){
                return res.data;
            }
        }).catch(err=>{
            throw false;
        })
    }

    static getRoomByRoomCode(roomCode){
        return axios.get(`${this.#baseUrl}/getRoom?roomCode=${roomCode}`, 
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(res=>{
            if(res.data){
                return res.data;
            }
        }).catch(err=>{
            throw false;
        })
    }

    static getActiveListeners(roomCode){
        return axios.get(`${this.#baseUrl}/getListeners?roomCode=${roomCode}`,
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(res=>{
            if(res.data){
                return res.data.listeners;
            }
        }).catch(err=>{
            throw err;
        })
    }
}