import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { RestLink } from "apollo-link-rest";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

let selectedNoteIds = makeVar(["2"]);

export function setNoteSelection(noteId, isSelected) {
  if (isSelected) {
    selectedNoteIds([...selectedNoteIds(), noteId]);
  } else {
    selectedNoteIds(
      selectedNoteIds().filter((selectedNoteId) => selectedNoteId !== noteId)
    );
  }
}

const websocketLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
});

const restLink = new RestLink({ uri: "http://localhost:4000/rest-api" });

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const protocolLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.operation === "subscription"; // or "query" or "mutation"
  },
  websocketLink,
  httpLink
);

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: 2000,
    jitter: false,
  },
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          note: {
            read: (valueInCache, helpers) => {
              const queriedNoteId = helpers.args.id;
              return helpers.toReference({
                id: queriedNoteId,
                __typename: "Note",
              });
            },
          },
        },
      },
      Note: {
        fields: {
          isSelected: {
            read: (currentIsSelectedValue, helpers) => {
              const currentNoteId = helpers.readField("id");
              return selectedNoteIds().includes(currentNoteId);
            },
          },
        },
      },
    },
  }),
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
