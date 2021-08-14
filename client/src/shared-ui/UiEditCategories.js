import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { UiEditCategoriesButton } from "./UiEditCategoriesButton";
import { UiCollapse } from "./UiCollapse";

function UiEditCategories({ categories, onEditCategory }) {
  const { isOpen, onToggle } = useDisclosure();
  function saveCategory(e, id) {
    e.preventDefault();
    const label = e.target.elements[`categoryLabel-${id}`].value;
    onEditCategory({ id, label });
  }
  return (
    <Stack>
      <Flex justify="flex-end" height={30} width={400}>
        <UiEditCategoriesButton onClick={onToggle} />
      </Flex>
      <UiCollapse isOpen={isOpen}>
        <Box padding="10px">
          {categories?.map((category) => (
            <form
              key={category.id}
              onSubmit={(e) => saveCategory(e, category.id)}
            >
              <Flex marginBottom="10px">
                <Input
                  id={`categoryLabel-${category.id}`}
                  background="white"
                  defaultValue={category.label}
                ></Input>
                <Button type="submit" marginLeft="5px">
                  Save
                </Button>
              </Flex>
            </form>
          ))}
        </Box>
      </UiCollapse>
    </Stack>
  );
}

export { UiEditCategories };
