import { gql, useMutation, useQuery } from "@apollo/client";
import { Spinner } from "@chakra-ui/spinner";
import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui";

const GET_NOTE = gql`
  query GetNote($id: String!) {
    note(id: $id) {
      id
      content
      isSelected @client
    }
  }
`;

export function EditNote() {
  let { noteId } = useParams();

  const { data, loading: noteLoading } = useQuery(GET_NOTE, {
    variables: {
      id: noteId,
    },
  });

  const [updateNote, { loading }] = useMutation(gql`
    mutation UpdateNote($id: String!, $content: String!) {
      updateNote(id: $id, content: $content) {
        successful
        note {
          id
          content
        }
      }
    }
  `);

  if (noteLoading) {
    return <Spinner />;
  }

  return (
    <UiEditNote
      isNoteSelected={data?.note.isSelected}
      isSaving={loading}
      onSave={(newContent) => {
        updateNote({
          variables: {
            id: noteId,
            content: newContent,
          },
        });
      }}
      note={data?.note}
    />
  );
}
