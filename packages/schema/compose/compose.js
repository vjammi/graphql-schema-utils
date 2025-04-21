const { getIntrospectionQuery, buildClientSchema, printSchema } = require('graphql');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const subgraphList = require('../../../subgraphs.json');
const {GraphQLSchema} = require("graphql/type/schema");
const federationConfigPath = './federation-config.json'; //./configs/
const composedPath = './supergraph/old_supergraph.graphql';

async function fetchSubgraphSDL(name, url) {
  const introspectionQuery = getIntrospectionQuery();
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: introspectionQuery }),
  });

  if (!response.ok) {
    throw new Error(`Failed to introspect ${name} at ${url}`);
  }

  const { data, errors } = await response.json();
  if (errors) {
    console.error(errors);
    throw new Error(`Introspection errors in ${name}`);
  }

  const clientGraphQLSchema = buildClientSchema(data);
  return printSchema(clientGraphQLSchema);
}

async function saveSubgraphsToSDLs() {
  const subgraphConfig = { subgraphs: {} };

  for (const [name, url] of Object.entries(subgraphList)) {
    console.log(`Introspecting ${name} from ${url}`);
    const sdl = await fetchSubgraphSDL(name, url);
    const outPath = `./packages/subgraphs/${name}/introspected.graphql`;

    fs.writeFileSync(outPath, sdl);
    subgraphConfig.subgraphs[name] = { "routing_url" : url, schema: { file : outPath } };
  }

  fs.writeFileSync(federationConfigPath, JSON.stringify(subgraphConfig, null, 2));
  console.log(`✅ Federation config written to ${federationConfigPath}`);
}

async function composeSupergraph() {
  console.log(`🔧 Composing supergraph with Apollo CLI...`);
  execSync(`npx @apollo/composition-cli compose --config ${federationConfigPath} > ${composedPath}`, {
    stdio: 'inherit',
  });
  console.log(`✅ Supergraph written to ${composedPath}`);
}

async function composeSupergraphViaRover() {
  console.log(`🔧 Composing supergraph with Apollo Rover CLI...`);
  execSync(`rover supergraph compose --config ${federationConfigPath} > ${composedPath}`, {
    stdio: 'inherit',
  });
  console.log(`✅ Supergraph written to ${composedPath}`);
}

async function main() {
  try {
    await saveSubgraphsToSDLs();
    await composeSupergraphViaRover();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main().catch(console.error).then(r => console.log("Done..."));

// (async () => {
//   try {
//     await saveSubgraphsToSDLs();
//     await composeSupergraph();
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// })();