const jwt = require('jsonwebtoken');

module.exports = class Auth{
    static createToken(userid){
        return jwt.sign({userid},process.env.TOKEN_KEY);
    }

    static validateToken(token){
        return jwt.verify(token, process.env.TOKEN_KEY);
    }
}