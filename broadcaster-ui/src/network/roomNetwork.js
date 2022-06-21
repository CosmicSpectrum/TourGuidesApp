import axios from 'axios';
import Cookie from 'js-cookie'

export default class RoomNetwork{
    static #baseUrl = 'http://localhost:3001/rooms';
    static #token = Cookie.get('auth-token');

    static createRoom(tourDescription){
        return axios.post(`${this.#baseUrl}/createRoom`, 
            {tourDescription}, 
            {headers: {"x-auth-token": this.#token}}).then(res=>{
                if(res.data.status){
                    return res.data.room;
                }
            }).catch(err=>{
                throw false;
            })
    }
}