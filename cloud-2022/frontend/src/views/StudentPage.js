import React, { useContext, useState, useEffect } from "react";
import userContext from "../contexts/userContext";

import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Container,
} from "react-bootstrap";
import { ProfileData } from "../components/ProfileData";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function StudentPage() {
  const { user, setUser } = useContext(userContext);
  const [number, setNumber] = useState(0);
  const token = localStorage.getItem("token");
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const requestOptions = {
      headers: { token: token },
    };

    fetch(url + "/orders/getCurrentUserOrders", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   setOrders(orders.reverse());
  // }, [orders]);

  function handleCanteen(id) {
    if (id === 1) getOrders();
    setNumber(id);
  }

  function generateReceipt() {
    const requestOptions = {
      headers: { token: token },
    };
    fetch(
      url +
        "/sb/getReceipt?userId=" +
        user.id +
        "&studentEmail=" +
        user.alternativeEmail,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert("Your receipt is ready. Check your email!")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function getOrders() {
    const requestOptions = {
      headers: { token: token },
    };

    fetch(url + "/orders/getCurrentUserOrders", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="menuContainer">
      <div className="sidebar">
        <Nav className="flex-column">
          <div
            className={
              "canteen-text-box " + (number == 0 ? "selectedCanteen" : "")
            }
            onClick={() => handleCanteen(0)}
          >
            <Nav.Link className="canteen-text">Profile info</Nav.Link>
          </div>
          <div
            className={
              "canteen-text-box " + (number == 1 ? "selectedCanteen" : "")
            }
            onClick={() => handleCanteen(1)}
          >
            <Nav.Link className="canteen-text">Orders</Nav.Link>
          </div>
        </Nav>
      </div>

      {number == 0 ? (
        <div className="canteen-days">
          <ProfileData userObjectBE={user} />{" "}
        </div>
      ) : (
        <div className="canteen-days">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              padding: "3%",
            }}
          >
            <button
              className="shop-button"
              onClick={() => generateReceipt()}
              style={{
                flex: "0",
                padding: "0.5%",
                justifyContent: "flex-start",
              }}
            >
              Send receipt on email
            </button>
            <p style={{ color: "#054B61", margin: 0, marginLeft: "auto" }}>
              <strong>Credit on card:</strong>{" "}
              {(Math.round(user.accountBalance * 100) / 100).toFixed(2)}€{" "}
            </p>
          </div>

          <div className="orderCart">
            {orders.reverse().map((order) => (
              <>
                <div style={{ display: "flex", paddingTop: "2%" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#000000" }}>
                      {order.canteen.name} for{" "}
                      {order.ordersMenu.date
                        .split("T")[0]
                        .replace("-", "/")
                        .replace("-", "/")}
                    </p>
                    <p style={{ color: "#A29696" }}>
                      {order.ordersMenu.food.name} {" - "}
                      {(Math.round(order.ordersMenu.price * 100) / 100).toFixed(
                        2
                      )}
                      €{"  "}
                      {order.prepaid == true ? (
                        <span style={{ color: "#1A782F" }}>(Prepaid)</span>
                      ) : (
                        <span></span>
                      )}
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 0.5,
                      display: "flex",
                      justifyContent: "flex-end",
                      alignSelf: "center",
                      paddingRight: "1%",
                    }}
                  >
                    {order.picked == false ? (
                      <p style={{ color: "#1890FF" }}>Not picked</p>
                    ) : (
                      <p style={{ color: "#1A782F" }}>Picked</p>
                    )}
                  </div>
                </div>
                <hr style={{ margin: "auto", height: 1 }} />{" "}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
