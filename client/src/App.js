import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Route, Link} from 'react-router-dom'
import Homescreen from './screens/Homescreen';
import { Routes } from 'react-router-dom';


import Bookingscreen from './screens/Bookingscreen';

function App() {
 

    return (
      <div className="App">
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route path="/home" element ={<Homescreen />} />
            <Route path="/book/:roomid" element={<Bookingscreen />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
}

export default App;
