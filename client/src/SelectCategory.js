import { Box, Select } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

export const ALL_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      label
    }
  }
`;

function SelectCategory({ onCategoryChange, defaultValue }) {
  const { data } = useQuery(ALL_CATEGORIES_QUERY);
  return (
    <Box>
      <Select
        placeholder="Select Category"
        value={defaultValue}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {data?.categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export { SelectCategory };
