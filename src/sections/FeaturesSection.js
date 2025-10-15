import React from "react";
import { View, Text } from "react-native";
import { Dumbbell, Calendar, BarChart } from "lucide-react-native";
import Card from "../components/ui/Card";
//
const features = [
  {
    icon: Dumbbell,
    title: "Biblioteca de Ejercicios",
    description:
      "Accede a cientos de ejercicios detallados para cada grupo muscular.",
  },
  {
    icon: BarChart,
    title: "Seguimiento de Progreso",
    description: "Registra tu peso, medidas y fotos para ver tu evolución.",
  },
  {
    icon: Calendar,
    title: "Calendario de Entrenamientos",
    description:
      "Organiza tus rutinas y sesiones semanales de manera eficiente.",
  },
];

export default function FeaturesSection() {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-4xl font-bold text-gray-100 text-center mb-6 mt-20">
        Herramientas para{" "}
        <Text className="text-blue-400">alcanzar tus metas</Text>
      </Text>
      <Text className="text-lg text-gray-300 text-center mb-8 max-w-md">
        Todo lo que necesitas para gestionar tu entrenamiento y progreso con tu
        entrenador.
      </Text>

      <View className="flex-col justify-center items-center gap-4 w-full">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <Card
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={<Icon color="#60A5FA" size={28} />}
              className="w-full p-4"
              style={{ minHeight: 140 }}
            />
          );
        })}
      </View>
    </View>
  );
}
