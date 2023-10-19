const mongoose = require("mongoose");

var mongoURL = 'mongodb+srv://Riesen95:Amina1992@cluster0.0cdqqzg.mongodb.net/mern-rooms'

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

var connection = mongoose.connection

connection.on('error', () => {
    console.log('MongoDB connection failed')
})

connection.on('connected', () => {
    console.log('MongoDB Connection successful')
})

module.exports = mongoose