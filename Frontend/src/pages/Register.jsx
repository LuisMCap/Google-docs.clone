import api from "../api";
import Form from "../components/Form";
import { useState } from "react";

const Register = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState({
    isError: false,
    message: "",
    isStatus: false,
  });

  const handleInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMessage = formError();
    if (errorMessage) {
      setError({ isError: true, message: errorMessage, isStatus: false });
      return;
    }
    registerUserAPI();
  };

  const formError = () => {
    if (!loginForm.username || !loginForm.password) {
      return "Please fill out all fields.";
    }
    // if (loginForm.password.length < 6) {
    //   return 'Password needs to be 6 characters long or more'
    // }
    return false;
  };

  const registerUserAPI = async (e) => {
    try {
      localStorage.clear();
      const response = await api.post("/users/register", loginForm);
      setError({
        isError: true,
        message: "User created sucessfully",
        isStatus: true,
      });
    } catch (err) {
      console.log(err);
      if (err.response) {
        if (err.response.status === 409) {
          setError({
            isError: true,
            message: "User already exists",
            isStatus: false,
          });
        }
      }
    }
  };

  return (
    <div className="modal__bg">
      <section className="login-form">
        <Form
          form={loginForm}
          title={"Register"}
          btnText={"Register"}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          accountPrompt={"Already have an account? "}
          alternative={"Log in here"}
          whereToAlternative={"/login"}
        />
        {error.isError ? (
          <div
            className={`form-error ${error.isStatus ? "form-error-green" : ""}`}
          >
            {error.message}
          </div>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default Register;
