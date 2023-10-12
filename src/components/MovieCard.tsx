import React from "react";
import { Movie } from "../hooks/useMovie";
import { Card, CardBody, Heading, Image } from "@chakra-ui/react";
const api_img = "https://image.tmdb.org/t/p/w500/";
interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <Card borderRadius={10} overflow={"hidden"}>
      <Image src={ api_img + movie.poster_path} />
      <CardBody>
        <Heading fontSize={"2xl"}>{movie.title}</Heading>
      </CardBody>
    </Card>
  );
};

export default MovieCard;
