import { api } from "../api";

export interface Article {
  "id_article": number,
  "title": string,
  "content"?: string,
  "publication_date": string | null,
  "author": string,
  "media": string | null,
  "source_link": string,
  "description": string
}

export interface ArticleWithAge {
  "id_article": number,
  "title": string,
  "content": string,
  "publication_date": string | null,
  "author": string,
  "media": string | null,
  "source_link": string,
  "description": string
  "fk_id_age_group": number,
  "age_group_name": string
}

export interface ResponseArticles {
  status_code: number;
  article: Article[];
}

export interface ResponseSingleArticle {
  status_code: number;
  article: Article[];
}

export interface ResponseArticlesWithAge {
  status_code: number;
  article: ArticleWithAge[];
}

export const getAllArticles = async (): Promise<ResponseArticles> => {
  try {
    const response = await api.get<ResponseArticles>(
      `/article`,
    );

    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, article: [] };
    }
    throw error;
  }
};

export const getSingleArticle = async (idArticle: number): Promise<ResponseSingleArticle> => {
  try {
    const response = await api.get<ResponseSingleArticle>(
      `http://localhost:5173/syncrobaby/article/${idArticle}`
    );
    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, article: [] };
    }
    throw error;
  }
};

export const getArticlesWithAge = async (idAgeGroup: number | null): Promise<ResponseArticlesWithAge> => {
  try {
    const response = await api.get<ResponseArticlesWithAge>(
      `/article/age/${idAgeGroup}`
    );
    return response.data;
  } catch (error: unknown) {
    if (String(error).includes("404")) {
      return { status_code: 404, article: [] };
    }
    throw error;
  }
};
