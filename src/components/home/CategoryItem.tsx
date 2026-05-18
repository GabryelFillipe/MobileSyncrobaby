import { Image, Pressable, Text, View } from "react-native";

interface CategoryItemProps {
  title: string;
  icon: any;
  onClick: () => void;
}

const ITEM_MIN_WIDTH = 72;

export function CategoryItem({ title, icon, onClick }: CategoryItemProps) {
  const IsSvgComponent = typeof icon === "function";
  const SvgIcon = IsSvgComponent ? icon : null;

  return (
    <View
      className="items-center justify-start"
      style={{ minWidth: ITEM_MIN_WIDTH, maxWidth: 88 }}
    >
      <Pressable
        className="bg-primary flex items-center justify-center rounded-sm w-10 h-10 md:w-14 md:h-14 cursor-pointer hover:opacity-90 transition-opacity"
        onPress={onClick}
      >
        {IsSvgComponent && SvgIcon ? (
          <SvgIcon className="w-6 h-6 md:w-8 md:h-8" />
        ) : (
          <Image
            source={typeof icon === "string" ? { uri: icon } : icon}
            alt={title}
            className="w-6 h-6 md:w-8 md:h-8"
          />
        )}
      </Pressable>
      <Text
        className="text-[10px] md:text-sm font-bold font-nunito text-primary-text mt-1 text-center w-full px-0.5"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </View>
  );
}
