import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
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

import childrenPhoto from "../../src/assets/icons/childrenPhoto.svg";
import DiaryIcon from "../../src/assets/icons/diaryIcon.svg";
import healthIcon from "../../src/assets/icons/healthIcon.svg";
import manageChildIcon from "../../src/assets/icons/manageChildIcon.svg";
import MeasurementsIcon from "../../src/assets/icons/measurementsIcon.svg";
import PediatricianIcon from "../../src/assets/icons/pediatricianIcon.svg";
import plusIcon from "../../src/assets/icons/plusIcon.svg";
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
  { id: 7, title: "Saúde", icon: healthIcon, path: "Health" },
];

const upcomingEventsData = [
  {
    id: 1,
    title: "Soneca da Tarde",
    time: "Em 2 Horas",
    description: "Previsto para 14H",
    icon: (
      <Svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-blue-500"
      >
        <Path d="M9.352 4.093c-2.316-2.023-5.836-1.503-6.953 1.134-.51 1.205-.51 2.585 0 3.79 1.117 2.637 4.637 3.157 6.953 1.134a.75.75 0 00-.982-1.127c-1.383 1.207-3.486.898-4.153-.679a3.004 3.004 0 010-2.27c.667-1.577 2.77-1.886 4.153-.679a.75.75 0 00.982-1.127z" />
        <Path d="M12.96 11.246c-2.316-2.023-5.836-1.503-6.953 1.134-.51 1.205-.51 2.585 0 3.79 1.117 2.637 4.637 3.157 6.953 1.134a.75.75 0 00-.982-1.127c-1.383 1.207-3.486.898-4.153-.679a3.004 3.004 0 010-2.27c.667-1.577 2.77-1.886 4.153-.679a.75.75 0 00.982-1.127z" />
        <Path
          fillRule="evenodd"
          d="M11.53 3.66a.75.75 0 01.696-.45h8.024a.75.75 0 01.696 1.03l-2.043 5.109h2.347a.75.75 0 01.625 1.164l-7.5 11.25a.75.75 0 01-1.312-.662l1.91-6.691h-3.21a.75.75 0 01-.663-1.096l3.398-9.055a.75.75 0 01.032-.05z"
          clipRule="evenodd"
        />
      </Svg>
    ),
    bgClass: "bg-blue-50",
  },
  {
    id: 2,
    title: "Almoço",
    time: "Em 3 Horas",
    description: "Previsto para 12H",
    icon: (
      <Svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6 text-orange-500"
      >
        <Path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
          clipRule="evenodd"
        />
      </Svg>
    ),
    bgClass: "bg-orange-50",
  },
];

const inventoryStatusData = [
  { id: 1, label: "Fraldas tamanho (M)", amount: 128, alert: false },
  {
    id: 2,
    label: "Creme de Assadura",
    amount: 1,
    alert: true,
    subLabel: "Comprar mais Creme",
  },
  { id: 3, label: "Lenços Umedecidos", amount: 64, alert: false },
];

