import { useState, useEffect } from "react";
import React from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import Swal from "sweetalert2";

const Adminscreen = () => {
  //Für Admin Login
  
    useEffect(() => {
      const currentUser = localStorage.getItem("currentUser");
  
      // Überprüfen, ob ein Benutzer angemeldet ist
      if (!currentUser) {
        window.location.href = "/home";
        return;
      }
  
      const userData = JSON.parse(currentUser);
  
      // Überprüfen, ob der angemeldete Benutzer ein Admin ist
      if (!userData.isAdmin) {
        window.location.href = "/home";
      }

      






    }, []);
  
    // Rest Ihres Komponentencodes...

  


  // Diese Funktion wird aufgerufen, wenn ein Tab gewechselt wird
  const onChange = (key) => {};

  // Definition der Tabs
  const items = [
    {
      key: "1",
      label: "Bookings",
      children: <Bookings />,
    },
    {
      key: "2",
      label: "Rooms",
      children: <Rooms />,
    },

    {
      key: "3",
      label: "Add Room ",
      children: <AddRoom />,
    },
    {
      key: "4",
      label: "Users",
      children: <Users />,
    },
  ];

  return (
    <div className="mt-3 ml-3 m-3 bs">
      <h1>Admin Panel</h1>
      {/* Hier werden die Tabs gerendert */}
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
};

export default Adminscreen;

// FÜR BOOKINGS ÜBERSICHT
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const getBookings = async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/bookings/getallbookings")).data;
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(error);
    }
  };
  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Bookings</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Booking ID</th>
              <th>User ID</th>
              <th>Room</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const fromdate = new Date(
                parseInt(booking.fromdate)
              ).toLocaleDateString("de-DE");
              const todate = new Date(
                parseInt(booking.todate)
              ).toLocaleDateString("de-DE");

              return (
                <tr>
                  <td>{booking._id}</td>
                  <td>{booking.userid}</td>
                  <td>{booking.room}</td>
                  <td>{fromdate}</td>
                  <td>{todate}</td>
                  <td>{booking.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// FÜR ROOMS ÜBERSICHT
export function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getRooms = async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/rooms/getallrooms")).data; // Passen Sie die URL an Ihre API an
      setRooms(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  if (error) {
    return <Error />;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Rooms</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>Room ID</th>
              <th> Name</th>
              <th>Type</th>
              <th>Rent Per day</th>
              <th>Max Count</th>
              <th>Room Number</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              return (
                <tr>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{room.Type}</td>
                  <td>{room.rentperday}</td>
                  <td>{room.maxcount}</td>
                  <td>{room.roomNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// FÜR USER ÜBERSICHT

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getUsers = async () => {
    try {
      setLoading(true);
      const data = (await axios.get("/api/users/getallusers")).data; // Passen Sie die URL an Ihre API an
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (error) {
    return <Error />;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <h1>Users</h1>
        {loading && <Loader />}

        <table className="table table-bordered table-dark">
          <thead className="bs">
            <tr>
              <th>User ID</th>
              <th> Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? "YES" : "NO"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//Für Add Room

export function AddRoom() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [room, setroom] = useState();
  const [rentperday, setrentperday] = useState();
  const [maxcount, setmaxcount] = useState();
  const [description, setdescription] = useState();
  const [roomNumber, setroomNumber] = useState();
  const [type, settype] = useState();
  const [imageurl1, setimageurl1] = useState();
  const [imageurl2, setimageurl2] = useState();
  const [imageurl3, setimageurl3] = useState();

  const addRoom = async () => {
    const newRoom = {
      name: room,
      rentperday: rentperday,
      maxcount: maxcount,
      description: description,
      roomNumber: roomNumber,
      Type: type,
      imageurls: [imageurl1, imageurl2, imageurl3],
    };

    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/rooms/addRoom", newRoom)
      ).data;
      console.log(result);
      Swal.fire(
        "Congratulation",
        "New Room added successfully",
        "success"
      ).then(() => {
        window.location.href = "/home";
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  };

  return (
    <div className="row">
      {loading && <Loader />}
      <div className="col-md-5">
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="room name"
          value={room}
          onChange={(e) => {
            setroom(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="rent per day"
          value={rentperday}
          onChange={(e) => {
            setrentperday(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="max count"
          value={maxcount}
          onChange={(e) => {
            setmaxcount(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="description"
          value={description}
          onChange={(e) => {
            setdescription(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="room number"
          value={roomNumber}
          onChange={(e) => {
            setroomNumber(e.target.value);
          }}
        />
      </div>
      <div className="col-md-5">
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="Type"
          value={type}
          onChange={(e) => {
            settype(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="image URL 1"
          value={imageurl1}
          onChange={(e) => {
            setimageurl1(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="image URL 2"
          value={imageurl2}
          onChange={(e) => {
            setimageurl2(e.target.value);
          }}
        />
        <input
          type="text"
          style={{ marginBottom: "5px" }}
          className="form-control"
          placeholder="image URL 3"
          value={imageurl3}
          onChange={(e) => {
            setimageurl3(e.target.value);
          }}
        />
        <div className="text-right">
          <button className="btn mt-3" onClick={addRoom}>
            ADD ROOM
          </button>
        </div>
      </div>
    </div>
  );
}
