const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway } = require('@apollo/gateway');
const fs = require('fs');

// Load supergraph SDL
const supergraphSdl = fs.readFileSync('schema1.graphql', 'utf8');

// Create Gateway instance
const gateway = new ApolloGateway({ supergraphSdl });

// Create Apollo Server with gateway
const server = new ApolloServer({ gateway });

// Start the server with standalone runner
startStandaloneServer(server, {
    context: async () => ({}),
    listen: { port: 4006 },
}).then(({ url }) => {
    console.log(`🚀 Apollo Gateway ready at ${url}`);
});

// npx graphql-inspector diff https://api.old.example.com/graphql  https://api.new.example.com/graphql --headers "Authorization: Bearer <token>"  --format markdown
// npx graphql-inspector diff http://localhost:4001/graphql  http://localhost:4002/graphql--headers --format markdown

