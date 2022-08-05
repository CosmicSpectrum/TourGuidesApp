const {Schema, model} = require('mongoose');

const FileMetadataSchema = new Schema({
    uid: {type: String, required: true,index: {unique: true}},
    mimeType: {type:String, required: true},
    fileName:{type: String, required: true},
    isPublic: {type: Boolean, required: true},
    fileOwner: {type: Schema.Types.ObjectId, required: true, ref: 'tourguides'},
    created_at: { type: Date, required: true, default: Date.now }
})

FileMetadataSchema.index({fileName: "text"});

module.exports = model('FileMetadata', FileMetadataSchema);