const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub, withFilter } from "graphql-subscriptions";
import * as cors from "cors";

const pubsub = new PubSub();

const typeDefs = gql`
  type Query {
    categories: [Category]
    notes(categoryId: String, offset: Int, limit: Int): [Note]
    note(id: String!): Note
  }
  type Category {
    id: String!
    label: String!
  }
  type Note {
    id: String!
    content: String!
    category: Category!
  }
  type UpdateNoteResponse {
    note: Note
    successful: Boolean!
  }
  type DeleteNoteResponse {
    successful: Boolean!
    note: Note!
  }
  type Mutation {
    updateNote(id: String!, content: String!): UpdateNoteResponse
    deleteNote(id: String!): DeleteNoteResponse
    updateCategory(id: String!, label: String!): Category
  }
  type Subscription {
    newSharedNote(categoryId: String): Note!
  }
`;

let categories = [
  { id: "1", label: "✈️ Holiday Planning" },
  { id: "2", label: "🛒 Shopping" },
  { id: "3", label: "📝 Saved articles" },
];

let unpublishedCategories = [
  { id: "4", label: "👶 Childcare" },
  { id: "5", label: "💻 Work" },
];

let allNotes = [
  {
    id: "1",
    content:
      "🇮🇹 Italy trip ideas: Santa Maria del Fiore was built on the site of Florence's second cathedral dedicated to Saint Reparata; the first was the Basilica di San Lorenzo di Firenze, the first building of which was consecrated as a church in 393 by St. Ambrose...",
    categoryId: "1",
  },

  {
    id: "2",
    content:
      "🛫 Flight details: flying out of Manchester --> landing in Florence.",
    categoryId: "1",
  },
  {
    id: "3",
    content:
      "😋 🥘 Great places to eat in Florence: 'Osteria Antica Casa Torre', Piazza Di San Pier Maggiore 7, R, 50122 Firenze",
    categoryId: "1",
  },
  {
    id: "4",
    content:
      "🍨 Delicious gelato: 'Gelateria dei Neri', Via dei Neri, 9/11R, 50122 Firenze",
    categoryId: "1",
  },
  {
    id: "5",
    content:
      "🚲 Bike rental places: 'Florent - Bike rental', Via della Mosca, 10r, 50122 Firenze",
    categoryId: "1",
  },
  {
    id: "6",
    content:
      "📅 Train schedules on last day: 13:50 Platform 1, Florence Station --> Train to Rome",
    categoryId: "1",
  },
  { id: "7", content: "Shopping list: 🍋 Lemons", categoryId: "2" },
  { id: "8", content: "Shopping list: 🥑 Avocados", categoryId: "2" },
  { id: "9", content: "Shopping list: 🍞 Bread", categoryId: "2" },
  { id: "20", content: "Shopping list: 🍷 Wine", categoryId: "2" },
  {
    id: "21",
    content: "Shopping list: 🍿 Popcorn for movie night",
    categoryId: "2",
  },
  {
    id: "22",
    content: "Shopping list: 🌮 Taco shells for taco night",
    categoryId: "2",
  },
  {
    id: "10",
    content:
      "🐦 The Sapphire-throated hummingbird: The sapphire-throated hummingbird is part of the order Apodiformes, which includes the hummingbirds, swifts and treeswifts. They are part of the family Trochilidae, also known as the hummingbirds, which are distinguished by their small size, high metabolism and extremely rapid wing-flapping. Although part of the same genus, the sapphire-throated hummingbird is taxonomically-closer related to the blue-headed sapphire (Chrysuronia grayi) than the shining-green hummingbird.[7] Additionally, the sapphire-throated hummingbird acts as an outgroup for some members of the genus Amazilia, such as the white-chested emerald (Amazilia brevirostris) and the plain-bellied emerald (Amazilia leucogaster)...",
    categoryId: "3",
  },
  {
    id: "11",
    content:
      "⚛️ Neutron star: A neutron star is the collapsed core of a massive supergiant star, which had a total mass of between 10 and 25 solar masses, possibly more if the star was especially metal-rich.[1] Except for black holes, and some hypothetical objects (e.g. white holes, quark stars, and strange stars), neutron stars are the smallest and densest currently known class of stellar objects.[2] Neutron stars have a radius on the order of 10 kilometres (6.2 mi) and a mass of about 1.4 solar masses.[3] They result from the supernova explosion of a massive star, combined with gravitational collapse, that compresses the core past white dwarf star density to that of atomic nuclei....",
    categoryId: "3",
  },
];

