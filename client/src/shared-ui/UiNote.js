import { Box, Flex, Stack, Text } from "@chakra-ui/react";

export function UiNote({ isSelected, content, category, children }) {
  return (
    <Box
      background={isSelected ? "#EDFDFD" : ""}
      p={2}
      shadow="md"
      minH={100}
      borderWidth="3px"
    >
      <Flex h="100%" justify="space-between">
        <Stack paddingRight={5}>
          <Text>{content}</Text>
          {category && (
            <Flex>
              <Text fontWeight="bold" marginRight={2}>
                Category:{" "}
              </Text>{" "}
              <Text>{category}</Text>
            </Flex>
          )}
        </Stack>
        <Stack>{children}</Stack>
      </Flex>
    </Box>
  );
}
