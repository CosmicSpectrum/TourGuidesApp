import axios from 'axios';
import Cookie from 'js-cookie'

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
                return res.data;
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

    static validateOtp(otp, email){
        return axios.post(`${this.#baseUrl}auth/validateOtp`, {email,otp}).then(res=>{
            if(res.data.validate){
                return true;
            }else{
                return false;
            }
        }).catch(err=>{
            return null;
        })
    }

    static updatePassword(otp,email, newPassword){
        return axios.patch(`${this.#baseUrl}auth/updatePassword`,
        {email, newPassword}, {
            headers: {'x-otp-post-validation': otp}}).then(res=>{
                if(res.data.status){
                    return {status: true, token: res.data.token};
                }else{
                    return false;
                }
            }).catch(err=>{
                return null;
            })
    }

    static getUser(){
        const authToken = Cookie.get("auth-token");
        return axios.get(`${this.#baseUrl}auth/getUser`,
        {headers: {"x-auth-token": authToken}}).then((res)=>{
            return res.data.user;
        }).catch(err=>{
            return null;
        })
    }
}