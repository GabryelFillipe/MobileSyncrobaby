import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, type Href } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import Search from "../../src/assets/icons/search.svg";
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

const classButtonFilter: string =
  "flex justify-center items-center px-4 h-8 font-semibold rounded-lg md:h-10 border border-accent";

const hiddenAgeGroups = [
  "2 meses",
  "3 meses",
  "4 meses",
  "5 meses",
  "6 meses",
  "7 meses",
  "8 meses",
  "9 meses",
  "12 meses",
  "15 meses",
  "4 e 5 anos",
  "4 anos",
  "5 anos",
];

function Articles() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const { data: onGetArticles } = useGetArticles();
  const { data: onGetAgeGroup } = useGetAgeGroups();

  const [idAgeGroupChild, setIdAgeGroupChild] = useState<number>(1);
  const { data: onGetArticlesCarousel } = useGetArticleByAge(idAgeGroupChild);

  const [filterArticlesId, setFilterArticlesId] = useState<number>(0);

  const { data: onGetArticlesFilteredByAPI, isFetching: isFetchingFilter } =
    useGetArticleByAge(filterArticlesId);

  const carousel = useRef<ScrollView>(null);
  const articleCarousel = useRef<View>(null);

  const [childName, setChildName] = useState<string>("");
  const [childBirthDate, setChildBirthDate] = useState<string>("");
  const [h3Text, setH3Text] = useState<string>("Recomendações");

  const [indexCarousel, setIndexCarousel] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const [articlesCarousel, setArticlesCarousel] = useState<ArticleWithAge[]>(
    [],
  );
  const [articles, setArticles] = useState<(Article | ArticleWithAge)[]>([]);

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

  useEffect(() => {
    if (!onGetAgeGroup || typeof onGetAgeGroup === "string" || !childBirthDate)
      return;
    setIdAgeGroupChild(
      calculateAgeChild(childBirthDate, onGetAgeGroup.age_group),
    );
  }, [onGetAgeGroup, childBirthDate]);

  useEffect(() => {
    if (onGetArticlesCarousel && typeof onGetArticlesCarousel !== "string") {
      setArticlesCarousel(onGetArticlesCarousel.article.slice(0, 3));
    }
  }, [onGetArticlesCarousel]);

  useEffect(() => {
    let sourceList: (Article | ArticleWithAge)[] = [];

    if (
      filterArticlesId === 0 &&
      onGetArticles &&
      typeof onGetArticles !== "string"
    ) {
      sourceList = onGetArticles.article;
    } else if (
      filterArticlesId !== 0 &&
      onGetArticlesFilteredByAPI &&
      typeof onGetArticlesFilteredByAPI !== "string"
    ) {
      sourceList = onGetArticlesFilteredByAPI.article;
    }

    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      sourceList = sourceList.filter((it) =>
        it.title.toLowerCase().includes(lowerSearch),
      );
    }

    setArticles(sourceList);
  }, [filterArticlesId, onGetArticles, onGetArticlesFilteredByAPI, searchText]);

  useEffect(() => {
    if (articlesCarousel.length === 0 || width === 0) return;
    const interval = setInterval(() => {
      scrollIntervalCarousel();
    }, 5000);
    return () => clearInterval(interval);
  }, [indexCarousel, width, articlesCarousel.length]);

  function scrollIntervalCarousel() {
    if (carousel.current && width > 0) {
      const maxIndex =
        articlesCarousel.length > 0 ? articlesCarousel.length - 1 : 0;
      const nextIndex = indexCarousel >= maxIndex ? 0 : indexCarousel + 1;
      const nextPosition = nextIndex * width;

      carousel.current.scrollTo({ x: nextPosition, y: 0, animated: true });
      setIndexCarousel(nextIndex);
    }
  }

  function scrollCarousel(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const positionCarousel = e.nativeEvent.contentOffset.x;
    const index = Math.round(positionCarousel / width);
    setIndexCarousel(index);
  }

  function handleArticlePage(id: number) {
    router.push(`/(app)/article/${id}` as Href);
  }

  const isSearching = searchText.trim() !== "";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1 w-full bg-light"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View className="flex flex-col w-full pt-4 gap-6">
          <View className="flex flex-col px-4 w-full">
            <View className="flex flex-row items-center w-full h-10 rounded-2xl bg-lilas shadow-purple-sm px-3">
              <Image
                source={Search as any}
                className="w-4 h-4"
                resizeMode="contain"
              />
              <InputDefault
                value={searchText}
                onChangeText={setSearchText}
                className="w-full pl-2 font-poppins text-primary-text"
                placeholder="Buscar artigos..."
              />
            </View>
          </View>

          {!isSearching && (
            <>
              <View className="flex flex-col px-4 w-full">
                <Text className="text-[22px] font-semibold font-poppins text-primary-text md:text-2xl">
                  {h3Text} <Text className="text-primary">{childName}</Text>
                </Text>
              </View>

              <View className="flex flex-col gap-3 w-full">
                <ScrollView
                  horizontal
                  pagingEnabled
                  onMomentumScrollEnd={scrollCarousel}
                  ref={carousel}
                  showsHorizontalScrollIndicator={false}
                  className="flex flex-row w-full"
                >
                  {articlesCarousel.map((article) => (
                    <View
                      key={article.id_article}
                      ref={articleCarousel}
                      style={{ width: width }}
                      className="px-4"
                    >
                      <CardCarousel
                        article={article}
                        handleArticlePage={(e, id) => handleArticlePage(id)}
                        articleCarousel={articleCarousel}
                      />
                    </View>
                  ))}
                </ScrollView>

                <View className="flex justify-center flex-row w-full">
                  <CarouselDots
                    total={articlesCarousel.length || 3}
                    activeIndex={indexCarousel}
                  />
                </View>
              </View>

              <View className="flex flex-col w-full px-4 gap-4">
                <Text className="text-primary-text font-semibold text-xl">
                  Faixa Etária
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 12 }}
                  className="flex flex-row w-full pb-2"
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setFilterArticlesId(0)}
                    className={`${classButtonFilter} ${
                      filterArticlesId === 0
                        ? "bg-accent border-accent shadow-sm"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        filterArticlesId === 0 ? "text-white" : "text-gray-500"
                      }
                    >
                      Todas
                    </Text>
                  </TouchableOpacity>

                  {onGetAgeGroup &&
                    typeof onGetAgeGroup !== "string" &&
                    onGetAgeGroup.age_group
                      ?.filter(
                        (ageGroup: any) =>
                          !hiddenAgeGroups.includes(ageGroup.age_group_name),
                      )
                      .map((ageGroup: any) => (
                        <TouchableOpacity
                          key={ageGroup.id_age_group}
                          activeOpacity={0.7}
                          onPress={() =>
                            setFilterArticlesId(ageGroup.id_age_group)
                          }
                          className={`${classButtonFilter} ${
                            filterArticlesId === ageGroup.id_age_group
                              ? "bg-accent border-accent shadow-sm"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <Text
                            className={
                              filterArticlesId === ageGroup.id_age_group
                                ? "text-white"
                                : "text-gray-500"
                            }
                          >
                            {ageGroup.age_group_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                </ScrollView>
              </View>
            </>
          )}

          <View className="flex flex-col w-full px-4 gap-4 mt-2">
            {isSearching && (
              <Text className="text-primary-text font-semibold text-xl mb-2">
                {`Resultados para "${searchText}"`}{" "}
              </Text>
            )}

            {isFetchingFilter && filterArticlesId !== 0 && (
              <Text className="text-gray-500 font-poppins text-center mt-4">
                Buscando artigos...
              </Text>
            )}

            {!isFetchingFilter &&
              articles.map((article) => (
                <TouchableOpacity
                  key={article.id_article}
                  activeOpacity={0.8}
                  onPress={() => handleArticlePage(article.id_article)}
                >
                  <ArticleCard article={article as Article} />
                </TouchableOpacity>
              ))}

            {!isFetchingFilter && articles.length === 0 && (
              <Text className="text-gray-500 font-poppins text-center mt-4">
                Nenhum artigo encontrado.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default Articles;
