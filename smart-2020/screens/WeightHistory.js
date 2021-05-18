import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { LineChart, YAxis, Grid } from "react-native-svg-charts";
import Moment from "moment";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useIsFocused } from "@react-navigation/native";

function WeightHistory(navigation) {
  console.log("HISTORY");
  let userId = navigation.route.params.params.objectId;
  const isFocused = useIsFocused();

  const [data, setData] = useState("");
  const [dataStats, setDataStats] = useState("");

  useEffect(
    function () {
      loadData();
    },
    [isFocused]
  );

  const loadData = async () => {
    const weight = Parse.Object.extend("weight");
    const query = new Parse.Query(weight);
    query.equalTo("userID", userId);
    query.find().then(
      (results) => {
        let weightObject = results;

        for (var i = 0; i < results.length; i++) {
          if (results[i].get("userID") == userId) {
            weightObject = results[i];
            break;
          }
        }

        let weightArray = weightObject.get("weight");
        let startingWeight = weightArray[0].weight;
        let newArray = [];
        let newArrayStats = [];
        Moment.locale("en");
        for (let i = 0; i < weightArray.length; i++) {
          let diffCalc = weightArray[i].weight - startingWeight;
          let newItem = {
            date: Moment(weightArray[i].date).format("D MMM YYYY, H:mm"),
            weight: weightArray[i].weight,
            difference: (diffCalc < 0 ? "" : "+") + diffCalc,
            color:
              diffCalc == 0 ? "black" : diffCalc < 0 ? "#00A779" : "#DC143C",
          };
          newArray.unshift(newItem);
          if (weightArray[i].weight != "")
            newArrayStats.push(parseInt(weightArray[i].weight));
        }

        setData(newArray);
        setDataStats(newArrayStats);
      },
      (error) => {
        if (typeof document !== "undefined")
          alert(`Error while fetching Menu: ${JSON.stringify(error)}`);
        console.error("Error while fetching Menu", error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.flatLabel}>
          <View style={styles.flatIcon}>
            <Icon name="calendar-day" size={24} color="#fffeff" />
          </View>
          <View style={styles.flatIcon}>
            <Icon name="weight" size={24} color="#fffeff" />
          </View>
          <View style={styles.flatIcon}>
            <Icon name="balance-scale-left" size={24} color="#fffeff" />
          </View>
        </View>
        <FlatList
          data={data}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 0.75,
                width: "100%",
                backgroundColor: "grey",
              }}
            />
          )}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={styles.flatIcon}>
                <Text style={styles.itemDate}>{item.date}</Text>
              </View>
              <View style={styles.flatIcon}>
                <Text style={styles.itemWeight}>{item.weight} kg</Text>
              </View>
              <View style={styles.flatIcon}>
                <Text style={(styles.itemDiff, { color: item.color })}>
                  {item.difference} kg
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.statsContainer}>
        <YAxis
          data={dataStats}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{
            fill: "grey",
            fontSize: 12,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `${value} kg`}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 16 }}
          data={dataStats}
          svg={{ stroke: "#0E53A7" }}
          contentInset={{ top: 20, bottom: 20 }}
        >
          <Grid />
        </LineChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#e1e2e8",
  },

  listContainer: {
    flex: 2,
    borderRadius: 8,
    margin: 10,
    marginRight: 5,
    backgroundColor: "white",
  },

  itemContainer: {
    flexDirection: "row",
    padding: 12,
    borderBottomColor: "#0E53A7",
  },

  flatLabel: {
    flexDirection: "row",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E53A7",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },

  flatIcon: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  statsContainer: {
    flex: 1.5,
    flexDirection: "row",
    marginTop: 4,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
    margin: 10,
    marginRight: 5,
    backgroundColor: "white",
  },
});

export default WeightHistory;
