import { Button } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

function UiEditCategoriesButton({ onClick }) {
  return (
    <Button size="sm" leftIcon={<EditIcon />} onClick={onClick}>
      Edit Categories
    </Button>
  );
}

export { UiEditCategoriesButton };
