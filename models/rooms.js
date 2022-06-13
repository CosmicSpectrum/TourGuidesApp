const {Schema, model} = require("mongoose");

const roomSchema = new Schema({
    roomCreator: {type: String, required: true, index: {unique: true}},
    roomCode: {type: String, required: true},
    guideName: {type: String, required: true},
    tourDescription: {type: String}
})


module.exports = model("guideRooms",roomSchema);