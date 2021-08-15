import { UiAppLayout } from "./shared-ui/UiAppLayout";
import { Stack } from "@chakra-ui/react";
import { NoteList } from "./NoteList";

function App() {
  return (
    <UiAppLayout>
      <Stack width={400}>
        <NoteList />
      </Stack>
    </UiAppLayout>
  );
}

export default App;
