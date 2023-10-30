import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { CanceledError } from "axios";
import { MovieQuery } from "../App";

export interface Movie {
  overview: string;
  release_date: string;
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

const useMovie = (movieQuery: MovieQuery, selectedGenres: number[] | null) => {
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
    // if (selectedGenres && selectedGenres.length > 0) {
    //   apiUrl += `/${selectedGenres.join(",")}`;
    // }
    const params: { [key: string]: any } = {
      sort_by: movieQuery.sortOrder,
      query: movieQuery.searchText,
    };

    if (movieQuery.genre) {
      params.with_genres = movieQuery.genre.id;
    }

    if (selectedGenres && selectedGenres.length > 0) {
      params.with_genres = selectedGenres.join(",");
    }

    apiClient
      .get<FetchMovieResponse>(apiUrl, {
        params,
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
            overview: item.overview,
            release_date: item.release_date,
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
