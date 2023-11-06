import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Bookingscreen() {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState(false);
    const [room, setroom] = useState();
    let { roomid } = useParams(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setloading(true);
                
                const response = await axios.post("/api/rooms/getroombyid", { roomid: roomid });
                setroom(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
                seterror(true);
            } finally {
                setloading(false);
            }
        };

        fetchData();
       
    }, [roomid]);

    return (
        <div className="m-5">
            
            {loading?(<h1>Loading...</h1>): error ?(<h1>Error...</h1>) : (<div>

            <div className="row justify-content-center mt-5 bs">
                <div className="col-md-6 text-center">
                <h1>{room.name}</h1>
                    <img src={room.imageurls[0]} className="bigimg" />
                </div>

                <div className="col-md-6">
                    <div style={{textAlign:"right"}}>
                    <h1>Booking Details</h1>
                    <hr />

                    <b>
                    <p>Name : </p>
                    <p>From Date :</p>
                    <p>To Date :</p>
                    <p>Max Count : {room.maxcount}</p>
                    </b>
                    </div>

                    <div style={{textAlign:"right"}}>
                     <b>
                     <h1>Amount</h1>
                        <hr />
                        <p>Total days : </p>
                        <p>Price Per Day : {room.rentperday} </p>
                        <p>Total Price : </p>
                     </b>
                    </div>
                    <div style={{float:"right"}}>
                        <button className="btn btn-primary">Pay Now</button>
                    </div>
                    
                    
                    
                    
                </div>



            </div>

            </div>)}

        </div>
    );
}

export default Bookingscreen;
