import React from "react";
import { useHistory } from "react-router-dom";

export default function ForgottenPassword() {
  let history = useHistory();

  function tryReset() {
    history.push("/login");
  }

  return (
    <form className="authForm" onSubmit={tryReset}>
      <h3>Reset password</h3>

      <div className="form-group marginTopBottom">
        <label>Email address</label>
        <input
          type="email"
          required
          className="form-control"
          placeholder="Enter email"
        />
      </div>

      <div style={{ display: "flex" }}>
        <button
          type="submit"
          className="btn btn-primary btn-block fullWidthButton"
        >
          Send new password
        </button>
      </div>
    </form>
  );
}
