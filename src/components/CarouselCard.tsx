import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";

interface CarouselCardProps {
  id: number;
  textPre: string;
  textHighlight: string;
  description?: string;
  img: string;
}

export function CarouselCard({
  textPre,
  textHighlight,
  description,
  img,
}: CarouselCardProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="w-full flex-row items-center bg-lilas rounded-3xl py-4 px-5 md:p-8 min-h-45 md:min-h-55 relative overflow-hidden md:snap-center">
      <View className="flex-1 flex-col justify-center gap-1 md:gap-3 pr-2 md:pr-4 z-10 min-w-0">
        <Text className="hidden md:flex bg-lilas text-primary text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-1">
          Destaque da Semana
        </Text>

        <Text
          className="text-xl md:text-2xl xl:text-3xl font-extrabold text-primary-text uppercase leading-tight font-poppins"
          numberOfLines={3}
        >
          {textPre}
          <Text className="text-primary">{textHighlight}</Text>
        </Text>

        {description && (
          <Text className="hidden md:block text-primary-text text-sm xl:text-base font-poppins mt-1 max-w-[95%] line-clamp-3">
            {description}
          </Text>
        )}

        <Pressable
          onPress={() => navigation.navigate("Articles")}
          className="hidden md:flex w-max bg-primary text-white font-poppins font-bold text-sm px-8 py-2.5 rounded-lg mt-2 hover:bg-primary/90 transition-colors shadow-md"
        >
          <Text className="text-white font-poppins font-bold text-sm">
            Ler o artigo Completo
          </Text>
        </Pressable>
      </View>

      <View className="w-[40%] max-w-38 md:w-[30%] md:max-w-none flex justify-center items-center z-10 shrink-0 self-stretch">
        <Image
          source={typeof img === "string" ? { uri: img } : img}
          alt="Ilustração do artigo"
          resizeMode="contain"
          className="w-full h-full max-h-35 md:max-h-50"
          style={{ width: "100%", minHeight: 120 }}
        />
      </View>
    </View>
  );
}
