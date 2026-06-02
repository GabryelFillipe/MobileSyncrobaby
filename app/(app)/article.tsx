import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Search from "../../src/assets/icons/search.svg";
import SetBlack from "../../src/assets/routines/setBlack.svg";
import { calculateAgeChild } from "../../src/utils/CalculeAgeGroup";

import { CarouselDots } from "../../src/components/CarouselDots";
import { InputDefault } from "../../src/components/InputDefault";

import type {
  Article,
  ArticleWithAge,
} from "../../src/services/article/article.service";
import { useGetAgeGroups } from "../../src/services/hook/ageGroup/useGetAgeGroups";
import { useGetArticleByAge } from "../../src/services/hook/article/useGetArticleByAge";
import { useGetArticles } from "../../src/services/hook/article/useGetArticles";

import ArticleCard from "../../src/components/articles/ArticleCard";
import CardCarousel from "../../src/components/articles/CardCarousel";

export interface ArticleModel {
  id: number;
  midia: string;
  title: string;
  font: string;
  date: string;
  description: string;
  author: string;
  type: string;
  text_content?: string;
}

const classButtonFilter: string =
  "flex justify-center items-center w-[30%] h-8 font-semibold rounded-lg md:h-10 xl:w-[15%] xl:rounded-lg border border-accent";

