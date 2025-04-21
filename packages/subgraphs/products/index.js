const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { gql } = require('graphql-tag');

const typeDefs = gql`
    type Query {
        topProducts(first: Int = 5): [Product]
    }

    type Product @key(fields: "id") {
        id: ID!
        title: String!
    }
`;

const resolvers = {
    Query: {
        topProducts() {
            return [
                { id: "p1", title: "Chair" },
                { id: "p2", title: "Table" },
            ];
        },
    },
    Product: {
        __resolveReference(product) {
            return { id: product.id, title: product.title || "Sample Product" };
        },
    },
};

async function start() {
    const server = new ApolloServer({
        schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    });

    const { url } = await startStandaloneServer(server, { listen: { port: 4002 } });
    console.log(`🚀 Products subgraph ready at ${url}`);
}

start();