import React from "react";
import { TouchableOpacity, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({
  children,
  onPress,
  variant = "solid",
  className,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-center";

  const variants = {
    solid: "bg-blue-600 text-white border border-gray-700/50",
    outline:
      "border-2 border-gray-600 text-gray-100 bg-gray-800/80 backdrop-blur-sm",
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      style={animatedStyle}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {typeof children === "string" ? (
        <Text className={variant === "solid" ? "text-white" : "text-gray-100"}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedTouchable>
  );
}
