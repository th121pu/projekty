import React, { useContext, useState, useEffect } from "react";
import userContext from "../contexts/userContext";
import cardContext from "../contexts/cardContext";
import Moment from "moment";
import { useNavigate } from "react-router-dom";

let url = "https://uni-canteen-backend.azurewebsites.net";

export default function OrderPage() {
  const { user, setUser } = useContext(userContext);
  const { card, setCard } = useContext(cardContext);
  const [prepaid, setPrepaid] = useState(true);
  const token = localStorage.getItem("token");
  let navigate = useNavigate();

  useEffect(() => {
    console.log("prepaid change");
    console.log(prepaid);
  }, [prepaid]);

  function removeFromCard(id) {
    console.log("removing menu " + id);
    let newArray = [];
    let firstRemoved = false;
    for (let i = 0; i < card.length; i++) {
      if (card[i].id !== id || firstRemoved === true) newArray.push(card[i]);
      else {
        firstRemoved = true;
      }
    }
    setCard(newArray);
  }

  function onPrepaidChange(e) {
    const isPublished = e.currentTarget.value === "true" ? true : false;
    console.log("handle", isPublished);

    setPrepaid(isPublished);
  }

  async function handleOrder() {
    console.log("ORDER STARTED");
    console.log(prepaid);

    let canBuy = true;
    if (prepaid) {
      let totalSum = card.reduce(function (prev, current) {
        return prev + +current.price;
      }, 0);

      console.log(totalSum);

      if (user.accountBalance < totalSum) {
        console.log("not enough money");
        canBuy = false;
      }
    }

    if (!canBuy) {
      alert("You do not have enough money on your ISIC for this order.");
    } else {
      const requestOptions = {
        headers: { token: token },
      };

      console.log(card.length);
      for (let i = 0; i < card.length; i++) {
        console.log(card[i].canteenId);
        console.log(card[i].menuId);
        await fetch(
          url +
            "/sb/createOrder?userId=" +
            user.id +
            "&canteenId=" +
            card[i].canteenId +
            "&menuId=" +
            card[i].menuId +
            "&prepaid=" +
            prepaid +
            "&picked=false&studentEmail=" +
            user.alternativeEmail +
            "&canteenEmail=" +
            user.alternativeEmail,
          requestOptions
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            if (i == card.length - 1) {
              setUser(data);

              navigate("../tuke/profile", { replace: true });
            }
            setCard([]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  return (
    <div>
      <h5
        class="h5box"
        style={{ marginTop: "4em", marginBottom: "1em", textAlign: "center" }}
      >
        Credit on card:{" "}
        <span style={{ color: "#96bc9c", marginLeft: "0.1em" }}>
          {" "}
          {(Math.round(user.accountBalance * 100) / 100).toFixed(2)}€{" "}
        </span>
      </h5>
      <div className="shopping-cart-order">
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
        {card.length == 0 ? (
          <div style={{ textAlign: "center" }}>
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
                {card[0].selectedCanteen} -{" "}
                {Moment(card[0].selectedDate).format("D.M.yyyy")}{" "}
              </h6>
            </div>
            <div>
              {card.map((item, index) => (
                <div class="rowContainer">
                  <p class="menu-box-text">
                    {item.name}{" "}
                    <p class="menu-box-text rightAl">
                      {(Math.round(item.price * 100) / 100).toFixed(2)}€{"  "}
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
                <b
                  class="menu-box-text"
                  style={{ marginLeft: 0, paddingLeft: 0 }}
                >
                  Total
                  <b class="menu-box-text rightAl" style={{ marginRigt: 0 }}>
                    {(
                      Math.round(
                        card.reduce(function (prev, current) {
                          return prev + +current.price;
                        }, 0) * 100
                      ) / 100
                    ).toFixed(2)}
                    €
                  </b>
                </b>
              </p>
            </div>
            <div>
              <h6 style={{ color: "#054b61" }}>Pick a payment method:</h6>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  color: "#054b61",
                  marginLeft: "1em",
                }}
              >
                <input
                  type="radio"
                  value={"true"}
                  checked={prepaid === true}
                  onChange={onPrepaidChange}
                  name="prepaid"
                />
                Prepaid from ISIC credit
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  color: "#054b61",
                  marginBottom: "1em",
                  marginLeft: "1em",
                }}
              >
                <input
                  type="radio"
                  value={"false"}
                  checked={prepaid === false}
                  onChange={onPrepaidChange}
                  name="prepaid"
                />
                In canteen
              </div>
              <button
                style={{
                  color: "white",
                  backgroundColor: "#054b61",
                  width: "100%",
                  norder: "none",
                  borderRadius: "10px",
                  height: "2.2em",
                }}
                onClick={() => handleOrder()}
              >
                Submit Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
