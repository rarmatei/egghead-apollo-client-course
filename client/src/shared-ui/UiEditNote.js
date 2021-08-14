import { Box, Button, Heading, Text, Textarea } from "@chakra-ui/react";
import { UiNotFound } from "./UiNotFound";

function UiEditNote({ note, onSave, isSaving, isNoteSelected }) {
  function save(e) {
    e.preventDefault();
    const newContent = e.target.elements.noteContents.value;
    onSave(newContent);
  }
  if (!note) {
    return <UiNotFound />;
  }
  return (
    <Box
      background={note.isSelected ? "#EDFDFD" : ""}
      p={5}
      shadow="md"
      borderWidth="1px"
    >
      <Heading marginBottom={5} fontSize="1.5rem" as="h1">
        Editing note with ID {note.id}
      </Heading>
      <form onSubmit={save}>
        <Textarea key={note.id} id="noteContents" defaultValue={note.content} />
        <Text padding="10px 0">Selected: {isNoteSelected ? "yes" : "no"}</Text>
        <Button isLoading={isSaving} type="submit" colorScheme="blue">
          Save
        </Button>
      </form>
    </Box>
  );
}

export { UiEditNote };
