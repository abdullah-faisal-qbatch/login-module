/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useCallback, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import api from "../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  async function responseGoogle(codeResponse) {
    try {
      const body = {
        code: codeResponse.code,
        grant_type: "authorization_code",
        client_id:
          "126582545391-pab79eacjtmrm5bldpg4nsadmkv3o1r8.apps.googleusercontent.com",
        client_secret: "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",
        redirect_uri: window.location.origin,
      };
      const response = await axios.post(
        "https://oauth2.googleapis.com/token",
        body
      );
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("loginMethod", "google");

      const profile = await api.axiosInstance.get(
        "https://www.googleapis.com/oauth2/v3/userinfo"
      );
      console.log("profile", profile.data);

      localStorage.setItem("profile", JSON.stringify(profile.data));

      navigate("/app");
      console.log("Google login successful!");
    } catch (error) {
      console.error(error);
    }
  }

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: responseGoogle,
    onError: (error) => console.log("Login Failed:", error),
  });

  const updateGoogleToken = useCallback(async (refreshToken) => {
    const body = {
      grant_type: "refresh_token",
      client_id:
        "126582545391-pab79eacjtmrm5bldpg4nsadmkv3o1r8.apps.googleusercontent.com",
      client_secret: "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",
      refresh_token: refreshToken,
    };

    const refreshResponse = await api.axiosInstance.post(
      "https://oauth2.googleapis.com/token",
      body
    );

    const newAccessToken = refreshResponse.data.access_token;
    localStorage.setItem("access_token", newAccessToken);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("profile")) {
      navigate("/app");
    }
  }, [navigate]);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const [render, setRender] = useState(false);

  const getAccessToken = async () => {
    const response = await api.getUserData();
    if (response?.status === 200) {
      navigate("/app");
    }
  };
  const getToken = async (refreshToken) => {
    await api.refreshTokenExpired(refreshToken);
    setRender(!render);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      if (localStorage.getItem("loginMethod") !== "google") getAccessToken();
    } else {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        if (localStorage.getItem("loginMethod") === "google") {
          updateGoogleToken(refreshToken);
        } else {
          getToken(refreshToken);
        }
      }
    }
  }, [render, navigate, updateGoogleToken]);

  const onSubmit = async (values, { resetForm }) => {
    console.log("Form data submitted:", values);
    resetForm();
    //do api request here
    try {
      const data = {
        email: values.username,
        password: values.password,
      };
      const response = await api.login(data);
      if (response.status === 201) {
        navigate("/app");
      }
      // console.log("RESPONSE: ", response);
      // const userData = await api.getUserData();
      //now get user data
      // console.log("Response: ", userData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
            />
            <ErrorMessage name="username" component="div" className="error" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit">Login</button>
        </Form>
      </Formik>
      <div
        style={{
          marginTop: "10px",
          marginLeft: "60px",
        }}
      >
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      </div>
    </div>
  );
};

export default Login;
