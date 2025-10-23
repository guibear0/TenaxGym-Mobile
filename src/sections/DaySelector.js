import React, { useRef, useState, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function DaySelector({ day, onDayChange }) {
  const TOTAL_DAYS = 5;

  const touchStartX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.nativeEvent.pageX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.nativeEvent.pageX;
    const distance = touchStartX.current - touchEndX;
    const threshold = 50;

    if (distance > threshold && day < TOTAL_DAYS) {
      onDayChange(day + 1);
    } else if (distance < -threshold && day > 1) {
      onDayChange(day - 1);
    }
  };

  return (
    <View
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        marginTop: 60,
        alignItems: "center",
        marginBottom: 20,
        paddingHorizontal: 40,
      }}
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
    </View>
  );
}
