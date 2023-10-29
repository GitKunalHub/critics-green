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
import { db } from "../configuration/firebase";
import useMovie from "../hooks/useMovie";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

const Homepage = () => {
  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery);
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    getMovieList();
  }, []);

  const handlePlatformSelect = (platform: string) => {
    setMovieQuery({ ...movieQuery, platform });
  };

  const { movies, error, isLoading } = useMovie(movieQuery);

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
        <NavBar
          onSearch={(searchText) =>
            setMovieQuery({ ...movieQuery, searchText })
          }
        />
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
        <MovieGrid movieQuery={movieQuery} />
      </GridItem>
    </Grid>
  );
};

export default Homepage;
