import {
  Button,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import useGenres, { Genre } from "../hooks/useGenres";
import icon from "../assets/240169.png";
import { auth, db } from "../configuration/firebase"; // Assuming you have already configured Firebase in your project.
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";

interface Props {
  onSelectGenre: (genre: Genre) => void;
  selectedGenre: Genre | null;
}

const GenreList = ({ selectedGenre, onSelectGenre }: Props) => {
  const { data, isLoading, error } = useGenres();
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchSelectedGenreIds = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData && userData.selectedGenreIds) {
            setSelectedGenreIds(userData.selectedGenreIds);
          }
        }
      }
    };

    fetchSelectedGenreIds();
  }, []);

  const insertGenreIdIntoFirebase = async (genre: Genre) => {
    if (!auth.currentUser) {
      return;
    }

    try {
      const updatedGenreIds = [...selectedGenreIds, genre.id];

      // Create a reference to the subcollection
      const userSubcollectionRef = doc(
        db,
        "users",
        auth.currentUser.uid
        // Replace with the name of your subcollection
        // Replace with the document ID within the subcollection
      );

      // Use setDoc to update the document within the subcollection
      await setDoc(userSubcollectionRef, {
        selectedGenreIds: updatedGenreIds,
      });

      onSelectGenre(genre);
      setSelectedGenreIds(updatedGenreIds);
    } catch (error) {
      console.error("Error inserting genre ID into Firebase:", error);
    }
  };

  if (error) return null;
  if (isLoading) return <Spinner />;

  return (
    <>
      <Heading fontSize="2xl" marginBottom={3}>
        Genres
      </Heading>
      <List>
        {data.map((genre) => (
          <ListItem key={genre.id} paddingY="5px">
            <HStack>
              <Image boxSize="32px" borderRadius={8} src={icon} />
              <Button
                whiteSpace="normal"
                textAlign="left"
                onClick={() => insertGenreIdIntoFirebase(genre)}
                fontWeight={genre.id === selectedGenre?.id ? "bold" : "normal"}
                fontSize="lg"
                variant="link"
              >
                {genre.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default GenreList;
