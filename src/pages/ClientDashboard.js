import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Dumbbell, User, Ruler, Zap } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const sections = [
  {
    id: "profile",
    name: "Perfil",
    icon: User,
    color: "#3b82f6",
    bgColor: "bg-blue-900/40",
  },
  {
    id: "exercises",
    name: "Ejercicios",
    icon: Dumbbell,
    color: "#ef4444",
    bgColor: "bg-red-900/40",
  },
  {
    id: "measures",
    name: "Medidas Corporales",
    icon: Ruler,
    color: "#10b981",
    bgColor: "bg-green-900/40",
  },
  {
    id: "tests",
    name: "Tests",
    icon: Zap,
    color: "#f59e0b",
    bgColor: "bg-amber-900/40",
  },
];

export default function ClientDashboard({ navigation }) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [userName, setUserName] = useState("Cliente");
  const startX = useRef(0);

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const userProfile = await AsyncStorage.getItem("userProfile");
      if (userProfile) {
        const user = JSON.parse(userProfile);
        setUserName(user.name);
      }
    } catch (err) {
      console.error("Error cargando usuario:", err);
    }
  };

  const currentSection = sections[activeIndex];
  const Icon = currentSection.icon;

  const handleSwipe = (e) => {
    const endX = e.nativeEvent.pageX;
    const distance = startX.current - endX;
    const threshold = 50;

    if (distance > threshold && activeIndex < sections.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else if (distance < -threshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleCardPress = () => {
    switch (currentSection.id) {
      case "profile":
        navigation.navigate("Profile");
        break;
      case "exercises":
        // navigation.navigate("Exercises");
        break;
      case "measures":
        // navigation.navigate("Measures");
        break;
      case "tests":
        // navigation.navigate("Tests");
        break;
      default:
        break;
    }
  };

  return (
    <LinearGradient
      colors={["#1a1a1a", "#1e40af", "#4f46e5"]}
      className="flex-1"
    >
      <View
        className="flex-1 p-10"
        onTouchStart={(e) => {
          startX.current = e.nativeEvent.pageX;
        }}
        onTouchEnd={handleSwipe}
      >
        {/* HEADER CENTRADO ARRIBA */}
        <Animated.View
          entering={FadeInUp.duration(400)}
          className="mb-2 mt-28"
          style={{ alignItems: "center" }}
        >
          <Text className="text-5xl font-extrabold text-white text-center tracking-tight">
            ¡Buenas {userName}!
          </Text>
          <Text className="text-xl text-gray-200 mt-1 text-center">
            ¡Vamos a movernos!
          </Text>
        </Animated.View>

        {/* CARD CARRUSEL */}
        <Animated.View
          key={activeIndex}
          entering={FadeInUp.duration(300)}
          className="items-center flex-1 justify-center"
        >
          <TouchableOpacity
            onPress={handleCardPress}
            activeOpacity={0.8}
            className="w-full h-80"
          >
            <View
              className={`w-full h-full rounded-3xl border-2 border-gray-600/50 p-8 justify-center items-center ${currentSection.bgColor}`}
              style={{ backdropFilter: "blur(8px)" }}
            >
              <Icon size={80} color={currentSection.color} />
              <Text className="text-4xl font-bold text-gray-100 mt-6 text-center">
                {currentSection.name}
              </Text>
              <Text className="text-gray-300 text-center mt-6 text-base leading-6">
                {currentSection.id === "profile" &&
                  "Aquí puedes ver y actualizar tu información personal"}
                {currentSection.id === "exercises" &&
                  "Carga, organiza y sigue tus ejercicios diarios"}
                {currentSection.id === "measures" &&
                  "Registra tus medidas y visualiza tu progreso"}
                {currentSection.id === "tests" &&
                  "Realiza tests de fuerza y movilidad"}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* INDICADORES */}
        <View className="flex-row justify-center gap-2">
          {sections.map((_, index) => (
            <View
              key={index}
              className={`rounded-full ${
                index === activeIndex
                  ? "bg-blue-400 w-8 h-3"
                  : "bg-gray-600 w-3 h-3"
              }`}
            />
          ))}
        </View>

        {/* TEXTO DE SWIPE */}
        <Text className="text-center text-gray-400 text-sm mt-3">
          Desliza para navegar
        </Text>
      </View>
    </LinearGradient>
  );
}
