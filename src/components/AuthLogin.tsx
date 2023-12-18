import { auth, googleProvider } from "../configuration/firebase";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import ColorModeSwitch from "./ColorModeSwitch";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

const VariantColour = "teal";
const ref = useRef(null);
const AuthLogin = () => {
  return (
    <div>
      <LoadingBar color="#f11946" ref={ref} shadow={true} />
      <Flex
        minHeight="100vh"
        width="full"
        align="center"
        justifyContent="center"
      >
        <Box
          borderWidth={1}
          px={4}
          width="full"
          maxWidth="500px"
          borderRadius={4}
          textAlign="center"
          boxShadow="lg"
        >
          <ColorModeSwitch />
          <Box padding={4}>
            <LoginHeader />
            <LoginForm />
          </Box>
        </Box>
      </Flex>
    </div>
  );
};

const LoginHeader = () => {
  const [animatedText, setAnimatedText] = useState(""); // Changed: Added state for animated text
  const targetText = "Critics Green"; // The target text to type

  useEffect(() => {
    let currentIndex = 0;
    const textAnimation = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setAnimatedText(targetText.slice(0, currentIndex)); // Update animatedText with a slice of targetText
        currentIndex += 1;
      } else {
        clearInterval(textAnimation);
      }
    }, 100); // Adjust the interval for typing speed
  }, []);

  return (
    <Box textAlign="center">
      <Heading>Sign In to </Heading>
      <Heading color={VariantColour} marginTop={2}>
        {animatedText}
      </Heading>
    </Box>
  );
};

const LoginForm = () => {
  const navigateTo = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle the state to switch between sign-in and sign-up
    setError(null);
  };

  const authenticationHandler = async () => {
    setError(null);
    if (isSignUp) {
      // Sign Up
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigateTo("/home");
      } catch (msg: any) {
        setError(msg.message);
        // You can display an error message to the user here
      }
    } else {
      // Sign In
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigateTo("/home");
      } catch (msg: any) {
        setError(msg.message);
        // You can display an error message to the user here
      }
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigateTo("/home");
    } catch (msg: any) {
      setError(msg.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      navigateTo("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box marginY={8} textAlign="left">
      <form>
        <FormControl marginTop={5}>
          <FormLabel>E-Mail Address: </FormLabel>
          <Input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email Address.."
          />
        </FormControl>
        <FormControl marginTop={3}>
          <FormLabel>Password: </FormLabel>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password.."
          />
        </FormControl>
        {isSignUp ? (
          <>
            <Button
              onClick={authenticationHandler}
              colorScheme={VariantColour}
              width="full"
              marginTop={9}
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={authenticationHandler}
              colorScheme={VariantColour}
              width="full"
              marginTop={9}
            >
              Sign In
            </Button>
          </>
        )}
        <Button
          onClick={signInWithGoogle}
          colorScheme={VariantColour}
          width="full"
          marginTop={4}
          leftIcon={<FcGoogle />} // Add the Google logo as an icon
        >
          Login with Google
        </Button>

        <Button
          onClick={toggleSignUp} // Toggle between Sign In and Sign Up
          variant="link"
          color={VariantColour}
          width="full"
          marginTop={4}
        >
          {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
        </Button>
        {error && (
          <Box marginTop={4} color="red.500">
            {error}
          </Box>
        )}
      </form>
    </Box>
  );
};

export default AuthLogin;
