const cache = {};

// QUERY: notes, categoryId "1"

cache["note:1"] = { id: "1", content: "Italy trip" };
cache["note:2"] = { id: "2", content: "Book flights" };

cache["notes:categoryId-1"] = ["note:1", "note:2"];

// QUERY: note, id "1"

cache["note:1"] = {
  ...cache["note:1"],
  content: "Italy trip",
  category: { label: "Trips" },
};

cache["note:id-1"] = "note:1";

// QUERY: categories

/*
    response: [
        {id: "1", label: "Shopping"},
        {id: "2", label: "Travel"}
    ]
*/

console.log(cache);
