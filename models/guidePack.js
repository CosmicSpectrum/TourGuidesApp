const {Schema, model} = require('mongoose');

const GuidePackSchema = new Schema({
    packName: {type: String, required: true},
    packItems: {type: Array, required: true},
    created_at: { type: Date, required: true, default: Date.now }
});

module.exports = model('GuidePacks', GuidePackSchema);