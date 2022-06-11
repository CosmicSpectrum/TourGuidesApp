const express = require('express');

const router = express.Router();

const Auth = require('../libs/auth');

const User = require('../models/users');

const Validator = require('../libs/validator');

router.post("/login", (req,res)=>{
    try{
        const {username, password} = req.body;
    
        if(Validator.checkLoginCardentials(username,password))
            return res.status('400').send("all inputs are required");
        
        User.findOne({username}, (err, user)=>{
            if(err) throw err;
            
            if(user){
                user.comparePasswords(password, (err, isMatch)=>{
                    if(err) throw err;
        
                    if(isMatch){
                        const token = Auth.createToken(user._id);
                        res.status(200).json({token});
                    }else{
                        return res.status(401).send('incorrect password')
                    }
                })
            }else{
                return res.status(401).send("user not found");
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).send("somthing went wrong");
    }

})

router.post("/createTourGuide", (req,res)=>{
    try{
        const {username, password, fullname, phonenumber} = req.body;
        
        const user = new User({
            username: username,
            password: password,
            fullname: fullname,
            phonenumber: phonenumber
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

module.exports = router;