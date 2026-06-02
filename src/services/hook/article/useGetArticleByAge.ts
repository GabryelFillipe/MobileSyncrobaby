import { useQuery } from "@tanstack/react-query";
import type { ResponseArticlesWithAge } from "../../article/article.service";
import { getArticlesWithAge } from "../../article/article.service";

export const useGetArticleByAge = (id_age_group: number) => {
  return useQuery<ResponseArticlesWithAge>({
    queryKey: ["articleByAge", id_age_group],
    queryFn: async () => {
      const response = await getArticlesWithAge(id_age_group);
      return response;
    },
    enabled: !!id_age_group,
  });
};
