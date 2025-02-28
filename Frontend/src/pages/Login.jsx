import Form from "../components/Form";
import { useState } from "react";
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

const Login = () => {
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState({ isError: false, message: "" });

  const handleInputChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    try {
      const response = await api.post(
        "/users/login",
        loginForm
      );
      if (response.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
        localStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);
        setError({ error: "", isError: false });
        window.location.href = '/'
      } 

    } catch (err) {
      setError({ isError: true, message: "Wrong username or password. Please try again" });
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const errorMessage = formError();
    if (errorMessage) {
      e.preventDefault()
      setError({ isError: true, message: errorMessage });
      return;
    }
    handleLogin(e)
  };

  const formError = () => {
    if (!loginForm.username || !loginForm.password) {
      return "Please fill out all fields.";
    }
    return false;
  };

  return (
    <div className="modal__bg">
      <section className="login-form">
        <Form
          form={loginForm}
          title={"Login"}
          btnText={"Log in"}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          accountPrompt={"Don't have an account? "}
          alternative={'Register here'}
          whereToAlternative={'/register'}
        />
        {error.isError ? (
          <div className="form-error">{error.message}</div>
        ) : (
          <></>
        )}
      </section>
    </div>
  );
};

export default Login;
