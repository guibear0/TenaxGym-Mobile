import "react-native-gesture-handler";
import "react-native-reanimated";
import "./src/lib/crypto-setup";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//holassssss
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import TrainerDashboard from "./src/pages/TrainerDashboard";
import ClientDashboard from "./src/pages/ClientDashboard";
import Profile from "./src/pages/Profile";
import Exercises from "./src/pages/ExercisesScreen";
import Measures from "./src/pages/MeasuresScreen";
import "./global.css";

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userProfile");
      setIsLoggedIn(!!userProfile);
    } catch (err) {
      console.error("Error checking session:", err);
      setIsLoggedIn(false);
    }
  };

  if (isLoggedIn === null) {
    return null; // Splash screen mientras carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 200,
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 200,
              },
            },
          },
        }}
        initialRouteName={isLoggedIn ? "ClientDashboard" : "Home"}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Exercises" component={Exercises} />
        <Stack.Screen name="Measures" component={Measures} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
