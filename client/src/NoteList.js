import { Heading, Spinner, Stack } from "@chakra-ui/react";
import { DeleteButton, UiNote, ViewNoteButton } from "./shared-ui";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String) {
    notes(categoryId: $categoryId) {
      id
      content
      category {
        id
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

  const [deleteNote] = useMutation(
    gql`
      mutation DeleteNote($noteId: String!) {
        deleteNote(id: $noteId) {
          successful
        }
      }
    `, {
      refetchQueries: ["GetAllNotes"]
    }
  )

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
        >
          <Link to={`/note/${note.id}`}>
            <ViewNoteButton />
          </Link>
          <DeleteButton
            onClick={() => deleteNote({ variables: { noteId: note.id } })}
          />
        </UiNote>
      ))}
    </Stack>
  );
}
