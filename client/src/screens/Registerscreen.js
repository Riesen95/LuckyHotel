import React, {useState, useEffect  } from 'react'
import axios from 'axios'

function Registerscreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword , setcpassword]=useState("");

  async function Register(){
    if(password===cpassword){
      const user={
        name,
        email,
        password,
        cpassword

      }
      try {
       const result= (await axios.post('/api/users/register',user)).data
        
      } catch (error) {
        console.log(error)
        
      }
    }
    else{
      alert('password not matched')
    }
  }





  return (
    <div>
      <div className='row d-flex justify-content-center align-items-center m-5'>

        <div className='col-md-5'>

              <div className='bs'>
                <h2>Register</h2>
                <input type='text' placeholder='Name' className='form-control ' 
                value = {name} onChange={(e)=>{setName(e.target.value)}}/>

                <input type='text' placeholder='Email' className='form-control ' 
                value = {email} onChange={(e)=>{setEmail(e.target.value)}}/>

                <input type='text' placeholder='Password' className='form-control ' 
                value = {password} onChange={(e)=>{setPassword(e.target.value)}}/>

                <input type='text' placeholder='Confirm password' className='form-control ' 
                value = {cpassword} onChange={(e)=>{setcpassword(e.target.value)}}/>

                <button className='btn btn-primary mt-3'  onClick={Register} >Register</button>
              </div> 
        </div>

      </div>

    </div>
  )
}

export default Registerscreen
