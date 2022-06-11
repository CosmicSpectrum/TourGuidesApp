module.exports = class Validator{
    static checkLoginCardentials(username, password){
        if(!(username && password)) return true;
        return false;
    }
}