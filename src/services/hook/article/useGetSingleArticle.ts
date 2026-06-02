import { useQuery } from "@tanstack/react-query";
import { getSingleArticle } from "../../article/article.service";
import type { ResponseSingleArticle } from "../../article/article.service";

export const useGetSingleArticle = (id_article: number) => {
    return useQuery<ResponseSingleArticle>({
        queryKey: ['singleArticle', id_article],
        queryFn: async () => {
                
           const response = await getSingleArticle(id_article)
        
           return response
              
       }
    });
}
