
import {  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Operation, } from "@apollo/client";
import { useMemo } from "react";
import { setContext } from "@apollo/client/link/context";


const devLink = new HttpLink({
  //   uri: "https://craft-vnrj.onrender.com",
  uri: "http://localhost:3000/graphql",
})


const prodLink = new HttpLink({
  uri: "https://craft-vnrj.onrender.com",
})



type LinkConditionPair = {
  condition: (operation: Operation) => boolean;
  link: HttpLink;
};


function getApolloLink(pairs: LinkConditionPair[]): ApolloLink {
  if (pairs.length === 1) {
    return pairs[0].link;
  } else {
    const [firstPair, ...restPairs] = pairs;
    return ApolloLink.split(
      firstPair.condition,
      firstPair.link,
      getApolloLink(restPairs)
    );
  }
}

/**
 * Create Apollo Client
 * @param newToken  - new token if provided the user is authenticated else not
 * @returns ApolloClient
 */
export function createApolloClient(newToken?: string) {
  const httpLink = getApolloLink([
    {
      condition: (operation: Operation) => {
        console.log(operation.operationName);
        return operation.operationName.toLocaleLowerCase().includes("Dev");
      },
      link: devLink,
    },
    {
      condition: (operation: Operation) =>
        operation.getContext().apiName === "Prod",
      link: prodLink,
    },

    {
      condition: () => true,
      link: devLink,
    },
  ]);

  console.log("link: ", httpLink);
  const Link = setContext(async (_req, { headers }) => {
    const modifiedHeader = {
      headers: {
        ...headers,
        authorization: `Bearer ${newToken}`,
      },
    };

    console.log("Modified Header: ", modifiedHeader);
    return modifiedHeader;
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: Link.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}


/**
 * Implement a hook to create an Apollo client
 * @param token
 * @returns
 */
export function useApollo(token: string = "") {
  const store = useMemo(() => createApolloClient(token), [token]);
  return store;
}


