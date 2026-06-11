import { api } from "../api";

export interface AllVaccine {
    id_vaccine: number,
    vaccine_name: string,
    observation: string,
    prevented_diseases: string,
    dose: string
}

export interface VaccineStatus {
    id_vaccine: number,
    vaccine: string,
    observation: string,
    prevented_diseases: string,
    dose: string,
    application_status: number,
    application_date: string,
    id_child: number
}

export interface JSONAgeGroup {
    age_group_name: string
    id_age_group: number
    vaccines: VaccineStatus[]
}

export interface ResponseGetAllVaccine {
    status_code: number
    vaccine: JSONAgeGroup[]
}

export interface UpdateVaccine {
    application_status: number,
    application_date: string,
    fk_id_child: number,
    fk_id_vaccine: number
}

export interface ResponsePutVaccine {
    status_code: number,
    vaccine: UpdateVaccine
}

export const getAllVaccine = async (id_child: number): Promise<ResponseGetAllVaccine> => {
    try {
        const response = await api.get<ResponseGetAllVaccine>(`/vaccine/child/${id_child}`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404,
                vaccine: []
            }
        }
        throw error
    }
};

export const updateVaccineStatus = async (data: UpdateVaccine): Promise<ResponsePutVaccine> => {
    const response = await api.put<ResponsePutVaccine>(`/vaccine/status`, data);
    return response.data;
};