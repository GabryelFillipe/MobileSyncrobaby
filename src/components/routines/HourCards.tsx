import { useState } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { RoutineData } from '../../../app/(app)/routine/routines';

import Trash from "../../../src/assets/routines/trashPurple.svg";

interface Props {
  routineData: RoutineData
  visibilityTrash: boolean
  onClick: (id: number) => void
  onDelete: (id: number) => void
}

function HourCard({
  routineData,
  visibilityTrash,
  onClick,
  onDelete
}: Props) {

  const [hoverVisibilityTrash, setHoverVisibilityTrash] =
    useState<number>(0);

  return (

    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onClick(routineData.id)}
      onPressIn={() => setHoverVisibilityTrash(routineData.id)}
      onPressOut={() => setHoverVisibilityTrash(0)}
      style={[
        styles.container,
        routineData.asClicked
          ? styles.containerExpanded
          : styles.containerCollapsed
      ]}
    >

      <View style={styles.leftContainer}>

        <Text style={styles.hour}>
          {routineData.hours}
        </Text>

        <View style={styles.iconCircle}>

          {routineData.imageDesk && (

            <routineData.imageDesk
              width={20}
              height={20}
            />

          )}

        </View>

      </View>

      <View style={styles.contentContainer}>

        <Text style={styles.title}>
          {routineData.title}
        </Text>

        <Text
          style={[
            styles.description,
            routineData.description == null &&
            styles.italic
          ]}
        >

          {routineData.description != null
            ? `${routineData.description}`
            : "Nenhuma descrição adicionada"}

        </Text>

        {visibilityTrash &&
          hoverVisibilityTrash == routineData.id && (

            <TouchableOpacity
              onPress={() => onDelete(routineData.id)}
              style={styles.trashButton}
            >

              <Trash
                width={20}
                height={20}
              />

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
    backgroundColor: "#D9B8FF",
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: "hidden",
    marginBottom: 16,
  },

  containerExpanded: {
    minHeight: 140,
    paddingVertical: 16,
  },

  containerCollapsed: {
    minHeight: 64,
    paddingVertical: 10,
  },

  leftContainer: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },

  hour: {
    fontSize: 24,
    fontWeight: "700",
    color: "#55297B",
    marginBottom: 10,
  },

  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 999,
    backgroundColor: "#55297B",
    alignItems: "center",
    justifyContent: "center",
  },

  contentContainer: {
    flex: 1,
    paddingLeft: 18,
    paddingBottom: 8,
    justifyContent: "center",
    position: "relative",
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2D1247",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#55297B",
    paddingRight: 28,
    lineHeight: 20,
  },

  italic: {
    fontStyle: "italic",
  },

  trashButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },

});