import React from "react";
import { Movie } from "../hooks/useMovie";
import { Card, CardBody, HStack, Heading, Image } from "@chakra-ui/react";
import CriticScore from "./CriticScore";
const api_img = "https://image.tmdb.org/t/p/w500/";
interface Props {
  movie: Movie;
}

const MovieCard = ({ movie }: Props) => {
  return (
    <Card borderRadius={10} overflow={"hidden"}>
      <Image src={ api_img + movie.poster_path} />
      <CardBody>
        <HStack justifyContent={"space-between"}>
        <Heading fontSize={"2xl"}>{movie.title}</Heading>
        <CriticScore score={movie.vote_average} />
        </HStack>
      </CardBody>
    </Card>
  );
};

export default MovieCard;
