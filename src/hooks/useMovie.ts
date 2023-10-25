import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";
import { Genre } from "./useGenres";
import { MovieQuery } from "../App";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  name?: string;
}

interface FetchMovieResponse {
  total_results: number;
  results: Movie[];
}

const useMovie = (movieQuery: MovieQuery) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    let apiUrl = "/discover/movie"; // Default to movie platform
    if (movieQuery.platform === "TV Shows") {
      apiUrl = "/discover/tv";
    }
    if (movieQuery.searchText) {
      apiUrl = "/search/multi"; // Use the multi-search endpoint for searching
    }
    apiClient
      .get<FetchMovieResponse>(apiUrl, {
        params: {
          with_genres: movieQuery.genre?.id,
          sort_by: movieQuery.sortOrder,
          query: movieQuery.searchText,
        },
        signal: controller.signal,
      })
      .then((res) => {
        const responseData = res.data.results.map((item) => {
          const title =
            movieQuery.platform === "TV Shows"
              ? item.name || "Unknown Title"
              : item.title || "Unknown Title";
          return {
            id: item.id,
            title,
            poster_path: item.poster_path,
            vote_average: item.vote_average,
          };
        });
        setMovies(responseData);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, [movieQuery]);

  return { movies, error, isLoading };
};

export default useMovie;
