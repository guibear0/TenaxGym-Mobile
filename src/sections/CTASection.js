import React from "react";
import { View, Text } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
export default function CTASection() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center px-6">
      <View className="items-center text-center">
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
          className="px-6 py-4"
        >
          <Text className="text-white text-lg font-semibold">
            Crea una Cuenta
          </Text>
        </Button>
      </View>
    </View>
  );
}
