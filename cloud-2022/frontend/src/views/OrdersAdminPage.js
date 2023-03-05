import React, { useContext, useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import userContext from "../contexts/userContext";
import Moment from "moment";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function MenuAdminPage() {
  const [canteens, setCanteens] = useState(null);
  const token = localStorage.getItem("token");
  const [canteenId, setCanteenId] = useState(0);
  const [orders, setOrders] = useState([]);
  const { user, setUser } = useContext(userContext);
  const [canteenName, setCanteenName] = useState("");

  useEffect(() => {
    const requestOptions = {
      headers: { token: token },
    };

    fetch(url + "/canteen/getAllCanteens", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setCanteens(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCanteenOrders(id, name) {
    setCanteenId(id);
    setCanteenName(name);
    const requestOptions = {
      headers: { token: localStorage.getItem("token") },
    };
    fetch(
      url + "/orders/admin/getCanteenOrders?canteenId=" + id,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let response = data;
        setOrders(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      {user.role == "STUDENT" || user.role == undefined ? (
        <div>YOU ARE NOT ADMIN</div>
      ) : (
          <div>
            {canteens != null ? (
              <>
                <div className="menuContainer">
                  <div className="sidebar">
                    <Nav className="flex-column">
                      {canteens.map((canteen) => (
                        <div
                          className={
                            "canteen-text-box " +
                            (canteen.id == canteenId ? "selectedCanteen" : "")
                          }
                          onClick={() => handleCanteenOrders(canteen.id, canteen.name)}
                        >
                          <Nav.Link
                            key={canteen.id}
                            className="canteen-text"

                          >
                            {canteen.name}
                          </Nav.Link>
                        </div>
                      ))}
                    </Nav>
                  </div>
                  {orders.length > 0 ? (
                    <div className="canteen-days">
                      <h2 style={{ color: "#054b61", paddingTop: '2%', paddingLeft: '1%' }}>{canteenName}</h2>
                      <div className="orderCart" style={{ marginTop: '5%' }}>
                        {orders.map((order, index) => (<>

                          <div style={{ display: 'flex', color: '#054b61' }}>
                            <div style={{ flex: 1, paddingTop: '1%' }}>
                              <p>Date for the order: {Moment(order.ordersMenu.date).format("D.M.yyyy")}
                                <p><i>Order ID:</i> {order.ordersMenu.id}
                                  <p><i>Student ID:</i> {order.userObjectId}

                                    <p style={{ color: '#A29696' }}>{order.ordersMenu.food.name}</p></p></p> </p>
                            </div>
                            <div style={{ flex: 0.5, display: 'flex', justifyContent: 'flex-end', alignSelf: 'center', paddingRight: '1%' }}>

                              {order.picked == false ?
                                <p style={{ color: "#1890FF" }}>Not picked</p>
                                :
                                <p style={{ color: "#1A782F" }}>Picked</p>}
                            </div>
                          </div>
                          <hr style={{ margin: "auto", height: 1 }} />
                        </>
                        ))} </div>
                    </div>
                  ) : (
                      <>
                        {canteenName != "" ?
                          <div className="canteen-days">
                            <h2 style={{ color: "#054b61", paddingTop: '2%', paddingLeft: '1%' }}>
                              {canteenName}
                            </h2>
                            <div className="orderCart"
                              style={{
                                paddingBottom: '3%',
                                paddingTop: '3%',
                                marginTop: '5%'
                              }}>
                              <h5>No orders</h5>
                            </div>
                          </div>
                          : <>
                            <div className="canteen-days">
                            </div>
                          </>}
                      </>
                    )}
                </div>
              </>
            ) : (
                <></>
              )}
          </div>
        )}
    </div>
  );
}
