import React, { useState, useEffect, useContext } from "react";
import { DataGrid, useGridApiContext, useGridState } from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import { VictoryLine } from "victory";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import icon_hist from "../images/pred.png";
import icon_prediction from "../images/pred2.png";
import icon_cap from "../images/cap.png";
import BTC from "../images/btc.png";
import ETH from "../images/eth.png";
import BNB from "../images/bnb.png";
import USDT from "../images/usdt.png";
import SOL from "../images/sol.png";
import currencyContext from "../contexts/currencyContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Img = ({ symbol }) => (
  <img
    style={{
      width: "30%",
      minWidth: "20px",
      maxWidth: "25px",
      marginRight: "8px",
      height: "auto",
    }}
    src={
      symbol === "BTC"
        ? BTC
        : symbol === "ETH"
        ? ETH
        : symbol === "BNB"
        ? BNB
        : symbol === "USDT"
        ? USDT
        : SOL
    }
  />
);

function toFixedIfNecessary(value, dp) {
  return +parseFloat(value).toFixed(dp);
}

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return newDate;
}

export default function MainPage() {
  const [open, setOpen] = React.useState(false);
  const { currency } = useContext(currencyContext);
  let [currencyDisplayed, setCurrencyDisplayed] = React.useState(
    currency === "EUR" ? "€" : "$"
  );

  const openDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.6,
      renderCell: (params) => (
        <div style={{ cursor: "pointer", width: "100%" }}>{params.value}</div>
      ),
    },
    {
      field: "code",
      headerName: "Symbol",
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <div style={{ cursor: "pointer", width: "100%" }}>
          <Img symbol={params.value}></Img>
          {params.value}
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <div style={{ cursor: "pointer", width: "100%" }}>{params.value}</div>
      ),
    },

    {
      field: "price_close",
      headerName: "Price",
      type: "number",
      flex: 0.7,
      minWidth: 90,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value).toLocaleString();
        return `${valueFormatted}${currencyDisplayed}`;
      },
    },

    {
      field: "graph",
      headerName: "Last 12 hours",
      flex: 0.8,
      minWidth: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <VictoryLine
          style={{
            data: { stroke: "#3f47cc", strokeWidth: 6 },
          }}
          padding={{ left: 5, top: 15, bottom: 15, right: 5 }}
          data={params.value}
        />
      ),
    },

    {
      field: "lastday",
      headerName: "24h % change",
      type: "number",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <div className={params.value > 0 ? "green" : "red"}>
          {toFixedIfNecessary(params.value, 2)}%
        </div>
      ),
    },

    {
      field: "lastweek",
      headerName: "7d % change",
      type: "number",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <div className={params.value > 0 ? "green" : "red"}>
          {toFixedIfNecessary(params.value, 2)}%
        </div>
      ),
    },

    {
      field: "dayprediction",
      headerName: "24h % prediction",
      type: "number",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <div className={params.value > 0 ? "green" : "red"}>
          {toFixedIfNecessary(params.value, 2)}%
        </div>
      ),
    },

    {
      field: "weekprediction",
      headerName: "7d % prediction",
      type: "number",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <div className={params.value > 0 ? "green" : "red"}>
          {toFixedIfNecessary(params.value, 2)}%
        </div>
      ),
    },
    {
      field: "time_period_end",
      headerName: "Updated at",
      type: "date",
      flex: 1,
      minWidth: 120,
      valueFormatter: (params) => {
        let date = new Date(params.value.replace('"', "").replace('"', ""));

        date = convertUTCDateToLocalDate(date);
        var options = {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };

        const valueFormatted = new Intl.DateTimeFormat("en-GB", options).format(
          date
        );
        return `${valueFormatted}`;
      },
    },
  ];

  // use for local version
  //let url = "http://127.0.0.1:5000";

  //use for deployed version
  let url = "https://crypto-predict-api2.azurewebsites.net";

  let mocked = [
    {
      time_period_end: '"2022-01-07 11:58:03.040000"',
      price_close: 0.886,
      id: 4,
      name: "Tether",
      code: "USDT",
      graph: [
        0.883, 0.884, 0.889, 0.855, 0.866, 0.9, 0.882, 0.85, 0.82, 0.864, 0.871,
        0.886,
      ],
      lastday: "-2.59",
      lastweek: "-1.80",
      dayprediction: "0.08",
      weekprediction: "0.15",
    },
    {
      time_period_end: '"2022-01-07 12:53:00"',
      price_close: 178.156,
      id: 5,
      name: "Solana",
      code: "SOL",
      graph: [
        150.962, 156.093, 161.428, 165.051, 170.051, 172.276, 165.145, 166.433,
        167.035, 160.988, 155.632, 151.156,
      ],
      lastday: "1.43",
      lastweek: "-2.12",
      dayprediction: "2.58",
      weekprediction: "-2.90",
    },
  ];

  React.useEffect(() => {
    console.log("change");
    console.log(currency);

    fetch(url + "/api/crypto_latest?world_currency=" + currency)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        //MOCKED DATA
        setRowsDay3([
          { name: "Bitcoin", cap: "768 707 702 001" },
          { name: "Ethereum", cap: "389 933 545 510" },
          { name: "Binance Coin", cap: "75 537 028 075" },
        ]);

        if (currency !== "EUR") {
          mocked[0].price_close = 1.01;
          mocked[1].price_close = 201.49;
          setRowsDay3([
            { name: "Bitcoin", cap: "869 393 036 809" },
            { name: "Ethereum", cap: "441 007 041 300" },
            { name: "Binance Coin", cap: "85 430 868 012" },
          ]);
        }
        data = data.concat(mocked);
        console.log(data);
        setRows(data);

        // other tables
        let newDataGainers = data.slice();
        newDataGainers.sort(({ lastday: a }, { lastday: b }) => b - a);
        setRowsDay(newDataGainers.slice(0, 3));

        let newDataGainersPredicted = data.slice();
        newDataGainersPredicted.sort(
          ({ dayprediction: a }, { dayprediction: b }) => b - a
        );
        setRowsDay2(newDataGainersPredicted.slice(0, 3));

        if (currency === "EUR") setCurrencyDisplayed("€");
        else setCurrencyDisplayed("$");
      });
  }, [currency]);

  const [rows, setRows] = useState();
  const [rowsDay, setRowsDay] = useState([]);
  const [rowsDay2, setRowsDay2] = useState([]);
  const [rowsDay3, setRowsDay3] = useState([]);

  useEffect(() => {
    fetch(url + "/api/crypto_latest?world_currency=" + currency)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        //MOCKED DATA
        data = data.concat(mocked);
        console.log(data);
        setRows(data);

        // other tables
        let newDataGainers = data.slice();
        newDataGainers.sort(({ lastday: a }, { lastday: b }) => b - a);
        setRowsDay(newDataGainers.slice(0, 3));

        let newDataGainersPredicted = data.slice();
        newDataGainersPredicted.sort(
          ({ dayprediction: a }, { dayprediction: b }) => b - a
        );
        setRowsDay2(newDataGainersPredicted.slice(0, 3));

        setRowsDay3([
          { name: "Bitcoin", cap: "768 707 702 001" },
          { name: "Ethereum", cap: "389 933 545 510" },
          { name: "Binance Coin", cap: "75 537 028 075" },
        ]);
      });
  }, []);

  const classes = useStyles();
  let history = useHistory();
  function handleClick(event) {
    console.log(event);
    if (
      event.field === "name" ||
      event.field === "id" ||
      event.field === "code"
    ) {
      if (event.id > 3) openDialog();
      else history.push("detail-page/" + event.id);
    }
  }

  return (
    <div
      style={{
        height: "385px",
        width: "90%",
        margin: "auto",
        marginTop: "40px",
      }}
      className="homeGrid"
    >
      <div
        style={{ display: "flex", marginBottom: "2em" }}
        className="flexTables"
      >
        <TableContainer component={Paper} style={{ flex: "1" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow style={{ height: "22px" }}>
                <TableCell style={{ height: "2em" }}>
                  <b style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{
                        width: "10%",
                        minWidth: "25px",
                        maxWidth: "35px",
                        marginRight: "8px",
                        height: "auto",
                      }}
                      src={icon_hist}
                    />
                    Biggest Gainers in last day
                  </b>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsDay.map((row) => (
                <TableRow
                  style={{ height: "2em" }}
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {row.name}
                    </div>
                  </TableCell>

                  <TableCell align="right">
                    <div className={row.lastday > 0 ? "green" : "red"}>
                      {toFixedIfNecessary(row.lastday, 2)}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          style={{ flex: "1" }}
          className="middle"
        >
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow style={{ height: "41px" }}>
                <TableCell style={{ height: "2em" }}>
                  <b style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{
                        width: "10%",
                        minWidth: "25px",
                        maxWidth: "35px",
                        marginRight: "8px",
                        height: "auto",
                      }}
                      src={icon_cap}
                    />
                    Biggest Market Cap
                  </b>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsDay3.map((row) => (
                <TableRow
                  style={{ height: "1.5em" }}
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {row.name}
                    </div>
                  </TableCell>

                  <TableCell align="right">
                    <div>
                      {row.cap}
                      {currencyDisplayed}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} style={{ flex: "1" }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow style={{ height: "22px" }}>
                <TableCell style={{ height: "2em" }}>
                  <b style={{ display: "flex", alignItems: "center" }}>
                    <img
                      style={{
                        width: "10%",
                        minWidth: "25px",
                        maxWidth: "35px",
                        marginRight: "8px",
                        height: "auto",
                      }}
                      src={icon_prediction}
                    />
                    Biggest Predicted Gainers in next day
                  </b>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsDay2.map((row) => (
                <TableRow
                  style={{ height: "1.5em" }}
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div>{row.name}</div>
                  </TableCell>
                  <TableCell align="right">
                    <div className={row.dayprediction > 0 ? "green" : "red"}>
                      {toFixedIfNecessary(row.dayprediction, 2)}%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* // main table */}
      <DataGrid
        className={classes.root}
        rows={rows}
        columns={columns}
        onCellClick={handleClick}
        pageSize={5}
        rowsPerPageOptions={[5]}
        style={{
          mouse: "pointer",
        }}
        components={{
          Pagination: CustomPagination,
        }}
      />

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {
            "Sorry, this crypto currency is not part of demo version. Please choose Bitcoin, Ethereum or Binance Coin."
          }
        </DialogTitle>

        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: 0,
        color:
          theme.palette.mode === "light"
            ? "rgba(0,0,0,.85)"
            : "rgba(255,255,255,0.85)",
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(","),
        WebkitFontSmoothing: "auto",
        letterSpacing: "normal",
        "& .MuiDataGrid-columnsContainer": {
          backgroundColor:
            theme.palette.mode === "light" ? "#fafafa" : "#1d1d1d",
        },
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
          borderRight: `1px solid ${
            theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
          }`,
        },
        "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
          borderBottom: `1px solid ${
            theme.palette.mode === "light" ? "#f0f0f0" : "#303030"
          }`,
        },
        "& .MuiDataGrid-cell": {
          color:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,.85)"
              : "rgba(255,255,255,0.65)",
        },
        "& .MuiPaginationItem-root": {
          borderRadius: 0,
        },
      },
    }),
  { defaultTheme }
);

function CustomPagination() {
  const apiRef = useGridApiContext();
  const [state] = useGridState(apiRef);

  return (
    <Pagination
      color="primary"
      variant="outlined"
      shape="rounded"
      page={state.pagination.page + 1}
      count={state.pagination.pageCount}
      // @ts-expect-error
      renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}
