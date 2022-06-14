const {Schema, model} = require('mongoose');

const PasswordResetSchema = new Schema({
    userId: {type: String, required: true},
    email: {type: String, required: true},
    otp: {type: String, required: true}
});

module.exports = model("passwordResets", PasswordResetSchema);