import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from, makeVar } from "@apollo/client";
import { RetryLink } from '@apollo/client/link/retry';

let selectedNoteIds = makeVar(["2"]);

export function setNoteSelection(noteId, isSelected) {
  if(isSelected) {
    selectedNoteIds([...selectedNoteIds(), noteId]);
  } else {
    selectedNoteIds(selectedNoteIds().filter(selectedNoteId => selectedNoteId !== noteId));
  }
}

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const retryLink = new RetryLink({
  delay: {
    initial: 2000,
    max: 2000,
    jitter: false
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          notes: {
            keyArgs: ["categoryId"],
            merge: (existingNotes = [], incomingNotes) => {
              return [...existingNotes, ...incomingNotes];
            }
          }
        }
      },
      Note: {
        fields: {
          isSelected: {
            read: (currentIsSelectedValue, helpers) => {
              const currentNoteId = helpers.readField("id");
              return selectedNoteIds().includes(currentNoteId);
            }
          }
        }
      }
    }
  }),
  link: from([retryLink, httpLink])
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
