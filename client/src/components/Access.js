import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

function Access({ children }) {
    const currentUser = localStorage.getItem("currentUser");
  
    // Überprüfen, ob ein Benutzer angemeldet ist
    if (!currentUser) {
        return (
            <Navigate to="/home" replace={true} />
        );
    }
  
    const userData = JSON.parse(currentUser);

    // Überprüfen, ob der angemeldete Benutzer ein Admin ist
    if (!userData.isAdmin) {
        return (
            <Navigate to="/home" replace={true} />
          );
    }

    return (
        <>{ children }</>
    );
}

Access.propTypes = {
  children: PropTypes.node,
};

export default Access;