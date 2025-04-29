const { makeExecutableSchema } = require('@graphql-tools/schema');
const { ApolloServer } = require('apollo-server');
const { gql } = require('graphql-tag');
const fs = require('fs');

// Define your schema (SDL)
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

// const resolvers = {
//     Query: {
//         hello: () => 'Hello, world!',
//         user: (parent, args) => {
//             // Use faker to generate random data
//             return {
//                 id: args.id,
//                 name: faker.name.findName(),
//                 email: faker.internet.email(),
//             };
//         },
//     },
//     User: {
//         id: (parent) => parent.id,
//         name: (parent) => parent.name,
//         email: (parent) => parent.email,
//     },
// };

// Define dummy resolvers
const resolvers = {
    Query: {
        hello: () => 'Hello, world!',
        user: (parent, args) => {
            // Dummy data for user
            return {
                id: args.id,
                name: 'John Doe',
                email: 'john.doe@example.com',
            };
        },
    },
    User: {
        // Dummy data for User fields, if needed
        id: (parent) => parent.id,
        name: (parent) => parent.name,
        email: (parent) => parent.email,
    },
};

// Create an executable schema with dummy resolvers
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Write the schema to a file (in SDL format)
const schemaSDL = schema.toString(); // This will get the schema in SDL format (typeDefs + resolvers)
fs.writeFileSync('./executable-schema.graphql', schemaSDL);

console.log("Schema has been written to 'executable-schema.graphql'");

//
// // Set up Apollo Server with the executable schema
// const server = new ApolloServer({
//     schema,
// });
//
// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`);
// });