import React from "react";
import { Link } from "react-router-dom";


const Startscreen = () => {
  return (
    <div className="start">
      <h2 className="animated-title">Lucky Hotel</h2>
      <h2>Book your room and enjoy your stay</h2>
      <Link to="/home">
        <button className="btn btn-primary">Start Rooms View</button>
      </Link>
    </div>
  );
};

export default Startscreen;
