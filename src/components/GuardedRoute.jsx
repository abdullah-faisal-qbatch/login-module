import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosUtils";
function AuthGuard({ children }) {
  const [renderChildren, setRenderChildren] = useState(false);
  const navigate = useNavigate();

  const checkAccessToken = useCallback(async () => {
    try {
      if (localStorage.getItem("loginMethod") !== "google") {
        const data = await api.getUserData();
        console.log("object: ", data.data);
        localStorage.setItem("profile", JSON.stringify(data.data));
        setRenderChildren(true);
      } else {
        setRenderChildren(true);
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
        alert("Please login to continue!");
      }
    }
  }, [navigate]);

  useEffect(() => {
    const accessToken = localStorage.access_token;
    if (!accessToken && !localStorage.profile) {
      navigate("/login");
      alert("Please login to continue!");
      return;
    }
    checkAccessToken();
  }, [navigate, checkAccessToken]);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     const response = api.getUserData();
  //     if (response === 401) {
  //       // alert("Unauthentic user");
  //     } else {
  //       // alert("Authentic user");
  //       setRenderChildren(true);
  //     }
  //     return;
  //   }
  //   navigate("/login");
  //   alert("Please login to continue!");
  // }, [navigate]);

  return <>{renderChildren && children}</>;
}

export default AuthGuard;
