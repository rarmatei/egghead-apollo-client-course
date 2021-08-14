import { Box, Heading } from "@chakra-ui/react";

function UiNotFound() {
  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading marginBottom={5} fontSize="1.5rem" as="h1">
        Note not found
      </Heading>
    </Box>
  );
}

export { UiNotFound };
