import { useRouter, type Href } from "expo-router";
import React from "react";
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

import Date from "../../utils/Date";

interface Props {
  article: ArticleWithAge | Article;
  articleCarousel?: React.RefObject<View | null>;
  handleArticlePage: (e: GestureResponderEvent, id: number) => void;
}

function CardCarousel({ article, articleCarousel, handleArticlePage }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={(e) => handleArticlePage(e, article.id_article)}
      key={article.id_article}
      ref={articleCarousel as React.RefObject<any>}
      className="min-w-full h-[96%] rounded-xl shadow-purple-sm snap-center bg-lilas xl:pointer-events-none"
    >
      <View className="w-full h-full xl:relative">
        <View className="w-full h-[calc(100%-40px)] xl:flex xl:h-full xl:rounded-xl">
          <Image
            accessibilityElementsHidden={true}
            source={{ uri: article.media! }}
            accessibilityLabel=""
            className="w-full h-[70%] rounded-t-xl object-top object-cover md:h-[55%] md:object-center
            xl:w-1/2 xl:h-full xl:rounded-tr-none xl:rounded-bl-xl"
          />
          <View
            className="px-4 pt-2 space-y-1 font-poppins h-[30%] bg-lilas md:h-[45%]
            xl:w-1/2 xl:space-y-10 xl:h-full xl:rounded-tr-xl xl:rounded-br-xl xl:px-10 xl:pt-6"
          >
            <View
              className={`hidden xl:flex xl:font-semibold xl:justify-start xl:items-center xl:min-w-30 xl:w-auto xl:h-10 xl:font-nunito `}
            >
              <Text className="xl:px-4 bg-white xl:rounded-md xl:h-8 xl:flex xl:justify-center xl:items-center xl:text-primary-darker">
                {article.author}
              </Text>
            </View>
            <Text className="text-primary-text font-semibold md:text-xl xl:text-[1.5rem]">
              {article.title}
            </Text>
            <Text className="hidden md:block md:text-lg md:font-medium md:text-primary xl:text-black xl:text-[1.2rem]">
              {article.description}
            </Text>
          </View>
        </View>
        <View
          className="flex justify-between items-center px-4 w-full h-10 rounded-b-xl font-nunito text-[10px] bg-lilas
            xl:absolute xl:bottom-0 xl:right-0 xl:w-1/2 xl:h-12 xl:pb-4 xl:rounded-bl-none"
        >
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              if (article.source_link) Linking.openURL(article.source_link);
            }}
          >
            <Text className="text-primary/80 md:text-[12px] xl:hidden">
              Material original
            </Text>
          </TouchableOpacity>
          <View className="xl:hidden">
            <Text className="text-primary font-semibold md:text-[12px]">
              Autor(a):{" "}
            </Text>
            <Text className="text-primary md:text-[12px]">
              {article.author}
            </Text>
          </View>
          <View className="hidden xl:flex xl:justify-between xl:items-end pb-5 xl:w-full">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push(`/(app)/article/${article.id_article}` as Href)
              }
              className="xl:rounded-lg xl:pointer-events-auto xl:hover:bg-accent-darker xl:flex xl:justify-center xl:items-center xl:bg-accent xl:shadow-purple-md xl:text-white xl:text-[125%] xl:w-2/5 xl:h-12"
            >
              <Text>Ler o artigo completo</Text>
            </TouchableOpacity>
            <Text className="xl:flex xl:justify-center xl:items-center xl:min-w-19 xl:h-8 px-2 xl:bg-accent xl:rounded-lg xl:text-white xl:text-[120%]">
              {article.publication_date
                ? Date.formatedDate(article.publication_date)
                : "Sem data de publicação"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardCarousel;
