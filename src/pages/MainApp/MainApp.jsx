import React, { useCallback, useEffect, useState } from "react";
import logo from "./../../logo.svg";
import "./../../App.css";
import { useNavigate } from "react-router-dom";

const MainApp = () => {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="App">
      <button onClick={Logout}>Logout the session</button>
      <header className="App-header">
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
    </div>
  );
};

export default MainApp;
