import React, { useState } from "react";
import { ScrollView, View, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import CTASection from "../sections/CTASection";
import PaginationDots from "../components/ui/PaginationDots";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  // 🔵 Animación de dots con Reanimated
  const dotStyles = [
    useAnimatedStyle(() => ({
      width: withTiming(currentIndex === 0 ? 18 : 8),
      backgroundColor:
        currentIndex === 0 ? "#2a7afaff" : "rgba(167, 167, 167, 0.11)",
    })),
    useAnimatedStyle(() => ({
      width: withTiming(currentIndex === 1 ? 18 : 8),
      backgroundColor:
        currentIndex === 1 ? "#3b82f6" : "rgba(167, 167, 167, 0.11)",
    })),
    useAnimatedStyle(() => ({
      width: withTiming(currentIndex === 2 ? 18 : 8),
      backgroundColor:
        currentIndex === 2 ? "#2879fdff" : "rgba(167, 167, 167, 0.11)",
    })),
  ];

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      style={styles.background}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={{ width, height }}>
          <HeroSection />
        </View>

        <View style={{ width, height }}>
          <FeaturesSection />
        </View>

        <View style={{ width, height }}>
          <CTASection />
        </View>
      </ScrollView>

      {/* 🔵 Paginación con animación */}
      <View style={styles.pagination}>
        <PaginationDots
          currentIndex={currentIndex}
          totalDots={3}
          containerStyle={{ position: "absolute", bottom: 50, width: "100%" }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  pagination: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  dotBase: {
    height: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    bottom: 20,
  },
});
