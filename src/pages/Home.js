// screens/Home.js
import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { LinearGradient } from "expo-linear-gradient";

import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import CTASection from "../sections/CTASection";

const { width, height } = Dimensions.get("window");

export default function Home() {
  return (
    <LinearGradient
      colors={["#0F172A", "#1E3A8A", "#312E81"]} // from-gray-900 via-blue-900 to-indigo-900
      style={styles.gradient}
    >
      <PagerView style={styles.pager} initialPage={0}>
        <View key="1" style={styles.page}>
          <HeroSection />
        </View>
        <View key="2" style={styles.page}>
          <FeaturesSection />
        </View>
        <View key="3" style={styles.page}>
          <CTASection />
        </View>
      </PagerView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  page: {
    width,
    height,
  },
});
