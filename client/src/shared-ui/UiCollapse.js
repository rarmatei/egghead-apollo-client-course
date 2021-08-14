import { Box, Collapse } from "@chakra-ui/react";

function UiCollapse({ isOpen, children }) {
  return (
    <Collapse in={isOpen} animateOpacity>
      <Box
        marginBottom={5}
        p="10px"
        mt="4"
        bg="gray.300"
        rounded="md"
        shadow="md"
      >
        {children}
      </Box>
    </Collapse>
  );
}

export { UiCollapse };
