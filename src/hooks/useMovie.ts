import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";

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

const useMovie = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [error, setError] = useState("");
  
    useEffect(() => {
        const controller = new AbortController();

      apiClient
        .get<FetchMovieResponse>("/now_playing", {signal: controller.signal})
        .then((res) => setMovies(res.data.results))
        .catch((err) => {
            if (err instanceof CanceledError) return;
            setError(err.message)});

        return () => controller.abort();
    }, [    ]);

    return { movies, error };
  
}

export default useMovie;