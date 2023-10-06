import { Text, useStatStyles } from "@chakra-ui/react";
import useMovie from "../hooks/useMovie";

const MovieGrid = () => {
  const { movies, error } = useMovie();
  return (
    <>
      {error && <Text>{error}</Text>}
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </>
  );
};

export default MovieGrid;
