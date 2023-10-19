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
    roomnumber:{
        type: Number,
        required: true,
    },
    rentperday:{
        type: Number,
        required: true,
    },
    imageurls:[],
    correntbookings:[],
    type:{
        type: String,
        required: true,
    },
    description: {

        type: String,Number,
    },
    

}, {
    timestamps: true,

})

const roomModel= mongoose.model('rooms', roomSchema)

module.exports = roomModel