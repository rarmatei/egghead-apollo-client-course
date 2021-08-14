import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

export function DeleteButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      size="xs"
      colorScheme="red"
      leftIcon={<DeleteIcon />}
    >
      Delete
    </Button>
  );
}
