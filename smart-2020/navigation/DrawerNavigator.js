import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import WeightHome from "../screens/WeightHome";
import WeightHistory from "../screens/WeightHistory";
import Pills from "../screens/Pills";
import PillsPlanner from "../screens/PillsPlanner";
import MapHospitals from "../screens/MapHospitals";
import MapPharmacies from "../screens/MapPharmacies";
import Logout from "../screens/Logout";
import Icons from "react-native-vector-icons/FontAwesome5";
import { useTranslation } from "react-i18next";
import "../locales/i18n";

const Drawer = createDrawerNavigator();

function DrawerNavigator(navigation) {
  const { t, i18n } = useTranslation();

  return (
    <Drawer.Navigator
      initialRouteName="Weight Planner"
      drawerContentOptions={{
        activeBackgroundColor: "#0E53A7",
        activeTintColor: "#E0E1DD",
        marginTop: 48,
      }}
    >
      <Drawer.Screen
        name= {t("Weight Planner")}
        component={WeightHome}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },

          drawerIcon: ({ focused }) => (
            <Icons
              name="weight"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />

      <Drawer.Screen
        name= {t("Weight History")}
        component={WeightHistory}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },
          drawerIcon: ({ focused }) => (
            <Icons
              name="history"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("Medication Planner")}
        component={PillsPlanner}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },
          drawerIcon: ({ focused }) => (
            <Icons
              name="calendar-check"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={27}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("My Medications")}
        component={Pills}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },
          drawerIcon: ({ focused }) => (
            <Icons
              name="pills"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("Nearby Pharmacies")}
        component={MapPharmacies}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },
          drawerIcon: ({ focused }) => (
            <Icons
              name="store"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("Nearby Hospitals")}
        component={MapHospitals}
        initialParams={{ params: navigation.route.params }}
        options={{
          headerShown: true,
          headerTintColor: "white",
          headerStyle: { backgroundColor: "#0E53A7" },
          drawerIcon: ({ focused }) => (
            <Icons
              name="hospital-alt"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />

      <Drawer.Screen
        name={t("Logout")}
        component={Logout}
        initialParams={{ params: navigation.route.params }}
        options={{
          drawerIcon: ({ focused }) => (
            <Icons
              name="sign-out-alt"
              color={focused ? "#E0E1DD" : "#ccc"}
              size={23}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
