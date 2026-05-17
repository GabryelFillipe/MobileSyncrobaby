import { Text, View } from "react-native";
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
  return (
    <View className="w-full flex flex-col gap-2 md:gap-6 justify-center">
      <Text className="text-xl md:text-2xl font-bold font-poppins text-primary-text">
        Categorias
      </Text>

      <View
        className="w-full flex justify-between flex-row py-2 md:justify-center md:gap-8 mt-3 md:mt-6"
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          flexWrap: "wrap",
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
    </View>
  );
}
