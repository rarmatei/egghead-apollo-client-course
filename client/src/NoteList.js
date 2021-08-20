import { Heading, Spinner, Stack } from "@chakra-ui/react";
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

export function NoteList({ category }) {
  const { data, loading, error } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId: category,
    },
    errorPolicy: "all",
  });

  if (error && !data) {
    return <Heading> Could not load notes. </Heading>;
  }

  if (loading) {
    return <Spinner />;
  }

  const notes = data?.notes.filter((note) => !!note);
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
