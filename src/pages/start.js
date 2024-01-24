import React from "react";
import "../resourses/global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import ProtectedRoute from "../components/ProtectedRoute";
import Bookings from "./Bookings";
import BookNow from "./bookNow";

const Start = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-now/:id"
            element={
              <ProtectedRoute>
                <BookNow />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Start;
