import React ,{useState , useEffect, } from 'react';
import axios from 'axios';

 function Homescreen() {


   
    
    const [rooms, setrooms] = useState([]);
    
    useEffect(() => {
        async function fetchData() {
          try {
            const data = (await axios.get('/api/rooms/getallrooms')).data;
            setrooms(data);
          } catch (error) {
            console.log(error);
          }
        }
        fetchData();
      }, []);

        

    return (
        <div>
            <h1>Home screen</h1>
            <h1>Es sind {rooms.length} zimmer </h1>
            
        </div>
    );
    
}

export default Homescreen
