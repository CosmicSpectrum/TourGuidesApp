import axios from 'axios';

export default class AuthNetwork {
    static #baseUrl = 'http://localhost:3001/';

    static getRoom(roomCode){
        return axios.get(`${this.#baseUrl}rooms/getRoomByCode?roomCode=${roomCode}`).then(res=>{
            if(res.data.room){
                return res.data.room;
            }else{
                return null
            }
        }).catch(err=>{
            throw null;
        })
    }

    static login(username,password){
        return axios.post(`${this.#baseUrl}auth/login`, {username,password}).then(res=>{
            if(res.data.token){
                return res.data.token;
            }else{
                return null;
            }
        }).catch(err=>{
            throw null;
        })
    }

    static requestPasswordChange(email){
        return axios.post(`${this.#baseUrl}auth/passwordResetRequest`, {insertedEmail: email}).then(res=>{
            if(res.data.status){
                return true;
            }else{
                return null;
            }
        }).catch(err=>{
            throw null;
        })
    }
}