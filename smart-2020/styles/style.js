import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerLogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  caption: {
    color: "#0E53A7",
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 60,
  },
  captionRegister: {
    color: "#0E53A7",
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
  },

  buttonContainer: {
    width: "80%",
    backgroundColor: "#0E53A7",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  registerContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 22,
    color: "white",
  },
  registerText: {
    fontSize: 22,
    color: "grey",
  },
  inputView: {
    width: "80%",
    backgroundColor: "#E0E1DD",
    borderRadius: 25,
    height: 50,
    marginBottom: 15,
    justifyContent: "center",
    padding: 19,
  },
  inputTextLogin: {
    height: 50,
    fontSize: 20,
    color: "#1A1A1D",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  tinyLogoRegister: {
    width: 105,
    height: 105,
    marginBottom: 40,
  },

  OrText: {
    fontWeight: "bold",
    paddingTop: 25,
    paddingBottom: 15,
  },

  listContainer: {
    flex: 2,
    borderRadius: 8,
    margin: 10,
    marginRight: 5,
    backgroundColor: "white",
    borderColor: "#0E53A7",
    borderWidth: 0.7,
  },

  itemContainer: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomColor: "#0E53A7",
  },

  itemContainerDesc: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomColor: "#0E53A7",
  },

  flatLabel: {
    flexDirection: "row",
    padding: 8,
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

  flatIconDur: {
    flex: 1.7,
    justifyContent: "center",
    alignItems: "center",
  },

  textCurrent: {
    fontWeight: "bold",
    color: "#0E53A7",
    fontSize: 18,
    alignSelf: "center",
  },

  inputText: {
    height: 30,
    fontSize: 17,
    color: "#1A1A1D",
  },

  centeredView: {
    flex: 1,
    margin: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  leftWeight: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    flex: 1,
    borderColor: "#0E53A7",
    borderWidth: 1.8,
  },

  rightWeight: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E53A7",
    borderRadius: 8,
    flex: 1,
  },

  bottomContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  shadow: {
    shadowOpacity: 3,
    textShadowRadius: 12,
    textShadowOffset: { height: 3.5 },
    textShadowColor: "#bcbcbc",
  },
  inputContainer: {
    flexDirection: "column",
    marginBottom: 4,
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  dateIcon: {
    fontSize: 18,
  },
  visible: {
    display: "flex",
    marginLeft: 3,
  },

  invisible: {
    display: "none",
  },

  itemDate: {
    fontSize: 16,
  },

  desc: {
    marginLeft: 0,
    color: "grey",
    fontSize: 12,
  },

  flatText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 6,
  },

  deleteBox: {
    backgroundColor: "#DC143C",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: "100%",
  },

  chosenGender: {
    color: "#0E53A7",
  },

  inputTextRegister: {
    height: 55,
    fontSize: 18,
    color: "#1A1A1D",
  },

  inputView1: {
    width: "35%",
    marginRight: 20,
  },
  inputView2: {
    width: "35%",
  },

  inputContainerRegister: {
    flexDirection: "row",
    marginBottom: 9,
    marginTop: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  welcome1: {
    fontSize: 48,
    color: "#0E53A7",
    paddingBottom: 40,
  },

  welcome2: {
    fontSize: 48,
    color: "grey",
  },
  info: {
    fontSize: 18,
    color: "black",
    paddingBottom: 20,
  },


});

export { styles };
