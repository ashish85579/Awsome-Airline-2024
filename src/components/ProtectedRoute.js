import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "./DefaultLayout";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  

  const validateToken = async () => {
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
    } else {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>{<DefaultLayout>{children}</DefaultLayout>}</div>
  );
}

export default ProtectedRoute;
