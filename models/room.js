const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    maxcount:{
        type: Number,
        required: true,
    },
    roomNumber:{
        type: Number,
        required: false,
    },
    rentperday:{
        type: Number,
        required: true,
    },
    imageurls:[],
    currentbookings:[],
    Type:{
        type: String,
        required: false,
    },
    description: {

        type: String,Number,
    },
    

}, {
    timestamps: true,

})

const roomModel= mongoose.model('rooms', roomSchema)

module.exports = roomModel