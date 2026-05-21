import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import VaccinesIcon from "../../src/assets/icons/vaccines.svg";
import { CarouselCard } from "../../src/components/CarouselCard";
import { CarouselDots } from "../../src/components/CarouselDots";
import { CategorySection } from "../../src/components/home/CategorySection";

import ChildrenPhoto from "../../src/assets/icons/childrenPhoto.svg";
import DiaryIcon from "../../src/assets/icons/diaryIcon.svg";
import HealthIcon from "../../src/assets/icons/healthIcon.svg";
import ManageChildIcon from "../../src/assets/icons/manageChildIcon.svg";
import MeasurementsIcon from "../../src/assets/icons/measurementsIcon.svg";
import PediatricianIcon from "../../src/assets/icons/pediatricianIcon.svg";
import PlusIcon from "../../src/assets/icons/plusIcon.svg";
import RoutinesIcon from "../../src/assets/icons/routinesIcon.svg";
import StorageIcon from "../../src/assets/icons/storageIcon.svg";

interface Children {
  id_child: number;
  child_name: string;
  birth_date: string;
  photo: string;
}

interface ResponseChild {
  children: Children[];
}

const mockChildrenData: ResponseChild = {
  children: [
    {
      id_child: 1,
      child_name: "Alice Silva",
      birth_date: "2022-05-10",
      photo: "",
    },
    {
      id_child: 2,
      child_name: "Enzo Gabriel",
      birth_date: "2020-11-20",
      photo: "",
    },
  ],
};

const articlesData = [
  {
    id: 1,
    textPre: "TUDO SOBRE O ",
    textHighlight: "PUERPÉRIO",
    description:
      "O puerpério é um dos momentos mais intensos e complexos da vida de uma mulher. Ele começa logo após o parto e se estende, geralmente, por seis a oito semanas...",
  },
  {
    id: 2,
    textPre: "DICAS PARA O ",
    textHighlight: "SONO",
    description:
      "Criar uma rotina de soneca saudável para o seu bebê é fundamental para o desenvolvimento dele e para o descanso de toda a família...",
  },
  {
    id: 3,
    textPre: "INTRODUÇÃO ",
    textHighlight: "ALIMENTAR",
    description:
      "A fase de introdução alimentar é repleta de descobertas. Saiba como apresentar os primeiros alimentos de forma segura e nutritiva para o seu bebê.",
  },
];

