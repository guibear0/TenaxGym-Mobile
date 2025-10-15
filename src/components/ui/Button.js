import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
//hola
export default function Button({
  children,
  onPress,
  variant = "solid",
  className,
}) {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center";

  const variants = {
    solid: "bg-blue-600 text-white border border-gray-700/50",
    outline:
      "border-2 border-gray-600 text-gray-100 bg-gray-800/80 backdrop-blur-sm",
  };

  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {typeof children === "string" ? (
          <Text
            className={variant === "solid" ? "text-white" : "text-gray-100"}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
