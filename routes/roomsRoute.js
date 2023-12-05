const express = require("express");
const router = express.Router();

const Room = require('../models/room')

router.get('/getallrooms', async (req, res) => {

    try {
        const rooms = await Room.find({});
        res.send(rooms)
    } catch (error) {
        return res.status(400).json({message: error});
        
    }

});

router.get('/getroombyid/:roomid', async (req, res) => {

    const roomid = req.params.roomid

    try {
        const room = await Room.findOne({_id:roomid})
        res.send(room)
    } catch (error) {
        return res.status(400).json({message: error});
        
    }

});

router.post('/addRoom', async (req, res) => {
    
        const newroom = req.body
    
        try {
            const room = new Room(newroom)
            await room.save()
            res.send('New Room added successfully')
        } catch (error) {
            return res.status(400).json({message: error});
            
        }
    
}),

module.exports = router;




