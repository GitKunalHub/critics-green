import {
  Box,
  HStack,
  IconButton,
  Switch,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <Box textAlign="right" py={4}>
      <IconButton
        icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
        onClick={toggleColorMode}
        aria-label=""
      />
    </Box>
    // <HStack>
    //   <Switch
    //     colorScheme="green"
    //     isChecked={colorMode === "dark"}
    //     onChange={toggleColorMode}
    //   />
    //   <Text whiteSpace="nowrap">Dark Mode</Text>
    // </HStack>
  );
};

export default ColorModeSwitch;
