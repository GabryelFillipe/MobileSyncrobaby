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
    <View className="w-full flex flex-col gap-1 md:gap-6 justify-center">
      <Text className="text-xl md:text-2xl font-bold font-poppins text-primary-text">
        Categorias
      </Text>

      <View className="w-full flex flex-row justify-between items-start mt-1 md:mt-0">
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
