import { Button, HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/Logo.png";
import ColorModeSwitch from "./ColorModeSwitch";
import SearchInput from "./SearchInput";
import Homepage from "./Homepage";
import { useNavigate } from "react-router-dom";

interface Props {
  onSearch: (searchText: string) => void;
}

const NavBar = ({ onSearch }: Props) => {
  const navigate = useNavigate();
  return (
    <HStack padding="20px">
      <Image src={logo} boxSize="60px" onClick={Homepage} />
      <SearchInput onSearch={onSearch} />
      <ColorModeSwitch />
      <Button
        onClick={() => {
          navigate("/");
        }}
      >
        Log out
      </Button>
    </HStack>
  );
};

export default NavBar;
