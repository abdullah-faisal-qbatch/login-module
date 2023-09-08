import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosUtils";
function AuthGuard({ children }) {
  const [renderChildren, setRenderChildren] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const response = api.getUserData();
      if (response === 401) {
        // alert("Unauthentic user");
      } else {
        // alert("Authentic user");
        setRenderChildren(true);
      }
      return;
    }
    navigate("/login");
    alert("Please login to continue!");
  }, [navigate]);

  return <>{renderChildren && children}</>;
}

export default AuthGuard;
