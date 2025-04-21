const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');

const typeDefs = gql`
    type Query {
        me: Account
    }

    type Account @key(fields: "id") {
        id: ID!
        name: String!
        email: String!
    }
`;

const resolvers = {
    Query: {
        me() {
            return { id: "1", name: "Alice", email: "alice@example.com" };
        },
    },
    Account: {
        __resolveReference(account) {
            return { id: account.id, name: "Alice", email: "alice@example.com" };
        },
    },
};

async function start() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    });

    const { url } = await startStandaloneServer(server, { listen: { port: 4001 } });
    console.log(`🚀 Accounts subgraph ready at ${url}`);
}

start();