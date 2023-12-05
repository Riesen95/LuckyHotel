import React, { useState } from "react";

import axios from 'axios'
import Loader from '../components/Loader';
import Error from '../components/Error';

function Loginscreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false)
  const [error, setError] = useState(""); // Zustand für Fehlermeldungen hinzufügen



  async function Login() {
    const user = {
      email,
      password,
    };


    try {
      setloading(true)
      const result= (await axios.post('/api/users/login',user)).data
      setloading(false)
      localStorage.setItem('currentUser',JSON.stringify(result));
      window.location.href='/home'
      
       
     } catch (error) {
       console.log(error)
        setloading(false)
        setError(true); // Zustand für Fehlermeldungen hinzufügen
       
     }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {loading && (<Loader/>)}
      <div className="row d-flex justify-content-center align-items-center m-5">
        <div className="col-md-5">
        {error && (<Error message = 'Invalid Login'/>)}
          <div className="bs">
            <h2>Login</h2>

            <input
              type="text"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(event) => {
                  if (event.nativeEvent.key === 'Enter') {
                    Login();
                  }
                }}
              />
              
            </div>

            <button className="btn btn-primary mt-3" onClick={Login}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
