import React, { useContext, useEffect, useState } from "react";
import userContext from "../contexts/userContext";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
  Container,
} from "react-bootstrap";
import Moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cardContext from "../contexts/cardContext";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCartShopping,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function MenuPage() {
  const { user, setUser } = useContext(userContext);
  const { card, setCard } = useContext(cardContext);
  const [canteens, setCanteens] = useState(null);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [number, setNumber] = useState(1);
  const [menu, setMenu] = useState(null);
  const [shop, setShop] = useState(card);
  const [price, setPrice] = useState(0);
  const [canteenName, setCanteenName] = useState(null);

  const [date, setDate] = useState(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate()
  );

  useEffect(() => {
    setCard(shop);
  }, [shop]);
  //DEFAULT GET MENU
  let navigate = useNavigate();
  library.add(faCartShopping, faShoppingBasket);
  useEffect(() => {
    setIsLoading(true);
    const requestOptions = {
      headers: { token: token },
    };
    fetch(url + "/canteen/getAllCanteens", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("GET ALL CANTEENS");
        console.log(data);
        setCanteens(data);
        getMenu(data[0].id);

        var today = new Date(),
          day =
            today.getFullYear() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getDate();
        setDate(day);

        handleCanteen(data[0].id, data[0].name);
        setIsLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function getMenu(id) {
    console.log("get menu for day " + date);
    const requestOptions = {
      headers: { token: token },
    };
    fetch(
      url + "/canteen-menu/getCanteenMenuWithRedis?id=" + id + "&date=" + date,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let response = data;
        //setMenu(data);
        setMenu(response);
        console.log("menuu", menu);
      })
      .catch((err) => {
        console.log(err);
        setMenu([]);
      });
  }

  function handleCanteen(id, name) {
    console.log("id", id);
    setNumber(id);

    setPrice(0);
    setCanteenName(name);
    getMenu(id);
  }

  function handleDate(date) {
    console.log(date);

    setPrice(0);
    setDate(date);
    const requestOptions = {
      headers: { token: token },
    };
    fetch(
      url +
        "/canteen-menu/getCanteenMenuWithRedis?id=" +
        number +
        "&date=" +
        date,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        let response = data;
        //setMenu(data);
        setMenu(response);
        console.log("menuuu", menu);
      })
      .catch((err) => {
        setMenu([]);
        console.log(err);
      });
  }

  function removeFromCard(id) {
    console.log("removing menu " + id);
    let newArray = [];
    let firstRemoved = false;
    for (let i = 0; i < shop.length; i++) {
      console.log(shop[i]);
      console.log(firstRemoved);
      if (shop[i].id !== id || firstRemoved === true) newArray.push(shop[i]);
      else {
        firstRemoved = true;
      }
    }
    setShop(newArray);
  }

  function saveToCard(
    id,
    name,
    itemPrice,
    menuId,
    selectedDate,
    selectedCanteen
  ) {
    let item = {
      id: id,
      name: name,
      price: itemPrice,
      selectedDate: selectedDate,
      selectedCanteen: selectedCanteen,
      canteenId: number,
      menuId: menuId,
    };

    setPrice((prevState) => prevState + Number(itemPrice));

    console.log(item);

    console.log(shop);
    if (shop.length > 0) {
      if (
        shop[0].selectedCanteen == selectedCanteen &&
        shop[0].selectedDate == selectedDate
      ) {
        setShop([...shop, item]);
      } else {
        console.log("reseting shop");
        let newArray = [];
        newArray.push(item);
        setShop(newArray);
      }
    } else {
      console.log("reseting shop");
      let newArray = [];
      newArray.push(item);
      setShop(newArray);
    }
  }

  function makeorder() {
    navigate("../tuke/makeorder", { replace: true });
  }

  return (
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
                      (canteen.id == number ? "selectedCanteen" : "")
                    }
                    onClick={() => handleCanteen(canteen.id, canteen.name)}
                  >
                    <Nav.Link key={canteen.id} className="canteen-text">
                      {canteen.name}
                    </Nav.Link>
                  </div>
                ))}
              </Nav>
            </div>
            <div className="canteen-days">
              <h2 style={{ color: "#054b61" }}>{canteenName}</h2>

              <div className="box-days">
                {Array.from(Array(3), (e, i) => {
                  let today = new Date();
                  let nextDay = new Date(today);
                  nextDay.setDate(today.getDate() + i);

                  let dateDisplay =
                    nextDay.getFullYear() +
                    "-" +
                    (nextDay.getMonth() + 1) +
                    "-" +
                    nextDay.getDate();

                  Moment.locale("en");

                  return (
                    <button
                      className={
                        "date-text-box " +
                        (dateDisplay == date ? "selectedCanteen" : "")
                      }
                      key={i}
                      onClick={() => handleDate(dateDisplay)}
                    >
                      {nextDay.toLocaleDateString("en", { weekday: "long" })}{" "}
                      {Moment(nextDay).format("D.M.yyyy")}
                    </button>
                  );
                })}
              </div>

              {menu != null && menu.length > 0 ? (
                <>
                  <div class="menu-box-container">
                    <h3>Menu</h3>
                    <hr
                      style={{
                        color: "white",
                        backgroundColor: "#white",
                        height: 5,
                      }}
                    />
                    {menu.map((food, index) =>
                      food.map((item, index) => {
                        return (
                          <div>
                            {index === 0 && <h4>{item.food.category.name}</h4>}

                            <div class="rowContainer">
                              <p class="menu-box-text" key={item.id}>
                                {item.food.name}{" "}
                                <p class="menu-box-text rightAl">
                                  {(Math.round(item.price * 100) / 100).toFixed(
                                    2
                                  )}
                                  €{"  "}
                                  <button
                                    className="shop-button"
                                    key={index}
                                    style={{
                                      fontSize: "0.9em",
                                      borderRadius: "45%",
                                    }}
                                    onClick={() =>
                                      saveToCard(
                                        item.id,
                                        item.food.name,
                                        item.price,
                                        item.id,
                                        date,
                                        canteenName
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon
                                      key={item.food.id}
                                      icon="fa-basket-shopping"
                                    />
                                  </button>{" "}
                                </p>
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div class="menu-box-container">
                  <h3>Menu</h3>
                  <hr
                    style={{
                      color: "white",
                      backgroundColor: "#white",
                      height: 5,
                    }}
                  />
                  <p class="menu-box-text">
                    This canteen is closed on chosen day.
                  </p>
                </div>
              )}
            </div>

            <div class="divContainer" style={{ backgroundColor: "#e8efe9" }}>
              <div style={{ paddingRight: "6%" }}>
                <h5
                  class="h5box"
                  style={{ textAlign: "right", color: "#054b61" }}
                >
                  Credit on card:{"   "}
                  <span style={{ color: "#96bc9c", marginLeft: "1em" }}>
                    {" "}
                    {(Math.round(user.accountBalance * 100) / 100).toFixed(
                      2
                    )}€{" "}
                  </span>
                </h5>
                <div className="shopping-cart">
                  <div>
                    <h4 style={{ color: "#054b61" }}>Your Order</h4>
                    <hr
                      style={{
                        color: "white",
                        backgroundColor: "#white",
                        height: 5,
                      }}
                    />
                  </div>
                  {shop.length == 0 || shop[0] == undefined ? (
                    <div style={{ textAlign: "center" }}>
                      <FontAwesomeIcon
                        style={{
                          color: "white",
                          marginTop: "1em",
                          marginLeft: "auto",
                          marginRight: "auto",
                          background: "#96bc9c",
                          border: "none",
                        }}
                        icon="fa-basket-shopping"
                        className="card"
                      ></FontAwesomeIcon>
                      <p
                        style={{
                          color: "white",
                          marginTop: "1em",
                          marginLeft: "4.5em",
                          marginRight: "4.5em",
                        }}
                      >
                        Nothing in your shopping cart yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h6 style={{ color: "#054b61" }}>
                          {" "}
                          {shop[0].selectedCanteen} -{" "}
                          {Moment(shop[0].selectedDate).format("D.M.yyyy")}{" "}
                        </h6>
                      </div>
                      <div>
                        {shop.map((item, index) => (
                          <div class="rowContainer">
                            <p class="menu-box-text">
                              {item.name}{" "}
                              <p class="menu-box-text rightAl">
                                {(Math.round(item.price * 100) / 100).toFixed(
                                  2
                                )}
                                €{"  "}
                                <button
                                  class="shop-button"
                                  key={item.id}
                                  style={{ fontSize: "0.8em" }}
                                  onClick={() => removeFromCard(item.id)}
                                >
                                  X
                                </button>{" "}
                              </p>
                            </p>
                          </div>
                        ))}
                        <hr
                          style={{
                            color: "white",
                            backgroundColor: "#white",
                            height: 3,
                            marginBottom: 0,
                            paddingBottom: 0,
                          }}
                        />
                        <hr
                          style={{
                            color: "white",
                            backgroundColor: "#white",
                            height: 3,
                            marginTop: "3px",
                            paddingBottom: 0,
                          }}
                        />
                        <p style={{ color: "white" }}>
                          <p
                            class="menu-box-text"
                            style={{ marginLeft: 0, paddingLeft: 0 }}
                          >
                            Total
                            <p class="menu-box-text rightAl">
                              {(
                                Math.round(
                                  shop.reduce(function (prev, current) {
                                    return prev + +current.price;
                                  }, 0) * 100
                                ) / 100
                              ).toFixed(2)}
                              €
                            </p>
                          </p>
                        </p>
                      </div>
                      <div>
                        <button
                          style={{
                            color: "white",
                            backgroundColor: "#054b61",
                            width: "100%",
                            norder: "none",
                            borderRadius: "10px",
                            height: "2.2em",
                          }}
                          onClick={() => makeorder()}
                        >
                          Order
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
