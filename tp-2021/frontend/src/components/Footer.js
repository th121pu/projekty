import React from "react";
import { useHistory } from "react-router-dom";


export default function Header() {
  let history = useHistory();

  return (
    <footer>
      <div className="flexOne"></div>
      <div
        className="flexOne"
        style={{
          justifyContent: "center",
        }}
      >
        <p>© Copyright 2021 | TP</p>
      </div>
      <div className="flexOne"></div>
    </footer>
  );
}
