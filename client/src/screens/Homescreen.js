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
    // Überprüft, ob 'dates' ein Array ist und mindestens zwei Elemente enthält
    if (Array.isArray(dates) && dates.length >= 2) {
      // Setzt die Uhrzeit des Startdatums auf 12:00 Uhr mittags
      dates[0].$d.setHours(12, 0, 0, 0);
      // Setzt die Uhrzeit des Enddatums auf 12:00 Uhr mittags
      dates[1].$d.setHours(12, 0, 0, 0);
      // Konvertiert das Startdatum in einen Zeitstempel
      const selFrom = dates[0].$d.getTime();
      // Konvertiert das Enddatum in einen Zeitstempel
      const selTo = dates[1].$d.getTime();
      // Aktualisiert den State für das Startdatum
      setfromdate(dates[0].$d);
      // Aktualisiert den State für das Enddatum
      settodate(dates[1].$d);

      // Erstellt ein temporäres Array für verfügbare Zimmer
      const temprooms = [];

      // Durchläuft alle Zimmer
      for (const room of rooms) {
        // Startet mit der Annahme, dass das Zimmer verfügbar ist
        let availability = true;
        // Überprüft, ob das Zimmer aktuelle Buchungen hat
        if (room.currentbookings.length > 0) {
          // Durchläuft alle Buchungen des Zimmers
          for (const booking of room.currentbookings) {
            // Konvertiert das Startdatum der Buchung in einen Zeitstempel
            const from = new Date(booking.fromdate).getTime();
            // Konvertiert das Enddatum der Buchung in einen Zeitstempel
            const to = new Date(booking.todate).getTime();

            // Überprüft, ob die Buchung mit dem ausgewählten Datum überschneidet
            if (to <= selFrom || from >= selTo) {
              availability = true;
            } else {
              availability = false;
              break;
            }
          }
        }
        // Fügt das Zimmer zum temporären Array hinzu, wenn es verfügbar ist
        if (availability) {
          temprooms.push(room);
        }
      }

      // Aktualisiert den State mit den gefilterten Zimmern
      setFilteredRooms(temprooms);
    } else {
      // Setzt das Start- und Enddatum zurück, wenn die Eingabe ungültig ist
      setfromdate(null);
      settodate(null);
      // Setzt die gefilterten Zimmer auf die Gesamtliste der Zimmer zurück
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
          <select
            className="form-control"
            value={Type}
            onChange={(e) => {
              filterByType(e.target.value);
            }}
          >
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
