import React from 'react'
import Alert from "react-bootstrap/Alert";

function Error() {
  return (
    <div>
        <Alert variant="danger">
            <Alert.Heading>Error!</Alert.Heading>
            <p>Something went wrong!</p>
            <hr />
            <p className="mb-0">Please try again.</p>
        </Alert>
      
    </div>
  )
}

export default Error
