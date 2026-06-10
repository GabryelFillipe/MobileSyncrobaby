import { useQuery } from "@tanstack/react-query";
import type { ResponseRoutines } from "../../routines/routines.service";
import { getRoutines } from "../../routines/routines.service";

export const useGetRoutinesByChild = (childId: number, date: string) => {
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    return useQuery<ResponseRoutines>({
        queryKey: ["routines", "child", childId, "date", date],
        queryFn: async () => {
            await delay(700);
            return await getRoutines(childId, date);
        },
    });
};
