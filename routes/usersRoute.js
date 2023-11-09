const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require('bcrypt');
const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const someOtherPlaintextPassword = 'not_bacon';


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;  // Nehmen Sie die Daten aus der Anfrage

  try {
    // Hashen des Passworts, das vom Benutzer bereitgestellt wurde
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Erstellen eines neuen Benutzerobjekts mit dem gehashten Passwort
    const newuser = new User({
      name: name,
      email: email,
      password: hashedPassword  // Verwenden Sie das gehashte Passwort
    });

    // Speichern des neuen Benutzers in der Datenbank
    const savedUser = await newuser.save();

    // Senden einer Erfolgsmeldung zurück zum Client
    res.status(201).json({ message: "User Registered Successfully", user: savedUser });
  } catch (error) {
    // Wenn ein Fehler auftritt, senden Sie eine Fehlermeldung zurück zum Client
    return res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Finden des Benutzers anhand der E-Mail
    const user = await User.findOne({ email: email });

    if (user) {
      // Vergleichen des bereitgestellten Passworts mit dem gehashten Passwort in der Datenbank
      const validPass = await bcrypt.compare(password, user.password);
      if (validPass) {
        // Senden der Benutzerdaten ohne Passwort zurück zum Client
        const { password, ...userDataWithoutPassword } = user.toObject();
        res.json(userDataWithoutPassword);
      } else {
        // Ungültiges Passwort
        res.status(400).send("Invalid Login");
      }
    } else {
      // Kein Benutzer gefunden
      res.status(400).send("Invalid Login");
    }
  } catch (error) {
    // Fehlerbehandlung
    return res.status(400).json({ message: error.message });
  }
});
module.exports = router;

