import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/style";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function Login({ navigation }) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState({});
  const [data, setData] = useState({
    username: "",
    password: "",
    email: "",
  });

  let signIn = async () => {
    var logUser = new Parse.User();
    logUser.set("username", data.username);
    logUser.set("password", data.password);

    logUser
      .logIn()
      .then(async function (tempUser) {
        setUser(tempUser);
        navigation.navigate("DrawerNavigator", {
          user: tempUser,
          sessionToken: tempUser.getSessionToken(),
          objectId: tempUser.id,
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
  const changePassword = (text) => {
    setData({
      ...data,
      password: text,
    });
  };

  return (
    <View style={styles.containerLogin}>
      <Text style={styles.caption}>Health Check</Text>
      <Image style={styles.tinyLogo} source={require("../assets/hicon.png")} />
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
          secureTextEntry
          style={styles.inputTextLogin}
          placeholder={t("Password...")}
          placeholderTextColor="grey"
          onChangeText={(text) => changePassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => signIn()}>
        <Text style={styles.buttonText}>{t("LOGIN")}</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.OrText}>{t("OR")}</Text>
      </View>
      <TouchableOpacity
        style={styles.registerContainer}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>{t("Create Account")}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;
