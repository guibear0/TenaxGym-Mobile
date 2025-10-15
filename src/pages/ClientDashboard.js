import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ClientDashboard() {
  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      className="flex-1 justify-center items-center"
    >
      <Text className="text-4xl font-bold text-gray-100">
        Esto es Client Dashboard
      </Text>
    </LinearGradient>
  );
}
