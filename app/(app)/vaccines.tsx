import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import MaskInput from "react-native-mask-input";

import { Controller, useForm } from "react-hook-form";

import { DropdownFilter, FilterOption } from "../../src/components/DropdownFilter";
import { LoadingBaby } from "../../src/components/Loading";

import EditIcon from "../../src/assets/icons/editIcon.svg";

import RoutineDate from "../../src/utils/Date";

import { useGetAllVaccine } from "../../src/services/hook/vaccine/useGetAllVaccine";
import { useUpdateVaccineStatus } from "../../src/services/hook/vaccine/useUpdateVaccineStatus";
import type { VaccineStatus } from "../../src/services/vaccine/vaccine.service";

import type {
    JSONAgeGroup,
    UpdateVaccine,
} from "../../src/services/vaccine/vaccine.service";

interface Form {
    application_date: string;
}

interface ResponseGetAllVaccine {
    status_code: number;
    vaccine: JSONAgeGroup[];
}

export default function Vaccines() {
    const [idChild, setIdChild] = useState<number | null>(null);

    const [vaccines, setVaccines] = useState<JSONAgeGroup[]>([]);
    const [useVaccines, setUseVaccines] = useState<JSONAgeGroup[]>([]);

    const [ageGroup, setAgeGroup] = useState("Todas");

    const [options, setOptions] = useState<FilterOption[]>([]);

    const [modalOpen, setModalOpen] = useState(false);

    const [selectedVaccineId, setSelectedVaccineId] =
        useState<number | null>(null);

    const [selectedVaccineName, setSelectedVaccineName] =
        useState("");

    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselWidth, setCarouselWidth] = useState(0);

    const flatListRef = useRef<FlatList>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Form>();

    const {
        data: onGetAllVaccines,
        isLoading,
        isError,
        refetch,
    } = useGetAllVaccine(idChild);

    const {
        mutate: onUpdateVaccine,
    } = useUpdateVaccineStatus();

    useEffect(() => {
        async function loadChild() {
            try {
                const stored =
                    await AsyncStorage.getItem(
                        "select_child"
                    );

                if (stored) {
                    setIdChild(Number(stored));
                }
            } catch {
                Alert.alert(
                    "Erro",
                    "Não foi possível recuperar a criança selecionada."
                );
            }
        }

        loadChild();
    }, []);

    function getAgeGroup(data: JSONAgeGroup[]) {
        const groups: FilterOption[] = data.map((item) => ({
            id: item.age_group_name,
            label: item.age_group_name,
        }));

        groups.unshift({
            id: "Todas",
            label: "Todas",
        });

        setOptions(groups);
    }

    useEffect(() => {
        if (!onGetAllVaccines) {
            return;
        }

        const response =
            onGetAllVaccines as ResponseGetAllVaccine;

        setVaccines(response.vaccine);

        setUseVaccines(response.vaccine);

        setAgeGroup("Todas");

        setCurrentIndex(0);

        getAgeGroup(response.vaccine);

        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
        });

    }, [onGetAllVaccines]);

    function filterVaccine(option: string) {
        setAgeGroup(option);

        if (option === "Todas") {
            setUseVaccines(vaccines);

        } else {
            setUseVaccines(
                vaccines.filter(
                    item =>
                        item.age_group_name === option
                )
            );
        }

        setCurrentIndex(0);

        flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
        });
    }

    function handleScrollEnd(event: any) {
        const index = Math.round(
            event.nativeEvent.contentOffset.x /
            carouselWidth
        );

        setCurrentIndex(index);
    }

    function updateVaccineDate(data: Form) {
        const dates: string[] = data.application_date.split("/")
        const dateFormated: string = `${dates[2]}-${dates[1]}-${dates[0]}`

        if (!idChild || !selectedVaccineId) {
            return;
        }
        
        const updateData: UpdateVaccine = {
            fk_id_child: idChild,
            application_status: 1,
            application_date: dateFormated,
            fk_id_vaccine: selectedVaccineId,
        };

        onUpdateVaccine(updateData, {
            onSuccess: () => {
                Alert.alert(
                    "Sucesso",
                    "Vacina atualizada com sucesso!"
                );

                setModalOpen(false);

                reset();

                refetch();
            },

            onError: () => {
                Alert.alert(
                    "Erro",
                    "Não foi possível atualizar a vacina."
                );
            },
        });
    }

    return (
        <View className="flex-1 items-start flex w-full bg-transparent px-6">
            {/* Modal */}
            <Modal
                visible={modalOpen}
                transparent
                animationType="fade"
            >
                <BlurView
                    intensity={40}
                    tint="dark"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                    }}
                />
                <View
                    className="
                        flex-1
                        justify-center
                        items-center
                        px-4
                    "
                >
                    <View
                        className="
                            w-full
                            max-w-sm
                            bg-lilas-bg
                            rounded-xl
                            p-6
                            items-center
                        "
                    >
                        <Text
                            className="
                                text-primary-text
                                font-semibold
                                text-center
                                mb-4
                            "
                        >
                            Digite a data de aplicação da{" "}
                            {selectedVaccineName}
                        </Text>

                        <Controller
                            control={control}
                            name="application_date"
                            rules={{
                                required:
                                    "Data obrigatória",
                            }}
                            render={({ field }) => (
                                <MaskInput
                                    placeholder="dd/MM/AAAA"
                                    value={field.value}
                                    onChangeText={
                                        field.onChange
                                    }
                                    mask={[
                                        /\d/,
                                        /\d/,
                                        "/",
                                        /\d/,
                                        /\d/,
                                        "/",
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                    ]}
                                    className="
                                        w-full
                                        h-13
                                        bg-white
                                        border
                                        border-gray-200
                                        rounded-md
                                        px-3
                                        text-primary
                                    "
                                />
                            )}
                        />

                        {errors
                            .application_date
                            ?.message && (
                                <Text
                                    className="
                                    text-red-600
                                    text-sm
                                    mt-2
                                "
                                >
                                    {
                                        errors
                                            .application_date
                                            .message
                                    }
                                </Text>
                            )}

                        <Text
                            className="
                                text-[11px]
                                italic
                                text-primary-darker
                                text-center
                                mt-3
                                mb-6
                            "
                        >
                            Obs: A data não poderá
                            ser alterada após a
                            confirmação
                        </Text>

                        <View
                            className="
                                flex-row
                                justify-center
                                gap-4
                                w-full
                            "
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setModalOpen(
                                        false
                                    );

                                    setSelectedVaccineId(
                                        null
                                    );

                                    setSelectedVaccineName(
                                        ""
                                    );

                                    reset({
                                        application_date:
                                            "",
                                    });
                                }}
                                className="
                                    bg-white
                                    border
                                    border-gray-300
                                    rounded-md
                                    px-6
                                    py-2.5
                                "
                            >
                                <Text
                                    className="
                                        text-gray-700
                                        font-semibold
                                    "
                                >
                                    Cancelar
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmit(
                                    updateVaccineDate
                                )}
                                className="
                                    bg-accent
                                    rounded-md
                                    px-6
                                    py-2.5
                                "
                            >
                                <Text
                                    className="
                                        text-white
                                        font-semibold
                                    "
                                >
                                    Confirmar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Dropdown */}
            <View
                className="
                    w-full
                    h-12
                    justify-start
                    mb-2
                    z-50
                "
            >
                <View
                className="w-1/3">
                    <DropdownFilter
                        options={options}
                        onSelect={setAgeGroup}
                        functionExtra={
                            filterVaccine
                        }
                        selectedFilter={
                            ageGroup
                        }
                    />
                </View>
            </View>

            {/* Container Principal */}
            <View
                className="
                    w-[98%]
                    h-[95%]
                    bg-primary
                    rounded-xl
                    p-2
                "
                onLayout={(event) => {
                    setCarouselWidth(
                        event.nativeEvent.layout.width
                    );
                }}
            >
                {isLoading &&
                    !isError && (
                        <LoadingBaby
                            message="Procurando vacinas"
                        />
                    )}

                {!isLoading &&
                    isError && (
                        <Text
                            className="
                                text-red-500
                                text-center
                                mt-4
                            "
                        >
                            Erro ao carregar
                            dados do servidor
                        </Text>
                    )}

                {!isLoading && !isError && (
                    <FlatList
                        ref={flatListRef}
                        data={useVaccines}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={1}
                        windowSize={3}
                        removeClippedSubviews={false}
                        snapToInterval={carouselWidth}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        disableIntervalMomentum={false}
                        keyExtractor={(item) =>
                            String(item.id_age_group)
                        }
                        getItemLayout={(_, index) => ({
                            length: carouselWidth,
                            offset: carouselWidth * index,
                            index,
                        })}
                        onMomentumScrollEnd={handleScrollEnd}
                        className="bg-lilas-medium rounded-xl -mr-5"
                        renderItem={({ item: ageGroupVaccine }) => (
                            <View
                                style={{
                                    width: carouselWidth,
                                }}
                                className="p-4"
                            >
                                <Text
                                    className="
                                        text-primary-text
                                        font-bold
                                        text-2xl
                                        mb-4
                                    "
                                >
                                    {ageGroupVaccine.age_group_name}
                                </Text>

                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingBottom: 20,
                                        flexGrow: 1,
                                    }}
                                >
                                    <View className="gap-4">
                                        {ageGroupVaccine.vaccines.map(
                                            (vaccine: VaccineStatus) => (
                                                <View
                                                    key={`${ageGroupVaccine.id_age_group}-${vaccine.id_vaccine}`}
                                                    className="
                                                        relative
                                                        bg-white
                                                        rounded-xl
                                                        overflow-hidden
                                                        min-h-54
                                                    "
                                                >
                                                    {/* Cabeçalho */}
                                                    <View
                                                        className="
                                                            flex-row
                                                            bg-primary
                                                            px-3
                                                            py-2
                                                        "
                                                    >
                                                        <Text
                                                            className="
                                                                w-[50%]
                                                                text-white
                                                                font-semibold
                                                                text-xs
                                                            "
                                                        >
                                                            Vacina
                                                        </Text>

                                                        <Text
                                                            className="
                                                                w-[25%]
                                                                text-white
                                                                font-semibold
                                                                text-xs
                                                                text-center
                                                            "
                                                        >
                                                            Status
                                                        </Text>

                                                        <Text
                                                            className="
                                                                w-[25%]
                                                                text-white
                                                                font-semibold
                                                                text-xs
                                                                text-center
                                                            "
                                                        >
                                                            Data
                                                        </Text>
                                                    </View>

                                                    {/* Conteúdo */}
                                                    <View
                                                        className="
                                                            flex-1
                                                            p-3
                                                            gap-2
                                                        "
                                                    >
                                                        <View
                                                            className="
                                                                flex-row
                                                                justify-between
                                                            "
                                                        >
                                                            <Text
                                                                numberOfLines={1}
                                                                className="
                                                                    w-[50%]
                                                                    text-primary-text
                                                                    font-semibold
                                                                    text-sm
                                                                "
                                                            >
                                                                {vaccine.vaccine}
                                                            </Text>

                                                            <Text
                                                                className={`w-[25%] text-center text-xs ${vaccine.application_status === 0
                                                                    ? "text-red-500"
                                                                    : "text-primary-text"
                                                                    }`}
                                                            >
                                                                {vaccine.application_status === 0
                                                                    ? "Pendente"
                                                                    : "Aplicada"}
                                                            </Text>

                                                            <Text
                                                                className={`w-[25%] text-right text-xs ${vaccine.application_status === 0
                                                                    ? "text-red-500"
                                                                    : "text-primary-text"
                                                                    }`}
                                                            >
                                                                {vaccine.application_date
                                                                    ? RoutineDate.formatedDate(
                                                                        vaccine.application_date
                                                                    )
                                                                    : "Pendente"}
                                                            </Text>
                                                        </View>

                                                        <Text
                                                            className="
                                                                text-xs
                                                                text-primary
                                                            "
                                                        >
                                                            <Text
                                                                className="
                                                                    text-primary-darker
                                                                    font-bold
                                                                "
                                                            >
                                                                Doenças evitadas:
                                                            </Text>{" "}
                                                            {vaccine.prevented_diseases}
                                                        </Text>

                                                        <Text
                                                            className="
                                                                text-xs
                                                                text-primary
                                                                italic
                                                            "
                                                        >
                                                            <Text
                                                                className="
                                                                    text-primary-darker
                                                                    font-bold
                                                                    not-italic
                                                                "
                                                            >
                                                                Obs:
                                                            </Text>{" "}
                                                            {vaccine.observation ??
                                                                "Sem observações"}
                                                        </Text>
                                                    </View>

                                                    {/* Botão editar */}
                                                    {vaccine.application_status ===
                                                        0 && (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    reset({
                                                                        application_date:
                                                                            "",
                                                                    });

                                                                    setSelectedVaccineId(
                                                                        vaccine.id_vaccine
                                                                    );

                                                                    setSelectedVaccineName(
                                                                        vaccine.vaccine
                                                                    );

                                                                    setModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="
                                                                absolute
                                                                bottom-2
                                                                right-2
                                                                w-8
                                                                h-8
                                                                justify-center
                                                                items-center
                                                                bg-purple-100
                                                                rounded-md
                                                            "
                                                            >
                                                                <EditIcon />
                                                            </TouchableOpacity>
                                                        )}
                                                </View>
                                            )
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    />
                )}
            </View>
        </View >

    )
}