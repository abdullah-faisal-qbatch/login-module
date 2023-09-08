import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import api from "../../utils/axiosUtils";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Initial form values
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const response = api.getUserData();
      if (response !== 401) {
        navigate("/app");
      } else {
        alert("Unauthentic user");
      }
    }
    console.log("object");
  }, []);

  // Form submission function
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
      // console.log("RESPONSE: ", response);
      const userData = await api.getUserData();
      //now get user data
      console.log("Response: ", userData);
      navigate("/app");
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
    </div>
  );
};

export default Login;
