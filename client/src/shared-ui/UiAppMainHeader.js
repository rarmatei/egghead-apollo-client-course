import { Flex, Heading, Image } from "@chakra-ui/react";

export function UiAppMainHeader() {
  return (
    <Flex width="270px" justify="space-between" padding="10px" align="center">
      <Image
        boxSize="50px"
        objectFit="cover"
        src="/apollo-graphql-compact.svg"
        alt="Segun Adebayo"
      />
      <Heading fontSize="2rem">Apollo Notes</Heading>
    </Flex>
  );
}
