import { Heading, SimpleGrid, Text } from "@chakra-ui/react";
import useMovie, { Movie } from "../hooks/useMovie";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import MovieCardContainer from "./MovieCardContainer";
import { MovieQuery } from "../App";
import { useEffect, useState } from "react";
import MovieDetails from "./MovieDetails";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../configuration/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import RecommendedMovies from "./RecommendedMovies";

interface Props {
  movieQuery: MovieQuery;
  selectedGenres: number[];
}

const MovieGrid = ({ movieQuery, selectedGenres }: Props) => {
  const {
    movies: data,
    error,
    isLoading,
  } = useMovie(movieQuery, selectedGenres, false);

  const addMovieToCollection = async (movieData: Movie) => {
    try {
      const moviesCollectionRef = collection(db, "movies");

      // Add the movie to the "movies" collection
      const docRef = await addDoc(moviesCollectionRef, {
        title: movieData.title,
        overview: movieData.overview,
        release_date: movieData.release_date,
        id: movieData.id,
        poster_path: movieData.poster_path,
        vote_average: movieData.vote_average,
      });

      console.log("Movie added to the 'movies' collection with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding movie to the 'movies' collection", error);
    }
  };
  const [selectedGenre, setSelectedGenre] = useState<number[]>([]);
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const [selectedMovie, setSelectedMovie] = useState<null | Movie>(null);

  const [userId, setUserId] = useState<null | string>(null); // Change the type here
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's ID (Document ID) from your authentication system

    if (auth.currentUser) {
      // Set the user's ID (Document ID) if the user is authenticated
      setUserId(auth.currentUser.uid);
    }
  }, []);

  if (error) return <Text>{error}</Text>;

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    await addMovieToCollection(movie);
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      {selectedGenres?.length > 0 ? (
        // Render RecommendedMovies if selectedGenres has values
        <>
          <Heading>Recommended</Heading>
          {selectedMovie ? (
            <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} />
          ) : (
            <>
              <RecommendedMovies
                movieQuery={movieQuery}
                selectedGenres={selectedGenres}
              />
              <Heading>Our Trending Movies!</Heading>
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
            </>
          )}
        </>
      ) : (
        // Render MovieGrid if selectedGenres is empty
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
      )}
      {/* {selectedMovie ? (
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
      )} */}
    </>
  );
};

export default MovieGrid;
