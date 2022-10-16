const {Schema, model} = require('mongoose');

const GuidePackSchema = new Schema({
    packName: {type: String, required: true},
    packItems: {type: Array, required: true},
    packOwner: {type: Schema.Types.ObjectId, required: true, ref: 'tourguides'},
    isPublic: {type: Boolean, required: true},
    created_at: { type: Date, required: true, default: Date.now }
});

module.exports = model('GuidePacks', GuidePackSchema);