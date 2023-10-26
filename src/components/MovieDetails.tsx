import { Movie } from "../hooks/useMovie";
import {
  Badge,
  Box,
  Button,
  HStack,
  Img,
  Text,
  VStack,
} from "@chakra-ui/react";
import CriticScore from "./CriticScore";

const api_img = "https://image.tmdb.org/t/p/w500/";

interface Props {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails = ({ movie, onClose }: Props) => {
  return (
    <Box bg="Background" p={4} boxShadow="lg" borderRadius="lg">
      <Button onClick={onClose} position="relative" top={2} left="90%">
        Close
      </Button>
      <HStack spacing={4}>
        <Img
          src={api_img + movie.poster_path}
          alt={movie.title}
          w="200px"
          h="300px"
          borderRadius="lg"
          boxShadow="md"
        />
        <VStack align="start" spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">
            {movie.title}
          </Text>
          <Badge colorScheme="teal">{movie.release_date.split("-")[0]}</Badge>
          <Text fontSize="lg">{movie.overview}</Text>
          <Text fontSize="md">
            iMDb Rating: <CriticScore score={movie.vote_average} />
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default MovieDetails;
