import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  // If user is already logged in, redirect to the page they came from or feed
  if (user) {
    const from = location.state?.from || "/feed";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
