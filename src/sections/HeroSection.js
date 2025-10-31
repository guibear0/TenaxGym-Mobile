import React from "react";
import { View, Text } from "react-native";
import { HeartHandshake } from "lucide-react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";

export default function HeroSection() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center">
        <View className="flex-row items-center justify-center mb-4">
          <HeartHandshake color="#60A5FA" size={28} />
          <Text className="text-2xl font-bold text-gray-100 ml-2">
            TENAX GYM
          </Text>
        </View>

        <Text className="text-5xl font-extrabold text-gray-100 text-center mb-6">
          Transforma tu{"\n"}
          <Text className="text-blue-400">Rutina de Ejercicio</Text>
        </Text>

        <Text className="text-xl text-gray-300 text-center mb-12 max-w-md">
          Registra ejercicios, monitorea tu peso y medidas, organiza tu rutina
          con nuestro calendario inteligente
        </Text>

        <View className="flex-row gap-4 justify-center">
          <Button
            onPress={() => navigation.navigate("Register")}
            variant="solid"
            className="px-6 py-4"
          >
            <Text className="text-white text-lg font-semibold">
              Comenzar Gratis
            </Text>
          </Button>
          <Button
            onPress={() => navigation.navigate("Login")}
            variant="outline"
            className="px-8 py-4"
          >
            <Text className="text-gray-100 text-lg font-semibold">
              Iniciar Sesión
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
