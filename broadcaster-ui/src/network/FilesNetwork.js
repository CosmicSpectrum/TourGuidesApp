import axios from "axios";
import Cookie from 'js-cookie';

export default class FilesNetwork {
    static #baseUrl = 'http://localhost:3001/guidePacks';

    static async getUserFiles(){
        return axios.get(this.#baseUrl + "/getUserFiles", 
        {headers: {'x-auth-token': Cookie.get("auth-token")}}).then(files=>{
            return files.data && files.data.files;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static async getPublicFiles(){
        return axios.get(this.#baseUrl + '/getPublicFiles',
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(files=>{
            return files.data && files.data.files;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }
    
    static getUserPacks(){
        return axios.get(this.#baseUrl + '/getUserPacks',
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(packs=>{
            return packs.data && packs.data;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static getPublicPacks(){
        return axios.get(this.#baseUrl + '/getPublicPacks',
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(packs=>{
            return packs.data && packs.data;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static deletePack(packId){
        return axios.delete(this.#baseUrl + `/deletePack?packId=${packId}`,
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(result=>{
            if(result.data.status){
                return true;
            }else{
                return false;
            }
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static createPack(pack){
        return axios.post(this.#baseUrl + '/createPack',pack,
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(res=>{
            return res.data.status;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }
    
    static download(fileKey){
        return axios.get(this.#baseUrl + `/download?fileKey=${fileKey}`,
        {headers: {'x-auth-token': Cookie.get('auth-token')},
        responseType: 'blob'}).then(file=>{
            if(file.data){
                return file.data;
            }
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static delete(fileKey){
        return axios.delete(this.#baseUrl + `/delete?fileKey=${fileKey}`,
        {headers: {'x-auth-token': Cookie.get('auth-token')}})
        .then(res=>{
            return res.data.status ? true : false;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }

    static upload(fileInfo){
        return axios.post(this.#baseUrl + '/upload', fileInfo, 
        {headers: {'x-auth-token': Cookie.get('auth-token')}}).then(res=>{
            if(res.data.status){
                return res.data.fileKey;
            }
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }
}