import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import CheckIcon from "../../assets/icons/checkIcon.svg";
import BtnPrimary from "../../components/BtnPrimary";

export function SupportNetworkCard() {
  const router = useRouter();

  return (
    <View className="hidden w-full flex-col gap-4 mb-6 xl:flex">
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-extrabold text-primary-text font-poppins flex-1">
          Rede de Apoio
        </Text>

        <BtnPrimary
          text="Adicionar profissional"
          className="bg-accent flex justify-center items-center h-10 px-4 rounded-lg shadow-md"
          textClassName="text-white font-poppins font-bold text-sm text-center"
          onPress={() => {
            router.push("/addProfessional");
          }}
        />
      </View>

      <View className="hidden rounded-xl border border-accent bg-lilas p-5 flex-col md:flex-row gap-4 items-center shadow-sm">
        <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-purple-sm">
          <View className="w-9 h-9 bg-accent rounded-full flex items-center justify-center">
            <CheckIcon width={20} height={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        </View>

        <View className="flex-col gap-2 flex-1 items-center md:items-start">
          <Text className="text-lg font-bold text-primary-text font-poppins text-center md:text-left">
            Seus Profissionais de Confiança
          </Text>
          <Text className="text-primary/80 leading-relaxed text-sm font-medium font-nunito text-center md:text-left">
            Tudo o que a saúde da sua família precisa, organizado em um só
            lugar: acesse o histórico completo das consultas com nossos
            especialistas validados e tenha a tranquilidade de acompanhar cada
            etapa do desenvolvimento de quem você ama, com segurança e
            praticidade.
          </Text>
        </View>
      </View>
    </View>
  );
}
