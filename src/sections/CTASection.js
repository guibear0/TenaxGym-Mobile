import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Feather from "react-native-vector-icons/Feather";
import Button from "../components/ui/Button";

export default function CTASection({ isVisible, navigation }) {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Animated.View
        entering={isVisible ? FadeInUp.duration(800) : undefined}
        className="items-center text-center"
      >
        {/* Icono decorativo */}
        <Feather name="zap" size={48} color="#60A5FA" className="mb-6" />

        <Text className="text-3xl font-bold text-gray-100 mb-4 text-center">
          ¡Es hora de transformar tu rutina!
        </Text>
        <Text className="text-lg text-gray-300 mb-8 max-w-md text-center">
          Regístrate y empieza a mejorar tu progreso con TENAX GYM. Sigue tus
          entrenamientos, metas y resultados de manera fácil e intuitiva.
        </Text>

        <Button
          onPress={() => navigation.navigate("Register")}
          variant="solid"
          className="flex-row items-center gap-2 px-8 py-4 text-lg"
        >
          <Text className="text-white">Empezar</Text>
          <Feather name="arrow-right" size={20} color="white" />
        </Button>
      </Animated.View>
    </View>
  );
}
