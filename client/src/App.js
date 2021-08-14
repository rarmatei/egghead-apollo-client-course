import { Route } from "react-router-dom";
import { EditNote } from "./EditNote";
import { UiAppLayout } from "./shared-ui/UiAppLayout";
import { useState } from "react";
import { Stack } from "@chakra-ui/react";
import { SelectCategory } from "./SelectCategory";
import { EditCategories } from "./EditCategories";
import { NoteList } from "./NoteList";

function App() {
  const [notesCategory, setNotesCategory] = useState("1");
  return (
    <UiAppLayout>
      <Stack width={400}>
        <SelectCategory
          value={notesCategory}
          onCategoryChange={(categoryId) => setNotesCategory(categoryId)}
        />
        <EditCategories />
        <NoteList categoryId={notesCategory} />
      </Stack>
      <Route path={`/note/:noteId`}>
        <EditNote />
      </Route>
    </UiAppLayout>
  );
}

export default App;
