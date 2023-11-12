import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';
import Success from '../components/Success';



function Registerscreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcpassword] = useState("");

  const [loading, setloading] = useState(false)
  const [error, setError] = useState(""); // Zustand für Fehlermeldungen hinzufügen
  const [success, setSuccess] = useState(""); // Zustand für Erfolgsmeldungen hinzufügen

  async function Register() {
    if(password === cpassword) {
      const user = {
        name,
        email,
        password // Entfernen Sie cpassword, da es nicht an den Server gesendet werden soll
      };
      try {
        setloading(true)
        const result = await axios.post('/api/users/register', user);
        setloading(false)
        setSuccess(true); // Zustand für Erfolgsmeldungen hinzufügen

        setName("")
        setEmail("")
        setPassword("")
        setcpassword("")


        // Hier sollten Sie die Benutzer nach erfolgreicher Registrierung umleiten oder eine Erfolgsmeldung anzeigen
        
        console.log(result.data);
      } catch (error) {
        setloading(false)
        setError(true); // Zustand für Fehlermeldungen hinzufügen

        // Hier sollten Sie eine Fehlermeldung anzeigen, anstatt sie nur in der Konsole zu loggen
        setError(error.response.data.message); // Nehmen Sie an, dass der Server eine 'message' im Fehlerobjekt sendet
      }
    } else {
      // Anzeigen einer Benachrichtigung oder eines Alerts, dass die Passwörter nicht übereinstimmen
      setError("Die Passwörter stimmen nicht überein.");
    }
  }

  return (
    <div>
      {/* Fehlermeldung anzeigen, wenn vorhanden */}
      {loading && (<Loader/>)}
      {error && (<Error/>)}
      
      
      
      <div className='row d-flex justify-content-center align-items-center m-5'>
        <div className='col-md-5'>
        {success && (<Success message="User Registered Successfully"/>)}
          <div className='bs'>
            <h2>Registrieren</h2>

            {/* ...andere Eingabefelder... */}

            <input
              type='name'
              placeholder='Name'
              className='form-control'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/*Eingabefeld Email */}

            <input
              type='email'
              placeholder='Email'
              className='form-control'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
              
              
            {/*Eingabefeld Password */}

            <input
              type='password' // Ändern Sie den Typ zu 'password'
              placeholder='Password'
              className='form-control'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type='password' // Ändern Sie auch hier den Typ zu 'password'
              placeholder='Confirm password'
              className='form-control'
              value={cpassword}
              onChange={(e) => setcpassword(e.target.value)}
            />
          
            <button className='btn btn-primary mt-3' onClick={Register}>

              Registrieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
