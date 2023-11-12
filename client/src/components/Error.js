import React from "react";
import Alert from "react-bootstrap/Alert";

function Error({ message }) {
  return (
    <div>
      <Alert variant="danger">
        <Alert.Heading>Error!</Alert.Heading>
        {message}
      </Alert>
    </div>
  );
}

export default Error;
