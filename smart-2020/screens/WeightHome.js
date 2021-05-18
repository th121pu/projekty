import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ProgressCircle from "react-native-progress-circle";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DialogInput from "react-native-dialog-input";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function WeightHome(navigation) {
  const { t, i18n } = useTranslation();
  let userId = navigation.route.params.params.objectId;
  const [data, setData] = useState({
    startingWeight: "",
    currentWeight: "",
    idealWeight: "",
    bmi: "",
    bmiWeight: "",
    bmiTextColor: "#0E53A7",
    healthyWeightFrom: "",
    healthyWeightTo: "",
    fatKg: "",
    fatPerc: "",
    massKg: "",
    massPerc: "",
    diff: "",
    weightGoal: "",
    remain: "",
    remainPerc: "",
  });
  const [objectId, setObjectId] = useState("");
  const [dialogVisible, setDialog] = useState(false);
  const [goalVisible, setGoal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

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
        setObjectId(weightObject.id);

        let weightArray = weightObject.get("weight");
        let idealWeightCalc;
        let fatCalc;
        if (weightObject.get("gender") == "male") {
          idealWeightCalc =
            50 + ((weightObject.get("height") - 152.4) / 2.54) * 2.3;
          fatCalc =
            weightArray[weightArray.length - 1].weight -
            (0.407 * weightArray[weightArray.length - 1].weight +
              0.267 * weightObject.get("height") -
              19.2);
        } else {
          idealWeightCalc =
            45.5 + ((weightObject.get("height") - 152.4) / 2.54) * 2.3;
          fatCalc =
            weightArray[weightArray.length - 1].weight -
            (0.252 * weightArray[weightArray.length - 1].weight +
              0.473 * weightObject.get("height") -
              48.3);
        }

        let goal;
        if (weightObject.get("goal") == null)
          goal = Math.round(idealWeightCalc);
        else goal = weightObject.get("goal");

        let diffCalc =
          weightArray[weightArray.length - 1].weight - weightArray[0].weight;

        let remainPercCalc = Math.round(
          100 -
            (100 / Math.abs(weightArray[0].weight - goal)) *
              Math.abs(weightArray[weightArray.length - 1].weight - goal)
        );

        let bmiCalc = parseFloat(
          weightArray[weightArray.length - 1].weight /
            Math.pow(weightObject.get("height") / 100, 2)
        ).toFixed(2);

        let bmiWeightCalc;
        let bmiColor;
        if (bmiCalc < 18.5) {
          bmiWeightCalc = "under";
          bmiColor = "#87b1d9";
        } else if (bmiCalc >= 18.5 && bmiCalc < 25) {
          bmiWeightCalc = "normal";
          bmiColor = "#00A779";
        } else if (bmiCalc >= 25 && bmiCalc < 30) {
          bmiWeightCalc = "over";
          bmiColor = "#eee133";
        } else if (bmiCalc >= 30 && bmiCalc < 35) {
          bmiWeightCalc = "obese";
          bmiColor = "#fd802e";
        } else {
          bmiWeightCalc = "extreme";
          bmiColor = "#DC143C";
        }

        setData({
          ...data,
          startingWeight: weightArray[0].weight,
          currentWeight: weightArray[weightArray.length - 1].weight,
          diff: (diffCalc < 0 ? "" : "+") + diffCalc,
          idealWeight: Math.round(idealWeightCalc),
          weightGoal: goal,
          healthyWeightFrom: Math.round(
            18.5 * Math.pow(weightObject.get("height") / 100, 2)
          ),
          healthyWeightTo: Math.round(
            25 * Math.pow(weightObject.get("height") / 100, 2)
          ),
          bmi: bmiCalc,
          bmiWeight: bmiWeightCalc,
          bmiTextColor: bmiColor,
          fatKg: Math.round(fatCalc),
          fatPerc: Math.round(
            (100 / weightArray[weightArray.length - 1].weight) * fatCalc
          ),
          massKg:
            weightArray[weightArray.length - 1].weight - Math.round(fatCalc),
          massPerc:
            100 -
            Math.round(
              (100 / weightArray[weightArray.length - 1].weight) * fatCalc
            ),
          remain: Math.abs(weightArray[weightArray.length - 1].weight - goal),
          remainPerc: remainPercCalc,
        });
      },
      (error) => {
        if (typeof document !== "undefined")
          alert(`Error while fetching Menu: ${JSON.stringify(error)}`);
        console.error("Error while fetching Menu", error);
      }
    );
  };
  const addWeight = async (newValue) => {
    const weight = Parse.Object.extend("weight");
    const query = new Parse.Query(weight);
    query.get(objectId).then((object) => {
      const newWeight = {
        weight: newValue,
        date: new Date(),
      };
      object.set(object.get("weight").push(newWeight));
      object.save().then(
        (response) => {
          if (typeof document !== "undefined")
            document.write(`Updated weight: ${JSON.stringify(response)}`);
          // console.log("Updated weight", response);
          loadData();
          if (Platform.OS === "android") {
            ToastAndroid.show(t("New weight added!"), ToastAndroid.SHORT);
          }
        },
        (error) => {
          if (typeof document !== "undefined")
            document.write(
              `Error while updating weight: ${JSON.stringify(error)}`
            );
          console.error("Error while updating weight", error);
        }
      );
    });
  };

  const addGoal = async (newValue) => {
    const weight = Parse.Object.extend("weight");
    const query = new Parse.Query(weight);
    query.get(objectId).then((object) => {
      object.set("goal", parseInt(newValue));
      object.save().then(
        (response) => {
          if (typeof document !== "undefined")
            document.write(`Updated weight: ${JSON.stringify(response)}`);
          loadData();
          if (Platform.OS === "android") {
            ToastAndroid.show(t("Weight goal updated!"), ToastAndroid.SHORT);
          }
        },
        (error) => {
          if (typeof document !== "undefined")
            document.write(
              `Error while updating weight: ${JSON.stringify(error)}`
            );
          console.error("Error while updating weight", error);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.currentContainer}>
          <View style={[styles.weights, styles.paddingBottom2]}>
            <View style={styles.leftWeight}>
              <Text style={styles.textCurrent}>{t("Starting Weight")}</Text>
              <Text style={styles.numberCurrent}>{data.startingWeight} kg</Text>
            </View>

            <View style={styles.rightWeight}>
              <Text style={styles.textCurrent}>{t("Ideal Weight")}</Text>
              <Text style={styles.numberCurrent}>{data.idealWeight} kg</Text>
            </View>
          </View>

          <View style={[styles.weights, styles.paddingBottom2]}>
            <View style={styles.leftWeight}>
              <Text style={styles.textCurrent}>{t("Current Weight")}</Text>
              <Text
                style={
                  data.currentWeight == data.weightGoal
                    ? styles.numberCurrent2
                    : styles.numberCurrent3
                }
              >
                {data.currentWeight} kg
              </Text>
            </View>

            <TouchableOpacity
              style={styles.rightWeight}
              onPress={() => setGoal(true)}
            >
              <Text style={styles.textCurrent}>{t("Weight Goal")}</Text>
              <Text style={styles.numberCurrent2}>{data.weightGoal} kg</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.progressCon}>
            <Text style={[styles.textCurrent, styles.progress]}>
              {t("Weight Goal Completed")}
            </Text>

            <ProgressCircle
              percent={parseInt(data.remainPerc)}
              radius={60}
              borderWidth={10}
              color="#0E53A7"
              shadowColor="#e1e2e8"
              bgColor="white"
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {data.remainPerc}%
              </Text>
              <Text style={{ fontSize: 14 }}>
                {t("Remain")}: {data.remain} kg
              </Text>
            </ProgressCircle>
          </View>

          <Text style={styles.textCurrent}>
            {t("Change since the beginning")}:
            <Text style={styles.textNormal}> {data.diff} kg</Text>
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.healtContainer}>
            <Icon
              style={styles.paddingBottom}
              name="medkit"
              size={32}
              color="#0E53A7"
            />
            <Text style={styles.textCurrent}>{t("Healthy Weight")}</Text>
            <Text>
              {data.healthyWeightFrom}-{data.healthyWeightTo} kg
            </Text>
          </View>

          <View style={styles.fatContainer}>
            <Image
              style={styles.tinyLogo}
              source={require("../assets/fatIcon.png")}
            />
            <Text style={styles.textCurrent}>{t("Body Fat")}</Text>
            <Text>
              {data.fatKg} kg ({data.fatPerc}%)
            </Text>
          </View>
          <View style={styles.massContainer}>
            <Icon
              style={styles.paddingBottom}
              name="ios-body"
              size={32}
              color="#0E53A7"
            />
            <Text style={styles.textCurrent}>{t("Lean Body")}</Text>
            <Text style={styles.textCurrent}>{t("Mass")}</Text>
            <Text>
              {data.massKg} kg ({data.massPerc}%)
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.textCurrent}>{t("Your")} BMI</Text>
        <Text
          style={{
            color: data.bmiTextColor,
            fontSize: 28,
            fontWeight: "bold",
            marginTop: 2,
            marginBottom: 4,
          }}
        >
          {data.bmi}
        </Text>
        <View style={styles.charts}>
          <View style={[styles.chart, styles.chartFirst, styles.blue]}>
            <Text style={styles.whiteText}> {t("Under")}</Text>
            <Text style={styles.whiteText}> {t("Weight")}</Text>
            <Text style={styles.whiteText}> {"<"}18,5 </Text>
          </View>
          <View style={[styles.chart, styles.green]}>
            <Text style={styles.whiteText}> {t("Normal")}</Text>
            <Text style={styles.whiteText}> {t("Weight")}</Text>
            <Text style={styles.whiteText}> 18,5-24,9 </Text>
          </View>
          <View style={[styles.chart, styles.yellow]}>
            <Text style={styles.whiteText}> {t("Over")}</Text>
            <Text style={styles.whiteText}> {t("Weight")}</Text>
            <Text style={styles.whiteText}> 25-29,9 </Text>
          </View>

          <View style={[styles.chart, styles.orange]}>
            <Text style={styles.whiteText}> {t("Obese")}</Text>
            <Text style={styles.whiteText}> {t("Weight")}</Text>
            <Text style={styles.whiteText}> 30-34,9 </Text>
          </View>
          <View style={[styles.chart, styles.chartLast, styles.red]}>
            <Text style={styles.whiteText}> {t("Extremely")}</Text>
            <Text style={styles.whiteText}> {t("Obese")}</Text>
            <Text style={styles.whiteText}> {">"}35 </Text>
          </View>
        </View>

        <View style={styles.chartsUnder}>
          <View
            style={[
              styles.chartUnder,
              data.bmiWeight == "under" ? styles.visible : styles.invisible,
            ]}
          >
            <Icon
              style={styles.shadow}
              name="caret-up"
              size={40}
              color="#87b1d9"
            />
          </View>
          <View
            style={[
              styles.chartUnder,
              data.bmiWeight == "normal" ? styles.visible : styles.invisible,
            ]}
          >
            <Icon
              style={styles.shadow}
              name="caret-up"
              size={40}
              color="#00A779"
            />
          </View>
          <View
            style={[
              styles.chartUnder,
              data.bmiWeight == "over" ? styles.visible : styles.invisible,
            ]}
          >
            <Icon
              style={styles.shadow}
              name="caret-up"
              size={40}
              color="#eee133"
            />
          </View>

          <View
            style={[
              styles.chartUnder,
              data.bmiWeight == "obese" ? styles.visible : styles.invisible,
            ]}
          >
            <Icon
              style={styles.shadow}
              name="caret-up"
              size={40}
              color="#fd802e"
            />
          </View>
          <View
            style={[
              styles.chartUnder,
              data.bmiWeight == "extreme" ? styles.visible : styles.invisible,
            ]}
          >
            <Icon
              style={styles.shadow}
              name="caret-up"
              size={40}
              color="#DC143C"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bottomContainer}
        onPress={() => setDialog(true)}
      >
        <Icon
          style={styles.shadow}
          name="add-circle"
          size={64}
          color="#0E53A7"
        />
      </TouchableOpacity>

      <DialogInput
        isDialogVisible={dialogVisible}
        title={t("Add Weight")}
        hintInput={t("In kilograms...")}
        submitInput={(inputText) => {
          addWeight(inputText);
          setDialog(false);
        }}
        closeDialog={() => {
          setDialog(false);
        }}
      ></DialogInput>

      <DialogInput
        isDialogVisible={goalVisible}
        title={t("Add Weight Goal")}
        hintInput={t("In kilograms...")}
        submitInput={(inputText) => {
          if (
            parseInt(inputText) < data.healthyWeightFrom ||
            parseInt(inputText) > data.healthyWeightTo
          ) {
            alert(
              `Sorry, this is not a healthy weight!    Select weight in range ${data.healthyWeightFrom}-${data.healthyWeightTo} kg!`
            );
          } else {
            addGoal(inputText);
            setGoal(false);
          }
        }}
        closeDialog={() => {
          setGoal(false);
        }}
      ></DialogInput>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e2e8",
  },

  progressCon: {
    paddingBottom: 24,
    paddingTop: 6,
    justifyContent: "center",
    alignItems: "center",
  },

  progress: {
    marginBottom: 8,
  },

  topContainer: {
    flex: 2.7,
    justifyContent: "center",
    flexDirection: "row",
  },

  fatContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#0E53A7",
    borderBottomWidth: 1,
    paddingBottom: 18,
    borderTopColor: "#0E53A7",
    borderTopWidth: 1,
    paddingTop: 18,
  },

  massContainer: {
    paddingTop: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  healtContainer: {
    paddingBottom: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  textCurrent: {
    fontWeight: "bold",
    color: "#0E53A7",
  },

  textNormal: {
    fontWeight: "normal",
    color: "#000000",
  },

  numberCurrent: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0E53A7",
  },

  numberCurrent2: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00A779",
  },

  numberCurrent3: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DC143C",
  },

  weights: {
    flexDirection: "row",
  },

  leftWeight: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  rightWeight: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  currentContainer: {
    flex: 2.4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    margin: 10,
    marginRight: 5,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    margin: 10,
    marginLeft: 5,
  },

  middleContainer: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 6,
    margin: 10,
    marginRight: 5,
  },

  bottomContainer: {
    flex: 0.7,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },

  addWeight: {
    borderRadius: 27,
    backgroundColor: "#0E53A7",
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    height: 54,
  },

  buttonText: {
    fontSize: 38,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  shadow: {
    shadowOpacity: 3,
    textShadowRadius: 12,
    textShadowOffset: { height: 3.5 },
    textShadowColor: "#bcbcbc",
  },

  tinyLogo: {
    width: 32,
    height: 32,
    marginBottom: 6,
  },

  paddingBottom: {
    paddingBottom: 6,
  },

  paddingBottom2: {
    paddingBottom: 16,
  },

  charts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  chartsUnder: {
    flexDirection: "row",
    margin: 0,
  },

  chart: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 2,
    paddingBottom: 5,
    paddingTop: 5,
    borderRadius: 4,
  },

  chartUnder: {
    alignItems: "center",
    flex: 1,
  },

  chartFirst: {
    marginLeft: 0,
  },

  chartLast: {
    marginRight: 0,
  },

  visible: {
    opacity: 100,
  },

  invisible: {
    opacity: 0,
  },

  blue: {
    backgroundColor: "#87b1d9",
  },

  green: {
    backgroundColor: "#00A779",
  },

  yellow: {
    backgroundColor: "#eee133",
  },

  orange: {
    backgroundColor: "#fd802e",
  },

  red: {
    backgroundColor: "#DC143C",
  },

  whiteText: {
    color: "#fffeff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default WeightHome;