function Articles() {
  const router = useRouter();

  const { data: onGetArticles } = useGetArticles();
  const { data: onGetAgeGroup } = useGetAgeGroups();

  const [idAgeGroup, setIdAgeGroup] = useState<number>(1);
  const { data: onGetArticlesByAge } = useGetArticleByAge(idAgeGroup);

  const carousel = useRef<ScrollView>(null);
  const articleCarousel = useRef<View>(null);
  const carouselArticlesDesktop = useRef<ScrollView>(null);
  const cardArticleDesktop = useRef<View>(null);

  const [childName, setChildName] = useState<string>("");
  const [childBirthDate, setChildBirthDate] = useState<string>("");
  const [h3Text, setH3Text] = useState<string>("Recomendações");

  useEffect(() => {
    const fetchStorageData = async () => {
      const name = await AsyncStorage.getItem("select_child_name");
      const birth = await AsyncStorage.getItem("child_birth_date");

      if (name) {
        setChildName(name);
        setH3Text("Recomendados para");
      }
      if (birth) setChildBirthDate(birth);
    };
    fetchStorageData();
  }, []);

  const [indexCarousel, setIndexCarousel] = useState<number>(0);
  const [filterArticles, setFilterArticles] = useState<string>("Todos");
  const [articlesCarousel, setArticlesCarousel] = useState<ArticleWithAge[]>(
    [],
  );
  const [articlesMain, setArticlesMain] = useState<Article[]>([]);
  const [articles, setArticles] = useState<Article[]>(articlesMain);

  const [articleWidth, setArticleWidth] = useState<number>(0);
  const [cardWidthDesktop, setCardWidthDesktop] = useState<number>(0);

  function onFilterArticles(type: string) {
    if (type !== filterArticles && type !== "Todos") {
      const newArticles: Article[] = articlesMain.filter(
        (it) => it.content === type,
      );
      setArticles(newArticles);
      setFilterArticles(type);
    } else {
      setArticles(articlesMain);
      setFilterArticles("Todos");
    }
  }

  function onFilterInputArticles(text: string) {
    const lowerText = text.toLowerCase();

    const newArticles = articlesMain.filter((it) => {
      return (
        it.title.toLowerCase().includes(lowerText) ||
        it.description.toLowerCase().includes(lowerText)
      );
    });

    setArticles(newArticles);
  }

  function scrollIntervalCarousel() {
    if (carousel.current && articleWidth > 0) {
      const nextIndex = indexCarousel === 2 ? 0 : indexCarousel + 1;
      const nextPosition = nextIndex * (articleWidth + 24);

      if (indexCarousel === 2) {
        carousel.current.scrollTo({
          x: 0,
          y: 0,
          animated: true,
        });
        setIndexCarousel(0);
      } else {
        carousel.current.scrollTo({
          x: nextPosition,
          y: 0,
          animated: true,
        });
        setIndexCarousel(nextIndex);
      }
    }
  }

  function scrollCarousel(e: NativeSyntheticEvent<NativeScrollEvent>) {
    if (articleWidth > 0) {
      const positionCarousel = e.nativeEvent.contentOffset.x;
      const index = Math.round(positionCarousel / (articleWidth + 24));
      setIndexCarousel(index);
    }
  }

  function moveCarouselArticles(direction: "left" | "right") {
    if (carouselArticlesDesktop.current && cardWidthDesktop > 0) {
      const offset =
        direction === "left" ? -cardWidthDesktop : cardWidthDesktop;
    }
  }

  function handleArticlePage(id: number) {
    router.push(`/(app)/article/${id}` as Href);
  }

  useEffect(() => {
    if (!onGetAgeGroup || !childBirthDate) {
      return;
    }

    if (onGetAgeGroup && childBirthDate) {
      setIdAgeGroup(calculateAgeChild(childBirthDate, onGetAgeGroup.age_group));
    }
  }, [onGetAgeGroup, childBirthDate]);

  useEffect(() => {
    if (!onGetArticles) {
      return;
    }

    if (onGetArticles && typeof onGetArticles != "string") {
      setArticles(onGetArticles.article);
      setArticlesMain(onGetArticles.article);
    }
  }, [onGetArticles]);

  useEffect(() => {
    if (!onGetArticlesByAge) {
      return;
    }

    if (onGetArticlesByAge) {
      setArticlesCarousel(onGetArticlesByAge.article.slice(0, 3));
    }
  }, [onGetArticlesByAge]);

  useEffect(() => {
    const interval = setInterval(() => {
      scrollIntervalCarousel();
    }, 5000);

    return () => clearInterval(interval);
  }, [indexCarousel, articleWidth]);

  return (
    <View className="flex flex-col w-full min-h-full">
      <View
        className="flex flex-col justify-around w-full h-96
            md:h-130
            xl:h-[57%]"
      >
        <View
          className="flex flex-row items-center w-full h-9 rounded-2xl bg-lilas shadow-purple-sm px-2
                    md:hidden
                    xl:w-2/3"
        >
          <Image
            accessibilityElementsHidden={true}
            source={Search as any}
            accessibilityLabel=""
            className="w-4 h-4"
            resizeMode="contain"
          />
          <InputDefault
            onChangeText={(text) => onFilterInputArticles(text)}
            className="w-full pl-2 font-poppins text-primary-text"
          />
        </View>
        <Text
          className="flex text-center text-[22px] font-semibold font-poppins text-primary-text
                md:text-left md:text-2xl
                xl:hidden"
        >
          {h3Text} <Text className="text-primary ml-1.5">{childName}</Text>
        </Text>
        <Text className="hidden xl:flex xl:text-primary-text xl:text-3xl font-poppins font-semibold">
          Descubra novos artigos
        </Text>

        <ScrollView
          horizontal
          onScroll={scrollCarousel}
          scrollEventThrottle={16}
          ref={carousel}
          showsHorizontalScrollIndicator={false}
          className="flex flex-row w-full max-h-[calc(100%-110px)] px-0.5
                    xl:min-h-[90%]"
          contentContainerStyle={{ gap: 24 }}
        >
          {articlesCarousel.map((article) => (
            <View
              key={article.id_article}
              ref={articleCarousel}
              onLayout={(e) => setArticleWidth(e.nativeEvent.layout.width)}
              className="snap-center snap-mandatory"
            >
              <CardCarousel
                article={article}
                handleArticlePage={(e, id) => handleArticlePage(id)}
                articleCarousel={articleCarousel}
              />
            </View>
          ))}
        </ScrollView>
        <View
          className="flex justify-center flex-row w-full
                xl:hidden"
        >
          <CarouselDots total={3} activeIndex={indexCarousel} />
        </View>
      </View>
      <View
        className="flex flex-col w-full
            xl:h-[43%] xl:relative xl:items-center"
      >
        <Text
          className="text-primary-text font-semibold text-xl
                md:text-2xl
                xl:hidden"
        >
          Categorias
        </Text>
        <View
          className="flex flex-row justify-between items-center w-full h-14
                md:h-16
                xl:justify-start xl:gap-5"
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFilterArticles("Todos")}
            className={`hidden xl:flex xl:border ${classButtonFilter} ${
              filterArticles === "Todos"
                ? "bg-accent border-accent shadow-sm"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                filterArticles === "Todos"
                  ? "text-white"
                  : "text-gray-500 hover:text-accent"
              }
            >
              Todos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFilterArticles("sono")}
            className={`border ${classButtonFilter} ${
              filterArticles === "sono"
                ? "bg-accent border-accent shadow-sm"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                filterArticles === "sono"
                  ? "text-white"
                  : "text-gray-500 hover:text-accent"
              }
            >
              Sono
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFilterArticles("alimentacao")}
            className={`border ${classButtonFilter} ${
              filterArticles === "alimentacao"
                ? "bg-accent border-accent shadow-sm"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                filterArticles === "alimentacao"
                  ? "text-white"
                  : "text-gray-500 hover:text-accent"
              }
            >
              Alimentação
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onFilterArticles("saude")}
            className={`border ${classButtonFilter} ${
              filterArticles === "saude"
                ? "bg-accent border-accent shadow-sm"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={
                filterArticles === "saude"
                  ? "text-white"
                  : "text-gray-500 hover:text-accent"
              }
            >
              Saúde
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          ref={carouselArticlesDesktop}
          showsHorizontalScrollIndicator={false}
          className="flex w-full py-2
                    xl:w-[calc(100%-52px)] xl:h-[calc(100%-56px)]"
          contentContainerStyle={{
            gap: 16,
            justifyContent: "space-around",
            flexDirection: "column",
          }}
        >
          {articles.map((article) => (
            <TouchableOpacity
              onPress={() =>
                router.push(`/(app)/article/${article.id_article}` as Href)
              }
              key={article.id_article}
              activeOpacity={0.8}
              onLayout={(e) => setCardWidthDesktop(e.nativeEvent.layout.width)}
              className="min-h-22 flex"
            >
              <ArticleCard
                article={article}
                cardArticleDesktop={cardArticleDesktop}
              />
            </TouchableOpacity>
          ))}
          <View className="hidden xl:absolute xl:top-[calc(50%+12px)] xl:right-0 xl:flex xl:flex-row xl:w-full xl:h-6 xl:justify-between">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => moveCarouselArticles("left")}
            >
              <Image
                source={SetBlack as any}
                accessibilityLabel="Move o carrosel de artigos"
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => moveCarouselArticles("right")}
            >
              <Image
                source={SetBlack as any}
                accessibilityLabel="Move o carrosel de artigos"
                className="w-6 h-6"
                resizeMode="contain"
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default Articles;
