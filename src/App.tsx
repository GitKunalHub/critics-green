import { Box, Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import MovieGrid from "./components/MovieGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import { useState } from "react";
import PlatformSelector from "./components/PlatformSelector";
import useMovie from "./hooks/useMovie";
import SortSelector from "./components/SortSelector";
import SearchInput from "./components/SearchInput";
import MovieHeading from "./components/MovieHeading";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

function App() {
  const [movieQuery, setMovieQuery] = useState<MovieQuery>({} as MovieQuery);

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
}

export default App;
