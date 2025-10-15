import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { HeartHandshake } from "lucide-react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";

export default function HeroSection() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center px-6">
      <Animated.View
        entering={FadeInDown.duration(800)}
        className="text-center"
      >
        <View className="flex-row items-center justify-center mb-4">
          <HeartHandshake color="#60A5FA" size={28} />
          <Text className="text-2xl font-bold text-gray-100 ml-2">
            TENAX GYM
          </Text>
        </View>

        <Text className="text-5xl font-extrabold text-gray-100 text-center mb-6">
          Transforma tu{"\n"}
          <Text className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Rutina de Ejercicio
          </Text>
        </Text>

        <Text className="text-xl text-gray-300 text-center mb-12 max-w-md">
          Registra ejercicios, monitorea tu peso y medidas, organiza tu rutina
          con nuestro calendario inteligente
        </Text>

        <View className="flex-row gap-4 justify-center">
          <Button
            onPress={() => navigation.navigate("Register")}
            variant="solid"
            className="px-8 py-4 text-lg"
          >
            Comenzar Gratis
          </Button>
          <Button
            onPress={() => navigation.navigate("Login")}
            variant="outline"
            className="px-8 py-4 text-lg"
          >
            Iniciar Sesión
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}
