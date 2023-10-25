import { Heading } from "@chakra-ui/react";
import React from "react";
import { MovieQuery } from "../App";

interface Props {
  movieQuery: MovieQuery;
}

const MovieHeading = ({ movieQuery }: Props) => {
  const heading = `${movieQuery.genre?.name || ""} ${
    movieQuery.platform || ""
  } List`;
  return (
    <Heading marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default MovieHeading;
