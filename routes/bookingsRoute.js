const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")("sk_test_51OEAUFDsVLAUyGpWcaP6FjtyF22MGKQZ6msuaNIC6fAI15yzhrFfhIWquE6XrfMa2i1h8Eg7WUmNwq1OAawXDUVf001UBIE8Bx");

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } = req.body;

  // Validierung der Eingabedaten
  if (!room || !userid || !fromdate || !todate || !totalamount || !totaldays || !token) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "EUR",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const booking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate,
        todate,
        totalamount,
        totaldays,
        transactionId: payment.id, // Hier sollten Sie die tatsächliche Transaktions-ID verwenden
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

      res.send("Payment Successful, Your Room is booked");
    } else {
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {

  const userid = req.body.userid

  try {
    const bookings = await Booking.find({userid : userid})
    res.send(bookings)

  } catch (error) {
    return res.status(400).json({error});

    
  }


})

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body; 
  try {
    const booking = await Booking.findOne({ _id: bookingid });
    if (booking) {
      booking.status = 'cancelled'; // Ändern Sie bookings in booking
      await booking.save();

      const room = await Room.findOne({ _id: roomid });
      if (room) {
        const bookings = room.currentbookings;
        const temp = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = temp;
        await room.save();

        res.send('Your booking cancelled successfully');
      } else {
        res.status(404).json({ message: "Room not found" });
      }
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});




module.exports = router;
