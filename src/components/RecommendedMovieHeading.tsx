import { Heading } from "@chakra-ui/react";
import React from "react";
import { MovieQuery } from "../App";

interface Props {
  movieQuery: MovieQuery;
}

const RecommendedMovieHeading = ({ movieQuery }: Props) => {
  const heading = "Recommended for You!";
  return (
    <Heading marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default RecommendedMovieHeading;
