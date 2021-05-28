import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

function MapPharmacies(props) {
  const { navigation } = props;
  const isFocused = useIsFocused();

  const [latitude, setLat] = useState(null);
  const [longitude, setLong] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    getLocation();
  }, [isFocused]);

  const getLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let local = await Location.getCurrentPositionAsync({});
    setLat(local.coords.latitude);
    setLong(local.coords.longitude);
    findNearby(local);
  };
  const findNearby = (loc) => {
    const url =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        loc.coords.latitude +
        "," +
        loc.coords.longitude +
        "&radius=3000&type=pharmacy&key=xxx";

    // const url =
    //   "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=pharmacy&inputtype=textquery&fields=geometry,formatted_address,name,opening_hours,rating&locationbias=circle:5000@" +
    //   loc.coords.latitude +
    //   "," +
    //   loc.coords.longitude +
    //   "&key=xxx";

    fetch(url)
      .then((response) => response.json())
      .then((JsonResponse) => {
        console.log(JsonResponse);
        let toMakrkers = JsonResponse.results;
        //let toMakrkers = JsonResponse.candidates;
        let newMarkers = [];
        toMakrkers.map((element, index) => {
          const obj = {};
          obj.id = index;
          obj.name = element.name;
          obj.desc = element.vicinity;
         // obj.desc = element.formatted_address;
          obj.marker = {
            latitude: element.geometry.location.lat,
            longitude: element.geometry.location.lng,
          };

          newMarkers.push(obj);
        });

        console.log(newMarkers);
        setMarkers(newMarkers);
        console.log(markers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsCompass={false}
        loadingEnabled={true}
        showsUserLocation={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.marker}
            title={marker.name}
            description={marker.desc}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default MapPharmacies;
