import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../Header/Header";

const ProtectedRoute = ({ element: Component,loggedIn,emailUser,...props }) => {

  return loggedIn ? (
    <>
      <Component {...props} />
    </>
  ) : (
    <Navigate to={"/signin"} replace />
  );
};

export default ProtectedRoute;
