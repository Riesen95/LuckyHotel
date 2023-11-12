import React from "react";
import Alert from "react-bootstrap/Alert";

function Success({message}) {
  return (
    <div>
      <Alert variant="success">
        <Alert.Heading>Success!</Alert.Heading>
        
        {message}
        
      </Alert>
    </div>
  );
}

export default Success;