export default function Home() {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1280;

  const handleCategoryNavigation = (path: string) => {
    if (path && path !== "") {
      navigation.navigate(path);
    } else {
      navigation.navigate("NotFound");
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

  const renderIcon = (iconSource: any, props: any) => {
    if (typeof iconSource === "function") {
      const SvgIcon = iconSource;
      return <SvgIcon {...props} />;
    }
    return (
      <Image
        source={
          typeof iconSource === "string" ? { uri: iconSource } : iconSource
        }
        {...props}
      />
    );
  };

  return (
    <View className="w-full flex flex-col items-center z-91 pt-8 pb-0 md:py-10 md:gap-8 xl:py-4 xl:pb-12 gap-4 xl:gap-4 relative">
      <ScrollView
        ref={carouselRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="w-full flex flex-row overflow-hidden rounded-2xl pb-2 xl:py-40"
      >
        {articlesData.map((article) => (
          <View key={article.id} className="w-screen px-6">
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

      <CarouselDots activeIndex={activeIndex} total={articlesData.length} />

      <View className="w-full flex flex-col grow justify-evenly gap-6 md:gap-12 xl:gap-6 xl:px-0">
        <View className="xl:hidden flex items-center justify-center w-full h-20">
          <CategorySection
            categories={categoriesData}
            onCategoryClick={handleCategoryNavigation}
          />
        </View>

        <View className="flex text-start flex-col gap-2 mt-10 md:mb-24 md:gap-6">
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
              <Pressable onPress={() => navigation.navigate("AddChild")}>
                {renderIcon(plusIcon, {
                  alt: "Icone de adicionar filho",
                  className: "md:w-8 md:h-8 w-6 h-6",
                })}
              </Pressable>
              <Pressable onPress={() => setIsModalOpen(true)}>
                {renderIcon(manageChildIcon, {
                  alt: "Icone para acessar o perfil do filho",
                  className: "md:w-8 md:h-8 w-6 h-6",
                })}
              </Pressable>
            </View>

            <Pressable
              onPress={() => navigation.navigate("ProfileChildren")}
              className="w-full xl:w-[320px] bg-primary xl:bg-white xl:border xl:border-gray-200 xl:border-t-4 xl:border-t-primary py-1 md:py-4 xl:py-4 px-6 md:px-8 xl:px-6 rounded-sm shadow-purple-md xl:shadow-sm flex flex-col hover:opacity-90 transition-all"
            >
              <View className="flex flex-row gap-4 md:gap-6 items-center w-full">
                <View className="bg-lilas rounded-full p-1 xl:p-0 xl:bg-transparent">
                  {renderIcon(
                    selectedChild?.photo && selectedChild.photo !== ""
                      ? { uri: selectedChild.photo }
                      : childrenPhoto,
                    {
                      alt: `Foto de ${selectedChild?.child_name}`,
                      className:
                        "w-11 h-11 md:w-14 md:h-14 xl:w-12 xl:h-12 rounded-full",
                    },
                  )}
                </View>
                <View className="flex flex-col justify-center flex-1">
                  <Text className="font-poppins font-bold text-white xl:text-primary-text text-base md:text-xl xl:text-lg leading-tight">
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
              onPress={() => navigation.navigate("AddChild")}
              className="hidden xl:flex w-full xl:w-50 border-2 border-dashed border-primary/40 bg-lilas/20 rounded-xl flex-col items-center justify-center gap-3 hover:bg-lilas/40 transition-colors py-4"
            >
              <View className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
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

        <View className="hidden xl:flex flex-row gap-10 mt-6 w-full">
          <View className="flex flex-col gap-4 flex-1">
            <Text className="font-poppins font-bold text-primary-text text-lg">
              Proximos Eventos{" "}
              <Text className="text-xs font-normal text-gray-400">
                (Baseado na sua rotina)
              </Text>
            </Text>
            <View className="flex flex-col gap-3">
              {upcomingEventsData.map((event) => (
                <View
                  key={event.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-row items-center justify-between"
                >
                  <View className="flex flex-row items-center gap-4">
                    <View
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${event.bgClass}`}
                    >
                      {event.icon}
                    </View>
                    <View className="flex flex-col">
                      <Text className="font-poppins font-bold text-primary-text text-sm">
                        {event.title}
                      </Text>
                      <Text className="font-poppins text-xs text-gray-400 mt-0.5">
                        {event.description}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs font-poppins text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                    {event.time}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="flex flex-col gap-4 flex-1">
            <Text className="font-poppins font-bold text-primary-text text-lg">
              Estado do Estoque
            </Text>
            <View className="flex flex-row flex-wrap gap-3">
              {inventoryStatusData.map((item) => (
                <View
                  key={item.id}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm border text-center flex-1 ${item.alert ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}
                >
                  <View
                    className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${item.alert ? "bg-red-100" : "bg-gray-50"}`}
                  >
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-5 h-5 ${item.alert ? "text-red-500" : "text-gray-500"}`}
                    >
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                      />
                    </Svg>
                  </View>
                  <Text
                    className={`font-poppins font-bold text-xl ${item.alert ? "text-red-500" : "text-primary-text"}`}
                  >
                    {item.amount}
                  </Text>
                  <Text
                    className={`font-poppins text-xs mt-1 leading-tight ${item.alert ? "text-red-400 font-medium" : "text-gray-500"}`}
                  >
                    {item.label}
                  </Text>
                  {item.subLabel && (
                    <Text className="text-[10px] text-red-400 mt-2 font-poppins">
                      {item.subLabel}
                    </Text>
                  )}
                </View>
              ))}
            </View>
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
            className="w-[90%] md:w-100 bg-white rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4"
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
                  className="w-full bg-white border border-lilas md:py-3 py-2 px-4 rounded-xl flex flex-row items-center gap-4"
                >
                  {renderIcon(
                    child.photo && child.photo !== ""
                      ? { uri: child.photo }
                      : childrenPhoto,
                    {
                      alt: `Foto de ${child.child_name}`,
                      className: "w-11 h-11 md:w-12 md:h-12 rounded-full",
                    },
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
