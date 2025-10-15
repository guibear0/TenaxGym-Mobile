import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function Card({ title, description, icon, onPress, className }) {
  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`bg-gray-800/80 border border-gray-700/50 rounded-2xl p-6 shadow-lg ${className}`}
      >
        <View className="items-center mb-4">{icon}</View>
        <Text className="text-xl font-bold text-gray-100 mb-2 text-center">
          {title}
        </Text>
        {description && (
          <Text className="text-gray-300 text-sm text-center">
            {description}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
