import React, { useRef, useState, useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  withRepeat,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function DaySelector({ day, onDayChange }) {
  const TOTAL_DAYS = 5;
  const touchStartX = useRef(0);

  // Animaciones separadas para controlar movimiento
  const hintOpacity = useSharedValue(1);
  const hintOffset = useSharedValue(0);

  useEffect(() => {
    // Solo animar si no estamos en los extremos
    if (day > 1 && day < TOTAL_DAYS) {
      hintOpacity.value = withRepeat(
        withTiming(0.2, { duration: 1000 }),
        -1,
        true
      );
      hintOffset.value = withRepeat(
        withTiming(5, { duration: 1000 }),
        -1,
        true
      );
    } else {
      // Detener movimiento cuando estamos en los extremos
      cancelAnimation(hintOffset);
      hintOpacity.value = withTiming(1, { duration: 300 });
      hintOffset.value = withTiming(0, { duration: 300 });
    }
  }, [day]);

  const leftHintStyle = useAnimatedStyle(() => ({
    opacity: day > 1 ? hintOpacity.value : 0.2,
    transform: [{ translateX: day > 1 ? -hintOffset.value : 0 }],
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    opacity: day < TOTAL_DAYS ? hintOpacity.value : 0.2,
    transform: [{ translateX: day < TOTAL_DAYS ? hintOffset.value : 0 }],
  }));

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
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      {/* Flecha izquierda */}
      <Animated.View style={[{ marginRight: 10 }, leftHintStyle]}>
        <Ionicons
          name="chevron-back-outline"
          size={32}
          color={day > 1 ? "#fff" : "#666"}
        />
      </Animated.View>

      {/* Texto central con animación de fade */}
      <Animated.View
        key={day}
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(250)}
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

      {/* Flecha derecha */}
      <Animated.View style={[{ marginLeft: 10 }, rightHintStyle]}>
        <Ionicons
          name="chevron-forward-outline"
          size={32}
          color={day < TOTAL_DAYS ? "#fff" : "#666"}
        />
      </Animated.View>
    </View>
  );
}
