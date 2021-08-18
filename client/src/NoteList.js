import { Stack } from "@chakra-ui/react";
import { UiNote } from "./shared-ui";
import { gql, useQuery } from "@apollo/client";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String) {
    notes(categoryId: $categoryId) {
      id
      content
      category {
        label
      }
    }
  }
`;

export function NoteList({category}) {
  const { data } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId: category
    }
  });
  const notes = data?.notes;
  return (
    <Stack spacing={4}>
      {notes?.map((note) => (
        <UiNote
          key={note.id}
          content={note.content}
          category={note.category.label}
        ></UiNote>
      ))}
    </Stack>
  );
}
