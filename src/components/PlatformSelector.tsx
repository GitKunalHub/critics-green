import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";

interface Props {
  onSelectPlatform: (platform: string) => void;
}

const PlatformSelector = ({ onSelectPlatform }: Props) => {
  const [selectedPlatform, setSelectedPlatform] = useState("Movies");

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    onSelectPlatform(platform);
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedPlatform}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => handlePlatformSelect("Movies")}>
          Movies
        </MenuItem>
        <MenuItem onClick={() => handlePlatformSelect("TV Shows")}>
          TV Shows
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PlatformSelector;
