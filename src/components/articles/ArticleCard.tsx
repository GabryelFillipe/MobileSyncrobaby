import React from "react";
import { Image, Text, View } from "react-native";
import type { Article } from "../../services/article/article.service.ts";

import DateUtils from "../../utils/Date";

interface Props {
  article: Article;
}

function ArticleCard({ article }: Props) {
  return (
    <View className="flex flex-row w-full h-30 bg-lilas rounded-lg overflow-hidden shadow-purple-sm">
      <View className="w-[35%] md:w-[30%] h-full relative bg-primary/20">
        {article.media ? (
          <Image
            source={{ uri: article.media }}
            accessibilityLabel={`Imagem do artigo ${article.title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <View className="w-full h-full bg-primary" />
        )}

        <View className="absolute top-2 left-2 bg-light px-2 py-1 rounded-md">
          <Text className="font-nunito text-primary-text font-bold text-[9px] md:text-[11px]">
            {article.publication_date
              ? DateUtils.formatedDate(article.publication_date)
              : "Sem data"}
          </Text>
        </View>
      </View>

      <View className="flex-1 flex flex-col justify-between py-2 px-3">
        <View>
          <Text
            numberOfLines={2}
            className="text-primary font-poppins font-semibold text-[13px] md:text-[16px] leading-tight"
          >
            {article.title}
          </Text>
          <Text
            numberOfLines={2}
            className="text-dark-purple-muted font-nunito font-normal text-[11px] md:text-[13px] mt-1 leading-tight"
          >
            {article.description}
          </Text>
        </View>

        <Text
          numberOfLines={1}
          className="w-full text-right text-primary-text font-poppins font-medium text-[10px] md:text-[12px]"
        >
          {article.author}
        </Text>
      </View>
    </View>
  );
}

export default ArticleCard;
