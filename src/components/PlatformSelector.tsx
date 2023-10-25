import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";

const PlatformSelector = () => {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        Platforms
      </MenuButton>
      <MenuList>
        <MenuItem>Movies</MenuItem>
        <MenuItem>TV Shows</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PlatformSelector;
