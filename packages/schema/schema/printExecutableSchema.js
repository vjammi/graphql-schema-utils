const { makeExecutableSchema } = require('@graphql-tools/schema');
const fs = require('fs');
const { gql } = require('graphql-tag');

// Define schema (SDL)
const typeDefs = gql`
    type Query {
        hello: String
        user(id: ID!): User
    }

    type User {
        id: ID!
        name: String
        email: String
    }
`;

// Define dummy (null) resolvers
const resolvers = {
    Query: {
        hello: () => null,  // Return null for hello field
        user: () => null,   // Return null for user field
    },
    User: {
        id: () => null,     // Return null for user id
        name: () => null,   // Return null for user name
        email: () => null,  // Return null for user email
    },
};

// Create executable schema with dummy resolvers
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Write the schema to a file (in SDL format)
const schemaSDL = schema.toString(); // This will get the schema in SDL format (typeDefs + resolvers)
fs.writeFileSync('./executable-schema.graphql', schemaSDL);

console.log("Schema has been written to 'executable-schema.graphql'");