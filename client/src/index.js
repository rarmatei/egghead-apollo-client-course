import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RetryLink } from "@apollo/client/link/retry";
import { RestLink } from "apollo-link-rest";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { persistCache, LocalStorageWrapper } from "apollo3-cache-persist";

const restLink = new RestLink({ uri: "http://localhost:4000/rest-api" });

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
});

const protocolLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.operation === "subscription";
  },
  wsLink,
  httpLink
);

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: 2000,
    jitter: false,
  },
});

const selectedNoteIds = makeVar([]);

export function toggleNote(noteId, isSelected) {
  if (isSelected) {
    selectedNoteIds([...selectedNoteIds(), noteId]);
  } else {
    selectedNoteIds(
      selectedNoteIds().filter((selectedNoteId) => selectedNoteId !== noteId)
    );
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        notes: {
          keyArgs: ["categoryId"],
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
        note(valueInCache, helpers) {
          const noteId = helpers.args.id;
          return helpers.toReference({
            id: noteId,
            __typename: "Note",
          });
        },
      },
    },
    Note: {
      fields: {
        isSelected: {
          read(currentIsSelectedValue, helpers) {
            const currentNoteId = helpers.readField("id");
            return selectedNoteIds().includes(currentNoteId);
          },
        },
      },
    },
  },
});

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
}).then(() => {
  const client = new ApolloClient({
    cache,
    link: from([retryLink, restLink, protocolLink]),
  });
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <ApolloProvider client={client}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApolloProvider>
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});
