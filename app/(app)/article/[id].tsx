import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";

import SetBack from "../../../src/assets/navigation/setBack.svg";

import type { Article } from "../../../src/services/article/article.service";
import { useGetSingleArticle } from "../../../src/services/hook/article/useGetSingleArticle";

function ArticleContent() {
  const router = useRouter();

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: onGetArticle } = useGetSingleArticle(Number(id));

  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if (!onGetArticle) {
      return;
    }

    if (onGetArticle) {
      setArticle(onGetArticle.article[0]);
    }
  }, [onGetArticle]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-light"
    >
      <View className="flex flex-col gap-5">
        <View className="hidden xl:flex xl:justify-start xl:w-full">
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <SetBack className="xl:w-auto xl:h-9" />
          </TouchableOpacity>
        </View>
        <View
          className="flex flex-col h-auto gap-6
                xl:flex-row-reverse"
        >
          <View
            className="flex flex-col 
                    xl:w-1/3 xl:gap-5"
          >
            <Text
              className="w-full text-primary-text font-poppins font-semibold text-center text-2xl
                        xl:text-xl xl:text-start"
            >
              {article?.title}
            </Text>
            <Text className="hidden xl:block xl:font-nunito xl:text-primary-darker">
              {article?.description}
            </Text>
          </View>
          {article?.media && (
            <Image
              source={{ uri: article.media }}
              accessibilityLabel="Imagem principal do artigo."
              className="rounded-lg shadow-purple-sm w-full h-60 object-cover object-center
                            md:h-120
                            xl:w-2/3 xl:h-full xl:max-h-120"
            />
          )}
        </View>
        <View
          className="flex flex-col w-full
                xl:pb-10"
        >
          <Markdown
            rules={{
              heading2: (node, children, parent, styles) => (
                <Text
                  key={node.key}
                  className="font-poppins text-primary font-semibold text-xl mt-8"
                >
                  {children}
                </Text>
              ),
              heading3: (node, children, parent, styles) => (
                <Text
                  key={node.key}
                  className="font-poppins text-primary font-semibold text-lg mt-8"
                >
                  {children}
                </Text>
              ),
              paragraph: (node, children, parent, styles) => (
                <Text
                  key={node.key}
                  className="font-nunito text-primary-text mt-2"
                >
                  {children}
                </Text>
              ),
              bullet_list: (node, children, parent, styles) => (
                <View key={node.key} className="flex gap-2 mt-2 flex-col">
                  {children}
                </View>
              ),
            }}
          >
            {article?.content || ""}
          </Markdown>
        </View>
      </View>
    </ScrollView>
  );
}

export default ArticleContent;
