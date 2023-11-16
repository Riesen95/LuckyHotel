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
            const from = (new Date(booking.fromdate)).getTime();
            const to = (new Date(booking.todate)).getTime();
            
            if (
              to <= selFrom || from >= selTo
            ) {
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

  return (
    <div className="container">
      <div className="row mt-5">
        <div className="col-md-3">
          <Space>
            <RangePicker format={"DD-MM-YYYY"} onChange={filterByDate} />
          </Space>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length ? (
          rooms.map((room) => {
            return (
              <div key={room._id} className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate} unavailable={!filteredRooms.find(r => r._id === room._id)} />
              </div>
            );
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
