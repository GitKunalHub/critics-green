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
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./components/Home";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

function App() {
  return (
    <>
      <Auth />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
