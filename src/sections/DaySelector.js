import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function DaySelector({ day, onDayChange }) {
  const TOTAL_DAYS = 5;

  const handlePrevDay = () => {
    if (day > 1) {
      onDayChange(day - 1);
    }
  };

  const handleNextDay = () => {
    if (day < TOTAL_DAYS) {
      onDayChange(day + 1);
    }
  };

  return (
    <View
      style={{
        marginTop: 60,
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 40,
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {/* Botón flecha izquierda */}
      <TouchableOpacity
        onPress={handlePrevDay}
        disabled={day === 1}
        activeOpacity={0.7}
        style={{ padding: 10 }}
      >
        <Ionicons
          name="chevron-back-outline"
          size={32}
          color={day > 1 ? "#fff" : "#444"}
        />
      </TouchableOpacity>

      {/* Texto central con animación de fade */}
      <View style={{ minWidth: 80, alignItems: "center" }}>
        <Animated.View
          key={day}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 24,
              marginBottom: 15,
            }}
          >
            Día {day}
          </Text>
        </Animated.View>
      </View>

      {/* Botón flecha derecha */}
      <TouchableOpacity
        onPress={handleNextDay}
        disabled={day === TOTAL_DAYS}
        activeOpacity={0.7}
        style={{ padding: 10 }}
      >
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={day < TOTAL_DAYS ? "#fff" : "#444"}
        />
      </TouchableOpacity>
    </View>
  );
}