const categoriesData: any[] = [
  { id: 1, title: "Vacinas", icon: VaccinesIcon, path: "Vaccines" },
  { id: 2, title: "Estoque", icon: StorageIcon, path: "Storage" },
  { id: 3, title: "Rotinas", icon: RoutinesIcon, path: "Routines" },
  { id: 4, title: "Diário", icon: DiaryIcon, path: "Diary" },
  { id: 5, title: "Medidas", icon: MeasurementsIcon, path: "Measures" },
  { id: 6, title: "Pediatra", icon: PediatricianIcon, path: "Pediatrician" },
  { id: 7, title: "Saúde", icon: HealthIcon, path: "Health" },
];

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1280;

  const [carouselWidth, setCarouselWidth] = useState(width);

  const handleCategoryNavigation = (path: string) => {
    if (path && path !== "") {
      const formattedPath = `/${path.toLowerCase()}`;
      router.push(formattedPath as any);
    } else {
      router.push("/");
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedChild, setSelectedChild] = useState<Children | undefined>(
    mockChildrenData.children[0],
  );
  const [listChildren, setListChildren] =
    useState<ResponseChild>(mockChildrenData);

  const carouselRef = useRef<ScrollView>(null);
  const scrollOffset = useRef(0);

  const handleLayout = (event: any) => {
    const realWidth = event.nativeEvent.layout.width;
    setCarouselWidth(realWidth);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const screenWidth = Dimensions.get("window").width;
        const maxScroll = screenWidth * (articlesData.length - 1);

        let nextScroll = scrollOffset.current + screenWidth;
        if (nextScroll > maxScroll + 50) {
          nextScroll = 0;
        }

        carouselRef.current.scrollTo({ x: nextScroll, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchChild = async () => {
      const storedId = await AsyncStorage.getItem("select_child");
      if (storedId) {
        const idChild: number = Number(storedId);
        const child: Children[] | undefined = mockChildrenData.children.filter(
          (it) => it.id_child === idChild,
        );

        if (child && child.length > 0) {
          setSelectedChild(child[0]);
        }
      }
    };

    fetchChild();
  }, []);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidth = event.nativeEvent.layoutMeasurement.width;

    scrollOffset.current = scrollPosition;

    const currentIndex = Math.round(scrollPosition / cardWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <View className="w-full flex flex-col  z-91 pt-4 pb-0 md:py-10 md:gap-8 gap-6 relative">
      <View className="w-full flex flex-col mb-4 mt-6">
        <ScrollView
          ref={carouselRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onLayout={handleLayout}
          className="w-full flex flex-row"
          contentContainerStyle={{
            justifyContent: "flex-start",
            flexGrow: 1,
          }}
        >
          {articlesData.map((article) => (
            <View
              key={article.id}
              style={{ width: carouselWidth }}
              className="px-6"
            >
              <CarouselCard
                id={article.id}
                textPre={article.textPre}
                textHighlight={article.textHighlight}
                description={article.description}
                img={require("../../src/assets/images/artigoImg.png")}
              />
            </View>
          ))}
        </ScrollView>
        <View className="mt-4">
          <CarouselDots activeIndex={activeIndex} total={articlesData.length} />
        </View>
      </View>

      <View className="w-full flex flex-col grow justify-evenly md:gap-12 px-6 xl:px-0">
        <View className="xl:hidden flex items-center justify-center w-full mt-4">
          <CategorySection
            categories={categoriesData}
            onCategoryClick={handleCategoryNavigation}
          />
        </View>

        <View className="flex text-start flex-col mt-10 gap-2 md:mb-24 md:gap-6">
          <View className="flex flex-row justify-between items-end xl:px-0">
            <Pressable onPress={() => console.log(listChildren)}>
              <Text className="text-xl md:text-2xl font-bold font-poppins text-primary-text xl:text-2xl w-full">
                {isDesktop ? "Meus Filhos" : "Filhos"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setIsModalOpen(true)}
              className="hidden xl:flex"
            >
              <Text className="text-primary font-bold text-sm font-poppins hover:underline">
                Gerir Filhos
              </Text>
            </Pressable>
          </View>

          <View className="w-full bg-lilas xl:bg-transparent shadow-purple-md xl:shadow-none flex flex-col xl:flex-row gap-3 xl:gap-8 px-6 md:px-8 xl:px-0 pt-3 md:pt-4 xl:pt-0 pb-8 md:pb-10 xl:pb-0 rounded-md">
            <View className="w-full flex flex-row justify-between xl:hidden">
              <Pressable onPress={() => router.push("/")}>
                {/* /addChild */}
                <PlusIcon width={24} height={24} />
              </Pressable>
              <Pressable onPress={() => setIsModalOpen(true)}>
                <ManageChildIcon width={24} height={24} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("/")} // /addChild
              className="w-full xl:w-[320px] bg-primary xl:bg-light xl:border xl:border-gray-200 xl:border-t-4 xl:border-t-primary py-1 md:py-4 xl:py-4 px-6 md:px-8 xl:px-6 rounded-sm shadow-purple-md xl:shadow-sm flex flex-col hover:opacity-90 transition-all"
            >
              <View className="flex flex-row gap-4 md:gap-6 items-center w-full">
                <View className="bg-lilas rounded-full p-1 xl:p-0 xl:bg-transparent">
                  {selectedChild?.photo && selectedChild.photo !== "" ? (
                    <Image
                      source={{ uri: selectedChild.photo }}
                      className="w-11 h-11 md:w-14 md:h-14 xl:w-12 xl:h-12 rounded-full"
                    />
                  ) : (
                    <ChildrenPhoto width={44} height={44} />
                  )}
                </View>
                <View className="flex flex-col justify-center flex-1">
                  <Text className="font-poppins font-bold text-libg-light xl:text-primary-text text-base md:text-xl xl:text-lg leading-tight">
                    {selectedChild?.child_name}
                  </Text>
                  <Text className="font-poppins text-sm md:text-base xl:text-sm text-lilas-medium xl:text-primary-text/70">
                    2 Anos
                  </Text>
                </View>
                <View className="hidden xl:flex p-2">
                  <Svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-500"
                  >
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </Svg>
                </View>
              </View>

              <View className="hidden xl:flex flex-row items-center gap-2 mt-6 pt-4 border-t border-gray-100 w-full">
                <Svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <Path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
                    clipRule="evenodd"
                  />
                </Svg>
                <Text className="text-gray-400 text-xs font-poppins">
                  Ultima Alimentação:
                </Text>
                <Text className="text-primary-text font-bold text-xs ml-auto">
                  A ser implementado
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => router.push("/")} // addChild
              className="hidden xl:flex w-full xl:w-50 border-2 border-dashed border-primary/40 bg-lilas/20 rounded-xl flex-col items-center justify-center gap-3 hover:bg-lilas/40 transition-colors py-4"
            >
              <View className="w-12 h-12 bg-light rounded-full flex items-center justify-center shadow-sm">
                <Text className="text-primary text-3xl font-bold leading-none mb-1">
                  +
                </Text>
              </View>
              <Text className="text-primary font-poppins text-base font-semibold">
                Adicionar Filho
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable
          className="flex-1 flex items-center justify-center bg-black/50 px-4"
          onPress={() => setIsModalOpen(false)}
        >
          <Pressable
            className="w-[90%] md:w-100 bg-light rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex flex-row justify-between items-center">
              <Text className="font-poppins font-bold text-primary-text text-lg md:text-xl">
                Filhos(as)
              </Text>
              <Pressable onPress={() => setIsModalOpen(false)}>
                <Svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-primary-text"
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </Svg>
              </Pressable>
            </View>

            <ScrollView className="flex flex-col gap-3 max-h-[60vh]">
              {listChildren?.children.map((child: Children) => (
                <Pressable
                  key={child.id_child}
                  onPress={async () => {
                    setSelectedChild(child);
                    await AsyncStorage.setItem(
                      "select_child",
                      child.id_child.toString(),
                    );
                    setIsModalOpen(false);
                  }}
                  className="w-full bg-light border border-lilas md:py-3 py-2 px-4 rounded-xl flex flex-row items-center gap-4"
                >
                  {child.photo && child.photo !== "" ? (
                    <Image
                      source={{ uri: child.photo }}
                      className="w-11 h-11 md:w-12 md:h-12 rounded-full"
                    />
                  ) : (
                    <ChildrenPhoto width={44} height={44} />
                  )}
                  <View className="flex flex-col">
                    <Text className="font-poppins font-bold text-primary-text text-sm md:text-base leading-tight">
                      {child.child_name}
                    </Text>
                    <Text className="font-poppins text-xs md:text-sm text-primary-text/70 mt-0.5">
                      {child.child_name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
