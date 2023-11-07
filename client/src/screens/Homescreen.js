import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";

function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true); // Initial sollte 'loading' true sein
  const [error, seterror] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data);
      } catch (error) {
        seterror(true);
        console.log(error);
      }
      setloading(false); // Set loading false hier nach try/catch
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader/>
        ) : rooms.length ? (
          rooms.map((room) => {
            return (
              <div key={room._id} className="col-md-9 mt-2">
                <Room room={room} />
              </div>
            );
          })
        ) : (
          <Error/>
          
        )}
      </div>
    </div>
  );
}

export default Homescreen;
