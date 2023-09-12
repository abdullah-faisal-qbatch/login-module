import React, { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosUtils";
function AuthGuard({ children }) {
  const [renderChildren, setRenderChildren] = useState(false);
  const navigate = useNavigate();

  const checkAccessToken = useCallback(async () => {
    if (localStorage.getItem("loginMethod") !== "google") {
      try {
        const data = await api.getUserData();
        console.log("object: ", data.data);
        localStorage.setItem("profile", JSON.stringify(data.data));
        setRenderChildren(true);
      } catch (error) {
        if (error.response.status === 401) {
          navigate("/login");
          alert("Please login to continue!");
        }
      }
    } else if (localStorage.getItem("profile")) {
      setRenderChildren(true);
    } else {
      alert("User not authenticated!");
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

  return <>{renderChildren && children}</>;
}

export default AuthGuard;
