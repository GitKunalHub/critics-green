import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig, CanceledError } from "axios";
import { Genre } from "./useGenres";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface FetchMovieResponse {
  total_results: number;
  results: Movie[];
}

const useMovie = (
  selectGenre: Genre | null,
  requestConfig?: AxiosRequestConfig
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    apiClient
      .get<FetchMovieResponse>("/discover/movie", {
        signal: controller.signal,
      })
      .then((res) => {
        setMovies(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { movies, error, isLoading };
};

export default useMovie;
