import { Grid, GridItem, Flex, Box } from "@chakra-ui/layout";
import { Show } from "@chakra-ui/media-query";
import React, { useEffect, useState } from "react";
import GenreList from "./GenreList";
import MovieGrid from "./MovieGrid";
import MovieHeading from "./MovieHeading";
import NavBar from "./NavBar";
import PlatformSelector from "./PlatformSelector";
import SortSelector from "./SortSelector";
import { Genre } from "../hooks/useGenres";
import { collection, getDocs } from "@firebase/firestore";
import { auth, db } from "../configuration/firebase";
import useMovie from "../hooks/useMovie";
import { doc, getDoc } from "firebase/firestore";
import RecommendedMovies from "./RecommendedMovies";
import { Button, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

const Homepage = () => {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [userId, setUserId] = useState<null | string>(null); // Change the type here
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the user's ID (Document ID) from your authentication system

    if (auth.currentUser) {
      // Set the user's ID (Document ID) if the user is authenticated
      setUserId(auth.currentUser.uid);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      // Fetch the user's selected genres based on their Document ID
      const fetchSelectedGenres = async () => {
        const userDocRef = doc(db, "users", userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userDoc = userDocSnapshot.data();

          if (userDoc.selectedGenreIds) {
            setSelectedGenres(userDoc.selectedGenreIds);
          }
        }
      };

      fetchSelectedGenres();
    }
  }, [userId]);

  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery);

  const handlePlatformSelect = (platform: string) => {
    setMovieQuery({ ...movieQuery, platform });
  };

  const { movies, error, isLoading } = useMovie(movieQuery, selectedGenres);

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav" "aside main"`,
      }}
      templateColumns={{
        base: "1 fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="nav">
        <HStack>
          <NavBar
            onSearch={(searchText) =>
              setMovieQuery({ ...movieQuery, searchText })
            }
          />

          <Button
            onClick={() => {
              // Add any logout logic here (e.g., signing the user out)
              navigate("/");
            }}
          >
            Log out
          </Button>
        </HStack>
      </GridItem>
      <Show above="lg">
        <GridItem area="aside" paddingX="5px">
          <GenreList
            selectedGenre={movieQuery.genre}
            onSelectGenre={(genre) => setMovieQuery({ ...movieQuery, genre })}
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <Box paddingLeft={2}>
          <MovieHeading movieQuery={movieQuery} />
          <Flex marginBottom={5}>
            <Box marginRight={5}>
              <PlatformSelector onSelectPlatform={handlePlatformSelect} />
            </Box>
            <SortSelector
              sortOrder={movieQuery.sortOrder}
              onSelectSortOrder={(sortOrder) =>
                setMovieQuery({ ...movieQuery, sortOrder })
              }
            />
          </Flex>
        </Box>
        {selectedGenres.length > 0 ? (
          // Render RecommendedMovies if selectedGenres has values
          <>
            <RecommendedMovies
              selectedGenres={selectedGenres}
              movieQuery={movieQuery}
            />
            <MovieGrid
              movieQuery={movieQuery}
              selectedGenres={selectedGenres}
            />
          </>
        ) : (
          // Render MovieGrid if selectedGenres is empty
          <MovieGrid movieQuery={movieQuery} selectedGenres={selectedGenres} />
        )}
      </GridItem>
    </Grid>
  );
};

export default Homepage;
