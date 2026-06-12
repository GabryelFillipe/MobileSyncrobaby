import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  GestureResponderEvent,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type {
  Article,
  ArticleWithAge,
} from "../../services/article/article.service.ts";

interface Props {
  article: ArticleWithAge | Article;
  articleCarousel?: React.RefObject<View | null>;
  handleArticlePage: (e: GestureResponderEvent, id: number) => void;
}

function CardCarousel({ article, articleCarousel, handleArticlePage }: Props) {
  const router = useRouter();

  const [imageFailed, setImageFailed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={(e) => handleArticlePage(e, article.id_article)}
      key={article.id_article}
      ref={articleCarousel as React.RefObject<any>}
      className="min-w-full h-70 rounded-xl shadow-purple-sm snap-center bg-lilas mb-2"
    >
      <View className="w-full h-full flex flex-col justify-between">
        <View className="w-full flex-1">
          <Image
            accessibilityElementsHidden={true}
            source={
              !imageFailed &&
              article.media &&
              typeof article.media === "string" &&
              article.media !== "null" &&
              article.media.trim() !== ""
                ? { uri: article.media }
                : require("../../assets/articles/defaultBaby.jpg")
            }
            onError={(e) => {
              setImageFailed(true);
            }}
            accessibilityLabel=""
            className="w-full h-[70%] rounded-t-xl object-top object-cover md:h-[65%] md:object-center"
          />

          <View className="flex-1 px-4 pt-3 font-poppins bg-lilas">
            <Text
              numberOfLines={2}
              className="text-primary-text font-semibold text-base md:text-xl"
            >
              {article.title}
            </Text>
            <Text
              numberOfLines={2}
              className="hidden md:block md:text-lg md:font-medium md:text-primary"
            >
              {article.description}
            </Text>
          </View>
        </View>

        <View className="flex flex-row justify-between items-center px-4 w-full h-12 rounded-b-xl font-nunito bg-lilas pb-2">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              if (article.source_link) Linking.openURL(article.source_link);
            }}
          >
            <Text className="text-primary-text font-bold text-[10px] md:text-[12px] underline">
              Material original
            </Text>
          </TouchableOpacity>

          <View className="flex flex-row items-center gap-1">
            <Text className="text-primary-darker font-semibold text-[10px] md:text-[12px]">
              Autor(a):
            </Text>
            <Text className="text-primary-dark text-[10px] font-bold md:text-[12px]">
              {article.author}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardCarousel;
