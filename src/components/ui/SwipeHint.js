import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

/**
 * Componente reutilizable para mostrar el hint de "Desliza para navegar"
 * @param {number} delay - Retraso en ms antes de mostrar el hint (default: 3000)
 * @param {string} text - Texto personalizado (default: "Desliza para navegar")
 * @param {object} containerStyle - Estilos adicionales para el contenedor
 * @param {object} textStyle - Estilos adicionales para el texto
 * @param {Array} dependencies - Array de dependencias para reiniciar el timer
 */
export default function SwipeHint({
  delay = 5000,
  text = "Desliza para navegar",
  containerStyle = {},
  textStyle = {},
  dependencies = [],
}) {
  const [showHint, setShowHint] = useState(false);
  const hintTimer = useRef(null);

  useEffect(() => {
    // Resetear el hint cuando cambien las dependencias
    setShowHint(false);

    // Limpiar timer anterior si existe
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
    }

    // Configurar nuevo timer
    hintTimer.current = setTimeout(() => {
      setShowHint(true);
    }, delay);

    // Cleanup
    return () => {
      if (hintTimer.current) {
        clearTimeout(hintTimer.current);
      }
    };
  }, dependencies);

  if (!showHint) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(800)}
      exiting={FadeOut.duration(400)}
      style={containerStyle}
    >
      <Text
        style={{
          color: "#9CA3AF",
          fontSize: 14,
          textAlign: "center",
          ...textStyle,
        }}
      >
        {text}
      </Text>
    </Animated.View>
  );
}
