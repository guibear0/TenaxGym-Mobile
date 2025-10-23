import React, { useRef } from "react";
import { View, Text, TouchableOpacity, PanResponder } from "react-native";

export default function DaySelector({ day, onDayChange }) {
  const TOTAL_DAYS = 5;

  // Swipe izquierda/derecha para cambiar el día
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50 && day < TOTAL_DAYS) onDayChange(day + 1);
        else if (gesture.dx > 50 && day > 1) onDayChange(day - 1);
      },
    })
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      style={{
        marginTop: 60,
        alignItems: "center",
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 40,
      }}
    >
      <TouchableOpacity
        onPress={() => day > 1 && onDayChange(day - 1)}
        disabled={day === 1}
        style={{ opacity: day === 1 ? 0.3 : 1 }}
      >
        <Text style={{ color: "#fff", fontSize: 26 }}>◀</Text>
      </TouchableOpacity>

      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>
        Día {day}
      </Text>

      <TouchableOpacity
        onPress={() => day < TOTAL_DAYS && onDayChange(day + 1)}
        disabled={day === TOTAL_DAYS}
        style={{ opacity: day === TOTAL_DAYS ? 0.3 : 1 }}
      >
        <Text style={{ color: "#fff", fontSize: 26 }}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}
