const express = require('express');
const router = express.Router();
const Auth = require('../libs/auth');
const User = require('../models/users');
const PasswordReset = require('../models/passwordReset');
const mailer = require('../libs/mailer');
const Validator = require('../libs/validator');
const otpMiddleware = require('../middlewares/otpValidation');

router.post("/login", (req,res)=>{
    try{
        const {username, password} = req.body;
    
        if(Validator.checkLoginCardentials(username,password))
            return res.status(400).send("all inputs are required");
        
        User.findOne({username}, (err, user)=>{
            if(err) throw err;
            
            if(user){
                user.comparePasswords(password, (err, isMatch)=>{
                    if(err) throw err;
        
                    if(isMatch){
                        const token = Auth.createToken(user._id);
                        res.status(200).json({token});
                    }else{
                        return res.status(200).send('incorrect password')
                    }
                })
            }else{
                return res.status(200).send("user not found");
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("somthing went wrong");
    }

})

router.post("/createTourGuide", (req,res)=>{
    try{
        const {username, password, fullname, phonenumber,email} = req.body;
        
        const user = new User({
            username: username,
            password: password,
            fullname: fullname,
            phonenumber: phonenumber,
            email: email
        });

        user.save((err)=>{
            if(err) throw err;

            return res.status(201).json({status: true});
        })      
    }catch(err){
        console.log(err);
        return res.status(500).send("something went wrong");
    }
})


router.post('/passwordResetRequest', (req,res)=>{
    try{
        const {insertedEmail} = req.body;
        User.findOne({email: insertedEmail}, (err, user)=>{
            if(err) throw err;

            if(user){
                mailer.sendMail(insertedEmail).then(({status, otp}) =>{
                    if(status){
                        const passwordReset = new PasswordReset({
                            userId: user._id,
                            email: insertedEmail,
                            otp: otp
                        })

                        passwordReset.save(err=>{
                            if(err) throw err;

                            return res.status(200).json({status: true});
                        })
                    }
                }).catch(err=>{
                    throw err;
                })
            }else{
                return res.status(200).json({success: false});
            }
        })
    }catch(err){
        return res.status(500).send('something went wrong');
    }
})

router.post('/validateOtp', (req,res)=>{
    try{
        const {otp,email} = req.body;

        PasswordReset.findOne({email}, (err, otpObject)=>{
            if(err) throw err;

            if(otpObject){
                if(otp === otpObject.otp){
                    return res.status(200).json({validate: true});
                }else{
                    return res.status(200).json({validate: false});
                }
            }else{
                return res.status(200).json({validate: false});
            }
        })

    }catch(err){
        return res.status(500).send('somthing went wrong');
    }
})

router.patch('/updatePassword',otpMiddleware, (req,res)=>{
    try{
        const {email,newPassword} = req.body;

        User.findOne({email},(err, user)=>{
            if(err) throw err;

            if(user){
                user.password = newPassword;
    
                user.save(err=>{
                    if(err) throw err;
    
                    return res.status(200).json({status: true});
                })
            }else{
                return res.status(200).send("user not found");
            }
        })

    }catch(err){
        return res.status(500).send("somthing went wrong");
    }
})

module.exports = router;