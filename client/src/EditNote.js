import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui";

const GET_NOTE = gql`
  query GetNote($id: String!) {
    note(id: $id) {
      id
      content
    }
  }
`;

export function EditNote() {
  let { noteId } = useParams();

  const { data } = useQuery(GET_NOTE, {
    variables: {
      id: noteId
    }
  });

  const [updateNote, {loading}] = useMutation(gql`
    mutation UpdateNote($id: String!, $content: String!) {
      updateNote(id: $id, content: $content) {
        successful
      }
    }
  `)

  return <UiEditNote isSaving={loading} onSave={(newContent) => {
    updateNote({
      variables: {
        id: noteId,
        content: newContent
      }
    })
  }} note={data?.note} />;
}
