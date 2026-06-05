import { api } from "../api";

export interface Notification {
    id_notification: number,
    title: string,
    message: string,
    date_time: string,
    read_status: boolean,
    fk_id_child: number,
    fk_id_guardian: number,
    fk_id_notification_type: number,
    notification_type_name: string,
    img_type?: string
}

export interface ResponseGetNotificationById {
    status_code: number,
    notification: Notification[]
}

export interface ResponseGetNotificationByUser {
    status_code: number,
    notification: Notification[]
}

export interface ResponseGetNotificationByChild {
    status_code: number,
    notification: Notification[]
}

export interface ResponsePatchNotificationRead {
    status_code: number
}

export interface ResponseDeleteNotification {
    status_code: number,
    message: string
}

export const getNotificationById = async (id_notification: number): Promise<ResponseGetNotificationById> => {
    try {
        const response = await api.get<ResponseGetNotificationById>(`/notification/${id_notification}`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404,
                notification: []
            }
        }
        throw error
    }
};

export const getNotificationByUser = async (): Promise<ResponseGetNotificationById> => {
    try {
        const response = await api.get<ResponseGetNotificationByUser>(`/notifications/user`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404,
                notification: []
            }
        }
        throw error
    }
};

export const getNotificationByChild = async (id_child: number): Promise<ResponseGetNotificationByChild> => {
    try {
        const response = await api.get<ResponseGetNotificationByChild>(`/notifications/child/${id_child}`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404,
                notification: []
            }
        }
        throw error
    }
};

export const patchNotificationRead = async (id_notification: number): Promise<ResponsePatchNotificationRead> => {
    try {
        const response = await api.patch<ResponsePatchNotificationRead>(`/notification/${id_notification}`);
        return response.data;

    } catch (error: any) {
        if (String(error).includes("404")) {
            return {
                status_code: 404
            }
        }
        throw error
    }
};

export const deleteNotification = async (id_notification: number): Promise<ResponseDeleteNotification> => {
   
    const response = await api.delete<ResponseDeleteNotification>(`/notification/${id_notification}`);
    return response.data;

};



