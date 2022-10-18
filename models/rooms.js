const {Schema, model, Types} = require("mongoose");

const roomSchema = new Schema({
    roomCreator: {type: String, required: true, index: {unique: true}},
    roomCode: {type: String, required: true},
    guideName: {type: String, required: true},
    tourDescription: {type: String},
    guidePack: {type: Types.ObjectId, ref: 'tourguides'},
    activeUsers: {type: Array, required: true}
})


module.exports = model("guideRooms",roomSchema);