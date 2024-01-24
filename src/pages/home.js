import { Col, message, Row, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Flight from "../components/Flight";
import { LoadingOutlined } from "@ant-design/icons";

function Home() {
  const [filters = {}, setFilters] = useState({
    from: "",
    to: "",
    journeyDate: "",
  });
  const [flights, setFlights] = useState([]);

  const getFlights = async () => {
    const response = await axios.get("https://unqi17shmd.execute-api.us-east-1.amazonaws.com/dev/flights");
    if (response.status === 200) {
      setFlights(response.data.data);
    } else {
      message.error(response.data.message);
    }
  };

  useEffect(() => {
    getFlights();
  }, []);
  return (
    <div>
      <div className="my-3 py-1">
        <Row gutter={10} align="center">
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="From"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="text"
              placeholder="To"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            />
          </Col>
          <Col lg={6} sm={24}>
            <input
              type="date"
              placeholder="Date"
              value={filters.journeyDate}
              onChange={(e) =>
                setFilters({ ...filters, journeyDate: e.target.value })
              }
            />
          </Col>
          <Col lg={6} sm={24}>
            <div className="d-flex gap-2">
              <button className="primary-btn" onClick={() => getFlights()}>
                Filter
              </button>
              <button
                className="outlined px-3"
                onClick={() =>
                  setFilters({
                    from: "",
                    to: "",
                    journeyDate: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </Col>
        </Row>
      </div>
      <div>
        {flights.length === 0 ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                  color: "blue",
                }}
                spin
              />
            }
          />
        ) : (
          <Row gutter={[15, 15]}>
            {flights
              .filter((flight) => {
                if (
                  filters.from === "" &&
                  filters.to === "" &&
                  filters.journeyDate === ""
                ) {
                  return true;
                }
                return (
                  flight.origin === filters.from && flight.destination === filters.to
                );
              })
              .map((flight) => (
                <Col lg={12} xs={24} sm={24}>
                  <Flight flight={flight} />
                </Col>
              ))}
          </Row>
        )}
      </div>
    </div>
  );
}
export default Home;
