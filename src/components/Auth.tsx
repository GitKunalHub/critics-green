import { auth, googleProvider } from "../configuration/firebase";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import ColorModeSwitch from "./ColorModeSwitch";
import { FcGoogle } from "react-icons/fc";

const VariantColour = "teal";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
      {/* <Input
        placeholder="EMail..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button onClick={signIn}>Sign in</Button>
      <Button onClick={signInWithGoogle}>Sign in with Google!</Button>
      <Button onClick={logOut}>Logout</Button> */}
    </div>
  );
};

const LoginHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>Sign In to </Heading>
      <Heading color={VariantColour} marginTop={2}>
        Critics Green
      </Heading>
    </Box>
  );
};

const LoginForm = () => {
  return (
    <Box marginY={8} textAlign="left">
      <form>
        <FormControl marginTop={5}>
          <FormLabel>E-Mail Address: </FormLabel>
          <Input type="email" placeholder="Enter your Email Address.." />
        </FormControl>
        <FormControl marginTop={3}>
          <FormLabel>Password: </FormLabel>
          <Input type="password" placeholder="Enter your Password.." />
        </FormControl>
        <Button colorScheme={VariantColour} width="full" marginTop={9}>
          Sign In
        </Button>
        <Button
          colorScheme={VariantColour}
          width="full"
          marginTop={4}
          leftIcon={<FcGoogle />} // Add the Google logo as an icon
        >
          Sign up with Google
        </Button>
      </form>
    </Box>
  );
};

export default Auth;
