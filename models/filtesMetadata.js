const {Schema, model} = require('mongoose');

const FileMetadataSchema = new Schema({
    uid: {type: String, required: true,index: {unique: true}},
    mimeType: {type:String, required: true},
    created_at: { type: Date, required: true, default: Date.now }
})

module.exports = model('FileMetadata', FileMetadataSchema);