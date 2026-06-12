import { Image, Pressable, Text, View } from "react-native";

interface CategoryItemProps {
  title: string;
  icon: any;
  onClick: () => void;
}

export function CategoryItem({ title, icon, onClick }: CategoryItemProps) {
  const IsSvgComponent = typeof icon === "function";
  const SvgIcon = IsSvgComponent ? icon : null;

  return (
    <View className="flex-1 items-center justify-start px-0.5">
      <Pressable
        className="bg-primary flex items-center justify-center rounded-lg w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 cursor-pointer hover:opacity-90 transition-opacity"
        onPress={onClick}
      >
        {IsSvgComponent && SvgIcon ? (
          <SvgIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
        ) : (
          <Image
            source={typeof icon === "string" ? { uri: icon } : icon}
            alt={title}
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
          />
        )}
      </Pressable>
      <Text
        className="text-[9px] sm:text-[11px] md:text-sm font-bold font-nunito text-primary-text mt-1 text-center w-full"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
  );
}
