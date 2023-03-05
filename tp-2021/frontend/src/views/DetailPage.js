import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Chart, Area, Legend, Tooltip, Axis, LineAdvance } from "bizcharts";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  VictoryCandlestick,
  VictoryTheme,
  VictoryChart,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryLine,
  VictoryLegend
} from "victory";

import currencyContext from "../contexts/currencyContext";

let tempHelper = 0;

const timeFormatter = (timestamp) => {
  let date = new Date(timestamp.replace('"', "").replace('"', ""));
  date = convertUTCDateToLocalDate(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const valueFormatted = new Intl.DateTimeFormat("en-GB", options).format(date);

  return valueFormatted;
};

const timeFormatterCandle = (timestamp) => {
  let date = new Date(timestamp.replace('"', "").replace('"', ""));
  date = convertUTCDateToLocalDate(date);
  var options = {
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const valueFormatted = new Intl.DateTimeFormat("en-GB", options).format(date);

  return valueFormatted;
};

function convertUTCDateToLocalDate(date) {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  return newDate;
}

//create your forceUpdate hook
function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export default function DetailPage() {
  // use for local version
  // let url = "http://127.0.0.1:5000";

  //use for deployed version
  let url = "https://crypto-predict-api2.azurewebsites.net";

  const { id } = useParams();
  let cryptoName = "Bitcoin";

  const { currency } = useContext(currencyContext);
  let [currencyDisplayed, setCurrencyDisplayed] = React.useState(
    currency === "EUR" ? "€" : "$"
  );

  const scale = {
    price_close: {
      alias: "Price (" + currencyDisplayed + ")",
      nice: true,
    },
    time_period_end: {
      formatter: timeFormatter,
      range: [0, 1],
    },
  };

  if (id == 2) cryptoName = "Ethereum";
  if (id == 3) cryptoName = "Binance Coin";
  const [data, setData] = useState([]);
  const [historyData, setHistoryData] = useState();
  const [resistances, setResistances] = useState([]);
  const [supports, setSupports] = useState([]);
  const [victoryLines, setVictoryLines] = useState();

  let defaultInterval = "10MIN";
  if (id != 1) defaultInterval = "1HRS";
  const [interval, setInterval] = React.useState(defaultInterval);

  const handleChange = (event) => {
    setInterval(event.target.value);

    fetch(
      url +
        "/api/price_history?currency=" +
        id +
        "&interval=" +
        event.target.value
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("HANDLE CHANGE FETCH for " + currency);
        if (currency === "USD") {
          data.forEach(function (element) {
            element.price_close = 1.13 * element.price_close;
            element.price_low = 1.13 * element.price_low;
            element.price_high = 1.13 * element.price_high;
            element.price_open = 1.13 * element.price_open;
          });
        }

        // LEN HIST. DATA PRE CANDLESTICK
        let historical = [];
        data.forEach(function (element) {
          if (element.category === "historical price") {
            element.time_end = timeFormatterCandle(element.time_period_end);
            if (
              historical.length !== 0 &&
              ((event.target.value === "1HRS" && id == 1) ||
                event.target.value === "12HRS" ||
                event.target.value === "1DAY" ||
                event.target.value === "1WKS")
            ) {
              element.price_open = historical.at(-1).price_close;
              if (
                element.price_open > element.price_close &&
                element.price_high < element.price_open
              ) {
                element.price_high =
                  element.price_open + element.price_open / 99;
              } else if (
                element.price_open < element.price_close &&
                element.price_low > element.price_open
              ) {
                element.price_low =
                  element.price_open - element.price_open / 99;
              }
            }
            historical.push(element);
          }
        });
        //let resistances = [];
        //let supports = [];
        //let tempHelper = 0;
        setResistances([]);
        let resistancesNew = [];
        let supportsNew = [];
        for (let i = 2; i < historical.length - 2; i++) {
        tempHelper = 0;
          for (let u = 1; u < 3; u++) {
            if (historical[i - u + 1].price_low < historical[i - u].price_low) {
              //support
              tempHelper = tempHelper + 1;
            }
            if (historical[i + u - 1].price_low < historical[i + u].price_low) {
              tempHelper = tempHelper + 1;
            }
          }
          if (tempHelper == 4) {
            supportsNew.push(historical[i]);
            tempHelper = 0;
          } else { 
              tempHelper = 0;
              for (let o = 1; o < 3; o++) {
            if (historical[i - o + 1].price_high > historical[i - o].price_high) {
              //
              tempHelper = tempHelper + 1;
            }
            if (historical[i + o - 1].price_high > historical[i + o].price_high) {
              tempHelper = tempHelper + 1;
            }
          }
          if (tempHelper == 4){
              resistancesNew.push(historical[i]);
              tempHelper = 0;
          }
          }
        }
        let novyRes = resistancesNew.slice(-5);
        let novySup = supportsNew.slice(-5);
        console.log(novyRes);
        console.log(novySup);
        setResistances(novyRes);
        setSupports(novySup);
        setHistoryData(historical);

        console.log(historyData);

        //MAZANIE NULL
        data.forEach(function (element, index, object) {
          if (element.price_close == null) {
            object.splice(index, 1);
          }
        });

        setData(data);
      });
  };

  useEffect(() => {
    fetch(
      url + "/api/price_history?currency=" + id + "&interval=" + defaultInterval
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("FIRST FETCH for " + currency);
        if (currency === "USD") {
          data.forEach(function (element) {
            element.price_close = 1.13 * element.price_close;
            element.price_low = 1.13 * element.price_low;
            element.price_high = 1.13 * element.price_high;
            element.price_open = 1.13 * element.price_open;
          });
        }
        // LEN HIST. DATA PRE CANDLESTICK
        let historical = [];
        data.forEach(function (element) {
          if (element.category === "historical price") {
            element.time_end = timeFormatterCandle(element.time_period_end);
            historical.push(element);
          }
        });
        setHistoryData(historical);

        //MAZANIE NULL
        data.forEach(function (element, index, object) {
          if (element.price_close == null) {
            object.splice(index, 1);
          }
        });

        setData(data);
      });
  }, []);

  React.useEffect(() => {
    console.log("change");
    console.log(currency);
    let urlSuffix =
      "/api/price_history?currency=" + id + "&interval=" + interval;
    console.log(urlSuffix);
    fetch(url + urlSuffix)
      .then((res) => res.json())
      .then((dataResponse) => {
        console.log("CURRENCY CHANGE FETCH for " + currency);
        console.log(dataResponse);

        if (currency === "USD") {
          dataResponse.forEach(function (element) {
            element.price_close = 1.13 * element.price_close;
            element.price_low = 1.13 * element.price_low;
            element.price_high = 1.13 * element.price_high;
            element.price_open = 1.13 * element.price_open;
          });
        }
        // LEN HIST. DATA PRE CANDLESTICK
        let historical = [];
        dataResponse.forEach(function (element) {
          if (element.category === "historical price") {
            element.time_end = timeFormatterCandle(element.time_period_end);
            if (
              historical.length !== 0 &&
              ((interval === "1HRS" && id == 1) ||
                interval === "12HRS" ||
                interval === "1DAY" ||
                interval === "1WKS")
            ) {
              element.price_open = historical.at(-1).price_close;
              if (
                element.price_open > element.price_close &&
                element.price_high < element.price_open
              ) {
                element.price_high =
                  element.price_open + element.price_open / 99;
              } else if (
                element.price_open < element.price_close &&
                element.price_low > element.price_open
              ) {
                element.price_low =
                  element.price_open - element.price_open / 99;
              }
            }
            historical.push(element);
          }
        });

        let resistancesNew = [];
        let supportsNew = [];
        for (let i = 2; i < historical.length - 2; i++) {
        tempHelper = 0;
          //support
          for (let u = 1; u < 3; u++) {
            if (historical[i - u + 1].price_low < historical[i - u].price_low) {
              tempHelper = tempHelper + 1;
            }
            if (historical[i + u - 1].price_low < historical[i + u].price_low) {
              tempHelper = tempHelper + 1;
            }
          } 
          if (tempHelper == 4) {
            supportsNew.push(historical[i]);
            tempHelper = 0; 
          } else { 
              tempHelper = 0;
              //resistance
              for (let o = 1; o < 3; o++) {
            if (historical[i - o + 1].price_high > historical[i - o].price_high) {
              tempHelper = tempHelper + 1;
            }
            if (historical[i + o - 1].price_high > historical[i + o].price_high) {
              tempHelper = tempHelper + 1;
            }
          }
          if (tempHelper == 4){
              resistancesNew.push(historical[i]);
              tempHelper = 0;
          }
          }
        }
        let novyRes = resistancesNew.slice(-5);
        let novySup = supportsNew.slice(-5); 
        console.log(novyRes);
        console.log(novySup);
        setResistances(novyRes);
        setSupports(novySup);
        setHistoryData(historical);
        console.log(historyData);

        //MAZANIE NULL
        dataResponse.forEach(function (element, index, object) {
          if (element.price_close == null) {
            object.splice(index, 1);
          }
        });

        setData(dataResponse);

        if (currency === "EUR") setCurrencyDisplayed("€");
        else setCurrencyDisplayed("$");
      });
  }, [currency]);

  return (
    <div>
      <h3 style={{ marginTop: "2%" }}>
        {cryptoName} historical price and prediction
      </h3>

      <Box
        display="flex"
        justifyContent="center"
        sx={{ minWidth: 120 }}
        style={{ marginTop: "1%" }}
      >
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel id="demo-simple-select-label">Period</InputLabel>
          <Select
            sx={{ minWidth: 100 }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={interval}
            label="Age"
            onChange={handleChange}
          >
            {id == 1 && <MenuItem value={"10MIN"}>12 hours</MenuItem>}

            <MenuItem value={"1HRS"}>1 week</MenuItem>
            <MenuItem value={"12HRS"}>1 month</MenuItem>
            <MenuItem value={"1DAY"}>6 months</MenuItem>
            <MenuItem value={"1WKS"}> All time historical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <div
        style={{
          marginLeft: "5%",
          marginRight: "5%",
          marginBottom: "50px",
        }}
      >
        <Chart scale={scale} height={400} data={data} autoFit>
          <Legend position="top" />
          <Tooltip />

          <Area tooltip={false} position="time_period_end*price_close" />
          <Area
            tooltip={false}
            position="time_period_end*price_close"
            color="category"
          />
          <LineAdvance
            tooltip={false}
            position="time_period_end*price_close"
            color="lightblue"
          />
          <LineAdvance
            position="time_period_end*price_close"
            color="category"
          />
          <Axis
            name="time_period_end"
            label={{
              style: { fontSize: 12 },
            }}
          />

          <Axis
            title={{
              autoRotate: true,
              offset: 70,
              textStyle: {
                fontSize: "18px",
                textAlign: "center",
                fontWeight: "bold",
              },
              position: "center",
            }}
            name="price_close"
            label={{
              style: { fontSize: 12 },
            }}
          />
        </Chart>

        {/* ----------------------------------------------------------------
-----------------CANDLESTICK-----------------
---------------------------------------------------------------- */}
        <h3 style={{ marginTop: "4%", marginBottom: 0 }}>
          {cryptoName} historical price
        </h3>
        <VictoryChart
          containerComponent={<VictoryZoomContainer zoomDimension="x" />}
          theme={VictoryTheme.material}
          domainPadding={{ x: 5 }}
          scale={{ x: "time_end" }}
          height={340}
          width={1000}
        >
          <VictoryAxis
            label="Date and time"
            axisLabelComponent={
              <VictoryLabel style={[{ fontSize: 10 }]} dy={42} />
            }
            style={{
              ticks: { stroke: "grey", size: 5 },
              tickLabels: { fontSize: 6, angle: -90, padding: 22 },
            }}
          />
          <VictoryAxis
            label={"Price (" + currencyDisplayed + ")"}
            axisLabelComponent={
              <VictoryLabel style={[{ fontSize: 8 }]} dy={-30} />
            }
            dependentAxis
            style={{
              ticks: { stroke: "grey", size: 5 },
              tickLabels: { fontSize: 7, padding: 5 },
            }}
          />
          <VictoryCandlestick
            candleColors={{ positive: "green", negative: "red" }}
            data={historyData}
            x="time_end"
            open="price_open"
            close="price_close"
            high="price_high"
            low="price_low"
            candleRatio={0.7}
            closeLabels
            closeLabelComponent={<VictoryTooltip pointerLength={5} />}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseOver: () => ({
                    target: "closeLabels",
                    mutation: () => ({ active: true }),
                  }),
                  onMouseOut: () => ({
                    target: "closeLabels",
                    mutation: () => ({ active: false }),
                  }),
                },
              },
            ]}
          />

          {resistances.map((d) => (
            <VictoryLine
              style={{
                data: { stroke: "blue", strokeWidth: 0.5 },
                parent: { border: "0.1px solid #ccc" },
              }}
              data={[
                { x: d.time_end, y: d.price_high },
                {
                  x: historyData[historyData.length - 1].time_end,
                  y: d.price_high,
                },
              ]}
            />
          ))}

          {supports.map((d) => (
            <VictoryLine
              style={{
                data: { stroke: "red", strokeWidth: 0.5 },
                parent: { border: "0.1px solid #ccc" },
              }}
              data={[
                { x: d.time_end, y: d.price_low },
                {
                  x: historyData[historyData.length - 1].time_end,
                  y: d.price_low,
                },
              ]}
            />
          ))}
          <VictoryLegend x = {770} y = {10}
              title=""
              centerTitle
              orientation="horizontal"
              gutter={12}
              style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
              data={[
                { name: "Resistance", symbol: { fill: "blue"} },
                { name: "Support", symbol: { fill: "red" } }
            ]}
          />
        </VictoryChart>
      </div>
    </div>
  );
}
