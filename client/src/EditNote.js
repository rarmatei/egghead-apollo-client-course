import { useParams } from "react-router-dom";
import { UiEditNote } from "./shared-ui/UiEditNote";
import { gql, useMutation, useQuery } from "@apollo/client";

export function EditNote() {
  let { noteId } = useParams();

  return <div>Note with id {noteId} selected.</div>;
}
