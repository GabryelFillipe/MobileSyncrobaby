import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import type { Article } from "../../services/article/article.service.ts";

import Date from "../../utils/Date";

interface Props {
  article: Article;
  cardArticleDesktop: React.RefObject<View | null>;
}

function ArticleCard({ article, cardArticleDesktop }: Props) {
  return (
    <View
      ref={cardArticleDesktop}
      key={article.id_article}
      className="flex w-full min-h-22 md:min-h-24
        xl:min-w-50 xl:max-w-50 xl:h-full xl:overflow-hidden xl:rounded-sm xl:snap-center xl:hover:shadow-purple-sm xl:hover:scale-102 xl:transition xl:duration-300"
    >
      <View
        className="flex w-full h-full rounded-lg
        xl:flex-col xl:relative"
      >
        <View
          className="flex justify-center pt-4 w-1/3 h-full bg-primary rounded-l-lg
            md:w-[28%]
            xl:relative xl:w-full xl:h-1/2 xl:rounded-bl-none xl:rounded-tl-sm xl:rounded-tr-sm xl:pt-0"
        >
          <Text
            className={`flex justify-center items-center w-22 h-6 font-nunito text-primary-text bg-light font-bold rounded-md
            md:w-30 md:h-8
            xl:absolute xl:bg-accent xl:text-white xl:font-normal xl:rounded-sm xl:w-24 xl:h-6 xl:top-2 xl:right-2 ${article.publication_date ? "" : "text-[7px] md:text-[10px] xl:text-[8px]"}`}
          >
            {article.publication_date
              ? Date.formatedDate(article.publication_date!)
              : "Sem data de publicação"}
          </Text>
          <View className="hidden xl:block xl:w-full xl:h-full xl:rounded-t-sm">
            <Image
              source={{ uri: article.media! }}
              accessibilityLabel=""
              className="xl:w-full xl:h-full xl:rounded-t-sm xl:object-cover xl:object-top"
            />
          </View>
        </View>
        <ScrollView
          className="flex flex-col w-2/3 h-full bg-lilas py-2 rounded-r-lg
        md:w-[72%]
        xl:w-full xl:h-1/2 xl:justify-start xl:rounded-tr-none xl:rounded-b-sm xl:pb-7 xl:overflow-y-auto"
        >
          <Text
            className="w-full px-4 text-primary font-poppins font-semibold text-[12px]
            md:text-[16px]
            xl:text-[14px]"
          >
            {article.title}
          </Text>
          <Text
            className="w-full px-4 text-dark-purple-muted font-nunito font-normal text-[10px]
            md:text-[12px]"
          >
            {article.description}
          </Text>
          <Text
            className="w-full px-2 text-end text-primary-text font-poppins font-medium text-[8px] md:text-[10px]
            xl:absolute xl:flex xl:items-center xl:bg-lilas xl:justify-end xl:bottom-0 xl:h-6 xl:rounded-b-sm"
          >
            {article.author}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

export default ArticleCard;
