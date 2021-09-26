import { Checkbox, Heading, Spinner, Stack } from "@chakra-ui/react";
import {
  DeleteButton,
  UiLoadMoreButton,
  UiNote,
  ViewNoteButton,
} from "./shared-ui";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { setNoteSelection } from ".";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String, $offset: Int, $limit: Int) {
    notes(categoryId: $categoryId, offset: $offset, limit: $limit)
    @rest(type: "Note", path: "/notes?categoryId={args.categoryId}&offset={args.offset}&limit={args.limit}")
    {
      id
      content
      isSelected @client
      category {
        id
        label
      }
    }
  }
`;

export function NoteList({ category }) {
  const { data, loading, error, fetchMore } = useQuery(ALL_NOTES_QUERY, {
    variables: {
      categoryId: category,
      offset: 0,
      limit: 3,
    },
    errorPolicy: "all",
  });

  const [deleteNote] = useMutation(
    gql`
      mutation DeleteNote($noteId: String!) {
        deleteNote(id: $noteId)
        @rest(path: "/notes/{args.id}", method: "DELETE", type: "DeleteNoteResponse")
        {
          successful
          note @type(name: "Note") {
            id
          }
        }
      }
    `,
    {
      update: (cache, mutationResult) => {
        const deletedNoteId = cache.identify(
          mutationResult.data?.deleteNote.note
        );
        console.log({ deletedNoteId })
        cache.modify({
          fields: {
            notes: (existingNotes) => {
              return existingNotes.filter((noteRef) => {
                return cache.identify(noteRef) !== deletedNoteId;
              });
            },
          },
        });
        cache.evict({ id: deletedNoteId });
      },
    }
  );

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
          <Checkbox
            onChange={(e) => setNoteSelection(note.id, e.target.checked)}
            isChecked={note.isSelected}
          >
            Select
          </Checkbox>
          <Link to={`/note/${note.id}`}>
            <ViewNoteButton />
          </Link>
          <DeleteButton
            onClick={() =>
              deleteNote({ variables: { noteId: note.id } }).catch((e) =>
                console.error(e)
              )
            }
          />
        </UiNote>
      ))}
      <UiLoadMoreButton
        onClick={() => fetchMore({ variables: { offset: data.notes.length } })}
      />
    </Stack>
  );
}
