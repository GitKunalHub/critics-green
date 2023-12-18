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
import { StarIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { auth, db } from "../configuration/firebase"; // Assuming you have already configured Firebase in your project.
import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const api_img = "https://image.tmdb.org/t/p/w500/";

interface Props {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails = ({ movie, onClose }: Props) => {
  const handleReview = async () => {
    if (userRating !== null) {
      try {
        // Push review data to Firestore
        const docRef = await addDoc(collection(db, "reviews"), {
          movieId: movie.id,
          userId: auth.currentUser?.uid, // You should replace this with the actual user ID
          rating: userRating,
          timestamp: serverTimestamp(),
        });

        console.log("Review added with ID: ", docRef.id);
        setSubmitted(true);
      } catch (error) {
        console.error("Error adding review: ", error);
      }
    }
  };

  const [userRating, setUserRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<DocumentData[]>([]); // Explicit typing here

  useEffect(() => {
    // Fetch reviews for the movie
    const fetchReviews = async () => {
      try {
        const reviewsCollection = collection(db, "reviews");
        const querySnapshot = await getDocs(
          query(reviewsCollection, where("movieId", "==", movie.id))
        );

        const reviewsData = querySnapshot.docs.map((doc) => doc.data());
        setReviews(reviewsData);

        const currentUserReview = reviewsData.find(
          (review) => review.userId === auth.currentUser?.uid
        );

        if (currentUserReview) {
          setSubmitted(true);
          setUserRating(currentUserReview.rating);
        }

        // Calculate average rating
        const totalRating = reviewsData.reduce(
          (accumulator, review) => accumulator + review.rating,
          0
        );
        const avgRating =
          reviewsData.length > 0 ? totalRating / reviewsData.length : 0;
        setAverageRating(Number(avgRating.toFixed(1)));
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    };

    fetchReviews();
  }, [movie.id]);

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmit = () => {
    // Handle the submission logic, e.g., send the rating to the server
    console.log("Submitted Rating:", userRating);
  };

  return (
    <Box p={4} boxShadow="lg" borderRadius="lg">
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
          <Text fontSize="md">
            Critics-Green Rating: <CriticScore score={averageRating} />
          </Text>
          <Text fontSize="md">
            Your Rating:{" "}
            <CriticScore score={userRating !== null ? userRating : 0} />
          </Text>
          {!submitted && (
            <HStack spacing={2}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
                <StarIcon
                  key={index}
                  boxSize={6}
                  color={index <= (userRating || 0) ? "teal.500" : "gray.300"}
                  cursor="pointer"
                  onClick={() => handleRatingChange(index)}
                />
              ))}
              <Button
                marginLeft={5}
                colorScheme="teal"
                onClick={handleReview}
                disabled={userRating === null || submitted}
              >
                {submitted ? "Submitted" : "Submit Rating"}
              </Button>
            </HStack>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

export default MovieDetails;
