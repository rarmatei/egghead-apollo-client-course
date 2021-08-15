import { UiAppMainHeader } from "./UiAppMainHeader";
import { Box, Flex } from "@chakra-ui/react";

export function UiAppLayout({ children }) {
  let contents;
  if (children && Array.isArray(children) && children.length > 0) {
    contents = (
      <Flex padding="10px" alignItems="flex-start">
        <Box>{children && children[0]}</Box>
        <Box paddingLeft="30px" width="450px">
          {children && children[1]}
        </Box>
      </Flex>
    );
  } else {
    contents = (
      <Flex padding="10px">
        <Box>{children}</Box>
      </Flex>
    );
  }
  return (
    <>
      <UiAppMainHeader />
      {contents}
    </>
  );
}
