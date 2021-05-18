import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function Logout({ navigation }) {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>
        {t("Are you sure you want to log out?")}
      </Text>
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.buttonContainer2}
          onPress={() => navigation.navigate(t("Weight Planner"))}
        >
          <Text style={styles.buttonText2}>{t("NO")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer1}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText1}>{t("YES")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
  },
  caption: {
    color: "#0E53A7",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 60,
    textAlign: "center",
    padding: 5,
  },
  buttonContainer1: {
    width: "40%",
    backgroundColor: "#0E53A7",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  buttonContainer2: {
    width: "40%",
    backgroundColor: "#E0E1DD",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  buttonText1: {
    fontSize: 20,
    color: "#E0E1DD",
  },
  buttonText2: {
    fontSize: 20,
    color: "#0E53A7",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 9,
    marginTop: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Logout;
