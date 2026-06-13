import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { RoutineData } from "../../../app/(app)/routine/routines";

import Trash from "../../../src/assets/routines/trashPurple.svg";

interface Props {
  routineData: RoutineData;
  visibilityTrash: boolean;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

function HourCard({ routineData, visibilityTrash, onClick, onDelete }: Props) {
  function formaterHour(hour: string) {
    if (!hour) return "";
    const newHours: string[] = hour.split(":");
    return `${newHours[0]}:${newHours[1]}`;
  }

  function formaterTitle(title: string) {
    if (!title) return "";
    if (title === "banho") {
      return "Banho";
    } else if (title === "stool") {
      return "Fraldas (Cocô)";
    } else if (title === "urine") {
      return "Fraldas (Xixi)";
    } else if (title === "Alimentação (Alimento sólido)") {
      return "Alimento sólido";
    } else if (title === "Alimentação (Papinha ou purê)") {
      return "Papinha ou purê";
    } else if (title === "Alimentação (Leite e derivados)") {
      return "Leite e derivados";
    } else if (title === "medication") {
      return "Medicação";
    } else if (title === "soneca") {
      return "Soneca";
    }
    return title;
  }

  const uniqueId = `${routineData.log_type}/${routineData.id}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onClick(uniqueId)}
      style={[
        styles.container,
        routineData.asClicked
          ? styles.containerExpanded
          : styles.containerCollapsed,
      ]}
    >
      <View style={styles.leftContainer}>
        <Text style={styles.hour}>{formaterHour(routineData.time)}</Text>

        <View style={styles.iconCircle}>
          {routineData.imageDesk && (
            <routineData.imageDesk width={20} height={20} />
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {formaterTitle(routineData.title)}
        </Text>

        <Text
          style={[
            styles.description,
            !routineData.description && styles.italic,
          ]}
        >
          {routineData.description && routineData.description.trim() !== ""
            ? `${routineData.description}`
            : "Nenhuma descrição adicionada"}
        </Text>

        {visibilityTrash && routineData.asClicked && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onDelete(uniqueId);
            }}
            style={styles.trashButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash width={24} height={24} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default HourCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#E2D3F5",
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  containerExpanded: {
    minHeight: 120,
    paddingVertical: 16,
  },
  containerCollapsed: {
    minHeight: 80,
    paddingVertical: 12,
  },
  leftContainer: {
    width: 80,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  hour: {
    fontSize: 22,
    fontWeight: "700",
    color: "#55297B",
    marginBottom: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: "#55297B",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 8,
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D1247",
    marginBottom: 6,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#55297B",
    paddingRight: 30,
    lineHeight: 20,
  },
  italic: {
    fontStyle: "italic",
    opacity: 0.7,
  },
  trashButton: {
    position: "absolute",
    right: 0,
    bottom: -6,
    padding: 8,
  },
});
