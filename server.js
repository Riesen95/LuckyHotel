const express = require("express");


const app = express();


const dbConfig = require('./db')
const roomsRoute = require('./routes/roomsRoute')
const usersRoute = require('./routes/usersRoute');
const bookinsRoute = require('./routes/bookingsRoute')


app.use(express.json()); // for parsing application/json


app.use('/api/rooms',roomsRoute)
app.use('/api/users',usersRoute)
app.use('/api/bookings',bookinsRoute)



const port = process.env.PORT || 5000;




app.listen(port, () => console.log(`Server  up and running on port ${port} !`));