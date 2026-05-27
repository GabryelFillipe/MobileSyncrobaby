import { useQuery } from "@tanstack/react-query";
import { getSpecialties } from "../../professional/professional.service";
import type { ResponseSpecialty } from "../../professional/professional.service";

export const useGetSpecialties = () => {
  return useQuery<ResponseSpecialty>({
    queryKey: ["specialties"],
    queryFn: getSpecialties,
  });
};
