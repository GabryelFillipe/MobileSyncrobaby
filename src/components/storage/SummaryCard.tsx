import { Text, View } from "react-native";

export function SummaryCard({
  icon,
  count,
  label,
  color,
}: {
  icon: string;
  count: number;
  label: string;
  color: string;
}) {
  return (
    <View className="bg-lilas-bg/50 p-6 rounded-md flex-col items-center gap-2 border border-gray-100">
      <View
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${color}`}
      >
        <Text className="font-bold">{icon}</Text>
      </View>
      <Text className="text-2xl font-bold">{count} Itens</Text>
      <Text className="text-gray-500 text-sm">{label}</Text>
    </View>
  );
}
