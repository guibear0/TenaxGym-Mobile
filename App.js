import "react-native-gesture-handler";
import "react-native-reanimated";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import TrainerDashboard from "./src/pages/TrainerDashboard";
import ClientDashboard from "./src/pages/ClientDashboard";

import "./global.css";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // 🔥 Esto elimina la pantalla blanca entre transiciones
          cardStyle: { backgroundColor: "transparent" },
          // 🔥 Animación más rápida y suave
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress,
            },
          }),
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 200, // Transición más rápida
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
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
        <Stack.Screen name="ClientDashboard" component={ClientDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