let unpublishedNotes = [
  {
    id: "12",
    content:
      "🏛️ Leaning Tower of Pisa: is the campanile, or freestanding bell tower, of the cathedral of the Italian city of Pisa, known worldwide for its nearly four-degree lean, the result of an unstable foundation. The tower is situated behind the Pisa Cathedral and is the third-oldest structure in the ...",
    categoryId: "1",
  },
  {
    id: "13",
    content: "🌋 Reminder to take a picture of Mount Vesuvius at night",
    categoryId: "1",
  },
  {
    id: "14",
    content: "🍕 Frozen Pizza",
    categoryId: "2",
  },
];

const resolvers = {
  Note: {
    category: (parent) => {
      // if (parent.id === "8") {
      //   console.log("ERROR!");
      //   throw new Error(`Could not retrieve note with ID ${parent.id}`);
      // }
      return categories.find((category) => category.id === parent.categoryId);
    },
  },
  Query: {
    notes: (root, args, context) => {
      if (!args.categoryId) {
        return allNotes;
      }
      const categorisedNotes = args.categoryId
        ? allNotes.filter((note) => note.categoryId === args.categoryId)
        : allNotes;
      if (args.offset !== undefined && args.offset !== null && args.limit) {
        return categorisedNotes.slice(args.offset, args.offset + args.limit);
      }
      return categorisedNotes;
    },
    note: (root, args, context) => {
      const noteId = args.id;
      return allNotes.find((note) => note.id === noteId);
    },
    categories: () => categories,
  },
  Mutation: {
    updateNote: (root, args, context) => {
      const noteId = args.id;
      allNotes = allNotes.map((note) => {
        if (note.id === noteId) {
          return {
            ...note,
            content: args.content,
          };
        }
        return note;
      });
      return {
        note: allNotes.find((note) => note.id === noteId),
        successful: true,
      };
    },
    deleteNote: (root, args, context) => {
      const noteId = args.id;
      if (noteId === "6") {
        throw new Error("Cannot delete note with ID 6");
      }
      const deletedNote = allNotes.find((note) => note.id === noteId);
      allNotes = allNotes.filter((n) => n.id !== noteId);
      return {
        successful: true,
        note: deletedNote,
      };
    },
    updateCategory: (root, args, context) => {
      const categoryId = args.id;
      categories = categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            label: args.label,
          };
        }
        return category;
      });
      return categories.find((note) => note.id === categoryId);
    },
  },
  Subscription: {
    newSharedNote: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["NEW_SHARED_NOTE"]),
        (payload, variables) => {
          if (!variables.categoryId) {
            return true;
          }
          return payload.newSharedNote.categoryId === variables.categoryId;
        }
      ),
    },
  },
};

//For polling lesson
// setInterval(() => {
//   if (unpublishedCategories.length === 0) {
//     return;
//   }
//   const newCategory = unpublishedCategories.shift();
//   categories.unshift(newCategory);
//   console.log("ADDED CATEGORY");
// }, 45000);

// For subscription lesson
setInterval(() => {
  if (unpublishedNotes.length === 0) {
    return;
  }
  const newNote = unpublishedNotes.shift();
  allNotes.unshift(newNote);
  pubsub.publish("NEW_SHARED_NOTE", {
    newSharedNote: newNote,
  });
  console.log("PUBLISHED NOTE");
}, 30000);

(async function () {
  const app = express();
  app.use(cors());
  const restRouter = express.Router();

  restRouter.get("/notes", (req, res, next) => {
    const categoryId = req.query["categoryId"];
    const offset = parseInt(req.query["offset"]);
    const limit = parseInt(req.query["limit"]);
    const categorisedNotes = categoryId
      ? allNotes.filter((note) => note.categoryId === categoryId)
      : allNotes;
    const notes = categorisedNotes
      .slice(offset, offset + limit)
      .map((note) => ({
        id: note.id,
        content: note.content,
        category: categories.find((c) => c.id === note.categoryId),
      }));
    res.send(notes);
  });

  restRouter.delete("/notes/:noteId", (req, res, next) => {
    const noteId = req.params.noteId;
    const deletedNote = allNotes.find((note) => note.id === noteId);
    allNotes = allNotes.filter((n) => n.id !== noteId);
    res.send({
      successful: true,
      note: deletedNote,
    });
  });

  app.use("/rest-api", restRouter);

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
