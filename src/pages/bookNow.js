import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { Auth } from "aws-amplify";

function BookNow() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [user, setUser] = useState(null);

  const getFlight = async () => {
    const response = await axios.get(
      "https://unqi17shmd.execute-api.us-east-1.amazonaws.com/dev/flights?flightNumber=" + params.id
    );
    if (response.status === 200) {
      let newRes = response.data.data[0];
      newRes.seatsBooked = [1, 2, 3, 6, 7, 34, 23];
      newRes.noofSeatsBooked = 100 - newRes.seatsBooked.length;
      newRes.fare = 5000;
      newRes.capacity = 100;
      setFlight(newRes);
    } else {
      message.error(response.data.message);
    }
  };
  var getUser = async () => {
    var userdetails = await Auth.currentUserInfo();
    setUser(userdetails.attributes);
  };

  const bookNow = async () => {
    const response = await axios.post(
      "https://gwd21kprv7.execute-api.us-east-1.amazonaws.com/dev/user-booked-flights",
      {
        _id: params.id,
        email: user.email,
        departure: flight.scheduledDepartureTime,
        fare: selectedSeats.length * flight.fare * 100,
        from: flight.origin,
        journeyDate: flight.validFrom,
        name: flight.airline,
        seats: selectedSeats,
        to: flight.destination,
      }
    );

    if (response.status === 200) {
      console.log(response);
      message.success(response.data.message);
      navigate("/bookings");
    } else {
      message.error(response.data.message);
    }
  };

  const onToken = async (token) => {
    bookNow();
  };
  useEffect(() => {
    getUser();
    getFlight();
  }, []);
  return (
    <div>
      {flight && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{flight.airline}</h1>
            <h1 className="text-md">
              {flight.origin} - {flight.destination}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">Jourey Date : {flight.validFrom}</p>
              <p className="text-md">Fare : Rs. {flight.fare} /-</p>
              <p className="text-md">
                Departure Time : {flight.scheduledDepartureTime}
              </p>
              <p className="text-md">
                Arrival Time : {flight.scheduledArrivalTime}
              </p>
              <p className="text-md">Capacity : {flight.capacity}</p>
              <p className="text-md">Seats Left : {flight.noofSeatsBooked}</p>
            </div>
            <hr />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">
                Selected Seats : {selectedSeats.join(", ")}
              </h1>
              <h1 className="text-2xl mt-2">
                Fare : {flight.fare * selectedSeats.length} /-
              </h1>
              <hr />

              <StripeCheckout
                billingAddress
                token={onToken}
                amount={flight.fare * selectedSeats.length }
                currency="INR"
                stripeKey="pk_test_51IYnC0SIR2AbPxU0TMStZwFUoaDZle9yXVygpVIzg36LdpO8aSG8B9j2C0AikiQw2YyCI8n4faFYQI5uG3Nk5EGQ00lCfjXYvZ"
              >
                <button
                  className={`primary-btn ${
                    selectedSeats.length === 0 && "disabled-btn"
                  }`}
                  disabled={selectedSeats.length === 0}
                >
                  Book Now
                </button>
              </StripeCheckout>
            </div>
          </Col>
          <Col lg={12} xs={24} sm={24}>
            <SeatSelection
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              flight={flight}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default BookNow;
