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
import Auth from "./components/AuthLogin";
import { auth, db } from "./configuration/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  BrowserRouter,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./components/Homepage";
import AuthLogin from "./components/AuthLogin";
import Homepage from "./components/Homepage";

export interface MovieQuery {
  genre: Genre | null;
  platform: string;
  sortOrder: string;
  searchText: string;
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<AuthLogin />} />
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
