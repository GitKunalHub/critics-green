import { SimpleGrid, Text } from "@chakra-ui/react";
import useMovie, { Movie } from "../hooks/useMovie";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import MovieCardContainer from "./MovieCardContainer";
import { MovieQuery } from "../App";
import { useState } from "react";
import MovieDetails from "./MovieDetails";

interface Props {
  movieQuery: MovieQuery;
  selectedGenres: number[] | null;
}

const MovieGrid = ({ movieQuery, selectedGenres }: Props) => {
  const {
    movies: data,
    error,
    isLoading,
  } = useMovie(movieQuery, selectedGenres, false);
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const [selectedMovie, setSelectedMovie] = useState<null | Movie>(null);

  if (error) return <Text>{error}</Text>;

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      {selectedMovie ? (
        <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} />
      ) : (
        <SimpleGrid
          columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
          padding="10px"
          spacing={6}
        >
          {isLoading &&
            skeletons.map((skeleton) => (
              <MovieCardContainer key={skeleton}>
                <MovieCardSkeleton />
              </MovieCardContainer>
            ))}
          {data.map((movie) => (
            <MovieCardContainer key={movie.id}>
              <MovieCard
                movie={movie}
                onClick={() => handleMovieClick(movie)}
              />
            </MovieCardContainer>
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default MovieGrid;
