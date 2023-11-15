import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

function Bookingscreen() {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [room, setroom] = useState();
  let { roomid } = useParams();
  let { fromdate, todate } = useParams();

  const firstdate = moment(fromdate, "DD-MM-YYY");
  const lastdate = moment(todate, "DD-MM-YYY");
  const totaldays = moment.duration(lastdate.diff(firstdate)).asDays() + 1;
  const [totalamount, settotalamount] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setloading(true);

        const response = await axios.get(`/api/rooms/getroombyid/${roomid}`);
        setroom(response.data);
        settotalamount(response.data.rentperday * totaldays);
        
      } catch (error) {
        console.error("Error fetching data: ", error);
        seterror(true);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, [roomid]);

    
    const bookroom = async () => {
        const bookingDetails = {
            room,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalamount,
            totaldays,
            
        }
        try {
            
            const result = await axios.post('/api/bookings/bookroom',bookingDetails)
           
        } catch (error) {
            
        }
    }


    


  return (
    <div className="m-5">
      {loading ? (
        <h1>
          {" "}
          <Loader />{" "}
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-6 text-center">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-6">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />

                <b>
                  <p>Name : </p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total days : {totaldays} </p>
                  <p>Price Per Day : {room.rentperday} </p>
                  <p>Total Price : {totalamount} </p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <button className="btn btn-primary" onClick={bookroom} >Pay Now</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default Bookingscreen;
