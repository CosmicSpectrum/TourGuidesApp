import axios from "axios";
import Cookie from 'js-cookie';

export default class FilesNetwork {
    static #baseUrl = 'http://localhost:3001/guidePacks';

    static getUserFiles(){
        return axios.get(this.#baseUrl + "/getUserFiles", 
        {headers: {'x-auth-token': Cookie.get("auth-token")}}).then(files=>{
            return files.data && files.data.files;
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }
    
    static download(fileKey){
        return axios.get(this.#baseUrl + `/download?fileKey=${fileKey}`,
        {headers: {'x-auth-token': Cookie.get('auth-token')},
        responseType: 'blob'}).then(file=>{
            console.log(file.data);
            if(file.data){
                return file.data;
            }
        }).catch(err=>{
            console.error(err);
            throw err;
        })
    }
}