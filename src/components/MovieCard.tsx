import React from "react";
import { Movie } from "../hooks/useMovie";
import { Card, CardBody, HStack, Heading, Image } from "@chakra-ui/react";
import CriticScore from "./CriticScore";
import placeholder from "../assets/placeholder.jpg";

const api_img = "https://image.tmdb.org/t/p/w500/";
interface Props {
  movie: Movie;
  onClick: () => void;
}

const MovieCard = ({ movie, onClick }: Props) => {
  return (
    <Card className="clickable-card" onClick={onClick}>
      {movie.poster_path ? (
        <Image src={api_img + movie.poster_path} />
      ) : (
        <Image src={placeholder} /> // Use placeholder when poster_path is empty
      )}
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
