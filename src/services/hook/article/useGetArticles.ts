import { useQuery } from "@tanstack/react-query";
import { getAllArticles } from "../../article/article.service";
import type { ResponseArticles } from "../../article/article.service";

export const useGetArticles = () => {
    return useQuery<ResponseArticles | string>({
        queryKey: ['article'],
        queryFn: async () => {
                
           const response = await getAllArticles()
        
           return response
              
       }
    });
}