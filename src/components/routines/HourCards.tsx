import { Pressable, Text, TouchableOpacity, View } from "react-native";

import type { Routine } from "../../../src/services/routines/routines.service";

import Trash from "../../../src/assets/routines/trashPurple.svg";

interface Props {
  routineData: Routine
  visibilityTrash: boolean
  onClick: (id: string) => void
  onDelete: (id: string) => void
}

function HourCard({
  routineData,
  visibilityTrash,
  onClick,
  onDelete
}: Props) {

  function formaterHour(hour: string) {
    const newHours = hour.split(":");

    return `${newHours[0]}:${newHours[1]}`;
  }

  function formaterTitle(title: string) {
    if (title === "banho") {
      return "Banho";
    }

    if (title === "stool") {
      return "Fraldas (Cocô)";
    }

    if (title === "urine") {
      return "Fraldas (Xixi)";
    }

    if (title === "Alimentação (Alimento sólido)") {
      return "Alimento sólido";
    }

    if (title === "Alimentação (Papinha ou purê)") {
      return "Papinha ou purê";
    }

    if (title === "Alimentação (Leite e derivados)") {
      return "Leite e derivados";
    }

    if (title === "medication") {
      return "Medicação";
    }

    if (title === "soneca") {
      return "Soneca";
    }

    return title;
  }

  return (
    <Pressable
      onPress={() =>
        onClick(
          `${routineData.log_type}${routineData.id}`
        )
      }
      className={`
            flex-row
            w-full
            bg-lilas
            rounded-xl
            px-4
            mt-4
            overflow-hidden
            ${routineData.asClicked
          ? "max-h-50"
          : "max-h-16"
        }
        `}
    >
      {/* Horário */}
      <View
        className="
        flex flex-row gap-4
                w-20
                pt-4
            "
      >
        <Text
          className="
                    text-2xl
                    font-semibold
                    text-primary
                "
        >
          {formaterHour(routineData.time)}
        </Text>

        <View
          className="
                    w-5
                    h-5
                    mt-1
                    rounded-full
                    bg-primary
                "
        />
      </View>

      {/* Conteúdo */}
      <View
        className="
                pt-4
                flex grow
                flex-col
                pl-10
                justify-start
            "
      >
        <Text
          className="
                    min-h-16
                    text-lg
                    font-semibold
                    text-primary-text
                    
                "
        >
          {formaterTitle(
            routineData.title
          )}
        </Text>

        {routineData.asClicked && (
          <>
            <Text
              className={`
                            mt-2
                            text-primary
                            ${!routineData.description
                  ? "italic"
                  : ""
                }
                        `}
            >
              {routineData.description &&
                routineData.description !== ""
                ? routineData.description
                : "Nenhuma descrição adicionada"}
            </Text>

            {visibilityTrash && (
              <TouchableOpacity
                onPress={() =>
                  onDelete(
                    `${routineData.log_type}/${routineData.id}`
                  )
                }
                className="
                                self-end
                                mt-1
                                mb-2
                            "
              >
                <Trash />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </Pressable>
  );
}

export default HourCard;
