import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";
import { Genre } from "./useGenres";

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

const useMovie = (
  selectedGenre: Genre | null,
  platform: string | null = null
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    let apiUrl = "/discover/movie"; // Default to movie platform
    if (platform === "TV Shows") {
      apiUrl = "/discover/tv";
    }
    apiClient
      .get<FetchMovieResponse>(apiUrl, {
        params: { with_genres: selectedGenre?.id },
        signal: controller.signal,
      })
      .then((res) => {
        const responseData = res.data.results.map((item) => {
          const title =
            platform === "TV Shows"
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
  }, [selectedGenre?.id, platform]);

  return { movies, error, isLoading };
};

export default useMovie;
