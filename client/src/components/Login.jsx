import axios from '../config/axios'
import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { jwtDecode } from 'jwt-decode';

export const Login = () => {
  const [serverErrors, setServerErrors] = useState();
  const navigate=useNavigate()
  const { userDispatch } = useContext(UserContext);
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required *"),
    password: Yup.string().required("Password is required *").min(8),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnChange: false,
    validationSchema: loginValidationSchema,
    onSubmit:async (formData) => {
      try{
        const token=await axios.post("/api/users/login",formData)
        localStorage.setItem("token",token.data)
        const { role } = jwtDecode(localStorage.getItem("token"));
          if (role === "admin") {
            const responses = await Promise.allSettled([
              await axios.get("/api/users/account", {
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get("/api/questions",{
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quizzes`,{
                headers: { Authorization: localStorage.getItem("token") },
              }),
            ]);
            userDispatch({ type: "LOGIN", payload: responses[0].value.data });
            userDispatch({
              type: "SET_QUESTIONS",
              payload: responses[1].value.data,
            });
            userDispatch({
              type: "SET_QUIZZES",
              payload: responses[2].value.data,
            });
          } else {
            const responses = await Promise.allSettled([
              await axios.get("/api/users/account", {
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quizzes`,{
                headers: { Authorization: localStorage.getItem("token") },
              }),
              await axios.get(`/api/quiz-response`, {
                headers: { Authorization: localStorage.getItem("token") },
              }),
            ]);
            console.log(responses);
            userDispatch({ type: "LOGIN", payload: responses[0].value.data });
            userDispatch({
              type: "SET_QUIZZES",
              payload: responses[1].value.data,
            });
            userDispatch({
              type: "SET_ATTEMPTED_QUIZZES",
              payload: responses[2].value.data,
            });
          }
        navigate('/dashboard') 
      }catch(e){
        console.log(e.response);
        setServerErrors(e.response.data)
      }
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <label>
          Enter email <br />
          <input
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">{formik.errors.email}</div>
        <br />
        <label>
          Enter password <br />
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </label>
        <div className="inputErrors">
          {formik.errors.password}
          {serverErrors}
        </div>
        <br />
        <div className="jc">
          <input type="submit" className="loginBtn" value={"Login"} />
        </div>
        <b>
          New User? <Link to="/register">Register now</Link>
        </b>
      </form>
    </div>
  );
};
