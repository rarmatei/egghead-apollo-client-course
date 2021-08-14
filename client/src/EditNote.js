import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui/UiEditNote";
import { gql, useMutation, useQuery } from "@apollo/client";

export function EditNote() {
  let { noteId } = useParams();

  const { data } = useQuery(
    gql`
      query EditNote($id: String!) {
        note(id: $id) {
          id
          content
          isSelected @client
        }
      }
    `,
    {
      variables: { id: noteId },
    }
  );

  const [updateNote, { loading }] = useMutation(
    gql`
      mutation UpdateNote($id: String!, $content: String!) {
        updateNote(id: $id, content: $content) {
          successful
          note {
            id
            content
          }
        }
      }
    `
  );

  return (
    <UiEditNote
      note={data?.note}
      isSaving={loading}
      isNoteSelected={data?.note.isSelected}
      onSave={(content) => updateNote({ variables: { content, id: noteId } })}
    />
  );
}
