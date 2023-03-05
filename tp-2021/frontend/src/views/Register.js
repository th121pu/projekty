import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Register() {
    // use for local version
  // let url = "http://127.0.0.1:5000";

  //use for deployed version
  let url = "https://crypto-predict-api2.azurewebsites.net";
  
  let history = useHistory();
  const [state, setState] = useState({
    username: "",
    surname: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [regError, setRegError] = useState(0);

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  function goLogin() {
    history.push("/login");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (state.password !== state.passwordRepeat) {
      setState({
        passwordRepeat: "",
        password: "",
      });
      setRegError(1);
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    };

    fetch(url + "/api/register", requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        console.log(data);
        history.push("/login");
      })
      .catch((error) => {
        console.log("error: " + error);
        setState({
          email: "",
          password: "",
          passwordRepeat: "",
        });
        setRegError(2);
      });
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      {regError === 1 && (
        <p style={{ textAlign: "center", color: "red" }}>
          Passwords dont match. Try again!
        </p>
      )}

      {regError === 2 && (
        <p style={{ textAlign: "center", color: "red" }}>
          Email already taken. Try again!
        </p>
      )}

      <div className="form-group marginTopBottom">
        <label>First name <p style={{display: "inline", color: "red"}}>*</p></label>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          required
          name="username"
          value={state.username}
          onChange={handleChange}
        />
      </div>

      <div className="form-group marginTopBottom">
        <label>Last name <p style={{display: "inline", color: "red"}}>*</p></label>
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          required
          name="surname"
          value={state.surname}
          onChange={handleChange}
        />
      </div>

      <div className="form-group marginTopBottom">
        <label>Email address <p style={{display: "inline", color: "red"}}>*</p></label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter email"
          required
          name="email"
          onChange={handleChange}
          value={state.email}
        />
      </div>

      <div className="form-group marginTopBottom">
        <label>Password <p style={{display: "inline", color: "red"}}>*</p></label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password"
          required
          name="password"
          onChange={handleChange}
          value={state.password}
        />
      </div>

      <div className="form-group marginTopBottom">
        <label>Repeat password <p style={{display: "inline", color: "red"}}>*</p></label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter password again"
          required
          name="passwordRepeat"
          onChange={handleChange}
          value={state.passwordRepeat}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block fullWidthButton"
      >
        Sign Up
      </button>
      <p onClick={goLogin} className="forgot-password text-right">
        Already registered? Sign in
      </p>
    </form>
  );
}
