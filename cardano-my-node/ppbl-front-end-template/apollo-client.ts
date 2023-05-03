import { ApolloClient, InMemoryCache } from "@apollo/client";

// To work with other networks, change the uri to any Dandelion GraphQL instance:
const client = new ApolloClient({
    uri: "https://graphql-api-iohk-preprod.gimbalabs.io/",
    cache: new InMemoryCache(),
});

export default client;