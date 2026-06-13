import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import DateFormatter from "../../utils/Date";

import type {
  Bmi,
  Head,
  Height,
  Weight,
} from "../../services/measures/measures.service";

interface Props {
  data: (Height | Head | Weight | Bmi)[];
  value_type: keyof Height | keyof Head | keyof Weight | keyof Bmi;
}

export default function Chart({ data, value_type }: Props) {
  const screenWidth = Dimensions.get("window").width;

  const chartData = useMemo(() => {
    return data.map((it: any) => ({
      value: Number(it[value_type]) || 0,
      label: DateFormatter.formatedDate(it.update_date.split("T")[0]),
    }));
  }, [data, value_type]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 10;
    const max = Math.max(...chartData.map((item) => item.value));
    return Math.ceil(max + max * 0.2);
  }, [chartData]);

  return (
    <View className="bg-lilas-bg py-4 px-2 rounded-xl shadow-purple-md items-center justify-center overflow-hidden">
      <BarChart
        data={chartData}
        width={screenWidth - 90}
        height={220}
        barWidth={40}
        spacing={24}
        roundedTop
        frontColor="#8c76bd"
        xAxisThickness={1}
        yAxisThickness={1}
        xAxisColor="#000000"
        yAxisColor="#000000"
        yAxisTextStyle={{
          color: "#41354c",
          fontSize: 12,
          fontFamily: "Poppins_400Regular",
        }}
        xAxisLabelTextStyle={{
          color: "#41354c",
          fontSize: 12,
          fontFamily: "Poppins_400Regular",
        }}
        yAxisLabelWidth={40}
        hideRules={false}
        rulesColor="#9d87d2"
        rulesType="dashed"
        isAnimated
        maxValue={maxValue}
        noOfSections={5}
        renderTooltip={(item: any) => {
          return (
            <View className="bg-purple-100 p-2 rounded-lg border border-purple-600 mb-2 shadow-sm">
              <Text className="text-primary-dark font-poppins font-bold text-xs text-center">
                {item.value}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}
