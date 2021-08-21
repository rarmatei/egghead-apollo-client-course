import { useParams } from "react-router-dom";

export function EditNote() {
  let { noteId } = useParams();

  return <div>Note with id {noteId} selected.</div>;
}
