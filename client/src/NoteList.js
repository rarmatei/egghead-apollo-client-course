import { Checkbox, Heading, Spinner, Stack, Text } from "@chakra-ui/react";
import {
  DeleteButton,
  UiLoadMoreButton,
  UiNote,
  ViewNoteButton,
} from "./shared-ui";
import { gql, useApolloClient, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Link } from "react-router-dom";
import { setNoteSelection } from ".";
import { useEffect } from "react";

const ALL_NOTES_QUERY = gql`
  query GetAllNotes($categoryId: String, $offset: Int, $limit: Int) {
    notes(categoryId: $categoryId, offset: $offset, limit: $limit) {
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
  const { data, loading, error, fetchMore, subscribeToMore } = useQuery(ALL_NOTES_QUERY, {
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
        deleteNote(id: $noteId) {
          successful
          note {
            id
          }
        }
      }
    `,
    {
      optimisticResponse: (vars) => {
        return {
          deleteNote: {
            successful: true,
            __typename: "DeleteNoteResponse",
            note: {
              id: vars.noteId,
              __typename: "Note",
            },
          },
        };
      },
      update: (cache, mutationResult) => {
        const deletedNoteId = cache.identify(
          mutationResult.data?.deleteNote.note
        );
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

  const client = useApolloClient();

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: gql`
        subscription NewSharedNote($categoryId: String) {
          newSharedNote(categoryId: $categoryId) {
            id
            content
            category {
              id
              label
            }
          }
        }
      `,
      variables: {
        categoryId: category
      },
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        const newNote = subscriptionData.data.newSharedNote;
        client.cache.writeQuery({
          query: ALL_NOTES_QUERY,
          data: {
            ...previousQueryResult, // __typename: ....
            notes: [newNote, ...previousQueryResult.notes]
          },
          variables: {
            categoryId: category
          },
          overwrite: true
        });
      }
    });
    return unsubscribe;
  }, [category]);

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
