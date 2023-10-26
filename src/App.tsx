import { Box, Flex, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import MovieGrid from "./components/MovieGrid";
import GenreList from "./components/GenreList";
import { Genre } from "./hooks/useGenres";
import { useEffect, useState } from "react";
import PlatformSelector from "./components/PlatformSelector";
import useMovie from "./hooks/useMovie";
import SortSelector from "./components/SortSelector";
import SearchInput from "./components/SearchInput";
import MovieHeading from "./components/MovieHeading";
import Auth from "./components/Auth";
import { db } from "./configuration/firebase";
import { getDocs, collection } from "firebase/firestore";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

function App() {
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
    <Auth />
    // <Grid
    //   templateAreas={{
    //     base: `"nav" "main"`,
    //     lg: `"nav nav" "aside main"`,
    //   }}
    //   templateColumns={{
    //     base: "1 fr",
    //     lg: "200px 1fr",
    //   }}
    // >
    //   <GridItem area="nav">
    //     <NavBar
    //       onSearch={(searchText) =>
    //         setMovieQuery({ ...movieQuery, searchText })
    //       }
    //     />
    //   </GridItem>
    //   <Show above="lg">
    //     <GridItem area="aside" paddingX="5px">
    //       <GenreList
    //         selectedGenre={movieQuery.genre}
    //         onSelectGenre={(genre) => setMovieQuery({ ...movieQuery, genre })}
    //       />
    //     </GridItem>
    //   </Show>
    //   <GridItem area="main">
    //     <Box paddingLeft={2}>
    //       <MovieHeading movieQuery={movieQuery} />
    //       <Flex marginBottom={5}>
    //         <Box marginRight={5}>
    //           <PlatformSelector onSelectPlatform={handlePlatformSelect} />
    //         </Box>
    //         <SortSelector
    //           sortOrder={movieQuery.sortOrder}
    //           onSelectSortOrder={(sortOrder) =>
    //             setMovieQuery({ ...movieQuery, sortOrder })
    //           }
    //         />
    //       </Flex>
    //     </Box>
    //     <MovieGrid movieQuery={movieQuery} />
    //   </GridItem>
    // </Grid>
  );
}

export default App;
