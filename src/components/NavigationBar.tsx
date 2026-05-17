import { Link, usePathname } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import arrowIcon from "../assets/navigation/ArrowIcon.svg";
import Logo from "../assets/navigation/logoHeader.png";
import Profile from "../assets/navigation/profileHeader.svg";

import type { IconsNavigation } from "../../app/(app)/_layout";

interface Props {
  listIcons: IconsNavigation[];
}

function NavigationBar({ listIcons }: Props) {
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1280;

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
    <View
      className="fixed bottom-0 flex flex-row justify-center w-full h-22 md:h-28 z-100 bg-light backdrop-blur-sm 
      xl:left-0 xl:w-[15%] xl:min-w-50 xl:h-screen xl:bg-primary xl:flex-col xl:justify-between"
      style={
        Platform.OS !== "web"
          ? { position: "absolute", bottom: 0, width: "100%" }
          : {}
      }
    >
      <View
        className="flex flex-row justify-center w-full items-center
        xl:items-start xl:pl-8 xl:pt-8 xl:flex-col"
      >
        <View
          className="hidden
          xl:flex xl:flex-row xl:gap-4 xl:items-center"
        >
          <Image
            source={typeof Logo === "string" ? { uri: Logo } : Logo}
            alt="Logo principal do web-site"
            className="w-full h-auto"
            resizeMode="contain"
          />
        </View>

        <View
          className="flex flex-row isolate justify-around items-center w-[90%] h-20 bg-lilas rounded-lg
          xl:flex-col xl:bg-transparent xl:w-auto xl:h-auto xl:items-start xl:gap-2 xl:mt-4"
        >
          <Text
            className="hidden
            xl:flex xl:text-dark-purple xl:text-[22px] xl:font-semibold"
          >
            Menu
          </Text>
          {listIcons.slice(0, 4).map((icon) => (
            <Link key={icon.id} href={icon.path as any} asChild>
              <Pressable
                className="relative isolate justify-center items-center 
                xl:w-auto xl:h-9 xl:rounded-lg xl:hover:bg-white/20 xl:hover:scale-103 xl:transition xl:duration-200"
              >
                {!isDesktop && pathname === icon.path && (
                  <View className="absolute w-15 h-15 rounded-xl md:w-16 md:h-16 bg-white/50 shadow-purple-sm -z-10" />
                )}

                <View
                  className={`flex flex-col items-center gap-1 z-60
                  xl:flex-row xl:w-full xl:h-full xl:gap-4 xl:rounded-lg xl:p-2
                  ${pathname === icon.path && isDesktop ? "xl:bg-white/40" : ""}`}
                >
                  {renderIcon(
                    pathname === icon.path
                      ? isDesktop && icon.iconSelected
                        ? icon.iconSelected
                        : icon.iconSelected || icon.icon
                      : isDesktop && icon.iconDesk
                        ? icon.iconDesk
                        : icon.icon,
                    {
                      "aria-hidden": "true",
                      className: "w-auto h-auto md:w-7.5 md:h-7.5 xl:w-6",
                    },
                  )}

                  <Text
                    className={`font-nunito text-[10px] font-bold
                    md:text-[12px]
                    xl:text-white xl:text-[12px] xl:font-light ${pathname === icon.path ? "text-accent-dark" : "text-text-primary"}`}
                  >
                    {icon.title}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>

        <View
          className="hidden
          xl:flex xl:flex-col xl:w-auto xl:h-auto xl:items-start xl:gap-2 xl:mt-4"
        >
          <Text className="xl:text-dark-purple xl:text-[22px] xl:font-semibold">
            Categoria
          </Text>
          {listIcons.slice(4, 11).map((icon) => (
            <Link key={icon.id} href={icon.path as any} asChild>
              <Pressable className="xl:w-auto xl:h-9 xl:rounded-lg xl:hover:bg-white/20 xl:hover:scale-103 xl:transition xl:duration-200">
                <View
                  className={`xl:flex xl:flex-row xl:w-full xl:h-full xl:gap-4 xl:items-center xl:rounded-lg xl:p-2
                  ${pathname === icon.path ? "xl:bg-white/40" : ""}`}
                >
                  {renderIcon(icon.icon, {
                    "aria-hidden": "true",
                    className: "xl:w-6 xl:h-auto",
                  })}
                  <Text className="xl:text-white xl:text-[12px]">
                    {icon.title}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>

      <Link href="/" asChild>
        <Pressable className="hidden xl:flex xl:flex-row xl:w-full xl:h-22 xl:justify-between xl:items-center xl:px-4 xl:border-t xl:border-white">
          <View className="xl:flex xl:flex-row xl:items-center xl:gap-2">
            {renderIcon(Profile, {
              alt: "Foto de perfil do usuário",
              className:
                "xl:w-8 xl:h-8 xl:rounded-full xl:border xl:border-white",
            })}
            <View className="xl:flex xl:flex-col">
              <Text className="font-nunito text-white text-[14px]">
                Mariana Silvana
              </Text>
              <Text className="font-nunito text-white xl:text-[10px]">
                Pedro Henrique
              </Text>
            </View>
          </View>
          {renderIcon(arrowIcon, {
            alt: "Redirecionamento para o perfil de usuário",
            className: "xl:w-4 xl:h-4",
          })}
        </Pressable>
      </Link>
    </View>
  );
}

export default NavigationBar;
