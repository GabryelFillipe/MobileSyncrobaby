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
    <View className="min-w-full h-40 flex items-center  justify-between bg-lilas rounded-2xl p-6 md:p-8 xl:p-10 snap-center relative overflow-hidden md:min-h-55 xl:min-h-75">
      <View className="flex flex-col justify-center gap-2 md:gap-3 w-full md:w-[65%] z-10">
        <Text className="hidden md:flex bg-lilas text-primary text-[10px] md:text-xs font-bold px-3 py-1 rounded-full w-max mb-1">
          Destaque da Semana
        </Text>

        <Text className="text-lg md:text-2xl xl:text-3xl font-extrabold text-primary-text uppercase leading-tight font-poppins">
          {textPre} <Text className="text-primary">{textHighlight}</Text>
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

      <View className="w-[35%] md:w-[30%] flex justify-end items-center z-10">
        <Image
          source={typeof img === "string" ? { uri: img } : img}
          alt="Ilustração do artigo"
          className="w-full max-w-30 md:max-w-45 xl:max-w-55 object-contain"
        />
      </View>
    </View>
  );
}
