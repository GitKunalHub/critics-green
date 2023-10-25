import { Box, Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import MovieGrid from "./components/MovieGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import { useState } from "react";
import PlatformSelector from "./components/PlatformSelector";
import useMovie from "./hooks/useMovie";
import SortSelector from "./components/SortSelector";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
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
        <NavBar />
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
        <Flex paddingLeft={2} marginBottom={5}>
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
        <MovieGrid movieQuery={movieQuery} />
      </GridItem>
    </Grid>
  );
}

export default App;
