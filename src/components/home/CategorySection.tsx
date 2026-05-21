import { ScrollView, Text, View, useWindowDimensions } from "react-native";
import { CategoryItem } from "./CategoryItem";

interface Category {
  id: number;
  title: string;
  icon: any;
  path: string;
}

interface CategorySectionProps {
  categories: Category[];
  onCategoryClick: (title: string) => void;
}

export function CategorySection({
  categories,
  onCategoryClick,
}: CategorySectionProps) {
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

  return (
    <View className="w-full flex flex-col gap-0 md:gap-6 justify-center">
      <Text className="text-xl md:text-2xl font-bold font-poppins text-primary-text">
        Categorias
      </Text>

      {isWide ? (
        <View
          className="w-full flex flex-row flex-wrap py-2 md:justify-center md:gap-6 mt-3 md:mt-6"
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              title={category.title}
              icon={category.icon}
              onClick={() => onCategoryClick(category.path)}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{
            flexDirection: "row",
            alignItems: "flex-start",
            paddingVertical: 8,
            paddingRight: 0,
          }}
        >
          {categories.map((category, index) => (
            <View
              key={category.id}
              style={{
                marginRight: index === categories.length - 1 ? 0 : 8,
              }}
            >
              <CategoryItem
                title={category.title}
                icon={category.icon}
                onClick={() => onCategoryClick(category.path)}
              />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
