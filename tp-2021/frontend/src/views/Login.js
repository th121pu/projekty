import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import authContext from "../contexts/authContext";
import userContext from "../contexts/userContext";

export default function Login() {
    // use for local version
  // let url = "http://127.0.0.1:5000";

  //use for deployed version
  let url = "https://crypto-predict-api2.azurewebsites.net";
  
  let history = useHistory();
  const { setAuthenticated } = useContext(authContext);
  const { setUser } = useContext(userContext);

  const [state, setState] = useState({
    id: null,
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(false);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  function goRegister() {
    history.push("/register");
  }

  function goForgot() {
    history.push("/forg-passwrod");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    };

    fetch(url + "/api/login", requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        else return response.json();
      })
      .then((data) => {
        setAuthenticated(true);
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
        });
        history.push("");
      })
      .catch((error) => {
        console.log("error: " + error);
        setState({
          email: "",
          password: "",
        });
        setLoginError(true);
        
      });
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <h3>Sign In</h3>
      {loginError &&
      <p style={{ textAlign: "center", color: "red" }}>Login failed. Try again!</p>
    }
      <div className="form-group marginTopBottom">
        <label>Email address</label>
        <input
          type="email"
          required
          className="form-control"
          placeholder="Enter email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
      </div>

      <div className="form-group marginTopBottom">
        <label>Password</label>
        <input
          type="password"
          required
          className="form-control"
          placeholder="Enter password"
          name="password"
          value={state.password}
          onChange={handleChange}
        />
      </div>

      <div className="form-group marginTopBottom">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="customCheck1"
          />
          <label className="custom-control-label" htmlFor="customCheck1">
            Remember me
          </label>
        </div>
      </div>

      <div style={{ display: "flex" }}>
        <button
          onClick={goRegister}
          type="submit"
          className="btn btnSecondary btn-block fullWidthButton btn1"
        >
          Register
        </button>
        <button
          type="submit"
          className="btn btn-primary btn-block fullWidthButton btn2"
        >
          Log in
        </button>
      </div>
      <p onClick={goForgot} className="forgot-password text-right">
        Forgot password?
      </p>
    </form>
  );
}
