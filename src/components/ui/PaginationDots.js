import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

/**
 * Componente individual de dot animado
 */
function AnimatedDot({
  isActive,
  activeColor,
  inactiveColor,
  activeWidth,
  inactiveWidth,
  height,
  spacing,
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(isActive ? activeWidth : inactiveWidth, {
      duration: 300,
    }),
    backgroundColor: withTiming(isActive ? activeColor : inactiveColor, {
      duration: 300,
    }),
  }));

  return (
    <Animated.View
      style={[
        styles.dotBase,
        {
          height,
          borderRadius: height / 2,
          marginHorizontal: spacing,
        },
        animatedStyle,
      ]}
    />
  );
}

/**
 * Componente de paginación con dots animados
 * @param {number} currentIndex - Índice actual (0-based)
 * @param {number} totalDots - Número total de dots
 * @param {string} activeColor - Color del dot activo (default: "#60A5FA")
 * @param {string} inactiveColor - Color de los dots inactivos (default: "rgba(167, 167, 167, 0.11)")
 * @param {number} activeWidth - Ancho del dot activo (default: 24)
 * @param {number} inactiveWidth - Ancho de los dots inactivos (default: 8)
 * @param {number} height - Altura de los dots (default: 8)
 * @param {number} spacing - Espacio entre dots (default: 4)
 * @param {object} containerStyle - Estilos adicionales para el contenedor
 */
export default function PaginationDots({
  currentIndex,
  totalDots,
  activeColor = "#60A5FA",
  inactiveColor = "rgba(167, 167, 167, 0.11)",
  activeWidth = 24,
  inactiveWidth = 8,
  height = 8,
  spacing = 4,
  containerStyle = {},
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length: totalDots }, (_, index) => (
        <AnimatedDot
          key={index}
          isActive={index === currentIndex}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          activeWidth={activeWidth}
          inactiveWidth={inactiveWidth}
          height={height}
          spacing={spacing}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dotBase: {
    // Estilos base del dot
  },
});
