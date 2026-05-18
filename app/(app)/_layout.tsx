import { Slot } from "expo-router";
import { View } from "react-native";
import NavigationBar, {
  useTabBarOccupiedSpace,
} from "../../src/components/NavigationBar";

import "../../src/style/global.css";

import Header from "../../src/components/Header";

import Pediatrician from "../../src/assets/icons/pediatricianIcon.svg";
import ArticlesIcon from "../../src/assets/navigation/articles.svg";
import ArticlesIconDesk from "../../src/assets/navigation/articlesDesk.svg";
import ArticlesSelected from "../../src/assets/navigation/articlesSelected.svg";
import diaryIcon from "../../src/assets/navigation/diario.svg";
import statisticsIcon from "../../src/assets/navigation/estatisticasIcon.svg";
import HomeIcon from "../../src/assets/navigation/home.svg";
import HomeIconDesk from "../../src/assets/navigation/homeDesk.svg";
import HomeSelected from "../../src/assets/navigation/homeSelected.svg";
import RoutineIcon from "../../src/assets/navigation/routine.svg";
import RoutineIconDesk from "../../src/assets/navigation/routineDesk.svg";
import RoutineSelected from "../../src/assets/navigation/routinesSelected.svg";
import healthIcon from "../../src/assets/navigation/saudeIcon.svg";
import StorageIcon from "../../src/assets/navigation/storage.svg";
import StorageIconDesk from "../../src/assets/navigation/storageDesk.svg";
import StorageSelected from "../../src/assets/navigation/storageSelected.svg";
import vaccineIcon from "../../src/assets/navigation/vacinasIcon.svg";

export interface IconsNavigation {
  id: number;
  icon: any;
  iconDesk?: any;
  iconSelected?: any;
  title: string;
  path: string;
}

export const listIcons: IconsNavigation[] = [
  {
    id: 1,
    icon: HomeIcon,
    iconDesk: HomeIconDesk,
    iconSelected: HomeSelected,
    title: "Home",
    path: "/home",
  },
  {
    id: 2,
    icon: RoutineIcon,
    iconDesk: RoutineIconDesk,
    iconSelected: RoutineSelected,
    title: "Rotinas",
    path: "/routines",
  },
  {
    id: 3,
    icon: StorageIcon,
    iconDesk: StorageIconDesk,
    iconSelected: StorageSelected,
    title: "Estoque",
    path: "/storage",
  },
  {
    id: 4,
    icon: ArticlesIcon,
    iconDesk: ArticlesIconDesk,
    iconSelected: ArticlesSelected,
    title: "Artigos",
    path: "/articles",
  },
  { id: 5, icon: vaccineIcon, title: "Vacinas", path: "/vaccines" },
  { id: 6, icon: healthIcon, title: "Saúde", path: "/health" },
  { id: 7, icon: statisticsIcon, title: "Medidas", path: "/measures" },
  { id: 8, icon: Pediatrician, title: "Profissionais", path: "/pediatrician" },
  { id: 9, icon: diaryIcon, title: "Diário", path: "/diary" },
];

export default function RootLayout() {
  const bottomInset = useTabBarOccupiedSpace();

  return (
    <View className="flex-1 bg-light" style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1, paddingBottom: bottomInset }}>
        <Slot />
      </View>
      <NavigationBar listIcons={listIcons} />
    </View>
  );
}
