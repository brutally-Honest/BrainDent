import axios from "../config/axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState([]);
  const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required *"),
    email: Yup.string().email().required("Email is required *"),
    password: Yup.string()
      .required("Password is required *")
      .min(8, "8  Characters minimum*"),
  });
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validateOnChange: false,
    validationSchema: registerValidationSchema,
    onSubmit: async(formData) => {
        try{
            await axios.post("/api/users/register", formData)
            navigate('/dashboard')
        }catch(e){
            setServerErrors(e.response.data.errors)
        }
    },
  });
  return (
    <div>
      <h2>Register</h2>
      <div>
        <form className="registerForm" onSubmit={formik.handleSubmit}>
          <label>
            Username <br />
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </label>
          <div className="inputErrors">{formik.errors.username}</div>
          <br />
          <label>
            Email <br />
            <input
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </label>
          <div className="inputErrors">
            {formik.errors.email}
            {serverErrors
              .filter((e) => e.path === "email")
              .map((e, i) => (
                <li key={i}>{e.msg}</li>
              ))}
          </div>
          <br />
          <label>
            Password <br />
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </label>
          <div className="inputErrors">{formik.errors.password}</div>
          <br />
          <div>
            <input type="submit" value={"Register"} />
          </div>
        </form>
      </div>
    </div>
  );
};
