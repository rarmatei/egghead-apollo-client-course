import { Box, Select } from "@chakra-ui/react";

function SelectCategory({ onCategoryChange, defaultValue }) {
  const categories = [
    { id: "1", label: "🛒 Shopping" },
    { id: "2", label: "💭 Random thoughts" },
    { id: "3", label: "✈️ Holiday Planning" },
  ];
  return (
    <Box>
      <Select
        placeholder="Select Category"
        defaultValue={defaultValue}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export { SelectCategory };
