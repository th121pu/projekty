import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Animated,
  ToastAndroid,
  Platform,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import DateTimePicker from "@react-native-community/datetimepicker";
import TimePicker from "react-native-simple-time-picker";
import { Picker } from "@react-native-picker/picker";
import Moment from "moment";
import Parse from "parse/react-native.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/style";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

function Pills({ navigation }) {
  const isFocused = useIsFocused();
  const { t, i18n } = useTranslation();
  useEffect(
    function () {
      loadData();
    },
    [isFocused]
  );

  const [show, setShow] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow();
    setAddData({
      ...addData,
      startDay: selectedDate,
      endDay: selectedDate,
    });
  };

  const onChangeEnd = (event, selectedDate) => {
    setShowEnd();
    setAddData({
      ...addData,
      endDay: selectedDate,
    });
  };

  const showPicker = () => {
    setShow(true);
  };

  const showPickerEnd = () => {
    setShowEnd(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

  const showModal = (id) => {
    setUpdateId(id);
    const pillShown = allPills.filter((pill) => pill.id == id)[0];

    setAddData({
      name: pillShown.name,
      desc: pillShown.desc,
      startDay: pillShown.startDay,
      endDay: pillShown.endDay,
      howOften: pillShown.howOften,
      howMany: pillShown.howMany,
      time1: pillShown.time1,
      time2: pillShown.time2,
      time3: pillShown.time3,
    });

    time.selectedMinutes = pillShown.time1.substring(3, 5);
    time.selectedHours = pillShown.time1.substring(0, 2);
    time.selectedMinutes2 = pillShown.time2.substring(3, 5);
    time.selectedHours2 = pillShown.time2.substring(0, 2);
    time.selectedMinutes3 = pillShown.time3.substring(3, 5);
    time.selectedHours3 = pillShown.time3.substring(0, 2);

    setModalUpdateVisible(true);
  };

  const [allPills, setAllPills] = useState([]);
  let userId = Parse.User.current().id;
  const [objectId, setObjectId] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [secondVisible, setSecond] = useState("none");
  const [thirdVisible, setThird] = useState("none");
  const [time, setTime] = useState({
    selectedHours: 0,
    selectedMinutes: 0,
    selectedHours2: 0,
    selectedMinutes2: 0,
    selectedHours3: 0,
    selectedMinutes3: 0,
  });

  const [addData, setAddData] = useState({
    name: "",
    desc: "",
    startDay: new Date(),
    endDay: new Date(),
    howOften: 1,
    howMany: "",
    time1: "",
    time2: "",
    time3: "",
  });

  const addTime = (hours, minutes, timeIndex) => {
    let sendHours = hours;
    let sendMinutes = minutes;

    if (hours < 10) sendHours = "0" + hours;
    if (minutes < 10) sendMinutes = "0" + minutes;
    if (sendHours == "0" || sendHours == "000") sendHours = "00";
    if (sendMinutes == "0" || sendMinutes == "000") sendMinutes = "00";

    if (timeIndex == 1) {
      setAddData({
        ...addData,
        time1: sendHours + ":" + sendMinutes,
      });
      setTime({
        selectedMinutes: minutes,
        selectedHours: hours,
      });
    }
    if (timeIndex == 2) {
      setAddData({
        ...addData,
        time2: sendHours + ":" + sendMinutes,
      });
      setTime({
        selectedMinutes2: minutes,
        selectedHours2: hours,
      });
    }
    if (timeIndex == 3) {
      setAddData({
        ...addData,
        time3: sendHours + ":" + sendMinutes,
      });
      setTime({
        selectedMinutes3: minutes,
        selectedHours3: hours,
      });
    }
  };

  const changeName = (text) => {
    setAddData({
      ...addData,
      name: text,
    });
  };
  const changeDesc = (text) => {
    setAddData({
      ...addData,
      desc: text,
    });
  };
  const changeHowMany = (text) => {
    setAddData({
      ...addData,
      howMany: text,
    });
  };

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

        let pillArray = weightObject.get("pills");
        setAllPills(pillArray);
      },
      (error) => {
        if (typeof document !== "undefined")
          alert(`Error while fetching Menu: ${JSON.stringify(error)}`);
        console.error("Error while fetching Menu", error);
      }
    );
  };

  const updatePill = async () => {
    if (addData.name == "" || addData.howMany == "")
      alert(t("Name and Amount required!"));
    else {
      const weight = Parse.Object.extend("weight");
      const query = new Parse.Query(weight);
      query.get(objectId).then((object) => {
        const newPill = {
          name: addData.name,
          desc: addData.desc,
          startDay: addData.startDay,
          endDay: addData.endDay,
          howOften: addData.howOften,
          howMany: addData.howMany,
          time1: addData.time1,
          time2: addData.time2,
          time3: addData.time3,
          id: updateId,
        };

        let oldObject = object.get("pills");
        let toDelete = oldObject.filter((pill) => pill.id == updateId)[0];
        const index = oldObject.indexOf(toDelete);
        object.get("pills")[index] = newPill;

        setAddData({
          ...addData,
          name: "",
          desc: "",
          startDay: new Date(),
          endDay: new Date(),
          howOften: 1,
          howMany: "",
          time1: "",
          time2: "",
          time3: "",
        });

        setUpdateId("");

        setTime({
          selectedHours: 0,
          selectedMinutes: 0,
          selectedHours2: 0,
          selectedMinutes2: 0,
          selectedHours3: 0,
          selectedMinutes3: 0,
        });

        setSecond("none");
        setThird("none");
        object.save().then(
          (response) => {
            if (typeof document !== "undefined")
              document.write(`Updated weight: ${JSON.stringify(response)}`);
            loadData();
            if (Platform.OS === "android") {
              ToastAndroid.show(t("Medication updated!"), ToastAndroid.SHORT);
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
    }
  };

  const deletePill = async (id) => {
    const weight = Parse.Object.extend("weight");
    const query = new Parse.Query(weight);
    query.get(objectId).then((object) => {
      for (let i = 0; i < object.get("pills").length; i++) {
        if (object.get("pills")[i].id == id) {
          object.get("pills").splice(i, 1);
        }
      }

      object.save().then(
        (response) => {
          if (typeof document !== "undefined")
            document.write(`Updated weight: ${JSON.stringify(response)}`);
          loadData();
          if (Platform.OS === "android") {
            ToastAndroid.show(t("Medication deleted!"), ToastAndroid.SHORT);
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

  const addPill = async () => {
    if (addData.name == "" || addData.howMany == "")
      alert(t("Name and Amount required!"));
    else {
      const weight = Parse.Object.extend("weight");
      const query = new Parse.Query(weight);
      query.get(objectId).then((object) => {
        const newPill = {
          name: addData.name,
          desc: addData.desc,
          startDay: addData.startDay,
          endDay: addData.endDay,
          howOften: addData.howOften,
          howMany: addData.howMany,
          time1: addData.time1,
          time2: addData.time2,
          time3: addData.time3,
        };

        if (object.get("pills") == null || object.get("pills").length == 0) {
          newPill.id = 0;
          const newObject = [newPill];
          object.set("pills", newObject);
        } else {
          newPill.id =
            object.get("pills")[object.get("pills").length - 1].id + 1;
          object.set(object.get("pills").push(newPill));
        }

        setAddData({
          ...addData,
          name: "",
          desc: "",
          startDay: new Date(),
          endDay: new Date(),
          howOften: 1,
          howMany: "",
          time1: "",
          time2: "",
          time3: "",
        });

        setTime({
          selectedHours: 0,
          selectedMinutes: 0,
          selectedHours2: 0,
          selectedMinutes2: 0,
          selectedHours3: 0,
          selectedMinutes3: 0,
        });

        setSecond("none");
        setThird("none");
        object.save().then(
          (response) => {
            if (typeof document !== "undefined")
              document.write(`Updated weight: ${JSON.stringify(response)}`);
            loadData();
            if (Platform.OS === "android") {
              ToastAndroid.show(t("New medication added!"), ToastAndroid.SHORT);
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
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <View style={styles.flatLabel}>
          <View style={styles.flatIcon}>
            <Text style={styles.flatText}>{t("Name")}</Text>
          </View>
          <View style={styles.flatIcon}>
            <Text style={styles.flatText}>{t("Amount")}</Text>
          </View>
          <View style={styles.flatIconDur}>
            <Text style={styles.flatText}>{t("Duration")}</Text>
          </View>
        </View>
        <FlatList
          data={allPills}
          //keyExtractor={item => item.id.toString()}
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
            <Swipeable
              renderRightActions={() => (
                <TouchableOpacity
                  onPress={() => {
                    deletePill(item.id);
                  }}
                  activeOpacity={0.6}
                >
                  <View style={styles.deleteBox}>
                    <Animated.Text style={{ color: "black" }}>
                      <Icon name="md-trash" size={24} color="white" />
                    </Animated.Text>
                  </View>
                </TouchableOpacity>
              )}
            >
              <TouchableOpacity
                onPress={() => {
                  showModal(item.id);
                }}
              >
                <View
                  style={
                    item.desc == ""
                      ? styles.itemContainer
                      : styles.itemContainerDesc
                  }
                >
                  <View style={styles.flatIcon}>
                    <Text style={styles.itemDate}>{item.name}</Text>
                    <Text
                      style={[
                        item.desc == "" ? styles.invisible : styles.visible,
                        styles.desc,
                      ]}
                    >
                      {item.desc}
                    </Text>
                  </View>
                  <View style={styles.flatIcon}>
                    <Text style={styles.itemDate}>{item.howMany}</Text>
                  </View>

                  <View style={styles.flatIconDur}>
                    <Text style={styles.itemDate}>
                      {Moment(item.startDay).format("YY") ==
                      Moment(item.endDay).format("YY")
                        ? Moment(item.startDay).format("DD MMM - ") +
                          Moment(item.endDay).format("DD MMM YY")
                        : Moment(item.startDay).format("DD MMM YY - ") +
                          Moment(item.endDay).format("DD MMM YY")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.bottomContainer}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Icon
          style={styles.shadow}
          name="add-circle"
          size={64}
          color="#0E53A7"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textCurrent}>{t("Add new medication!")}</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginTop: 8,
              }}
            >
              <Text style={styles.dateText}>
                {t("Name")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Name...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeName(text)}
              />
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 2 }}
            >
              <Text style={styles.dateText}>
                {t("Description")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Description...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeDesc(text)}
              />
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 2 }}
            >
              <Text style={styles.dateText}>
                {t("Amount to take")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Amount...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeHowMany(text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginBottom: 8,
                marginTop: 6,
              }}
            >
              <Text style={styles.dateText}>
                {t("Start day")}:{"  "}
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => showPicker()}
              >
                <Text style={styles.dateIcon}>
                  {Moment(addData.startDay).format("D MMM YYYY")}{" "}
                  <Icon name="ios-calendar-sharp" size={24} color="#0E53A7" />
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={addData.startDay}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginBottom: 0,
              }}
            >
              <Text style={styles.dateText}>
                {t("End day")}:{"    "}
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => showPickerEnd()}
              >
                <Text style={styles.dateIcon}>
                  {Moment(addData.endDay).format("D MMM YYYY")}{" "}
                  <Icon name="ios-calendar-sharp" size={24} color="#0E53A7" />
                </Text>
              </TouchableOpacity>
            </View>

            {showEnd && (
              <DateTimePicker
                testID="dateTimePicker2"
                value={addData.endDay}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                minimumDate={addData.startDay}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 3,
              }}
            >
              <View
                style={{
                  flex: 0.8,
                }}
              >
                <Text style={styles.dateText}>{t("How often")}: </Text>
              </View>
              <Picker
                selectedValue={addData.howOften}
                style={{ flex: 1.1 }}
                onValueChange={(itemValue) =>
                  setAddData({
                    ...addData,
                    howOften: itemValue,
                  })
                }
              >
                <Picker.Item label={t("Every day")} value="1" />
                <Picker.Item
                  label={t("Every") + " " + 2 + " " + t("days")}
                  value="2"
                />
                <Picker.Item
                  label={t("Every") + " " + 3 + " " + t("days")}
                  value="3"
                />
                <Picker.Item
                  label={t("Every") + " " + 4 + " " + t("days")}
                  value="4"
                />
                <Picker.Item
                  label={t("Every") + " " + 5 + " " + t("days")}
                  value="5"
                />
                <Picker.Item
                  label={t("Every") + " " + 6 + " " + t("days")}
                  value="6"
                />
                <Picker.Item label={t("Once a week")} value="7" />
              </Picker>
            </View>

            <View style={styles.visible}>
              <Text style={styles.dateText}>
                {t("First time to take")}:{"  "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={parseInt(time.selectedHours)}
                  selectedMinutes={parseInt(time.selectedMinutes)}
                  onChange={(hours, minutes) => addTime(hours, minutes, 1)}
                />

                <TouchableOpacity
                  onPress={() => {
                    setSecond("flex");
                  }}
                >
                  <Icon name="add" size={32} color="#0E53A7" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={
                secondVisible == "flex" ? styles.visible : styles.invisible
              }
            >
              <Text style={styles.dateText}>
                {t("Second time to take")}:{"  "}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={parseInt(time.selectedHours2)}
                  selectedMinutes={parseInt(time.selectedMinutes2)}
                  onChange={(hours, minutes) => addTime(hours, minutes, 2)}
                />

                <TouchableOpacity
                  onPress={() => {
                    setThird("flex");
                  }}
                >
                  <Icon name="add" size={32} color="#0E53A7" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={thirdVisible == "flex" ? styles.visible : styles.invisible}
            >
              <Text style={styles.dateText}>
                {t("Third time to take")}:{"  "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={parseInt(time.selectedHours3)}
                  selectedMinutes={parseInt(time.selectedMinutes3)}
                  onChange={(hours, minutes) => addTime(hours, minutes, 3)}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={styles.leftWeight}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#0E53A7",
                    fontWeight: "bold",
                    padding: 8,
                  }}
                >
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rightWeight}
                onPress={() => {
                  addPill();
                  if (addData.name != "" && addData.howMany != "")
                    setModalVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "white",
                    padding: 8,
                  }}
                >
                  {t("Add")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalUpdateVisible}
        onRequestClose={() => {
          alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textCurrent}>
              {t("Update medication!")}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginTop: 8,
              }}
            >
              <Text style={styles.dateText}>
                {t("Name")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Name...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeName(text)}
                value={addData.name}
              />
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 2 }}
            >
              <Text style={styles.dateText}>
                {t("Description")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Description...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeDesc(text)}
                value={addData.desc}
              />
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", margin: 2 }}
            >
              <Text style={styles.dateText}>
                {t("Amount to take")}:{"  "}
              </Text>
              <TextInput
                style={styles.inputText}
                placeholder={t("Amount...")}
                placeholderTextColor="grey"
                onChangeText={(text) => changeHowMany(text)}
                value={addData.howMany}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginBottom: 8,
                marginTop: 6,
              }}
            >
              <Text style={styles.dateText}>
                {t("Start day")}:{"  "}
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => showPicker()}
              >
                <Text style={styles.dateIcon}>
                  {Moment(addData.startDay).format("D MMM YYYY")}{" "}
                  <Icon name="ios-calendar-sharp" size={24} color="#0E53A7" />
                </Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={addData.startDay}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChange}
                minimumDate={new Date()}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                margin: 2,
                marginBottom: 0,
              }}
            >
              <Text style={styles.dateText}>
                {t("End day")}:{"    "}
              </Text>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => showPickerEnd()}
              >
                <Text style={styles.dateIcon}>
                  {Moment(addData.endDay).format("D MMM YYYY")}{" "}
                  <Icon name="ios-calendar-sharp" size={24} color="#0E53A7" />
                </Text>
              </TouchableOpacity>
            </View>

            {showEnd && (
              <DateTimePicker
                testID="dateTimePicker2"
                value={addData.endDay}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={onChangeEnd}
                minimumDate={addData.startDay}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 3,
              }}
            >
              <View
                style={{
                  flex: 0.8,
                }}
              >
                <Text style={styles.dateText}>{t("How often")}: </Text>
              </View>
              <Picker
                selectedValue={addData.howOften}
                style={{ flex: 1.1 }}
                onValueChange={(itemValue) =>
                  setAddData({
                    ...addData,
                    howOften: itemValue,
                  })
                }
              >
                <Picker.Item label={t("Every day")} value="1" />
                <Picker.Item
                  label={t("Every") + " " + 2 + " " + t("days")}
                  value="2"
                />
                <Picker.Item
                  label={t("Every") + " " + 3 + " " + t("days")}
                  value="3"
                />
                <Picker.Item
                  label={t("Every") + " " + 4 + " " + t("days")}
                  value="4"
                />
                <Picker.Item
                  label={t("Every") + " " + 5 + " " + t("days")}
                  value="5"
                />
                <Picker.Item
                  label={t("Every") + " " + 6 + " " + t("days")}
                  value="6"
                />
                <Picker.Item label={t("Once a week")} value="7" />
              </Picker>
            </View>

            <View style={styles.visible}>
              <Text style={styles.dateText}>
                {t("First time to take")}:{"  "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={parseInt(time.selectedHours)}
                  selectedMinutes={parseInt(time.selectedMinutes)}
                  onChange={(hours, minutes) => addTime(hours, minutes, 1)}
                />

                <TouchableOpacity
                  onPress={() => {
                    setSecond("flex");
                  }}
                >
                  <Icon name="add" size={32} color="#0E53A7" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={
                secondVisible == "flex" ? styles.visible : styles.invisible
              }
            >
              <Text style={styles.dateText}>
                {t("Second time to take")}:{"  "}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={time.selectedHours2}
                  selectedMinutes={time.selectedMinutes2}
                  onChange={(hours, minutes) => addTime(hours, minutes, 2)}
                />

                <TouchableOpacity
                  onPress={() => {
                    setThird("flex");
                  }}
                >
                  <Icon name="add" size={32} color="#0E53A7" />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={thirdVisible == "flex" ? styles.visible : styles.invisible}
            >
              <Text style={styles.dateText}>
                {t("Third time to take")}:{"  "}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimePicker
                  selectedHours={time.selectedHours3}
                  selectedMinutes={time.selectedMinutes3}
                  onChange={(hours, minutes) => addTime(hours, minutes, 3)}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <TouchableOpacity
                style={styles.leftWeight}
                onPress={() => {
                  setModalUpdateVisible(!modalUpdateVisible);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#0E53A7",
                    fontWeight: "bold",
                    padding: 8,
                  }}
                >
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rightWeight}
                onPress={() => {
                  updatePill();
                  if (addData.name != "" && addData.howMany != "")
                    setModalUpdateVisible(false);
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "white",
                    padding: 8,
                  }}
                >
                  {t("Update")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Pills;
