import React from "react";
import { useNavigate } from "react-router-dom";

function Flight({ flight }) {
  const navigate = useNavigate();
  return (
    <div className="card p-2">
      <h1 className="text-lg primary-text">{flight.airline}</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <div>
          <p className="text-sm">From</p>
          <p className="text-sm">{flight.origin}</p>
        </div>

        <div>
          <p className="text-sm">To</p>
          <p className="text-sm">{flight.destination}</p>
        </div>

        <div>
          <p className="text-sm">Fare</p>
          <p className="text-sm">Rs. 5000</p>
        </div>
      </div>
      <hr />
      <div className="d-flex justify-content-between align-items-end">
        <div>
          <p className="text-sm">Joureny Date</p>
          <p className="text-sm">{flight.validFrom}</p>
        </div>

        <h1 className="text-lg underline secondary-text" onClick={()=>{
            navigate(`/book-now/${flight.flightNumber}`)
        }}>Book Now</h1>
      </div>
    </div>
  );
}

export default Flight;
