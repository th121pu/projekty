import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button } from "react-native";
import { TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Moment from "moment";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/style";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function RegisterInput(navigation) {
  const { t, i18n } = useTranslation();
  let username = navigation.route.params.username;

  const [gender, setGender] = useState("male");

  let changeMale = gender == "male" ? styles.chosenGender : "";
  let changeFemale = gender == "female" ? styles.chosenGender : "";

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow();
    setDate(selectedDate);
    console.log("selected " + selectedDate);
    console.log("date " + date);
  };

  const showPicker = () => {
    setShow(true);
  };

  const [data, setData] = useState({
    birthdate: "",
    height: "",
    weight: "",
  });

  const changeHeight = (text) => {
    setData({
      ...data,
      height: text,
    });
  };
  const changeWeight = (text) => {
    setData({
      ...data,
      weight: text,
    });
  };

  let completeReg = async () => {
    let tempUser = navigation.route.params.user;
    console.log(tempUser);
    const weight = Parse.Object.extend("weight");
    const myNewObject = new weight();

    myNewObject.set("userID", tempUser.id);
    myNewObject.set("birthdate", date);
    myNewObject.set("height", parseInt(data.height));
    let weightObject = [];
    let newWeight = {
      weight: data.weight,
      date: new Date(),
    };
    weightObject.push(newWeight);
    myNewObject.set("weight", weightObject);
    myNewObject.set("gender", gender);

    myNewObject.save().then(
      (result) => {
        if (typeof document !== "undefined")
          document.write(`weight created: ${JSON.stringify(result)}`);
        console.log("weight created", result);
        navigation.navigation.navigate("DrawerNavigator", {
          user: tempUser,
          sessionToken: tempUser.getSessionToken(),
          objectId: tempUser.id,
        });
      },
      (error) => {
        if (typeof document !== "undefined")
          document.write(
            `Error while creating weight: ${JSON.stringify(error)}`
          );
        console.error("Error while creating weight: ", error);
      }
    );
  };
  Moment.locale("en");
  return (
    <View style={styles.containerLogin}>
      <Text style={styles.welcome2}>{t("Welcome")}</Text>
      <Text style={styles.welcome1}>{username}!</Text>
      <Text style={styles.info}>
        {t("Please fill in the required information")}:
      </Text>
      <View style={styles.inputContainerRegister}>
        <View style={styles.inputView1}>
          <TextInput
            label={t("Height")}
            mode="outlined"
            style={styles.inputTextRegister}
            placeholder={t("in cm...")}
            placeholderTextColor="grey"
            onChangeText={(text) => changeHeight(text)}
            theme={{ colors: { primary: "#0E53A7" } }}
          />
        </View>
        <View style={styles.inputView2}>
          <TextInput
            label={t("Weight")}
            mode="outlined"
            style={styles.inputTextRegister}
            placeholder={t("in kg...")}
            placeholderTextColor="grey"
            onChangeText={(text) => changeWeight(text)}
            theme={{ colors: { primary: "#0E53A7" } }}
          />
        </View>
      </View>

      <View style={styles.inputContainerRegister}>
        <TouchableOpacity onPress={() => showPicker()}>
          <View style={styles.inputContainerRegister}>
            <Text style={styles.dateText}>
              {t("Your birthday")}:{"  "}
            </Text>
            <Text style={styles.dateIcon}>
              {Moment(date).format("D MMM YYYY")}{" "}
            </Text>
            <Icon
              name="ios-calendar-sharp"
              size={36}
              color="#0E53A7"
              style={changeMale}
            />
          </View>
        </TouchableOpacity>
      </View>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <View style={styles.inputContainerRegister}>
        <TouchableOpacity onPress={() => setGender("male")}>
          <Icon name="man" size={80} color="grey" style={changeMale} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender("female")}>
          <Icon name="woman" size={80} color="grey" style={changeFemale} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => completeReg()}
      >
        <Text style={styles.buttonText}>{t("CONTINUE")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default RegisterInput;
