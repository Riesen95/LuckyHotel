import React, { useState, useEffect } from "react";

import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import "antd/dist/reset.css";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;
function Homescreen() {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState(true); // Initial sollte 'loading' true sein
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchkey, setsearchkey] = useState("");
  const [Type, setType] = useState("Alle");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setrooms(data);
        setFilteredRooms(data);
      } catch (error) {
        seterror(true);
        console.log(error);
      }
      setloading(false); // Set loading false hier nach try/catch
    }
    fetchData();
  }, []);

  function filterByDate(dates) {
    // const from = moment(dates[0].$d).format('DD-MM-YYYY');
    // const to = moment(dates[1].$d).format('DD-MM-YYYY');
    if (Array.isArray(dates) && dates.length >= 2) {
      dates[0].$d.setHours(12, 0, 0, 0);
      dates[1].$d.setHours(12, 0, 0, 0);
      const selFrom = dates[0].$d.getTime();
      const selTo = dates[1].$d.getTime();
      setfromdate(dates[0].$d);
      settodate(dates[1].$d);

      const temprooms = [];

      for (const room of rooms) {
        let availability = true;
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            const from = new Date(booking.fromdate).getTime();
            const to = new Date(booking.todate).getTime();

            if (to <= selFrom || from >= selTo) {
              availability = true;
            } else {
              availability = false;
              break;
            }
          }
        }
        if (availability) {
          temprooms.push(room);
        }
      }

      setFilteredRooms(temprooms);
    } else {
      setfromdate(null);
      settodate(null);
      setFilteredRooms([...rooms]);
    }
  }
  function filterBySearch(searchValue) {
    // Stellen Sie sicher, dass searchValue immer ein String ist
    const lowercasedFilter = (searchValue + "").toLowerCase();
    const filteredRooms = rooms.filter((room) =>
      room.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredRooms(filteredRooms);
  }

  //Funktion dass anzeigt mit Balkon oder ohne Balkon und alle
  function filterByType(Type) {
    setType(Type);
    if (Type === "Alle") {
      setFilteredRooms([...rooms]);
    } else {
      const filteredRooms = rooms.filter((room) => room.Type === Type);
      setFilteredRooms(filteredRooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <Space>
            <RangePicker format={"DD-MM-YYYY"} onChange={filterByDate} />
          </Space>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="search rooms"
            value={searchkey}
            onChange={(e) => {
              setsearchkey(e.target.value);
              filterBySearch(e.target.value);
            }}
          />
        </div>

        <div className="col-md-4">
          <select className="form-control" value={Type}onChange={(e)=>{filterByType(e.target.value)}}>
            <option value="Alle">Alle</option>
            <option value="Mit Balkon">Mit Balkon</option>
            <option value="Ohne Balkon">Ohne Balkon</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
  {loading ? (
    <Loader />
  ) : (
    filteredRooms.map((room) => {
      return (
        <div key={room._id} className="col-md-9 mt-2">
          <Room
            room={room}
            fromdate={fromdate}
            todate={todate}
            unavailable={!filteredRooms.find((r) => r._id === room._id)}
          />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Homescreen;
