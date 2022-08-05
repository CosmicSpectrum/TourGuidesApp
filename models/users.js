const {Schema, model} = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const usersSchema = new Schema({
    username: {type: String,required: true, index: {unique: true}},
    password: {type: String, required: true},
    fullname: {type: String, required: true},
    phonenumber: {type: String, required: true},
    guidePacks: {type: Array, required: true},
    email: {type: String, required: true, index: {unique: true}}
})

usersSchema.pre("save",function(next){
    let user = this;

    if(!user.isModified("password")) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt)=>{
        if(err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash)=>{
            if(err) return next(err);

            user.password = hash;
            next();
        })
    })
})

usersSchema.methods.comparePasswords = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, (err, isMatch)=>{
        if(err) return cb(err);
        
        cb(null, isMatch);
    })
}

module.exports = model('tourGuides', usersSchema);