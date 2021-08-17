import { Stack } from "@chakra-ui/react";
import { UiNote } from "./shared-ui";
import { gql, useQuery } from "@apollo/client";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes {
    notes {
      id
      content
      category {
        label
      }
    }
  }
`;

export function NoteList() {
  const { data } = useQuery(ALL_NOTES_QUERY);
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
