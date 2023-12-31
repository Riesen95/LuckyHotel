import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Space, Tag } from 'antd';

const { TabPane } = Tabs;

const Profilescreen = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-10">
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="My Bookings" key="1">
            <MyBookings />
          </TabPane>
          <TabPane tab="My Profile" key="2">
            <div className="row justify-content-left mt-5">
              <div className="col-md-6">
                <div className="bs">
                  <h1>My Profile</h1>
                  <p>
                    <b>Name:</b> {user.name}
                  </p>
                  <p>
                    <b>Email:</b> {user.email}
                  </p>
                  <p><b>isAdmin:</b> {user?.isAdmin ? "YES" : "No"}</p>
                 
                  
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
    
  );
};

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [rooms, setRooms] = useState([]);
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setloading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        setRooms(response.data);
        setbookings(response.data);
        setloading(false);
      } catch (error) {
        console.log("Error fetching bookings:", error);
        setloading(false);
        seterror(error);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, []);

  const cancelBooking = async (bookingid, roomid) => {
    try {
      setloading(true);
      const result = await axios.post("/api/bookings/cancelbooking", {
        bookingid,
        roomid,
      }).data;
      console.log(result);
      setloading(false);
      Swal.fire("Congrats", "Your booking has been cancelled", "success").then(
        (result) => {
          window.location.reload();
        }
      );
    } catch (error) {
      console.log(error);
      setloading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking) => (
              <div className="bs">
                <h1>{booking.room}</h1>
                <p>
                  <b>BookingId</b> : {booking._id}
                </p>
                <p>
                  <b>CheckIn:</b>{" "}
                  {new Date(parseInt(booking.fromdate)).toLocaleDateString()}
                </p>
                <p>
                  <b>Checkout:</b>{" "}
                  {new Date(parseInt(booking.todate)).toLocaleDateString()}
                </p>
                <p>
                  <b>Amount:</b> {booking.totalamount}€
                </p>
                <p>
                  <b>Status</b>:{" "}
                  {booking.status==='cancelled'? (<Tag color="red">CANCELED</Tag>) :(<Tag color="green">CONFIRMED</Tag>)}
                </p>

                {booking.status !== "cancelled" && (
                  <div className="text-right">
                    <button
                      className="btn"
                      onClick={() => {
                        cancelBooking(booking._id, booking.roomid);
                      }}
                    >
                      CANCEL BOOKING
                    </button>
                  </div>
                )}
              </div>
            ))}
          {error && <Error message={error.toString()} />}
        </div>
      </div>
    </div>
  );
}
