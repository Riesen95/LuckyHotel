import React from "react";
import Alert from "react-bootstrap/Alert";

function Success() {
  return (
    <div>
      <Alert variant="success">
        <Alert.Heading>Success!</Alert.Heading>
        <p>Your booking was successful!</p>
        <hr />
        <p className="mb-0">You can view your bookings in the bookings tab.</p>
      </Alert>
    </div>
  );
}

export default Success;
