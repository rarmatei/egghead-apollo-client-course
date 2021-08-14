import { UiAppMainHeader } from "./UiAppMainHeader";
import { Box, Flex } from "@chakra-ui/react";

export function UiAppLayout({ children }) {
  return (
    <>
      <UiAppMainHeader />
      <Flex padding="10px" alignItems="flex-start">
        <Box>{children && children[0]}</Box>
        <Box paddingLeft="30px" width="450px">
          {children && children[1]}
        </Box>
      </Flex>
    </>
  );
}
