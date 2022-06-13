import axios from 'axios';

export default class AuthNetwork {
    static #baseUrl = 'http://localhost:3001/';

    static getRoom(roomCode){
        return axios.get(`${this.#baseUrl}rooms/getRoomByCode?roomCode=${roomCode}`).then(res=>{
            console.log(res.data);
            if(res.data.room){
                return res.data.room;
            }else{
                return null
            }
        }).catch(err=>{
            return null;
        })
    }

    static login(){

    }
}