import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

/**
 * Componente reutilizable para grupos colapsables
 * @param {string} title - Título del grupo
 * @param {Array} items - Array de items a mostrar
 * @param {Function} onDeleteItem - Callback cuando se elimina un item
 * @param {Function} renderItem - Función para renderizar cada item personalizado
 * @param {boolean} defaultOpen - Si el grupo inicia abierto
 */
export default function CollapsibleGroup({
  title,
  items = [],
  onDeleteItem,
  renderItem,
  defaultOpen = false,
  emptyMessage = "No hay datos",
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (items.length === 0) return null;

  return (
    <View style={{ marginBottom: 12 }}>
      {/* Header */}
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          backgroundColor: "rgba(31, 41, 55, 0.6)",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "rgba(107, 114, 128, 0.3)",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={{ color: "#9ca3af", fontSize: 12 }}>
            {items.length} {items.length === 1 ? "registro" : "registros"}
          </Text>
          {isOpen ? (
            <ChevronUp size={20} color="#fff" />
          ) : (
            <ChevronDown size={20} color="#fff" />
          )}
        </View>
      </TouchableOpacity>

      {/* Content */}
      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{ marginTop: 10 }}
        >
          {items.length === 0 ? (
            <View
              style={{
                backgroundColor: "rgba(31, 41, 55, 0.6)",
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#9ca3af" }}>{emptyMessage}</Text>
            </View>
          ) : (
            items.map((item, index) => {
              // Generar key único
              const uniqueKey = item.id
                ? typeof item.id === "string" || typeof item.id === "number"
                  ? item.id
                  : `${item.id}-${index}`
                : `item-${index}`;

              return (
                <View
                  key={uniqueKey}
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.6)",
                    padding: 12,
                    borderRadius: 12,
                    marginBottom: 10,
                    borderWidth: 1,
                    borderColor: "rgba(107, 114, 128, 0.3)",
                  }}
                >
                  {renderItem ? (
                    renderItem(item, () => onDeleteItem && onDeleteItem(item))
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "#d1d5db" }}>{item.label}</Text>
                      <TouchableOpacity
                        onPress={() => onDeleteItem && onDeleteItem(item)}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </Animated.View>
      )}
    </View>
  );
}
