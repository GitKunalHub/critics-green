import { Badge } from "@chakra-ui/react";

interface Props {
  score: number | null;
}

const CriticScore2 = ({ score }: Props) => {
  let color: string;
  let displayScore: string | null = null;

  if (score !== null) {
    color = score > 4 ? "green" : score > 3 ? "yellow" : "red";
    displayScore = score.toFixed(1); // Display the score with one decimal place
  } else {
    color = "gray";
  }
  return (
    <Badge colorScheme={color} fontSize={"14px"} borderRadius={"4px"}>
      {score}
    </Badge>
  );
};

export default CriticScore2;
