import { message, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../components/PageTitle";
import { useReactToPrint } from "react-to-print";
import { Auth } from "aws-amplify";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

function Bookings() {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);

  const getBookings = async () => {
    var userdetails = await Auth.currentUserInfo();
    let email = userdetails.attributes.email;
    console.log(email);

    const response = await axios.get(
      "https://gwd21kprv7.execute-api.us-east-1.amazonaws.com/dev/user-booked-flights?email=" +
        email
    );

    if (response.status === 200) {
      setBookings(response.data.data);
    } else {
      message.error(response.data.message);
    }
  };

  const columns = [
    {
      title: "Flight Name",
      dataIndex: "name",
      key: "flight_name",
    },
    {
      title: "Flight Number",
      dataIndex: "_id",
      key: "flight_number",
    },
    {
      title: "Journey Date",
      dataIndex: "journeyDate",
    },
    {
      title: "Journey Time",
      dataIndex: "departure",
    },
    {
      title: "Seats",
      dataIndex: "seats",
      render: (seats) => {
        return seats.join(", ");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div>
          <p
            className="text-md underline"
            onClick={() => {
              setSelectedBooking(record);
              setShowPrintModal(true);
            }}
          >
            Print Ticket
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getBookings();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div>
      <PageTitle title="Bookings" />
      <div className="mt-2">
        {bookings.length === 0 ? (
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
          <Table dataSource={bookings} columns={columns} />
        )}
      </div>

      {showPrintModal && (
        <Modal
          title="Print Ticket"
          onCancel={() => {
            setShowPrintModal(false);
            setSelectedBooking(null);
          }}
          visible={showPrintModal}
          okText="Print"
          onOk={handlePrint}
        >
          <div className="d-flex flex-column p-5" ref={componentRef}>
            <p>Flight : {selectedBooking.name}</p>
            <p>
              {selectedBooking.from} - {selectedBooking.to}
            </p>
            <hr />
            <p>
              <span>Journey Date:</span>
              {selectedBooking.journeyDate}
            </p>
            <p>
              <span>Journey Time:</span> {selectedBooking.departure}
            </p>
            <hr />
            <p>
              <span>Seat Numbers:</span> <br />
              {selectedBooking.seats}
            </p>
            <hr />
            <p>
              <span>Total Amount:</span>{" "}
              {selectedBooking.fare * selectedBooking.seats.length} /-
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Bookings;
