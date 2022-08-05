const Auth = require('../libs/auth');
const User = require('../models/users');

const authenticateMiddleware = (req,res,next) => {
    const token = req.headers['x-auth-token'];

    if(!token){
        return res.status(403).send("token is needed in order to use api");
    }

    const {userid} = Auth.validateToken(token);
    User.findById(userid,['fullname','_id','phonenumber', 'email','guidePacks'], (err, user)=>{
        if(err){
            return res.status(500).send("sonthing went wrong");
        }
        
        if(user){
            req.user = user;
            return next();
        }else{
            return res.status(401).send('invalid token')
        }
    })
} 

module.exports = authenticateMiddleware;