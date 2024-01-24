import { Movie } from "../hooks/useMovie";

import {
  Badge,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Img,
  Input,
  Text,
  Textarea,
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
import CriticScore2 from "./CriticScore2";

async function sentimentQuery(dataCG: { inputs: string }) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment",
    {
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataCG),
    }
  );
  const result = await response.json();
  return result;
}

const api_img = "https://image.tmdb.org/t/p/w500/";

interface Props {
  movie: Movie;
  onClose: () => void;
}

const MovieDetails = ({ movie, onClose }: Props) => {
  const handleReview = async () => {
    if (userComment !== null) {
      try {
        const sentimentResponse = await sentimentQuery({
          inputs: userComment,
        });

        const topResult = sentimentResponse[0][0];
        let rating2;

        switch (topResult.label) {
          case "5 stars":
            rating2 = 5;
            break;
          case "4 stars":
            rating2 = 4;
            break;
          case "3 stars":
            rating2 = 3;
            break;
          case "2 stars":
            rating2 = 2;
            break;
          case "1 star":
            rating2 = 1;
            break;
          default:
            rating2 = null; // Handle the default case if necessary
        }

        setSubmitted(true);
        setRating(rating2);
        // Push review data to Firestore
        const docRef = await addDoc(collection(db, "reviews"), {
          movieId: movie.id,
          userId: auth.currentUser?.email?.split("@")[0],
          rating: rating2,
          timestamp: serverTimestamp(),
          comment: userComment,
          title: reviewTitle,
        });
      } catch (error) {
        console.error("Error adding review: ", error);
      }
    }
  };

  const [userRating, setUserRating] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<DocumentData[]>([]);
  const [reviewTitle, setReviewTitle] = useState<string>("");
  const [userComment, setUserComment] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null); // Added for sentiment analysis
  const [userReview, setUserReview] = useState<DocumentData | null>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReviewTitle(event.target.value);
  };
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserComment(event.target.value);
  };
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
          (review) => review.userId === auth.currentUser?.email?.split("@")[0]
        );

        if (currentUserReview) {
          setSubmitted(true);
          setUserRating(currentUserReview.rating);
          setUserComment(currentUserReview.comment);
          setReviewTitle(currentUserReview.title);
          setUserReview(currentUserReview);
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

  // const handleRatingChange = async (rating: number) => {
  //   const sentimentResponse = await sentimentQuery({
  //     inputs: userComment,
  //   });
  //   const topResult = sentimentResponse[0][0];
  //   setUserRating(topResult.label);
  // };

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
            Critics-Green Rating: <CriticScore2 score={averageRating} />
          </Text>
          <Text fontSize="md">
            Your Rating:{" "}
            <CriticScore2 score={userRating !== null ? userRating : 0} />
          </Text>
        </VStack>
      </HStack>

      {userReview === null && !submitted && (
        <>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              fontWeight={600}
              type="text"
              placeholder="Enter a title for your review..."
              size="lg"
              value={reviewTitle}
              onChange={handleTitleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Review</FormLabel>
            <Textarea
              placeholder="Write your review here..."
              size="sm"
              resize="vertical"
              value={userComment}
              onChange={handleCommentChange}
            />
          </FormControl>
          <Button
            colorScheme="teal"
            onClick={handleReview}
            disabled={
              userRating === null || submitted || userComment.trim() === ""
            }
          >
            {submitted ? "Submitted" : "Submit Rating and Review"}
          </Button>
        </>
      )}
      {reviews.length > 0 && (
        <VStack align="start" spacing={4}>
          <Text fontSize="lg" fontWeight="bold" mt={3}>
            User Reviews:
          </Text>
          {reviews.map((review) => (
            <Box
              width="80%"
              key={review.userId}
              borderRadius="md"
              p={4}
              borderWidth={1}
              borderColor="gray.200"
            >
              <VStack align="start" spacing={2}>
                <HStack spacing={2}>
                  <StarIcon boxSize={6} color="teal.500" />
                  <Text fontSize="sm">{review.rating}/5</Text>
                </HStack>

                <Text fontSize="sm"></Text>
              </VStack>
              <Text fontSize="lg" fontWeight={700}>
                {review.title}
              </Text>
              <HStack spacing={2}>
                <Text fontSize="8pt" color="blue.500">
                  {review.userId}
                </Text>
                <Text fontSize="8pt" color="gray.500">
                  {review.timestamp.toDate().toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </HStack>
              <Text fontSize="md" mt={4}>
                {review.comment}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default MovieDetails;
