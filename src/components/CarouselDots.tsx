import { View } from "react-native";

interface CarouselDotsProps {
  activeIndex: number;
  total: number;
}

export function CarouselDots({ activeIndex, total }: CarouselDotsProps) {
  const dots = Array.from({ length: total });

  return (
    <View
      className="flex-row justify-center items-center"
      accessibilityRole="progressbar"
    >
      {dots.map((_, index) => (
        <View
          key={index}
          className={`h-2 mx-0.5 rounded-full ${
            activeIndex === index ? "w-4 bg-primary" : "w-2 bg-lilas-medium"
          }`}
        />
      ))}
    </View>
  );
}
