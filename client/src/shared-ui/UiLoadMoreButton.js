import { TriangleDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

function UiLoadMoreButton({ onClick }) {
  return (
    <Button
      size="sm"
      variant="outline"
      leftIcon={<TriangleDownIcon />}
      colorScheme="blue"
      onClick={() => onClick()}
    >
      Load more
    </Button>
  );
}

export { UiLoadMoreButton };
