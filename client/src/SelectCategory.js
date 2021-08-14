import { Select } from "@chakra-ui/react";
import { gql } from "@apollo/client/core";
import { useQuery } from "@apollo/client";

export const ALL_CATEGORIES_QUERY = gql`
  query GetCategories {
    categories {
      id
      label
    }
  }
`;

export function SelectCategory({ onCategoryChange, value }) {
  const { data } = useQuery(ALL_CATEGORIES_QUERY, {
    // pollInterval: 1000,
  });

  return (
    <Select
      placeholder="Select Category"
      value={value}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      {data?.categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.label}
        </option>
      ))}
    </Select>
  );
}
