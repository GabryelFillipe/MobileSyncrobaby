import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";

import { LoadingBaby } from "@/src/components/Loading";
import type { Article } from "../../../src/services/article/article.service";
import { useGetSingleArticle } from "../../../src/services/hook/article/useGetSingleArticle";

function ArticleContent() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: onGetArticle, isLoading } = useGetSingleArticle(Number(id));
  const [article, setArticle] = useState<Article>();
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (onGetArticle?.article) {
      const foundArticle = Array.isArray(onGetArticle.article)
        ? onGetArticle.article[0]
        : onGetArticle.article;

      if (foundArticle) {
        setArticle(foundArticle);
      }
    }
  }, [onGetArticle]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <LoadingBaby message="Carregando artigo..." />
      </View>
    );
  }

  if (!article) {
    return (
      <View className="flex-1 justify-center items-center bg-light">
        <Text className="font-poppins text-primary-text">
          Artigo não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      className="flex-1 bg-light px-4 pt-6"
    >
      <View className="flex flex-col gap-6">
        <View className="flex flex-col gap-4">
          <View className="flex flex-col gap-2">
            <Text className="w-full text-primary-text font-poppins font-bold text-2xl">
              {article.title}
            </Text>
            <Text className="font-nunito text-dark-purple-muted text-base">
              {article.description}
            </Text>
          </View>

          <Image
            source={
              !imageFailed &&
              article.media &&
              typeof article.media === "string" &&
              article.media !== "null" &&
              article.media.trim() !== ""
                ? { uri: article.media }
                : require("../../../src/assets/articles/defaultBaby.jpg")
            }
            onError={() => setImageFailed(true)}
            accessibilityLabel={`Imagem do artigo ${article.title}`}
            className="rounded-lg shadow-purple-sm w-full h-56 object-cover object-center"
          />
        </View>

        <View className="flex flex-col w-full pb-10">
          <Markdown
            rules={{
              heading2: (node, children) => (
                <Text
                  key={node.key}
                  className="font-poppins text-primary font-bold text-xl mt-6"
                >
                  {children}
                </Text>
              ),
              heading3: (node, children) => (
                <Text
                  key={node.key}
                  className="font-poppins text-primary font-bold text-lg mt-5"
                >
                  {children}
                </Text>
              ),
              paragraph: (node, children) => (
                <Text
                  key={node.key}
                  className="font-nunito text-primary-text mt-3 text-base leading-relaxed"
                >
                  {children}
                </Text>
              ),
              bullet_list: (node, children) => (
                <View key={node.key} className="flex gap-2 mt-3 flex-col ml-2">
                  {children}
                </View>
              ),
            }}
          >
            {article.content || ""}
          </Markdown>
        </View>
      </View>
    </ScrollView>
  );
}

export default ArticleContent;
