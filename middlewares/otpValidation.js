const PasswordReset = require("../models/passwordReset");

const otpMiddleware = (req,res,next)=>{
    try{
        const otp = req.headers["x-otp-post-validation"];
        
            PasswordReset.findOne({otp}, (err, otpObject)=>{
                if(err) throw err;
        
                if(otpObject){
                    otpObject.remove(err=>{
                        if(err) throw err;
                        
                        next();
                    })
                }else{
                    return res.status(401).send("cannot access password change without a validated otp");
                }
        })
    }catch(err){
        return res.status(500).send("something went wrong");
    }
}

module.exports = otpMiddleware;