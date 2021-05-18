import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/style";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function Register({ navigation }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
  });

  let signUp = async () => {
    console.log(data);
    var tempUser = new Parse.User();
    tempUser.set("username", data.username);
    tempUser.set("password", data.password);
    tempUser.set("email", data.email);

    tempUser
      .signUp()
      .then(function (user) {
        console.log(user);
        navigation.navigate("RegisterInput", {
          user: user,
          username: data.username,
        });
      })
      .catch(function (error) {
        alert("Error: " + error.code + " " + error.message);
      });
  };

  const changeUsername = (text) => {
    setData({
      ...data,
      username: text,
    });
  };

  const changeEmail = (text) => {
    setData({
      ...data,
      email: text,
    });
  };

  const changePassword = (text) => {
    setData({
      ...data,
      password: text,
    });
  };

  return (
    <View style={styles.containerLogin}>
      <Text style={styles.captionRegister}>Health Check</Text>
      <Image
        style={styles.tinyLogoRegister}
        source={require("../assets/hicon.png")}
      />
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputTextLogin}
          placeholder={t("Login...")}
          placeholderTextColor="grey"
          onChangeText={(text) => changeUsername(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputTextLogin}
          placeholder="Email..."
          placeholderTextColor="grey"
          onChangeText={(text) => changeEmail(text)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          secureTextEntry
          style={styles.inputTextLogin}
          placeholder={t("Password...")}
          placeholderTextColor="grey"
          onChangeText={(text) => changePassword(text)}
        />
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => signUp()}>
        <Text style={styles.buttonText}>{t("REGISTER")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Register;
