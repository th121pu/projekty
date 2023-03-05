import React from "react";
import "./SubPage.css";

export default function SubPage() {
  return (
    <div>
      <h1>Choose your subscription plan!</h1>
      <div className="container">
        <div className="item">
          <h3>Free trial</h3>
          <h2>FREE</h2>
          <h5>- see predictions</h5>
          <a className="button" href="">
            <h3 style={{ color: "white" }}>Start free trial!</h3>
          </a>
        </div>
        <div className="item">
          <h3>Basic</h3>
          <h2>5€/mo</h2>
          <h5>- see predictions</h5>
          <h5>- own wallet</h5>
          <a className="button" href="">
            <h3 style={{ color: "white" }}>Get started!</h3>
          </a>
        </div>
        <div className="item">
          <h3>Premium</h3>
          <h1>10€/mo</h1>
          <h5>- see predictions</h5>
          <h5>- own wallet</h5>
          <h5>- notifications about important events</h5>
          <a
            className="button"
            href="https://discord.gg/kpQJjJDpQk"
            target="_blank"
          >
            <h3 style={{ color: "white" }}>Get started!</h3>
          </a>
        </div>
      </div>
    </div>
  );
}
