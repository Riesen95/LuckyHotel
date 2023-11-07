const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/register", async (req, res) => {
  const newuser = new User(req.body);
  try {
    const user = await newuser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findone({ email: email, password: password });
    if (user) {
      res.send("Login Successfull");
    } else {
      res.send("Invalid Login");
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});
module.exports = router;
