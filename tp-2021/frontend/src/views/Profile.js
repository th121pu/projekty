import React, { useContext, useState, useEffect, useReducer } from "react";
import userContext from "../contexts/userContext";
import currencyContext from "../contexts/currencyContext";
import defaultProfilePicture from "../images/defaultProfileImage.jpg";
import "./Profile.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Profile() {
  // use for local version
  // let url = "http://127.0.0.1:5000";

  //use for deployed version
  let url = "https://crypto-predict-api2.azurewebsites.net";

  const { user } = useContext(userContext);
  const [latestPrice, setLatestPrice] = useState({
    btc: 0,
    eth: 0,
    bnb: 0,
  });

  const { currency } = useContext(currencyContext);
  let [currencyDisplayed, setCurrencyDisplayed] = React.useState(
    currency === "EUR" ? "€" : "$"
  );
  useEffect(() => {
    fetch(url + "/api/crypto_latest")
      .then((res) => res.json())
      .then((data) => {
        setLatestPrice({
          btc: data[0].price_close,
          eth: data[1].price_close,
          bnb: data[2].price_close,
        });
      });
  }, []);

  const [, forceUpdate] = useReducer(x => x + 1, 0);  // Javascrip secret formula

  function plsUpdate() {
    forceUpdate();
  }

  const [rows2, setRows2] = useState([]);
  useEffect(() => {
    fetch(url + "/api/crypto_user")
      .then((res) => res.json())
      .then((data) => {
        setRows2(getUserCrypto(data.crypto));
      });
  }, []);

  function getUserCrypto(data) {
    let allRows = [];
    let id = 1;
    data.forEach((element) => {
      let row = {};
      // if(element.user_id === 9){
      switch (element.crypto_type_id) {
        case 1:
          row = {
            id: id,
            crypto_type: "BTC",
            amount: 0,
            price: (0 * 37450.25).toFixed(2),
          };
          break;
        case 2:
          row = {
            id: id,
            crypto_type: "ETH",
            amount: element.count,
            price: (element.count * 2754.9).toFixed(2),
          };
          break;
        case 3:
          row = {
            id: id,
            crypto_type: "BNB",
            amount: element.count,
            price: (element.count * 415.007).toFixed(2),
          };
          break;
        default:
          break;
      }
      id = id + 1;
      allRows.push(row);
      // }
    });
    return allRows;
  }

  function Form(){
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      // console.log("Submitted!")
      //rows2.forEach(updateRow)
      for(let i = 0; i < rows2.length; i++){
        if(inputs.currency === rows2[i].crypto_type){
          let newRows = rows2
          newRows[i].amount = parseFloat(inputs.amount)
          newRows[i].price = parseFloat((inputs.amount * 37450.25).toFixed(2))
          setRows2(newRows)
          break
        } 
      }
      // console.log(rows2)
      plsUpdate()
      event.target.reset();
    }


    return (
      <form class="form-inline" onSubmit={handleSubmit} style = {{justifyContent: "center"}}>
        <label>Currency:
          <select name="currency" value={inputs.currency} onChange={handleChange} required>
            <option selected></option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="BNB">BNB</option>
          </select>
        </label>
        <label>
          Amount:
          <input 
            type="number" 
            step="0.00000000001" 
            min="0" 
            name="amount" 
            value={inputs.amount}
            onChange={handleChange}
            required
          />
        </label>
        <button style={{backgroundColor: "#3f47cc"}} type="submit" value="Submit">Submit</button>
      </form>
    )

  }

  return (
    <div className="containerProfile">
      <div className="profile">
        <div className="imageContainer">
          <img src={defaultProfilePicture} className="profilePicture" alt="" />
        </div>
        <div className="userInfo">
          <div className="flexSelfCenter">
            <h4>{user.name}</h4>
          </div>
          <div className="flexSelfCenter">
            <h5 style={{ opacity: "0.8" }}>{user.email}</h5>
          </div>
        </div>
      </div>
      <div className="tableContainer">
        <div style={{ height: 220, width: "100%" }}>
          <TableContainer component={Paper} style={{ flex: "1" }}>
            <h4 style={{marginTop: "0.3em"}}>My crypto wallet</h4>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow style={{ height: "22px" }}>
                  <TableCell align="center"  style={{ height: "2em" }}>
                    <b >
                      Crypto type
                    </b>
                  </TableCell>
                  <TableCell align="center" >
                    <b>Amount</b>
                  </TableCell>
                  <TableCell align="center" >
                    <b>Total price</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows2.map((row) => (
                  <TableRow
                    style={{ height: "1.5em" }}
                    key={row.crypto_type}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      <div>{row.crypto_type}</div>
                    </TableCell>
                    <TableCell align="center" >
                      <div>{row.amount}</div>
                    </TableCell>

                    <TableCell align="center" >
                      <div>{row.price}{currencyDisplayed}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{ height: 280, width: "100%", marginLeft: "auto", marginRight: "auto"}}>
          <Form/>
        </div>
      </div>
    </div>
  );
}
