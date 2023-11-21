import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from 'sweetalert2'

function Bookingscreen() {
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [room, setroom] = useState();
  let { roomid } = useParams();
  let { fromdate, todate } = useParams();

  const firstdate = moment(parseInt(fromdate, 10));
  const lastdate = moment(parseInt(todate, 10));
  const totaldays = moment.duration(lastdate.diff(firstdate)).asDays();
  const [totalamount, settotalamount] = useState();
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser"))
    : null;

  useEffect(() => {
    const fetchData = async () => {
      // if(!localStorage.getItem('currenUser')){
      //   window.location.href='/login'
      // }


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

  // Zum Bezahlen der Token von Stripe+Bookroom
  async function onToken(token) {
    
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Überprüfen, ob der Benutzer eingeloggt ist
    if (currentUser && currentUser._id) {
      const bookingDetails = {
        room,
        userid: currentUser._id,
        fromdate: parseInt(fromdate, 10),
        todate: parseInt(todate, 10),
        totalamount,
        totaldays,
        token,
      };
      try {
        setloading(true);
        const result = await axios.post("/api/bookings/bookroom",bookingDetails);
        setloading(false);
        Swal.fire('Congratulation',' Your Room booked Successfully','success').then(result=>{
          window.location.href='/profile'
        })
        
        
      } catch (error) {
        setloading(false)
        Swal.fire('Oops','Something went wrong','error')

        // Fehlerbehandlung
      }
    } else {
      // Benutzer ist nicht eingeloggt, also Meldung anzeigen oder auf Login-Seite umleiten

      alert("Bitte loggen Sie sich ein, um ein Zimmer zu buchen");
      // Hier können Sie auch eine Umleitung zur Login-Seite einfügen
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
                  <p>Name :{currentUser ? currentUser.name : "Gast"} </p>
                  <p>From Date : {firstdate.format("DD-MM-YYYY")}</p>
                  <p>To Date : {lastdate.format("DD-MM-YYYY")}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total nights : {totaldays} </p>
                  <p>Price Per night : {room.rentperday} </p>
                  <p>Total Price : {totalamount} </p>
                </b>
              </div>
              <div style={{ float: "right" }}>
                <StripeCheckout
                  amount={totalamount * 100}
                  token={onToken}
                  currency="EUR"
                  stripeKey="pk_test_51OEAUFDsVLAUyGpWVbh0AC6iOyDmqQteksozLsAYQkfbrJPKC6mUQL5soi4nUu2OtMrxhq2Vj0rAfvX6LSGgIzr000QLKpfFVz"
                >
                  <button className="btn btn-primary">Pay Now</button>
                </StripeCheckout>
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
