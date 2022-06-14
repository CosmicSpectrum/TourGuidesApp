const {Schema, model} = require('mongoose');

const PasswordResetSchema = new Schema({
    userId: {type: String, required: true},
    email: {type: String, required: true},
    otp: {type: String, required: true},
    created_at: { type: Date, required: true, default: Date.now }
});

PasswordResetSchema.index({"created_at": 1}, {expireAfterSeconds: 300})

module.exports = model("passwordResets", PasswordResetSchema);