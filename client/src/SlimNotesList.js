import { gql, useQuery } from "@apollo/client";
import { UiNote } from "./shared-ui";
import { Stack } from "@chakra-ui/react";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes {
    notes {
      id
      content
    }
  }
`;

export function SlimNoteList() {
  const { data } = useQuery(ALL_NOTES_QUERY);
  return (
    <Stack spacing={4}>
      {data?.notes?.map((note) => (
        <UiNote key={note.id} content={note.content}></UiNote>
      ))}
    </Stack>
  );
}
