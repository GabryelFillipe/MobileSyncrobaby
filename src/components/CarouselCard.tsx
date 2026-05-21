import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

interface CarouselCardProps {
  id: number;
  textPre: string;
  textHighlight: string;
  description?: string;
  img: any;
}

export function CarouselCard({
  textPre,
  textHighlight,
  description,
  img,
}: CarouselCardProps) {
  const router = useRouter();

  return (
    <View className="w-full flex-row items-center bg-lilas rounded-3xl py-4 px-5 h-40 md:h-55 relative overflow-hidden">
      <View className="flex-1 flex-col justify-center gap-1 pr-2 z-10 min-w-0">
        <Text className="hidden md:flex bg-lilas text-primary text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-1">
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
          <Text
            className="hidden md:block text-primary-text text-sm xl:text-base font-poppins mt-1 max-w-[95%]"
            numberOfLines={2}
          >
            {description}
          </Text>
        )}

        <Pressable
          onPress={() => router.push("/")}
          className="hidden md:flex bg-primary px-8 py-2.5 rounded-lg mt-2 shadow-md items-center w-max"
        >
          <Text className="text-white font-poppins font-bold text-sm">
            Ler o artigo Completo
          </Text>
        </Pressable>
      </View>

      <View className="w-[40%] md:w-[30%] h-full flex justify-center items-center z-10 shrink-0">
        <Image
          source={typeof img === "string" ? { uri: img } : img}
          resizeMode="contain"
          className="w-full h-30 md:h-45"
        />
      </View>
    </View>
  );
}
