import { UiAppLayout } from "./shared-ui/UiAppLayout";
import { Box, Button, Stack } from "@chakra-ui/react";
import { NoteList } from "./NoteList";
import { SlimNoteList } from "./SlimNotesList";
import { useState } from "react";

function App() {
  const [slimListOpen, setSlimListOpen] = useState(false);
  return (
    <UiAppLayout>
      <Stack width={400}>
        <NoteList />
      </Stack>
      <Box width="350px">
        <Button onClick={() => setSlimListOpen(!slimListOpen)}>
          Open List
        </Button>
        {slimListOpen && <SlimNoteList />}
      </Box>
    </UiAppLayout>
  );
}

export default App;
