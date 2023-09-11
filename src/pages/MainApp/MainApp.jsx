/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import logo from "./../../logo.svg";
import "./../../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MainApp = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("profile"))
  );

  console.log("here");

  useEffect(() => {
    console.log("current profile: ", profile);
  }, [profile]);

  const Logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={Logout}>Logout the session</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      {console.log("jere")}
      {/* {profile && (
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
        </div>
      )} */}
    </div>
  );
};

export default MainApp;
