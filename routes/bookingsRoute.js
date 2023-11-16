const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

  try {
    const booking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate,
      todate,
      totalamount,
      totaldays,
      transactionId: "1234",
    });

    const newbooking = await booking.save();

    const from = new Date(fromdate);
    const to = new Date(todate);

    from.setHours(12, 0, 0, 0);
    to.setHours(12, 0, 0, 0);

    const roomtemp = await Room.findOne({ _id: room._id });
    roomtemp.currentbookings.push({
      bookingid: newbooking._id,
      fromdate: from,
      todate: to,
      userid,
      status: "booked",
    });

    await roomtemp.save();

    res.send("Room booked successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
